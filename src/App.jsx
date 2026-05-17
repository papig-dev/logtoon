import { useState, useRef } from 'react'
import { useWebtoons } from './hooks/useWebtoons'
import Stats from './components/Stats'
import WebtoonList from './components/WebtoonList'
import WebtoonModal from './components/WebtoonModal'

const STATUS_FILTERS = ['전체', '읽는중', '완결', '보류', '관심']
const SORT_OPTIONS = [
  { value: 'updatedAt', label: '최근 수정' },
  { value: 'createdAt', label: '추가순' },
  { value: 'title', label: '제목순' },
  { value: 'rating', label: '별점순' },
]

export default function App() {
  const { webtoons, addWebtoon, updateWebtoon, deleteWebtoon, exportJSON, importJSON } = useWebtoons()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [filterStatus, setFilterStatus] = useState('전체')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('updatedAt')

  const importRef = useRef()

  function openAdd() {
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(webtoon) {
    setEditTarget(webtoon)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (editTarget) {
      updateWebtoon(editTarget.id, data)
    } else {
      addWebtoon(data)
    }
  }

  const filtered = webtoons
    .filter(w => filterStatus === '전체' || w.status === filterStatus)
    .filter(w => {
      const q = search.toLowerCase()
      return !q || w.title.toLowerCase().includes(q) || (w.author || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      return new Date(b[sortBy]) - new Date(a[sortBy])
    })

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: '#2d2420' }}>
            로그<span style={{ color: '#d97706' }}>툰</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => importRef.current.click()}
              className="text-xs px-3 py-1.5 rounded-xl font-medium transition-colors"
              style={{ background: '#fff', border: '1px solid #e8e0d8', color: '#78716c', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              가져오기
            </button>
            <button
              onClick={exportJSON}
              className="text-xs px-3 py-1.5 rounded-xl font-medium transition-colors"
              style={{ background: '#fff', border: '1px solid #e8e0d8', color: '#78716c', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              내보내기
            </button>
            <button
              onClick={openAdd}
              className="text-xs px-3 py-1.5 rounded-xl font-semibold"
              style={{ background: '#d97706', color: '#fff', boxShadow: '0 2px 4px rgba(217,119,6,0.3)', border: 'none' }}
            >
              + 추가
            </button>
          </div>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={e => { if (e.target.files[0]) importJSON(e.target.files[0]); e.target.value = '' }}
          />
        </div>

        {/* 통계 */}
        <Stats webtoons={webtoons} />

        {/* 필터 & 검색 */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                style={
                  filterStatus === s
                    ? { background: '#2d2420', color: '#faf8f5', border: '1px solid #2d2420' }
                    : { background: '#fff', color: '#78716c', border: '1px solid #e8e0d8', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }
                }
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="제목 / 작가 검색"
              className="text-xs px-3 py-1.5 rounded-full w-40 outline-none"
              style={{ background: '#fff', border: '1px solid #e8e0d8', color: '#3d3530', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-full outline-none"
              style={{ background: '#fff', border: '1px solid #e8e0d8', color: '#78716c' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 목록 */}
        <WebtoonList webtoons={filtered} onEdit={openEdit} onDelete={deleteWebtoon} />
      </div>

      {/* 모달 */}
      {modalOpen && (
        <WebtoonModal
          webtoon={editTarget}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
