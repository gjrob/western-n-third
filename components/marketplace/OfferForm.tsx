'use client'

import { useState } from 'react'

interface OfferFormProps {
  listingId: string
  askingPrice: number
}

const INITIAL = { buyerName: '', buyerEmail: '', buyerPhone: '', offeredPrice: '', quantity: '1', message: '' }

export default function OfferForm({ listingId, askingPrice }: OfferFormProps) {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const pct = form.offeredPrice
    ? Math.round((parseFloat(form.offeredPrice) / askingPrice) * 100)
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/marketplace/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, ...form }),
      })

      if (res.ok) {
        setSent(true)
        setForm(INITIAL)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to submit offer')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ padding: '20px', background: '#cce5ff', color: '#004085', borderRadius: '4px', textAlign: 'center' }}>
        <strong>Offer submitted!</strong>
        <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>The vendor will respond within 24–48 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontSize: '0.85rem', color: 'var(--dash-text-light)', marginBottom: '16px' }}>
        Asking price: <strong>${askingPrice.toFixed(2)}</strong>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Your Name *</label>
        <input type="text" value={form.buyerName} onChange={e => set('buyerName', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input type="email" value={form.buyerEmail} onChange={e => set('buyerEmail', e.target.value)} required />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Your Offer ($) *
            {pct !== null && (
              <span style={{ marginLeft: '8px', color: pct >= 90 ? '#27ae60' : pct >= 70 ? '#f39c12' : '#e74c3c', fontSize: '0.8rem' }}>
                ({pct}% of asking)
              </span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={form.offeredPrice}
            onChange={e => set('offeredPrice', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Why you're interested, pickup arrangements, etc."
          style={{ minHeight: '70px', resize: 'vertical' }}
        />
      </div>

      <button type="submit" className="dash-btn dash-btn-block" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Offer'}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--dash-text-light)', marginTop: '8px', textAlign: 'center' }}>
        Offer expires in 7 days · No payment collected yet
      </p>
    </form>
  )
}
