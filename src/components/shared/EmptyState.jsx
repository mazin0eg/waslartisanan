function EmptyState({ title, message, action }) {
  return (
    <div className="surface flex flex-col items-start gap-3 rounded-3xl p-8">
      <p className="text-lg font-display text-ink">{title}</p>
      <p className="text-sm text-cedar/70">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export default EmptyState
