'use client'

import { useEffect } from 'react'
import { emit, EventType } from '../../lib/events'

const CLIENT_SLUG = 'western-n-third'
const QR_URL = 'https://western-n-third.com'

export default function QRPage() {
  useEffect(() => {
    emit({
      event_type: EventType.QR_SCAN,
      client_slug: CLIENT_SLUG,
      payload: { page: '/qr', url: QR_URL },
    })
  }, [])

  const handlePrint = () => window.print()

  const handleDownload = async () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(QR_URL)}&bgcolor=ffffff&color=1a1a1a&margin=2`
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'western-n-third-qr.png'
    a.click()
  }

  return (
    <div className="qr-page-body">
      <div className="qr-card">
        <div className="qr-eyebrow">Scan to Visit</div>
        <div className="qr-brand">
          Western N Third
          <span>Industrial Building Materials</span>
        </div>

        <div className="qr-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(QR_URL)}&bgcolor=ffffff&color=1a1a1a&margin=2`}
            alt="QR Code for Western N Third Building Materials"
            width={256}
            height={256}
            style={{ display: 'block' }}
          />
        </div>

        <div className="qr-url">{QR_URL}</div>

        <div className="qr-cta">Buy · Sell · Trade</div>
        <p className="qr-sub">
          Scan the code or visit our site to browse inventory.<br />
          Premium Industrial Materials · Wilmington NC
        </p>

        <div className="qr-promo">
          🏗️ Quality Building Materials at Unbeatable Prices
        </div>

        <div className="qr-contact">
          <div className="qr-contact-row">
            <span className="qr-contact-label">Phone</span>
            <span className="qr-contact-value">(910) 555-0123</span>
          </div>
          <div className="qr-contact-row">
            <span className="qr-contact-label">Email</span>
            <span className="qr-contact-value">info@western-n-third.com</span>
          </div>
          <div className="qr-contact-row">
            <span className="qr-contact-label">Hours</span>
            <span className="qr-contact-value">Mon–Fri 8–6, Sat 9–4</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="qr-print-btn" onClick={handlePrint}>
            Print
          </button>
          <button
            className="qr-print-btn"
            style={{ background: 'transparent', border: '2px solid var(--accent)', color: 'var(--accent)' }}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
