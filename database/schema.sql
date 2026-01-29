-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stores table
CREATE TABLE stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    whatsapp_number TEXT NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0.00,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extras table
CREATE TABLE extras (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product extras junction table
CREATE TABLE product_extras (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    extra_id UUID NOT NULL REFERENCES extras(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, extra_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    items_json JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    change_amount DECIMAL(10,2),
    final_observation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_categories_store_id ON categories(store_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_extras_store_id ON extras(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);

-- RLS Policies
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Stores policies
CREATE POLICY "Public stores are viewable by everyone" ON stores
    FOR SELECT USING (true);

CREATE POLICY "Store owners can update their own store" ON stores
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Store owners can manage their categories" ON categories
    FOR ALL USING (auth.uid()::text = store_id::text);

-- Products policies
CREATE POLICY "Active products are viewable by everyone" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (auth.uid()::text = store_id::text);

-- Extras policies
CREATE POLICY "Active extras are viewable by everyone" ON extras
    FOR SELECT USING (is_active = true);

CREATE POLICY "Store owners can manage their extras" ON extras
    FOR ALL USING (auth.uid()::text = store_id::text);

-- Product extras policies
CREATE POLICY "Product extras are viewable by everyone" ON product_extras
    FOR SELECT USING (true);

CREATE POLICY "Store owners can manage product extras" ON product_extras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM products 
            WHERE products.id = product_extras.product_id 
            AND auth.uid()::text = products.store_id::text
        )
    );

-- Orders policies
CREATE POLICY "Store owners can view their orders" ON orders
    FOR SELECT USING (auth.uid()::text = store_id::text);

CREATE POLICY "Store owners can insert orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = store_id::text);

-- Functions for better queries
CREATE OR REPLACE FUNCTION get_store_by_slug(slug_param TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    whatsapp_number TEXT,
    delivery_fee DECIMAL,
    is_open BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.slug,
        s.whatsapp_number,
        s.delivery_fee,
        s.is_open
    FROM stores s
    WHERE s.slug = slug_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_categories_by_store(store_id_param UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    sort_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.sort_order
    FROM categories c
    WHERE c.store_id = store_id_param
    ORDER BY c.sort_order ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_products_by_category(category_id_param UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    price DECIMAL,
    image_url TEXT,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_active
    FROM products p
    WHERE p.category_id = category_id_param AND p.is_active = true
    ORDER BY p.created_at ASC;
END;
$$ LANGUAGE plpgsql;
