interface Order {
  id: string
  buyer_name: string
  buyer_email: string
  quantity: number
  total_price_cents: number
  status: string
  created_at: string
  listings?: { title: string }
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#fff3cd', color: '#856404' },
  accepted:  { bg: '#cce5ff', color: '#004085' },
  completed: { bg: '#d4edda', color: '#155724' },
  cancelled: { bg: '#f8d7da', color: '#721c24' },
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--db-muted)' }}>
        No pending orders.
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="db-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Buyer</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending
            return (
              <tr key={order.id}>
                <td>{order.listings?.title || '—'}</td>
                <td>
                  {order.buyer_name}
                  <br />
                  <span style={{ fontSize: '0.8rem', color: 'var(--db-muted)' }}>{order.buyer_email}</span>
                </td>
                <td>{order.quantity}</td>
                <td>${(order.total_price_cents / 100).toFixed(2)}</td>
                <td>
                  <span style={{ padding: '3px 8px', background: style.bg, color: style.color, borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
