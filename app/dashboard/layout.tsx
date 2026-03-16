import '../globals.css'
import './dashboard.css'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-wrapper">
      <DashboardNav />
      {children}
    </div>
  )
}
