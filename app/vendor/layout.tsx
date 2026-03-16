import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Vendor Portal — Western 'N' Third",
  description: "Manage your inventory and orders on Western 'N' Third Marketplace",
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
