'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardHeader({ vendor }: { vendor: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/vendor/login')
  }

  return (
    <div className="dashboard-header">
      <div>
        <h1>Welcome, {vendor?.business_name}</h1>
        <p style={{ color: 'var(--dash-text-light)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
          Manage your inventory, orders, and inquiries
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a href="/marketplace" className="dash-btn dash-btn-secondary">
          View Marketplace
        </a>
        <button className="dash-btn dash-btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
