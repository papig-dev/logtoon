const PALETTES = [
  { bg: '#fde8e8', text: '#c0392b' },
  { bg: '#fef3e2', text: '#d35400' },
  { bg: '#fefbe2', text: '#b7950b' },
  { bg: '#e8f8e8', text: '#1e8449' },
  { bg: '#e2f0fb', text: '#1a5276' },
  { bg: '#ede8fd', text: '#6c3483' },
  { bg: '#fde8f6', text: '#a93226' },
  { bg: '#e8fdfd', text: '#117a65' },
  { bg: '#f0f0f0', text: '#2c3e50' },
  { bg: '#e8eafd', text: '#1f3a8a' },
  { bg: '#fde8f0', text: '#922b21' },
  { bg: '#eafde8', text: '#196f3d' },
]

export function getCoverColor(title = '') {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0
  }
  return PALETTES[hash % PALETTES.length]
}
