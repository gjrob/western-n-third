interface Stats {
  active_listings?: number
  total_sold?: number
  month_revenue_cents?: number
  avg_rating?: number
  response_rate_pct?: number
}

export default function StatsCards({ stats }: { stats?: Stats }) {
  if (!stats) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => <div key={i} className="stat-card" style={{ minHeight: '88px' }} />)}
      </div>
    )
  }

  return (
    <div className="stats-grid">
      <div className="stat-card accent">
        <div className="stat-label">Active Listings</div>
        <div className="stat-value">{stats.active_listings ?? 0}</div>
        <div className="stat-meta">Ready to sell</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Items Sold</div>
        <div className="stat-value">{stats.total_sold ?? 0}</div>
        <div className="stat-meta">All time</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Month Revenue</div>
        <div className="stat-value">${((stats.month_revenue_cents ?? 0) / 100).toFixed(0)}</div>
        <div className="stat-meta">Last 30 days</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Avg Rating</div>
        <div className="stat-value">{(stats.avg_rating ?? 5).toFixed(1)}</div>
        <div className="stat-meta">{stats.response_rate_pct ?? 100}% response rate</div>
      </div>
    </div>
  )
}
