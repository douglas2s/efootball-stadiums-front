import { useCallback, useEffect, useState } from 'react'
import { fetchStadiums } from '../services/api'

export function useStadiums() {
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadTick, setReloadTick] = useState(0)

  const reload = useCallback(() => {
    setReloadTick((tick) => tick + 1)
  }, [])

  useEffect(() => {
    // AbortController cancela a requisição se o componente desmontar ou recarregar
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchStadiums({ signal: controller.signal })
        setStadiums(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(
          err.message ||
            'Não foi possível conectar à API. Verifique se o backend FastAPI está rodando.'
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => controller.abort()
  }, [reloadTick])

  return { stadiums, loading, error, reload }
}
