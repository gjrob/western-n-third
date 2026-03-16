'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { detectDeviceType } from '@/lib/qr-utils'

export default function ScanTracker({
  qrCodeId,
  listingId,
}: {
  qrCodeId: string
  listingId: string
}) {
  useEffect(() => {
    const supabase = createClient()
    supabase.from('qr_scans').insert({
      qr_code_id: qrCodeId,
      listing_id: listingId,
      client_slug: 'western-n-third',
      device_type: detectDeviceType(navigator.userAgent),
      user_agent: navigator.userAgent.slice(0, 500),
      referrer: document.referrer || null,
    })
  }, [qrCodeId, listingId])

  return null
}
