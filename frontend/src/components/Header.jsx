import './Header.css'

export function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="#top" className="brand" aria-label="eFootball Stadiums — Início">
          <span className="brand__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect
                x="2.5"
                y="4.5"
                width="19"
                height="15"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line x1="12" y1="4.5" x2="12" y2="19.5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <span className="brand__text">
            <span className="brand__title">
              eFootball <span className="brand__badge">STADIUMS</span>
            </span>
            <span className="brand__tagline">Catálogo Oficial &amp; Genéricos</span>
          </span>
        </a>

        <div className="site-header__actions">
          <button
            id="theme-toggle"
            type="button"
            className="theme-switch"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            aria-pressed={!isDark}
          >
            <span
              className={`theme-switch__option ${isDark ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.2 14.5A8.2 8.2 0 0 1 9.5 3.8a8.2 8.2 0 1 0 10.7 10.7Z"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Dark</span>
            </span>
            <span
              className={`theme-switch__option ${!isDark ? 'is-active' : ''}`}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2.1" />
                <path
                  d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>
              <span>Light</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
