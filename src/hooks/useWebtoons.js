import { useState, useEffect } from 'react'

const STORAGE_KEY = 'logtoon_webtoons'

const initialData = []

export function useWebtoons() {
  const [webtoons, setWebtoons] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : initialData
    } catch {
      return initialData
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(webtoons))
  }, [webtoons])

  function addWebtoon(data) {
    const now = new Date().toISOString()
    const newItem = {
      ...data,
      id: Date.now(),
      createdAt: now,
      updatedAt: now,
    }
    setWebtoons(prev => [newItem, ...prev])
  }

  function updateWebtoon(id, data) {
    setWebtoons(prev =>
      prev.map(w =>
        w.id === id ? { ...w, ...data, updatedAt: new Date().toISOString() } : w
      )
    )
  }

  function deleteWebtoon(id) {
    setWebtoons(prev => prev.filter(w => w.id !== id))
  }

  function incrementEp(id) {
    setWebtoons(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, currentEp: (w.currentEp || 0) + 1, updatedAt: new Date().toISOString() }
          : w
      )
    )
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(webtoons, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logtoon_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJSON(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (Array.isArray(data)) {
          setWebtoons(data)
        }
      } catch {
        alert('올바른 JSON 파일이 아닙니다.')
      }
    }
    reader.readAsText(file)
  }

  return { webtoons, addWebtoon, updateWebtoon, deleteWebtoon, incrementEp, exportJSON, importJSON }
}
