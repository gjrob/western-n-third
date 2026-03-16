import { createServiceClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ScanTracker from './ScanTracker'

const CONDITION_LABELS: Record<string, string> = {
  new: 'New',
  'like-new': 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export default async function ProductQRPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServiceClient()

  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('id, listing_id')
    .eq('listing_id', params.id)
    .single()

  if (!qrCode) notFound()

  const { data: listing } = await supabase
    .from('listings')
    .select('*, vendors(business_name, phone, city, state)')
    .eq('id', params.id)
    .eq('status', 'active')
    .single()

  if (!listing) notFound()

  const vendor = listing.vendors as any
  const price = (listing.asking_price_cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <>
      <ScanTracker qrCodeId={qrCode.id} listingId={listing.id} />

      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', marginBottom: '8px' }}>
              {listing.category}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
              {listing.title}
            </h1>
          </div>

          {/* Price + Condition */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937' }}>
              {price}
            </div>
            <div style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              borderRadius: '20px',
              fontSize: '0.85rem',
              color: '#4b5563',
              fontWeight: 600,
            }}>
              {CONDITION_LABELS[listing.condition] || listing.condition}
            </div>
            {listing.quantity_available > 1 && (
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {listing.quantity_available} available
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ marginBottom: '24px', fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.6 }}>
              {listing.description}
            </div>
          )}

          {/* Vendor */}
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              {vendor?.business_name || "Western 'N' Third"}
            </div>
            {vendor?.city && (
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {vendor.city}{vendor.state ? `, ${vendor.state}` : ''}
              </div>
            )}
            {vendor?.phone && (
              <a
                href={`tel:${vendor.phone}`}
                style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.9rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
              >
                📞 {vendor.phone}
              </a>
            )}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href={`/marketplace/listings/${listing.id}`}
              style={{
                display: 'block',
                padding: '14px 24px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '1rem',
                textAlign: 'center',
                textDecoration: 'none',
                letterSpacing: '0.3px',
              }}
            >
              View Details & Contact Vendor
            </a>
            {vendor?.phone && (
              <a
                href={`tel:${vendor.phone}`}
                style={{
                  display: 'block',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                Call Now
              </a>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
            Western 'N' Third Building Materials · Wilmington, NC
          </div>
        </div>
      </div>
    </>
  )
}
