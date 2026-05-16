import { Link } from 'react-router-dom'
import PageTransition from '../components/shared/PageTransition.jsx'

function NotFound() {
  return (
    <PageTransition className="space-y-6">
      <p className="pill">404</p>
      <h1 className="text-3xl font-display text-ink">Page not found</h1>
      <p className="text-sm text-cedar/70">
        The page you are looking for has moved or does not exist.
      </p>
      <Link to="/" className="primary-button">
        Back to home
      </Link>
    </PageTransition>
  )
}

export default NotFound
