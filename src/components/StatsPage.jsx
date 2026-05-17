export default function StatsPage({ webtoons }) {
  if (webtoons.length === 0) {
    return (
      <div className="text-center py-20 text-sm" style={{ color: '#a8a29e' }}>
        작품을 추가하면 통계가 나타납니다 ✦
      </div>
    )
  }

  const total = webtoons.length
  const totalEps = webtoons.reduce((sum, w) => sum + (w.currentEp || 0), 0)

  // 상태 분포
  const statusCount = { '읽는중': 0, '완결': 0, '보류': 0, '관심': 0 }
  webtoons.forEach(w => { if (statusCount[w.status] !== undefined) statusCount[w.status]++ })

  // 별점 분포
  const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const rated = webtoons.filter(w => w.rating)
  rated.forEach(w => { ratingCount[w.rating]++ })
  const avgRating = rated.length ? (rated.reduce((s, w) => s + w.rating, 0) / rated.length).toFixed(1) : null

  // 장르 분포 (상위 5)
  const genreCount = {}
  webtoons.forEach(w => {
    if (!w.genre) return
    const g = w.genre.split('/')[0].trim()
    genreCount[g] = (genreCount[g] || 0) + 1
  })
  const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // 요일 분포
  const dayCount = { '월': 0, '화': 0, '수': 0, '목': 0, '금': 0, '토': 0, '일': 0 }
  webtoons.forEach(w => {
    (w.serialDays || []).forEach(d => { if (dayCount[d] !== undefined) dayCount[d]++ })
  })
  const maxDay = Math.max(...Object.values(dayCount), 1)
  const hasAnyDay = Object.values(dayCount).some(v => v > 0)

  // 평균 진행률 (읽는중만)
  const reading = webtoons.filter(w => w.status === '읽는중' && w.totalEp)
  const avgProgress = reading.length
    ? Math.round(reading.reduce((s, w) => s + (w.currentEp / w.totalEp) * 100, 0) / reading.length)
    : null

  const STATUS_COLOR = {
    '읽는중': '#d97706',
    '완결':   '#65a355',
    '보류':   '#9ca3af',
    '관심':   '#8b5cf6',
  }

  return (
    <div className="space-y-4">
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="총 작품" value={total} unit="편" color="#3d3530" />
        <SummaryCard label="누적 회차" value={totalEps.toLocaleString()} unit="화" color="#d97706" />
        <SummaryCard label="평균 별점" value={avgRating ?? '-'} unit={avgRating ? '점' : ''} color="#f59e0b" />
      </div>

      {/* 상태 분포 */}
      <Section title="상태 분포">
        <div className="space-y-2">
          {Object.entries(statusCount).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <span className="text-xs w-12 text-right shrink-0" style={{ color: '#78716c' }}>{status}</span>
              <div className="flex-1 rounded-full h-5 overflow-hidden" style={{ background: '#f5ede8' }}>
                <div
                  className="h-5 rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{
                    width: total ? `${Math.max((count / total) * 100, count > 0 ? 6 : 0)}%` : '0%',
                    background: STATUS_COLOR[status],
                  }}
                >
                  {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
                </div>
              </div>
              <span className="text-xs w-8 shrink-0" style={{ color: '#a8a29e' }}>
                {total ? Math.round((count / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* 별점 분포 */}
      {rated.length > 0 && (
        <Section title={`별점 분포 · ${rated.length}편 평가됨`}>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(n => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-xs shrink-0" style={{ color: '#f59e0b' }}>{'★'.repeat(n)}</span>
                <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ background: '#f5ede8' }}>
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: rated.length ? `${Math.max((ratingCount[n] / rated.length) * 100, ratingCount[n] > 0 ? 4 : 0)}%` : '0%',
                      background: '#fbbf24',
                    }}
                  />
                </div>
                <span className="text-xs w-4 shrink-0 text-right" style={{ color: '#a8a29e' }}>{ratingCount[n]}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 장르 분포 */}
      {topGenres.length > 0 && (
        <Section title="장르 분포 (상위 5)">
          <div className="space-y-2">
            {topGenres.map(([genre, count]) => (
              <div key={genre} className="flex items-center gap-3">
                <span className="text-xs w-14 shrink-0 truncate" style={{ color: '#78716c' }}>{genre}</span>
                <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ background: '#f5ede8' }}>
                  <div
                    className="h-4 rounded-full transition-all"
                    style={{
                      width: `${(count / topGenres[0][1]) * 100}%`,
                      background: '#d97706',
                      opacity: 0.7 + (count / topGenres[0][1]) * 0.3,
                    }}
                  />
                </div>
                <span className="text-xs w-4 shrink-0 text-right" style={{ color: '#a8a29e' }}>{count}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 요일 분포 */}
      {hasAnyDay && (
        <Section title="연재 요일 분포">
          <div className="flex items-end gap-2 h-24">
            {Object.entries(dayCount).map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs" style={{ color: '#a8a29e' }}>{count || ''}</span>
                <div className="w-full rounded-t-lg transition-all" style={{
                  height: `${count ? Math.max((count / maxDay) * 72, 8) : 4}px`,
                  background: count ? '#d97706' : '#f5ede8',
                }} />
                <span className="text-xs font-bold" style={{ color: count ? '#d97706' : '#d1c9c2' }}>{day}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 읽는중 평균 진행률 */}
      {avgProgress !== null && (
        <Section title={`읽는중 평균 진행률 · ${reading.length}편`}>
          <div className="flex items-center gap-4">
            <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ background: '#f5ede8' }}>
              <div
                className="h-4 rounded-full transition-all"
                style={{ width: `${avgProgress}%`, background: '#d97706' }}
              />
            </div>
            <span className="text-lg font-extrabold shrink-0" style={{ color: '#d97706' }}>{avgProgress}%</span>
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="text-xs font-bold mb-3" style={{ color: '#a8a29e', letterSpacing: '0.5px' }}>{title.toUpperCase()}</div>
      {children}
    </div>
  )
}

function SummaryCard({ label, value, unit, color }) {
  return (
    <div className="rounded-2xl p-4 text-center" style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="text-2xl font-extrabold" style={{ color }}>
        {value}<span className="text-sm font-medium ml-0.5" style={{ color: '#a8a29e' }}>{unit}</span>
      </div>
      <div className="text-xs mt-1" style={{ color: '#a8a29e' }}>{label}</div>
    </div>
  )
}
