import { useState, useRef, useEffect } from 'react'
import { getCoverColor } from '../utils/coverColor'

const STATUS_STYLE = {
  '읽는중': { background: '#fef3c7', color: '#d97706' },
  '완결':   { background: '#dcfce7', color: '#16a34a' },
  '보류':   { background: '#f3f4f6', color: '#6b7280' },
  '관심':   { background: '#ede9fe', color: '#7c3aed' },
}

export default function WebtoonList({ webtoons, onEdit, onDelete, onIncrementEp }) {
  if (webtoons.length === 0) {
    return (
      <div className="text-center py-20 text-sm" style={{ color: '#a8a29e' }}>
        작품을 추가해보세요 ✦
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {webtoons.map(w => (
        <WebtoonCard key={w.id} webtoon={w} onEdit={onEdit} onDelete={onDelete} onIncrementEp={onIncrementEp} />
      ))}
    </div>
  )
}

function WebtoonCard({ webtoon, onEdit, onDelete, onIncrementEp }) {
  const { title, author, genre, status, serialDays, currentEp, totalEp, rating, memo } = webtoon
  const progress = totalEp ? Math.min(100, Math.round((currentEp / totalEp) * 100)) : null
  const cover = getCoverColor(title)
  const initial = title.charAt(0)
  const statusStyle = STATUS_STYLE[status] || STATUS_STYLE['보류']

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-start gap-4 transition-shadow hover:shadow-md"
      style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    >
      {/* 커버 */}
      <div
        className="shrink-0 flex items-center justify-center text-xl font-extrabold select-none"
        style={{ backgroundColor: cover.bg, color: cover.text, width: 44, height: 60, borderRadius: 12 }}
      >
        {initial}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-bold text-sm" style={{ color: '#2d2420' }}>{title}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={statusStyle}
          >
            {status}
          </span>
          {rating && (
            <span className="text-sm" style={{ color: '#f59e0b' }}>{'★'.repeat(rating)}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-xs" style={{ color: '#a8a29e' }}>
            {author && <span>{author}</span>}
            {genre && <span> · {genre}</span>}
          </span>
          {serialDays && serialDays.length > 0 && (
            <div className="flex gap-0.5">
              {serialDays.map(day => (
                <span
                  key={day}
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: '#fef3c7', color: '#d97706', fontSize: 10 }}
                >
                  {day}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs shrink-0" style={{ color: '#78716c' }}>
            {currentEp}화{totalEp ? ` / ${totalEp}화` : ''}
          </span>
          {progress !== null && (
            <div className="flex-1 max-w-28 rounded-full h-1.5" style={{ background: '#f5ede8' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%`, background: '#d97706' }}
              />
            </div>
          )}
          {progress !== null && (
            <span className="text-xs shrink-0" style={{ color: '#a8a29e' }}>{progress}%</span>
          )}
        </div>

        {memo && (
          <p className="text-xs mt-1.5 truncate" style={{ color: '#a8a29e' }}>{memo}</p>
        )}
      </div>

      {/* 오른쪽 액션 */}
      <div className="flex items-center gap-1 shrink-0">
        {status === '읽는중' && (
          <button
            onClick={() => onIncrementEp(webtoon.id)}
            className="text-xs px-3 py-1.5 rounded-xl font-bold transition-colors"
            style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' }}
          >
            +1 읽음
          </button>
        )}

        {/* ... 메뉴 */}
        <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="text-sm w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: '#a8a29e' }}
          onMouseOver={e => e.currentTarget.style.background = '#f5ede8'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          ···
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-10 rounded-xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 80 }}
          >
            <button
              onClick={() => { onEdit(webtoon); setMenuOpen(false) }}
              className="w-full text-left text-xs px-3 py-2 transition-colors"
              style={{ color: '#3d3530', borderBottom: '1px solid #f5ede8' }}
              onMouseOver={e => e.currentTarget.style.background = '#faf8f5'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
            >
              편집
            </button>
            <button
              onClick={() => {
                if (confirm(`"${title}" 을(를) 삭제할까요?`)) { onDelete(webtoon.id); setMenuOpen(false) }
              }}
              className="w-full text-left text-xs px-3 py-2 transition-colors"
              style={{ color: '#ef4444' }}
              onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseOut={e => e.currentTarget.style.background = '#fff'}
            >
              삭제
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
