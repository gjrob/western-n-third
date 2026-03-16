'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Inquiry {
  id: string
  inquirer_name: string
  inquirer_email: string
  inquirer_phone: string
  message: string
  status: string
  created_at: string
  listings?: { title: string }
}

export default function RecentInquiries({ inquiries }: { inquiries: Inquiry[] }) {
  const supabase = createClient()
  const router = useRouter()
  const [responding, setResponding] = useState<string | null>(null)

  const markResponded = async (id: string) => {
    setResponding(id)
    await supabase
      .from('inquiries')
      .update({ status: 'responded', responded_at: new Date().toISOString() })
      .eq('id', id)
    router.refresh()
    setResponding(null)
  }

  if (inquiries.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--db-muted)' }}>
        No new inquiries.
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="db-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>From</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map(inq => (
            <tr key={inq.id}>
              <td>{inq.listings?.title || '—'}</td>
              <td>
                {inq.inquirer_name}
                <br />
                <a href={`mailto:${inq.inquirer_email}`} style={{ fontSize: '0.8rem', color: 'var(--db-accent)' }}>
                  {inq.inquirer_email}
                </a>
              </td>
              <td>
                {inq.inquirer_phone
                  ? <a href={`tel:${inq.inquirer_phone}`} style={{ color: 'var(--db-accent)' }}>{inq.inquirer_phone}</a>
                  : '—'}
              </td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {inq.message || '—'}
              </td>
              <td>{new Date(inq.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => markResponded(inq.id)}
                  disabled={responding === inq.id}
                  className="btn btn-small"
                >
                  {responding === inq.id ? '...' : 'Mark Responded'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
