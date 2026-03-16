'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import '../auth.css'

interface SetupForm {
  business_name: string
  description: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  shipping_available: boolean
  auto_accept_offers: boolean
}

export default function VendorSetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [vendor, setVendor] = useState<any>(null)
  const [form, setForm] = useState<SetupForm>({
    business_name: '',
    description: '',
    phone: '',
    address: '',
    city: 'Wilmington',
    state: 'NC',
    zip: '',
    shipping_available: true,
    auto_accept_offers: false,
  })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/vendor/login')
        return
      }

      const { data: v } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!v) {
        router.push('/vendor/signup')
        return
      }

      setVendor(v)
      setForm({
        business_name: v.business_name || '',
        description: v.description || '',
        phone: v.phone || '',
        address: v.address || '',
        city: v.city || 'Wilmington',
        state: v.state || 'NC',
        zip: v.zip || '',
        shipping_available: v.shipping_available !== false,
        auto_accept_offers: v.auto_accept_offers || false,
      })

      setLoading(false)
    }

    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase
      .from('vendors')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', vendor.id)

    if (error) {
      alert('Error saving: ' + error.message)
      setSaving(false)
      return
    }

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
        <p>Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div className="auth-container" style={{ maxWidth: '580px' }}>
        <div className="auth-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Western N Third" />
          <div className="auth-logo-subtitle">Complete Your Profile</div>
          <div className="auth-logo-description">Add your business details to start listing</div>
        </div>

        <form onSubmit={handleSave} className="auth-form">
          <h2 className="auth-form-title">Business Info</h2>

          <div className="form-group">
            <label htmlFor="business_name">Business Name *</label>
            <input
              id="business_name"
              type="text"
              value={form.business_name}
              onChange={e => setForm({ ...form, business_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">About Your Business</label>
            <textarea
              id="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Tell buyers about your specialties, years in business, inventory focus..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="(910) 555-0123"
            />
          </div>

          <p className="auth-section-heading">Location</p>

          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              id="address"
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP</label>
              <input
                id="zip"
                type="text"
                value={form.zip}
                onChange={e => setForm({ ...form, zip: e.target.value })}
                placeholder="28401"
              />
            </div>
          </div>

          <p className="auth-section-heading">Preferences</p>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              <input
                type="checkbox"
                checked={form.shipping_available}
                onChange={e => setForm({ ...form, shipping_available: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              I can arrange shipping for orders
            </label>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              <input
                type="checkbox"
                checked={form.auto_accept_offers}
                onChange={e => setForm({ ...form, auto_accept_offers: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              Auto-accept reasonable offers
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={saving} style={{ marginTop: '8px' }}>
            {saving ? 'Saving...' : 'Complete Setup → Go to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
