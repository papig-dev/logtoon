export default function Stats({ webtoons }) {
  const total = webtoons.length
  const reading = webtoons.filter(w => w.status === '읽는중').length
  const finished = webtoons.filter(w => w.status === '완결').length
  const totalEps = webtoons.reduce((sum, w) => sum + (w.currentEp || 0), 0)

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {[
        { label: '전체', value: total, color: 'text-gray-800' },
        { label: '읽는중', value: reading, color: 'text-blue-600' },
        { label: '완결', value: finished, color: 'text-green-600' },
        { label: '누적 회차', value: totalEps, color: 'text-purple-600' },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className={`text-2xl font-bold ${color}`}>{value}</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
