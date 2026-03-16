import { createClient, createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!vendor) {
    return Response.json({ error: 'Vendor profile not found' }, { status: 404 })
  }

  const { title, category, askingPrice, quantity, condition, description, imageUrls } = await req.json()

  if (!title || !category || !askingPrice) {
    return Response.json({ error: 'Missing required fields: title, category, askingPrice' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  const { data: listing, error } = await serviceClient
    .from('listings')
    .insert({
      vendor_id: vendor.id,
      title: title.trim(),
      category,
      asking_price_cents: Math.round(parseFloat(askingPrice) * 100),
      quantity_available: parseInt(quantity) || 1,
      condition: condition || 'good',
      description: description?.trim() || '',
      image_urls: imageUrls || [],
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Upsert vendor stats
  await serviceClient
    .from('vendor_stats')
    .upsert(
      { vendor_id: vendor.id, total_listings: 1, active_listings: 1 },
      { onConflict: 'vendor_id' }
    )

  return Response.json(listing, { status: 201 })
}
