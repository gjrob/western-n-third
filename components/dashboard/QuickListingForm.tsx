'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

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
  const [success, setSuccess] = useState(false)

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('listings').insert({
        vendor_id: vendorId,
        title: form.title.trim(),
        category: form.category,
        asking_price_cents: Math.round(parseFloat(form.askingPrice) * 100),
        quantity_available: parseInt(form.quantity) || 1,
        condition: form.condition,
        description: form.description.trim(),
        status: 'active',
      })

      if (error) throw error

      setForm(INITIAL)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      onSuccess?.()
    } catch (err) {
      console.error('Listing creation error:', err)
      alert('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {success && (
        <div style={{ padding: '12px 16px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '16px', fontWeight: 600 }}>
          ✓ Listing created!
        </div>
      )}

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
