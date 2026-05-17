const STATUS_COLOR = {
  '읽는중': 'bg-blue-100 text-blue-700',
  '완결':   'bg-green-100 text-green-700',
  '보류':   'bg-yellow-100 text-yellow-700',
  '관심':   'bg-purple-100 text-purple-700',
}

export default function WebtoonList({ webtoons, onEdit, onDelete }) {
  if (webtoons.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-sm">
        작품을 추가해보세요 ✦
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {webtoons.map(w => (
        <WebtoonCard key={w.id} webtoon={w} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

function WebtoonCard({ webtoon, onEdit, onDelete }) {
  const { title, author, genre, status, currentEp, totalEp, rating, memo } = webtoon
  const progress = totalEp ? Math.min(100, Math.round((currentEp / totalEp) * 100)) : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-start gap-4 hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900 text-sm">{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[status]}`}>
            {status}
          </span>
          {rating && (
            <span className="text-xs text-yellow-500">{'★'.repeat(rating)}</span>
          )}
        </div>

        <div className="text-xs text-gray-400 mt-0.5 space-x-2">
          {author && <span>{author}</span>}
          {genre && <span>· {genre}</span>}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-xs text-gray-500">
            {currentEp}화{totalEp ? ` / ${totalEp}화` : ''}
          </span>
          {progress !== null && (
            <div className="flex-1 max-w-32 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-gray-800 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {progress !== null && (
            <span className="text-xs text-gray-400">{progress}%</span>
          )}
        </div>

        {memo && (
          <p className="text-xs text-gray-400 mt-1.5 truncate">{memo}</p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        <button
          onClick={() => onEdit(webtoon)}
          className="text-xs px-2.5 py-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          편집
        </button>
        <button
          onClick={() => {
            if (confirm(`"${title}" 을(를) 삭제할까요?`)) onDelete(webtoon.id)
          }}
          className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
