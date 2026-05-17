import { useState, useEffect, useRef } from 'react'
import webtoonDB from '../data/webtoons.json'

const STATUS_OPTIONS = ['읽는중', '완결', '보류', '관심']

const STATUS_ACTIVE = {
  '읽는중': { background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d' },
  '완결':   { background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' },
  '보류':   { background: '#f3f4f6', color: '#6b7280', border: '1px solid #d1d5db' },
  '관심':   { background: '#ede9fe', color: '#7c3aed', border: '1px solid #c4b5fd' },
}

const empty = {
  title: '',
  author: '',
  genre: '',
  status: '읽는중',
  currentEp: 0,
  totalEp: '',
  rating: null,
  memo: '',
}

export default function WebtoonModal({ webtoon, onSave, onClose }) {
  const [form, setForm] = useState(empty)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggest, setShowSuggest] = useState(false)
  const suggestRef = useRef(null)

  useEffect(() => {
    if (webtoon) {
      setForm({ ...empty, ...webtoon, totalEp: webtoon.totalEp ?? '' })
    } else {
      setForm(empty)
    }
  }, [webtoon])

  useEffect(() => {
    function handleClick(e) {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggest(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'title') {
      const q = value.trim()
      if (q.length >= 1) {
        const matched = webtoonDB
          .filter(w => w.title.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 6)
        setSuggestions(matched)
        setShowSuggest(matched.length > 0)
      } else {
        setShowSuggest(false)
      }
    }
  }

  function selectSuggestion(item) {
    setForm(prev => ({
      ...prev,
      title: item.title,
      author: item.author || prev.author,
      genre: item.genre || prev.genre,
    }))
    setShowSuggest(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({
      ...form,
      currentEp: Number(form.currentEp) || 0,
      totalEp: form.totalEp !== '' ? Number(form.totalEp) : null,
      rating: form.rating ? Number(form.rating) : null,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="w-full max-w-md rounded-3xl shadow-2xl" style={{ background: '#faf8f5' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #e8e0d8' }}>
          <h2 className="text-sm font-bold" style={{ color: '#2d2420' }}>
            {webtoon ? '작품 편집' : '작품 추가'}
          </h2>
          <button
            onClick={onClose}
            className="text-xl leading-none"
            style={{ color: '#a8a29e' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <Field label="제목 *">
            <div className="relative" ref={suggestRef}>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                onFocus={() => form.title && suggestions.length > 0 && setShowSuggest(true)}
                required
                placeholder="작품 제목"
                className="input"
                autoComplete="off"
              />
              {showSuggest && (
                <ul
                  className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden"
                  style={{ background: '#fff', border: '1px solid #e8e0d8', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                >
                  {suggestions.map((item, i) => (
                    <li
                      key={i}
                      onMouseDown={() => selectSuggestion(item)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer text-sm"
                      style={{ borderBottom: i < suggestions.length - 1 ? '1px solid #f5ede8' : 'none' }}
                      onMouseOver={e => e.currentTarget.style.background = '#faf8f5'}
                      onMouseOut={e => e.currentTarget.style.background = '#fff'}
                    >
                      <span style={{ color: '#2d2420', fontWeight: 500 }}>{item.title}</span>
                      <span style={{ color: '#a8a29e', fontSize: 11 }}>{item.author} · {item.genre}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="작가">
              <input name="author" value={form.author} onChange={handleChange} placeholder="작가명" className="input" />
            </Field>
            <Field label="장르">
              <input name="genre" value={form.genre} onChange={handleChange} placeholder="로맨스, 액션…" className="input" />
            </Field>
          </div>

          <Field label="상태">
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className="flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  style={
                    form.status === s
                      ? STATUS_ACTIVE[s]
                      : { background: '#fff', color: '#a8a29e', border: '1px solid #e8e0d8' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="현재 회차">
              <input type="number" name="currentEp" value={form.currentEp} onChange={handleChange} min="0" className="input" />
            </Field>
            <Field label="총 회차">
              <input type="number" name="totalEp" value={form.totalEp} onChange={handleChange} min="0" placeholder="미정" className="input" />
            </Field>
          </div>

          <Field label="별점">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, rating: prev.rating === n ? null : n }))}
                  className="text-2xl transition-colors"
                  style={{ color: form.rating >= n ? '#f59e0b' : '#e8e0d8' }}
                >
                  ★
                </button>
              ))}
            </div>
          </Field>

          <Field label="메모">
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              rows={3}
              placeholder="간단한 메모..."
              className="input resize-none"
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#fff', border: '1px solid #e8e0d8', color: '#78716c' }}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl text-sm font-semibold"
              style={{ background: '#d97706', color: '#fff', border: 'none', boxShadow: '0 2px 4px rgba(217,119,6,0.3)' }}
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: '#a8a29e' }}>{label}</label>
      {children}
    </div>
  )
}
