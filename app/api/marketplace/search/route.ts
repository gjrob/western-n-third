import { createClient } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = createClient()

  let query = supabase
    .from('listings')
    .select(
      'id, title, category, condition, asking_price_cents, image_urls, quantity_available, negotiable, vendor_id, vendors(business_name, slug, avg_rating)',
      { count: 'exact' }
    )
    .eq('status', 'active')
    .gt('quantity_available', 0)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (q.length > 2) {
    query = query.textSearch('search_vector', q, { config: 'english' })
  }

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (minPrice) {
    query = query.gte('asking_price_cents', Math.round(parseFloat(minPrice) * 100))
  }
  if (maxPrice) {
    query = query.lte('asking_price_cents', Math.round(parseFloat(maxPrice) * 100))
  }

  const { data, error, count } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({
    listings: (data || []).map((listing: any) => ({
      ...listing,
      image: listing.image_urls?.[0] || null,
      price: listing.asking_price_cents / 100,
      vendor: listing.vendors,
    })),
    total: count || 0,
    limit,
    offset,
  })
}
