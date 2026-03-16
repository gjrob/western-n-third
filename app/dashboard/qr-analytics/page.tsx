'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import QRCodeDisplay from '@/components/QRCodeDisplay'

interface QRRow {
  id: string
  listing_id: string
  destination_url: string
  created_at: string
  listing_title: string
  listing_category: string
  total_scans: number
  unique_devices: number
  conversions: number
  mobile_scans: number
}

export default function QRAnalyticsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [rows, setRows] = useState<QRRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQR, setSelectedQR] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/vendor/login'); return }

      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!vendor) { router.push('/vendor/setup'); return }

      // Load QR codes for this vendor's listings
      const { data: qrCodes } = await supabase
        .from('qr_codes')
        .select(`
          id, listing_id, destination_url, created_at,
          listings!inner(title, category, vendor_id)
        `)
        .eq('listings.vendor_id', vendor.id)
        .order('created_at', { ascending: false })

      if (!qrCodes || qrCodes.length === 0) {
        setRows([])
        setLoading(false)
        return
      }

      // Load scan stats per QR code
      const qrIds = qrCodes.map(q => q.id)
      const { data: scans } = await supabase
        .from('qr_scans')
        .select('qr_code_id, device_type, converted')
        .in('qr_code_id', qrIds)

      // Aggregate scan stats
      const statsMap: Record<string, { total: number; mobile: number; converted: number }> = {}
      for (const scan of scans || []) {
        if (!statsMap[scan.qr_code_id]) statsMap[scan.qr_code_id] = { total: 0, mobile: 0, converted: 0 }
        statsMap[scan.qr_code_id].total++
        if (scan.device_type === 'mobile') statsMap[scan.qr_code_id].mobile++
        if (scan.converted) statsMap[scan.qr_code_id].converted++
      }

      const result: QRRow[] = qrCodes.map((qr: any) => {
        const stats = statsMap[qr.id] || { total: 0, mobile: 0, converted: 0 }
        return {
          id: qr.id,
          listing_id: qr.listing_id,
          destination_url: qr.destination_url,
          created_at: qr.created_at,
          listing_title: qr.listings.title,
          listing_category: qr.listings.category,
          total_scans: stats.total,
          unique_devices: stats.total, // simplified — no dedup without ip
          conversions: stats.converted,
          mobile_scans: stats.mobile,
        }
      })

      setRows(result)
      setLoading(false)
    }

    load()
  }, [])

  const totalScans = rows.reduce((sum, r) => sum + r.total_scans, 0)
  const totalConversions = rows.reduce((sum, r) => sum + r.conversions, 0)
  const conversionRate = totalScans > 0 ? ((totalConversions / totalScans) * 100).toFixed(1) : '0'
  const mobileScans = rows.reduce((sum, r) => sum + r.mobile_scans, 0)
  const mobilePct = totalScans > 0 ? Math.round((mobileScans / totalScans) * 100) : 0

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner" />
        <p>Loading QR analytics...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-main">

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--db-text)', marginBottom: '4px' }}>
            QR Code Analytics
          </h1>
          <p style={{ color: 'var(--db-muted)', fontSize: '0.9rem' }}>
            Track every scan from your product QR codes
          </p>
        </div>

        {/* Summary stats */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-value">{totalScans}</div>
            <div className="stat-label">Total Scans</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{rows.length}</div>
            <div className="stat-label">Active QR Codes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{conversionRate}%</div>
            <div className="stat-label">Conversion Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{mobilePct}%</div>
            <div className="stat-label">Mobile Scans</div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--db-muted)', background: '#fff', border: '1px solid var(--db-border)', borderRadius: '8px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📱</div>
            <p style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--db-text)' }}>No QR codes yet</p>
            <p style={{ fontSize: '0.9rem' }}>QR codes are generated automatically when you create a listing.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="db-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Scans</th>
                  <th>Mobile</th>
                  <th>Conversions</th>
                  <th>QR Code</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.listing_title}</strong>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{row.listing_category}</td>
                    <td>
                      <strong>{row.total_scans}</strong>
                    </td>
                    <td>
                      {row.total_scans > 0 ? `${Math.round((row.mobile_scans / row.total_scans) * 100)}%` : '—'}
                    </td>
                    <td>
                      {row.conversions > 0 ? (
                        <span style={{ color: '#059669', fontWeight: 600 }}>{row.conversions}</span>
                      ) : '0'}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedQR(selectedQR === row.listing_id ? null : row.listing_id)}
                        className="btn btn-small"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {selectedQR === row.listing_id ? 'Hide' : '📱 View QR'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* QR Code expanded view */}
            {selectedQR && (
              <div style={{
                marginTop: '24px',
                padding: '32px',
                background: '#fff',
                border: '1px solid var(--db-border)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}>
                <p style={{ fontWeight: 700, color: 'var(--db-text)', marginBottom: '4px' }}>
                  {rows.find(r => r.listing_id === selectedQR)?.listing_title}
                </p>
                <QRCodeDisplay
                  listingId={selectedQR}
                  title={rows.find(r => r.listing_id === selectedQR)?.listing_title || ''}
                  size={220}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
