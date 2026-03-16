'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import '../auth.css'

export default function VendorSignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (authError || !data.user) {
        setError(authError?.message || 'Signup failed')
        return
      }

      const slug = form.businessName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          user_id: data.user.id,
          business_name: form.businessName,
          email: form.email,
          slug,
        })
        .select('id')
        .single()

      if (vendorError || !vendor) {
        setError('Failed to create vendor profile')
        return
      }

      await supabase.from('vendor_stats').insert({ vendor_id: vendor.id })

      setSuccess(true)
      setTimeout(() => router.push('/vendor/setup'), 2000)
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#059669' }}>✓</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', marginBottom: '8px', color: '#059669' }}>
            Account Created
          </h2>
          <p style={{ color: '#6b7280' }}>Welcome to Western 'N' Third. Redirecting to setup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Western 'N' Third" />
          <div className="auth-logo-subtitle">Vendor Portal</div>
          <div className="auth-logo-description">Western 'N' Third Building Materials</div>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          <h2 className="auth-form-title">Create Account</h2>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <div className="form-group">
            <label htmlFor="businessName">Business Name *</label>
            <input
              id="businessName"
              type="text"
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
              placeholder="Your company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="business@example.com"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm *</label>
              <input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', marginTop: '16px' }}>
            By creating an account, you agree to our Terms of Service
          </p>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/vendor/login">Sign in</Link>
          </p>
          <p>
            <Link href="/marketplace">← Back to marketplace</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
