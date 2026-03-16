'use client'

import { buildQRUrl, buildQRImageUrl } from '@/lib/qr-utils'

interface QRCodeDisplayProps {
  listingId: string
  title: string
  size?: number
  showButtons?: boolean
}

export default function QRCodeDisplay({
  listingId,
  title,
  size = 200,
  showButtons = true,
}: QRCodeDisplayProps) {
  const qrUrl = buildQRUrl(listingId)
  const qrImageUrl = buildQRImageUrl(qrUrl, size)
  const qrPrintUrl = buildQRImageUrl(qrUrl, 1000)

  const handleDownload = async () => {
    const res = await fetch(qrPrintUrl)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `qr-${title.toLowerCase().replace(/\s+/g, '-')}.png`
    a.click()
  }

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>QR — ${title}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;gap:12px}h2{margin:0;font-size:1rem}p{margin:0;font-size:.8rem;color:#666}</style>
      </head><body>
      <img src="${qrPrintUrl}" width="300" height="300" />
      <h2>${title}</h2>
      <p>${qrUrl}</p>
      <script>window.onload=()=>window.print()</script>
      </body></html>
    `)
    win.document.close()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrImageUrl}
        alt={`QR code for ${title}`}
        width={size}
        height={size}
        style={{ display: 'block', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px', background: '#fff' }}
      />
      {showButtons && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleDownload}
            className="btn btn-small"
            style={{ fontSize: '0.8rem' }}
          >
            ↓ Download
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-small"
            style={{ fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--db-border)', color: 'var(--db-text)' }}
          >
            🖨 Print
          </button>
        </div>
      )}
    </div>
  )
}
