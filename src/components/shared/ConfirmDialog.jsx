function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div className="surface w-full max-w-md rounded-3xl p-6">
        <h3 className="text-xl font-display text-ink">{title}</h3>
        <p className="mt-2 text-sm text-cedar/70">{description}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="ghost-button text-xs" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="primary-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
