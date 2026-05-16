import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

function MainLayout() {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <main className="section-padding flex-1 pt-10">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
