function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-sand/40 bg-white/80 p-4 shadow-card">
      <div className="h-44 w-full rounded-2xl bg-sand/30" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 rounded-full bg-sand/30" />
        <div className="h-3 w-1/2 rounded-full bg-sand/30" />
        <div className="h-4 w-1/3 rounded-full bg-sand/30" />
      </div>
    </div>
  )
}

export default SkeletonCard
