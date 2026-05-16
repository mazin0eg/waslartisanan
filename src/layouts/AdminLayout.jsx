import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar.jsx'
import AdminTopbar from '../components/layout/AdminTopbar.jsx'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="section-padding flex-1 py-10">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
