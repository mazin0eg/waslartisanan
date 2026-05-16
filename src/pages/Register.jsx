import PageTransition from '../components/shared/PageTransition.jsx'

function Register() {
  return (
    <PageTransition className="space-y-6">
      <h1 className="text-3xl font-display text-ink">Registration disabled</h1>
      <p className="text-sm text-cedar/70">
        Customer registration is temporarily disabled while admin-only access is
        active.
      </p>
    </PageTransition>
  )
}

export default Register
