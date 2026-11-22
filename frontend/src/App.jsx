import { useCallback, useMemo, useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { Header } from './components/Header'
import { StadiumCard } from './components/StadiumCard'
import { StadiumModal } from './components/StadiumModal'
import { useFavorites } from './hooks/useFavorites'
import { useStadiums } from './hooks/useStadiums'
import { useTheme } from './hooks/useTheme'
import { API_BASE_URL } from './services/api'
import { getCountryFlag, normalizeSearchText } from './utils/stadiumHelpers'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { stadiums, loading, error, reload } = useStadiums()
  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites()

  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [country, setCountry] = useState('all')

  // Estado do Modal (estádio selecionado + flag se veio do sorteador)
  const [selectedStadium, setSelectedStadium] = useState(null)
  const [isRandomPick, setIsRandomPick] = useState(false)

  const stats = useMemo(() => {
    const licensed = stadiums.filter((s) => s.category === 'licensed')
    const generic = stadiums.filter((s) => s.category === 'generic')
    const countries = Array.from(new Set(stadiums.map((s) => s.country).filter(Boolean))).sort(
      (a, b) => a.localeCompare(b, 'pt-BR')
    )

    return {
      total: stadiums.length,
      licensedCount: licensed.length,
      genericCount: generic.length,
      countries,
      featuredPool: licensed.slice(0, 6),
    }
  }, [stadiums])

  const filteredStadiums = useMemo(() => {
    const query = normalizeSearchText(search)

    return stadiums.filter((stadium) => {
      if (category === 'favorites' && !isFavorite(stadium.id)) return false
      if (category === 'licensed' && stadium.category !== 'licensed') return false
      if (category === 'generic' && stadium.category !== 'generic') return false
      if (country !== 'all' && stadium.country !== country) return false

      if (query) {
        const haystack = normalizeSearchText(
          `${stadium.name} ${stadium.club || ''} ${stadium.country || ''}`
        )
        if (!haystack.includes(query)) return false
      }

      return true
    })
  }, [stadiums, search, category, country, isFavorite])

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || country !== 'all'

  function handleResetFilters() {
    setSearch('')
    setCategory('all')
    setCountry('all')
  }

  const spotlight = stats.featuredPool[spotlightIndex % (stats.featuredPool.length || 1)]

  function handleNextSpotlight() {
    if (stats.featuredPool.length === 0) return
    setSpotlightIndex((prev) => (prev + 1) % stats.featuredPool.length)
  }

  function handleSelectStadium(stadium) {
    setIsRandomPick(false)
    setSelectedStadium(stadium)
  }

  // Sorteia um estádio da lista atual (ou do catálogo todo) evitando repetir o atual
  const handlePickRandom = useCallback(() => {
    const pool = filteredStadiums.length > 0 ? filteredStadiums : stadiums
    if (pool.length === 0) return

    const candidates =
      pool.length > 1 && selectedStadium
        ? pool.filter((item) => item.id !== selectedStadium.id)
        : pool

    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    setIsRandomPick(true)
    setSelectedStadium(chosen)
  }, [filteredStadiums, stadiums, selectedStadium])

  const handleCloseModal = useCallback(() => {
    setSelectedStadium(null)
    setIsRandomPick(false)
  }, [])

  return (
    <div id="top" className="app-shell">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container main-content">
        {/* Hero Matchday Spotlight */}
        <section className="hero-banner" aria-labelledby="hero-title">
          <div className="hero-banner__copy">
            <div className="hero-banner__kicker">
              <span className="hero-banner__bar" aria-hidden="true" />
              <span>Catálogo de Estádios • eFootball</span>
            </div>
            <h1 id="hero-title" className="hero-banner__title">
              Os palcos do futebol mundial em um só lugar
            </h1>
            <p className="hero-banner__subtitle">
              Explore os estádios licenciados e originais do eFootball, filtre por país ou clube,
              monte seus favoritos ou sorteie o palco da sua próxima partida.
            </p>
            <div className="hero-banner__actions">
              <button
                id="random-stadium-btn"
                type="button"
                className="btn-volt"
                onClick={handlePickRandom}
                disabled={loading || stadiums.length === 0}
              >
                🎲 Sortear estádio
              </button>
              <a href="#catalogo" className="btn-primary">
                Explorar catálogo
              </a>
              {stats.featuredPool.length > 1 && (
                <button
                  id="next-spotlight"
                  type="button"
                  className="btn-ghost"
                  onClick={handleNextSpotlight}
                >
                  Trocar destaque
                </button>
              )}
            </div>
          </div>

          <div className="hero-spotlight">
            {spotlight ? (
              <div
                className="spotlight-card spotlight-card--interactive"
                role="button"
                tabIndex={0}
                onClick={() => handleSelectStadium(spotlight)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectStadium(spotlight)
                  }
                }}
                aria-label={`Abrir detalhes de ${spotlight.name}`}
              >
                <img
                  src={spotlight.image}
                  alt={`Destaque: ${spotlight.name}`}
                  className="spotlight-card__img"
                />
                <div className="spotlight-card__overlay" aria-hidden="true" />
                <div className="spotlight-card__top">
                  <span className="spotlight-card__tag">★ Arena em Destaque</span>
                  <span className="spotlight-card__country">
                    {getCountryFlag(spotlight.country)} {spotlight.country}
                  </span>
                </div>
                <div className="spotlight-card__bottom">
                  <p className="spotlight-card__club">{spotlight.club}</p>
                  <h2 className="spotlight-card__name">{spotlight.name}</h2>
                </div>
              </div>
            ) : (
              <div className="spotlight-card spotlight-card--placeholder">
                <p className="spotlight-card__club">FastAPI conectado</p>
                <h2 className="spotlight-card__name">Carregando destaque...</h2>
              </div>
            )}
          </div>
        </section>

        {/* Faixa de métricas esportivas */}
        <section className="stats-strip" aria-label="Resumo do catálogo">
          <div className="stat-item stat-item--primary">
            <span className="stat-item__label">Total no Catálogo</span>
            <strong className="stat-item__value">{loading ? '—' : stats.total}</strong>
          </div>
          <div className="stat-item stat-item--pitch">
            <span className="stat-item__label">Licenciados</span>
            <strong className="stat-item__value">{loading ? '—' : stats.licensedCount}</strong>
          </div>
          <div className="stat-item stat-item--volt">
            <span className="stat-item__label">Originais / Genéricos</span>
            <strong className="stat-item__value">{loading ? '—' : stats.genericCount}</strong>
          </div>
          <div className="stat-item stat-item--cyan">
            <span className="stat-item__label">Países Representados</span>
            <strong className="stat-item__value">{loading ? '—' : stats.countries.length}</strong>
          </div>
        </section>

        {/* Catálogo com Busca, Filtros, Favoritos e Modal */}
        <section id="catalogo" className="catalog-section" aria-live="polite">
          <div className="section-header">
            <div>
              <h2 className="section-header__title">Explorar Estádios</h2>
              <p className="section-header__sub">
                {loading
                  ? 'Consultando a API FastAPI...'
                  : 'Clique em qualquer estádio para abrir a ficha completa ou sorteie uma arena'}
              </p>
            </div>
            {!loading && !error && (
              <div className="section-header__actions">
                <button
                  id="catalog-random-btn"
                  type="button"
                  className="btn-ghost"
                  onClick={handlePickRandom}
                  disabled={stadiums.length === 0}
                >
                  🎲 Sortear da lista
                </button>
                <button
                  id="reload-stadiums"
                  type="button"
                  className="btn-ghost"
                  onClick={reload}
                >
                  Atualizar
                </button>
              </div>
            )}
          </div>

          {!loading && !error && (
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              category={category}
              onCategoryChange={setCategory}
              country={country}
              onCountryChange={setCountry}
              countries={stats.countries}
              counts={{
                all: stats.total,
                licensed: stats.licensedCount,
                generic: stats.genericCount,
                favorites: favoritesCount,
              }}
              resultsCount={filteredStadiums.length}
              totalCount={stats.total}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
            />
          )}

          {loading && (
            <div className="stadium-grid" aria-label="Carregando estádios">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton-card" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="error-panel" role="alert">
              <h3 className="error-panel__title">Não foi possível carregar os estádios</h3>
              <p className="error-panel__message">{error}</p>
              <p className="error-panel__hint">
                Verifique se o backend FastAPI está rodando em <code>{API_BASE_URL}</code> com{' '}
                <code>uvicorn main:app --reload</code>.
              </p>
              <button id="retry-fetch" type="button" className="btn-primary" onClick={reload}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && filteredStadiums.length === 0 && (
            <div className="empty-state">
              <h3 className="empty-state__title">
                {category === 'favorites' && favoritesCount === 0
                  ? 'Nenhum estádio favoritado ainda'
                  : 'Nenhum estádio encontrado'}
              </h3>
              <p className="empty-state__text">
                {category === 'favorites' && favoritesCount === 0
                  ? 'Clique no ícone de coração em qualquer card para montar sua lista de estádios favoritos.'
                  : 'Tente ajustar o termo de busca ou remover alguns filtros ativos.'}
              </p>
              <button
                id="empty-reset-filters"
                type="button"
                className="btn-primary"
                onClick={handleResetFilters}
              >
                Ver todos os estádios
              </button>
            </div>
          )}

          {!loading && !error && filteredStadiums.length > 0 && (
            <div className="stadium-grid">
              {filteredStadiums.map((stadium) => (
                <StadiumCard
                  key={stadium.id}
                  stadium={stadium}
                  isFavorite={isFavorite(stadium.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={handleSelectStadium}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>eFootball Stadiums • Catálogo React + FastAPI</span>
          <span>Temas Dark &amp; Light • Busca, Filtros, Favoritos e Sorteador</span>
        </div>
      </footer>

      {selectedStadium && (
        <StadiumModal
          key={selectedStadium.id}
          stadium={selectedStadium}
          isFavorite={isFavorite(selectedStadium.id)}
          isRandomPick={isRandomPick}
          onToggleFavorite={toggleFavorite}
          onPickAnother={stadiums.length > 1 ? handlePickRandom : null}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App
