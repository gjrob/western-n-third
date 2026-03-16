'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ListingDetail from '@/components/marketplace/ListingDetail'
import InquiryForm from '@/components/marketplace/InquiryForm'
import OfferForm from '@/components/marketplace/OfferForm'

export default function ListingDetailPage() {
  const params = useParams()
  const supabase = createClient()
  const [listing, setListing] = useState<any>(null)
  const [vendor, setVendor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('listings')
        .select('*, vendors(*)')
        .eq('id', params.id as string)
        .single()

      if (data) {
        // Increment view count
        supabase.from('listings').update({ view_count: data.view_count + 1 }).eq('id', data.id)
        setListing(data)
        setVendor(data.vendors)
      }

      setLoading(false)
    }

    load()
  }, [params.id])

  if (loading) {
    return (
      <div className="marketplace-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="marketplace-not-found">
        <h2>Listing not found</h2>
        <a href="/marketplace">← Back to marketplace</a>
      </div>
    )
  }

  return (
    <div className="listing-detail-page">
      <div className="listing-detail-nav">
        <a href="/marketplace" className="back-link">← Back to Marketplace</a>
      </div>

      <div className="listing-detail-layout">
        <div className="listing-detail-main">
          <ListingDetail listing={listing} vendor={vendor} />
        </div>

        <aside className="listing-detail-sidebar">
          <div className="action-card">
            <h3>Interested in this item?</h3>
            <InquiryForm listingId={listing.id} vendorName={vendor?.business_name} />
          </div>

          {listing.negotiable && (
            <div className="action-card" style={{ marginTop: '24px' }}>
              <h3>Make an Offer</h3>
              <OfferForm listingId={listing.id} askingPrice={listing.asking_price_cents / 100} />
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
