function SectionHeading({ label, title, description }) {
  return (
    <div className="flex flex-col gap-3">
      {label ? <span className="pill">{label}</span> : null}
      <h2 className="text-3xl font-display text-ink md:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm text-cedar/70">{description}</p>
      ) : null}
    </div>
  )
}

export default SectionHeading
