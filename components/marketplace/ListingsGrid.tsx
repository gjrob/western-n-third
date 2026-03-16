'use client'

import Link from 'next/link'

interface ListingItem {
  id: string
  title: string
  category: string
  price: number
  image: string | null
  quantity_available: number
  condition: string
  negotiable: boolean
  vendor?: { business_name: string; avg_rating: number }
}

const CATEGORY_ICON: Record<string, string> = {
  lumber: '🪵',
  metals: '⚙️',
  tools: '🔨',
  hardware: '🔩',
  flooring: '🏠',
  windows: '🚪',
}

export default function ListingsGrid({ listings }: { listings: ListingItem[] }) {
  return (
    <div className="listings-grid">
      {listings.map(listing => (
        <Link href={`/marketplace/listings/${listing.id}`} key={listing.id} style={{ textDecoration: 'none' }}>
          <div className="listing-card">
            <div className="listing-image">
              {listing.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.image} alt={listing.title} />
              ) : (
                <div style={{ fontSize: '3rem' }}>{CATEGORY_ICON[listing.category] || '📦'}</div>
              )}
            </div>

            <div className="listing-body">
              <div className="listing-title">{listing.title}</div>
              <div className="listing-price">${listing.price.toFixed(2)}</div>

              <div className="listing-meta">
                <span style={{ textTransform: 'capitalize' }}>{listing.category}</span>
                <span>{listing.condition}</span>
                {listing.negotiable && <span style={{ color: '#27ae60' }}>Negotiable</span>}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '8px' }}>
                {listing.quantity_available} available
              </div>

              {listing.vendor && (
                <div className="listing-vendor">
                  <div className="listing-vendor-name">{listing.vendor.business_name}</div>
                  <div className="listing-vendor-rating">
                    ⭐ {listing.vendor.avg_rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
