import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  request: Request,
  { params }: { params: { storeSlug: string } }
) {
  try {
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', params.storeSlug)
      .single()

    if (error || !store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
