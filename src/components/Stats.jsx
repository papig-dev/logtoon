export default function Stats({ webtoons }) {
  const total = webtoons.length
  const reading = webtoons.filter(w => w.status === '읽는중').length
  const finished = webtoons.filter(w => w.status === '완결').length
  const totalEps = webtoons.reduce((sum, w) => sum + (w.currentEp || 0), 0)

  const items = [
    { label: '전체',    value: total,    color: '#3d3530' },
    { label: '읽는중',  value: reading,  color: '#d97706' },
    { label: '완결',    value: finished, color: '#65a355' },
    { label: '누적 회차', value: totalEps, color: '#8b5cf6' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-2xl p-4 text-center"
          style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
          <div className="text-xs mt-1" style={{ color: '#a8a29e' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
