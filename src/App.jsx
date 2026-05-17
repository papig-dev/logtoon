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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">로그툰</h1>
          <div className="flex gap-2">
            <button
              onClick={() => importRef.current.click()}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              가져오기
            </button>
            <button
              onClick={exportJSON}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              내보내기
            </button>
            <button
              onClick={openAdd}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
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
          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                  ${filterStatus === s
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
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
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white w-40 outline-none focus:border-gray-400"
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 outline-none"
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
