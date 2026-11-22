import { getCountryFlag } from '../utils/stadiumHelpers'
import './FilterBar.css'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'licensed', label: 'Licenciados' },
  { value: 'generic', label: 'Genéricos' },
  { value: 'favorites', label: 'Favoritos' },
]

export function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  country,
  onCountryChange,
  countries,
  counts,
  resultsCount,
  totalCount,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="filter-bar" role="region" aria-label="Busca e filtros do catálogo">
      <div className="filter-bar__top">
        {/* Campo de busca por nome, clube ou país */}
        <div className="search-field">
          <svg
            className="search-field__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16.2 16.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <label htmlFor="search-stadiums" className="sr-only">
            Buscar estádio por nome, clube ou país
          </label>
          <input
            id="search-stadiums"
            type="search"
            className="search-field__input"
            placeholder="Buscar por estádio, clube ou país (ex: Camp Nou, Brasil, Milan)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-field__clear"
              onClick={() => onSearchChange('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        {/* Seletor de país */}
        <div className="select-field">
          <label htmlFor="country-filter" className="sr-only">
            Filtrar por país
          </label>
          <select
            id="country-filter"
            className="select-field__control"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="all">🌍 Todos os países</option>
            {countries.map((item) => (
              <option key={item} value={item}>
                {getCountryFlag(item)} {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-bar__bottom">
        {/* Abas / Pílulas de categoria */}
        <div className="filter-pills" role="tablist" aria-label="Filtrar por categoria">
          {CATEGORY_OPTIONS.map((opt) => {
            const isActive = category === opt.value
            const count = counts[opt.value] ?? 0
            return (
              <button
                key={opt.value}
                id={`filter-cat-${opt.value}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`filter-pill ${isActive ? 'is-active' : ''} ${
                  opt.value === 'favorites' ? 'filter-pill--fav' : ''
                }`}
                onClick={() => onCategoryChange(opt.value)}
              >
                {opt.value === 'favorites' && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={isActive || count > 0 ? 'currentColor' : 'none'}
                    aria-hidden="true"
                  >
                    <path
                      d="M12 20.5s-7-4.5-9.2-8.4C1.2 9.2 2.6 5.5 6.3 5.1c2-.2 3.7.8 4.7 2.3 1-1.5 2.7-2.5 4.7-2.3 3.7.4 5.1 4.1 3.5 7-2.2 3.9-9.2 8.4-9.2 8.4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span>{opt.label}</span>
                <span className="filter-pill__count">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="filter-bar__summary">
          <span className="filter-bar__count">
            Mostrando <strong>{resultsCount}</strong> de {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              id="clear-filters"
              type="button"
              className="filter-bar__reset"
              onClick={onResetFilters}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
