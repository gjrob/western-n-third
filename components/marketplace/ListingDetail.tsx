'use client'

import { useState } from 'react'

interface ListingDetailProps {
  listing: any
  vendor: any
}

export default function ListingDetail({ listing, vendor }: ListingDetailProps) {
  const [activeImage, setActiveImage] = useState(0)
  const images: string[] = listing.image_urls || []
  const price = listing.asking_price_cents / 100

  return (
    <div className="listing-detail">
      {/* Images */}
      <div className="listing-detail-images">
        <div className="listing-main-image">
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[activeImage]} alt={listing.title} />
          ) : (
            <div className="listing-no-image">No photos available</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="listing-thumbnails">
            {images.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt=""
                className={i === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="listing-detail-info">
        <div style={{ fontSize: '0.85rem', color: 'var(--dash-text-light)', textTransform: 'capitalize', marginBottom: '8px' }}>
          {listing.category} · {listing.condition}
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', lineHeight: 1.2 }}>{listing.title}</h1>

        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--dash-primary)', marginBottom: '8px' }}>
          ${price.toFixed(2)}
        </div>

        {listing.negotiable && (
          <div style={{ fontSize: '0.9rem', color: '#27ae60', fontWeight: 600, marginBottom: '16px' }}>
            ✓ Price negotiable
          </div>
        )}

        <div style={{ marginBottom: '24px', color: 'var(--dash-text-light)', fontSize: '0.9rem' }}>
          {listing.quantity_available} in stock
        </div>

        {listing.description && (
          <div style={{ marginBottom: '24px', lineHeight: 1.7 }}>
            {listing.description}
          </div>
        )}

        {vendor && (
          <div style={{ padding: '16px', background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{vendor.business_name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--dash-text-light)' }}>
              ⭐ {(vendor.avg_rating || 5).toFixed(1)} · {vendor.city}, {vendor.state}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
