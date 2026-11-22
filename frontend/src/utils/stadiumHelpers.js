// Mapeamento de bandeiras para os países presentes em stadiums.json
const COUNTRY_FLAGS = {
  Espanha: '🇪🇸',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Itália: '🇮🇹',
  Alemanha: '🇩🇪',
  'Países Baixos': '🇳🇱',
  México: '🇲🇽',
  Brasil: '🇧🇷',
  Argentina: '🇦🇷',
  Japão: '🇯🇵',
}

// Paletas individuais para a arte de estádios genéricos ou fallback de imagem
const ARENA_PALETTES = [
  { start: '#0c2352', end: '#063d2d', beam: '#1f7eff', line: '#00dc82' },
  { start: '#10294a', end: '#1b1d45', beam: '#00d2ff', line: '#ffe600' },
  { start: '#0b2f3a', end: '#0b1e3b', beam: '#00dc82', line: '#38bdf8' },
  { start: '#1c2445', end: '#0a2a38', beam: '#ffe600', line: '#00dc82' },
]

export function getCountryFlag(country) {
  if (!country) return '🏟️'
  return COUNTRY_FLAGS[country] || '🌍'
}

export function getArenaPalette(stadiumId = 1) {
  return ARENA_PALETTES[(stadiumId - 1) % ARENA_PALETTES.length]
}

export function formatStadiumCode(stadiumId) {
  return `#${String(stadiumId).padStart(2, '0')}`
}

// Normaliza texto removendo acentos e maiúsculas para buscas tolerantes (ex: "italia" -> "Itália")
export function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
