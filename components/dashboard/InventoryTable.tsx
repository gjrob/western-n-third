'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Listing {
  id: string
  title: string
  category: string
  asking_price_cents: number
  quantity_available: number
  view_count: number
  inquiry_count: number
  status: string
  condition: string
}

export default function InventoryTable({ listings, vendorId }: { listings: Listing[]; vendorId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [archiving, setArchiving] = useState<string | null>(null)

  const handleArchive = async (id: string) => {
    setArchiving(id)
    await supabase.from('listings').update({ status: 'archived' }).eq('id', id)
    router.refresh()
    setArchiving(null)
  }

  if (listings.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--db-muted)' }}>
        No active listings. Create your first listing above.
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="db-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Views</th>
            <th>Inquiries</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map(listing => (
            <tr key={listing.id}>
              <td><strong>{listing.title}</strong></td>
              <td style={{ textTransform: 'capitalize' }}>{listing.category}</td>
              <td style={{ textTransform: 'capitalize' }}>{listing.condition}</td>
              <td>${(listing.asking_price_cents / 100).toFixed(2)}</td>
              <td>{listing.quantity_available}</td>
              <td>{listing.view_count}</td>
              <td>{listing.inquiry_count}</td>
              <td>
                <button
                  onClick={() => handleArchive(listing.id)}
                  disabled={archiving === listing.id}
                  style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {archiving === listing.id ? '...' : 'Archive'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
