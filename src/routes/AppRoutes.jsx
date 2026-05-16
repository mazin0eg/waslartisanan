import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'
import ScrollToTop from '../components/shared/ScrollToTop.jsx'
import Home from '../pages/Home.jsx'
import Products from '../pages/Products.jsx'
import ProductDetails from '../pages/ProductDetails.jsx'
import About from '../pages/About.jsx'
import Contact from '../pages/Contact.jsx'
import Cart from '../pages/Cart.jsx'
import Checkout from '../pages/Checkout.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Profile from '../pages/Profile.jsx'
import NotFound from '../pages/NotFound.jsx'
import AdminLogin from '../pages/admin/Login.jsx'
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminProducts from '../pages/admin/Products.jsx'
import AdminProductForm from '../pages/admin/ProductForm.jsx'
import AdminOrders from '../pages/admin/Orders.jsx'
import AdminCustomers from '../pages/admin/Customers.jsx'
import AdminRouteGuard from './AdminRouteGuard.jsx'

function AppRoutes() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin/login" element={<AdminLogin />} />
          </Route>
          <Route
            path="admin"
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default AppRoutes
