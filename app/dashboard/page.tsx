'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCards from '@/components/dashboard/StatsCards'
import InventoryTable from '@/components/dashboard/InventoryTable'
import RecentOrders from '@/components/dashboard/RecentOrders'
import RecentInquiries from '@/components/dashboard/RecentInquiries'
import QuickListingForm from '@/components/dashboard/QuickListingForm'

interface DashboardData {
  vendor: any
  stats: any
  listings: any[]
  orders: any[]
  inquiries: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/vendor/login')
          return
        }

        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (vendorError || !vendor) {
          router.push('/vendor/setup')
          return
        }

        const [
          { data: stats },
          { data: listings },
          { data: orders },
          { data: inquiries },
        ] = await Promise.all([
          supabase.from('vendor_stats').select('*').eq('vendor_id', vendor.id).single(),
          supabase
            .from('listings')
            .select('*')
            .eq('vendor_id', vendor.id)
            .neq('status', 'archived')
            .order('updated_at', { ascending: false })
            .limit(20),
          supabase
            .from('orders')
            .select('*, listings(title)')
            .eq('vendor_id', vendor.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('inquiries')
            .select('*, listings(title)')
            .eq('vendor_id', vendor.id)
            .eq('status', 'new')
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        setData({
          vendor,
          stats: stats || { active_listings: 0, total_sold: 0, month_revenue_cents: 0, avg_rating: 5.0 },
          listings: listings || [],
          orders: orders || [],
          inquiries: inquiries || [],
        })
      } catch (err) {
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="dashboard-page">
      <DashboardHeader vendor={data.vendor} />

      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Overview</h2>
          <StatsCards stats={data.stats} />
        </section>

        <section className="dashboard-section">
          <h2>List New Item</h2>
          <QuickListingForm vendorId={data.vendor.id} />
        </section>

        <section className="dashboard-section">
          <h2>Active Listings ({data.listings.length})</h2>
          <InventoryTable listings={data.listings} vendorId={data.vendor.id} />
        </section>

        <section className="dashboard-section">
          <h2>Pending Orders ({data.orders.length})</h2>
          <RecentOrders orders={data.orders} />
        </section>

        <section className="dashboard-section">
          <h2>New Inquiries ({data.inquiries.length})</h2>
          <RecentInquiries inquiries={data.inquiries} />
        </section>
      </main>
    </div>
  )
}
