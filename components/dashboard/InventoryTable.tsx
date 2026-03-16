'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { buildQRImageUrl, buildQRUrl } from '@/lib/qr-utils'

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
  const [showQR, setShowQR] = useState<string | null>(null)

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
    <>
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
            <th>QR</th>
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
                  onClick={() => setShowQR(showQR === listing.id ? null : listing.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--db-accent)', cursor: 'pointer', fontSize: '1.1rem' }}
                  title="View QR code"
                >
                  📱
                </button>
              </td>
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

      {showQR && (() => {
        const listing = listings.find(l => l.id === showQR)
        if (!listing) return null
        const qrUrl = buildQRUrl(listing.id)
        const imgSrc = buildQRImageUrl(qrUrl, 200)
        const handleDownload = async () => {
          const res = await fetch(buildQRImageUrl(qrUrl, 1000))
          const blob = await res.blob()
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = `qr-${listing.title.toLowerCase().replace(/\s+/g, '-')}.png`
          a.click()
        }
        return (
          <div style={{ marginTop: '16px', padding: '24px', background: '#fff', border: '1px solid var(--db-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt="QR" width={120} height={120} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '4px', background: '#fff' }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>{listing.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--db-muted)', marginBottom: '12px', wordBreak: 'break-all' }}>{qrUrl}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleDownload} className="btn btn-small" style={{ fontSize: '0.8rem' }}>↓ Download</button>
                <button onClick={() => setShowQR(null)} style={{ background: 'none', border: 'none', color: 'var(--db-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
