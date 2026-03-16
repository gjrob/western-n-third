'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { buildQRUrl } from '@/lib/qr-utils'
import QRCodeDisplay from '@/components/QRCodeDisplay'

const CATEGORIES = [
  { value: 'lumber',   label: 'Lumber & Wood' },
  { value: 'metals',   label: 'Metals' },
  { value: 'tools',    label: 'Tools & Equipment' },
  { value: 'hardware', label: 'Hardware & Fixtures' },
  { value: 'flooring', label: 'Flooring & Tile' },
  { value: 'windows',  label: 'Windows & Doors' },
]

const INITIAL = {
  title: '', category: 'lumber', askingPrice: '',
  quantity: '1', condition: 'good', description: '',
}

export default function QuickListingForm({
  vendorId,
  onSuccess,
}: {
  vendorId: string
  onSuccess?: () => void
}) {
  const supabase = createClient()
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [createdListingId, setCreatedListingId] = useState<string | null>(null)
  const [createdTitle, setCreatedTitle] = useState('')

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          vendor_id: vendorId,
          title: form.title.trim(),
          category: form.category,
          asking_price_cents: Math.round(parseFloat(form.askingPrice) * 100),
          quantity_available: parseInt(form.quantity) || 1,
          condition: form.condition,
          description: form.description.trim(),
          status: 'active',
        })
        .select('id, title')
        .single()

      if (error || !listing) throw error || new Error('No listing returned')

      // Auto-generate QR code record
      await supabase.from('qr_codes').insert({
        listing_id: listing.id,
        client_slug: 'western-n-third',
        destination_url: buildQRUrl(listing.id),
      })

      setCreatedListingId(listing.id)
      setCreatedTitle(listing.title)
      setForm(INITIAL)
      onSuccess?.()
    } catch (err) {
      console.error('Listing creation error:', err)
      alert('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  if (createdListingId) {
    return (
      <div style={{ padding: '24px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#15803d', marginBottom: '4px' }}>✓ Listing Created!</div>
        <div style={{ color: '#374151', marginBottom: '20px', fontSize: '0.9rem' }}>{createdTitle}</div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '12px' }}>QR code generated — print it and attach to the item:</p>
          <QRCodeDisplay listingId={createdListingId} title={createdTitle} size={180} />
        </div>
        <button
          onClick={() => { setCreatedListingId(null); setCreatedTitle('') }}
          className="btn"
          style={{ fontSize: '0.9rem' }}
        >
          + Add Another Listing
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>

      <div className="db-form-row">
        <div className="db-form-group">
          <label>Item Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g., Industrial Steel I-Beams"
            required
          />
        </div>
        <div className="db-form-group">
          <label>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="db-form-row">
        <div className="db-form-group">
          <label>Asking Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.askingPrice}
            onChange={e => set('askingPrice', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="db-form-group">
          <label>Quantity</label>
          <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
        </div>
      </div>

      <div className="db-form-row">
        <div className="db-form-group">
          <label>Condition</label>
          <select value={form.condition} onChange={e => set('condition', e.target.value)}>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div className="db-form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Item details, dimensions, notes..."
          />
        </div>
      </div>

      <button type="submit" className="btn btn-block" disabled={loading}>
        {loading ? 'Creating...' : '✓ Create Listing'}
      </button>
    </form>
  )
}
