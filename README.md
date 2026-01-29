# Delivery SaaS - Sistema de Pedidos para Lanchonetes

Plataforma white-label de pedidos delivery para lanchonetes, onde cada lanchonete tem seu próprio link de cardápio digital, e os pedidos são enviados formatados para o WhatsApp da loja.

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Supabase** (Auth, Database, Storage)
- **Zustand** (gerenciamento de estado)
- **Lucide React** (ícones)

## 📋 Funcionalidades

### Cliente Final
- Cardápio digital com categorias e produtos
- Detalhes do produto com seleção de adicionais
- Carrinho persistido no localStorage
- Checkout completo com múltiplas formas de pagamento
- Envio automático do pedido para WhatsApp

### Painel Admin
- Login seguro com Supabase Auth
- CRUD completo de produtos, categorias e adicionais
- Upload de imagens para Supabase Storage
- Configurações da loja (nome, taxa, WhatsApp)
- Dashboard com status da loja e link do cardápio

### Multi-tenant
- Cada loja tem seu próprio slug único
- Isolamento completo de dados por store_id
- Políticas RLS implementadas no Supabase

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd projeto-delivery
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Preencha com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Execute o schema SQL no Supabase:
```bash
# Copie e execute o conteúdo de database/schema.sql no seu projeto Supabase
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse `http://localhost:3000` para ver a aplicação.

## 🌐 Deploy no Netlify

### Pré-requisitos
- Conta no Netlify
- Projeto Supabase configurado
- Repositório Git (GitHub, GitLab, etc.)

### Passos para Deploy

1. **Prepare o repositório**
   ```bash
   git add .
   git commit -m "Ready for Netlify deploy"
   git push origin main
   ```

2. **Configure no Netlify**
   - Acesse [netlify.com](https://netlify.com) e faça login
   - Clique em "Add new site" > "Import an existing project"
   - Conecte seu repositório Git

3. **Configure as variáveis de ambiente**
   - Vá para "Site settings" > "Build & deploy" > "Environment"
   - Adicione as variáveis:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. **Configure as build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar

### Configurações Adicionais

O arquivo `netlify.toml` já está configurado com:
- Redirecionamentos para rotas admin
- Tratamento de páginas 404
- Configuração de Node.js

## 📁 Estrutura do Projeto

```
├── app/
│   ├── [storeSlug]/           # Rotas públicas do cliente
│   │   ├── page.tsx          # Cardápio da loja
│   │   ├── produto/[productId]/page.tsx  # Detalhes do produto
│   │   ├── carrinho/page.tsx # Carrinho
│   │   └── checkout/page.tsx # Checkout
│   ├── admin/                 # Rotas administrativas
│   │   ├── login/page.tsx    # Login admin
│   │   ├── page.tsx          # Dashboard
│   │   ├── produtos/         # CRUD produtos
│   │   ├── categorias/       # CRUD categorias
│   │   ├── extras/           # CRUD adicionais
│   │   └── configuracoes/    # Configurações da loja
│   ├── api/                   # API routes
│   ├── globals.css
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                    # Componentes reutilizáveis
│   ├── ProductCard.tsx
│   ├── MenuHeader.tsx
│   └── ...
├── hooks/
│   └── useCart.ts            # Hook do carrinho com Zustand
├── lib/
│   ├── supabaseClient.ts     # Cliente Supabase
│   └── utils.ts              # Utilitários
├── types/
│   └── index.ts              # Tipos TypeScript
├── database/
│   └── schema.sql            # Schema do banco
├── netlify.toml              # Config Netlify
└── .env.example              # Variáveis de ambiente exemplo
```

## 🔐 Configuração do Supabase

1. Crie um novo projeto no Supabase
2. Execute o schema SQL em `database/schema.sql`
3. Habilite o Row Level Security (RLS)
4. Configure o Authentication com provedores de email
5. Crie um bucket no Storage para imagens de produtos:
   - Nome: `product-images`
   - Políticas: Permitir upload para usuários autenticados

## 📱 Como Usar

### Para Clientes
1. Acesse `https://seusite.netlify.app/nome-da-loja`
2. Navegue pelo cardápio e adicione produtos ao carrinho
3. Finalize o pedido preenchendo seus dados
4. O pedido será enviado automaticamente para o WhatsApp da loja

### Para Lojistas
1. Acesse `https://seusite.netlify.app/admin/login`
2. Faça login com suas credenciais
3. Configure sua loja em "Configurações"
4. Adicione categorias, produtos e adicionais
5. Compartilhe seu link de cardápio com os clientes

## 🎨 Design

- Interface mobile-first e responsiva
- Design moderno inspirado no iFood
- Botões grandes e fáceis de usar em dispositivos móveis
- Cores e tipografia consistentes

## 🚀 Recursos Técnicos

- **Performance**: Next.js 15 com otimizações automáticas
- **SEO**: Meta tags e estrutura semântica
- **Segurança**: RLS no Supabase, middleware de proteção
- **Escalabilidade**: Arquitetura multi-tenant pronta para crescimento
- **PWA**: Ready para instalação como aplicativo

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas e suporte, abra uma issue no GitHub.

## 🎯 Próximos Passos

- [ ] Integração com gateways de pagamento
- [ ] Sistema de avaliações
- [ ] Notificações push
- [ ] App mobile nativo
- [ ] Relatórios e analytics
