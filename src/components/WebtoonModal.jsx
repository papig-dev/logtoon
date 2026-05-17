import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['읽는중', '완결', '보류', '관심']

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

  useEffect(() => {
    if (webtoon) {
      setForm({ ...empty, ...webtoon, totalEp: webtoon.totalEp ?? '' })
    } else {
      setForm(empty)
    }
  }, [webtoon])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {webtoon ? '작품 편집' : '작품 추가'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3">
          <Field label="제목 *">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="작품 제목"
              className="input"
            />
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
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${form.status === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                  className={`text-xl ${form.rating >= n ? 'text-yellow-400' : 'text-gray-200'}`}
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
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              취소
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-gray-900 text-sm text-white hover:bg-gray-700">
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
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
