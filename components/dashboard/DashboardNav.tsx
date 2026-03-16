'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/dashboard',                   label: '📊 Overview' },
  { href: '/dashboard/qr-analytics',      label: '📱 QR Analytics' },
  { href: '/marketplace',                 label: '🛒 Marketplace' },
]

export default function DashboardNav() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/vendor/login')
  }

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-header">
        <div className="dashboard-nav-logo">BTV CRM</div>
        <div className="dashboard-nav-tagline">Western N Third</div>
      </div>

      <ul className="dashboard-nav-items">
        {NAV_ITEMS.map(item => (
          <li key={item.href} className="dashboard-nav-item">
            <a
              href={item.href}
              className={`dashboard-nav-link${pathname === item.href ? ' active' : ''}`}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li className="dashboard-nav-item">
          <a href="/" className="dashboard-nav-link">← Main Site</a>
        </li>
      </ul>

      <div className="dashboard-nav-user">
        <div className="dashboard-nav-user-info">Vendor Portal</div>
        <button className="dashboard-nav-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
