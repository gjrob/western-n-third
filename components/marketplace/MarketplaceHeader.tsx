export default function MarketplaceHeader() {
  return (
    <div className="marketplace-header">
      <h1>Western 'N' Third Marketplace</h1>
      <p>Buy · Sell · Trade — Premium Industrial Building Materials · Wilmington NC</p>
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <a href="/" className="dash-btn dash-btn-secondary" style={{ fontSize: '0.85rem' }}>
          ← Main Site
        </a>
        <a href="/vendor/login" className="dash-btn" style={{ fontSize: '0.85rem' }}>
          Vendor Login
        </a>
      </div>
    </div>
  )
}
