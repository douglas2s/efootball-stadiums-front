// No Vite, variáveis de ambiente acessíveis no navegador precisam começar com VITE_
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/$/, '')

async function request(endpoint, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    let detail = `Erro HTTP ${response.status}`
    try {
      const errorBody = await response.json()
      if (errorBody?.detail) {
        detail = errorBody.detail
      }
    } catch {
      // Se o corpo da resposta não for JSON, mantemos a mensagem de status HTTP
    }
    throw new Error(detail)
  }

  return response.json()
}

export function fetchStadiums(options) {
  return request('/stadiums', options)
}

export function fetchStadiumById(stadiumId, options) {
  return request(`/stadiums/${stadiumId}`, options)
}

export function fetchStadiumsByCategory(category, options) {
  return request(`/stadiums/category/${encodeURIComponent(category)}`, options)
}
