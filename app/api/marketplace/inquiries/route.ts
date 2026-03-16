import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const supabase = createServiceClient()
  const { listingId, name, email, phone, message } = await req.json()

  if (!listingId || !name || !email) {
    return Response.json({ error: 'Missing required fields: listingId, name, email' }, { status: 400 })
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('vendor_id')
    .eq('id', listingId)
    .single()

  if (!listing) {
    return Response.json({ error: 'Listing not found' }, { status: 404 })
  }

  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .insert({
      listing_id: listingId,
      vendor_id: listing.vendor_id,
      inquirer_name: name,
      inquirer_email: email,
      inquirer_phone: phone,
      message,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  await supabase.rpc('increment_listing_inquiries', { listing_id: listingId })

  return Response.json(inquiry, { status: 201 })
}
