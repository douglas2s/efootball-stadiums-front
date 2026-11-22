import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'efootball-favorites'

function getInitialFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(getInitialFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds])

  // Set permite checar se um estádio é favorito em tempo constante O(1)
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds])

  const isFavorite = useCallback((id) => favoriteSet.has(id), [favoriteSet])

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    isFavorite,
    toggleFavorite,
  }
}
