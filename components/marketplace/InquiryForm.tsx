'use client'

import { useState } from 'react'

interface InquiryFormProps {
  listingId: string
  vendorName: string
}

const INITIAL = { name: '', email: '', phone: '', message: '' }

export default function InquiryForm({ listingId, vendorName }: InquiryFormProps) {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/marketplace/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, ...form }),
      })

      if (res.ok) {
        setSent(true)
        setForm(INITIAL)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send inquiry')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div style={{ padding: '20px', background: '#d4edda', color: '#155724', borderRadius: '4px', textAlign: 'center' }}>
        <strong>Inquiry sent!</strong>
        <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
          {vendorName} will be in touch soon.
        </p>
        <button
          onClick={() => setSent(false)}
          style={{ marginTop: '12px', background: 'none', border: 'none', color: '#155724', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
        >
          Send another inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '16px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Your Name *</label>
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Questions about this item..."
          style={{ minHeight: '80px', resize: 'vertical' }}
        />
      </div>

      <button type="submit" className="dash-btn dash-btn-block" disabled={loading}>
        {loading ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  )
}
