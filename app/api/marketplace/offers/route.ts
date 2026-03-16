import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const supabase = createServiceClient()
  const { listingId, buyerName, buyerEmail, buyerPhone, offeredPrice, quantity, message } = await req.json()

  if (!listingId || !buyerName || !buyerEmail || !offeredPrice) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('vendor_id, asking_price_cents, negotiable')
    .eq('id', listingId)
    .single()

  if (!listing) {
    return Response.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (!listing.negotiable) {
    return Response.json({ error: 'This listing does not accept offers' }, { status: 400 })
  }

  const { data: offer, error } = await supabase
    .from('offers')
    .insert({
      listing_id: listingId,
      vendor_id: listing.vendor_id,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      offered_price_cents: Math.round(parseFloat(offeredPrice) * 100),
      quantity: parseInt(quantity) || 1,
      message,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(offer, { status: 201 })
}
