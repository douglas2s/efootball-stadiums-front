import { useState } from 'react'
import {
  formatStadiumCode,
  getArenaPalette,
  getCountryFlag,
} from '../utils/stadiumHelpers'
import './StadiumCard.css'

export function StadiumCard({
  stadium,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) {
  const [imageFailed, setImageFailed] = useState(false)

  const isLicensed = stadium.category === 'licensed'
  const hasPhoto = Boolean(stadium.image) && !imageFailed
  const palette = getArenaPalette(stadium.id)

  function handleFavoriteClick(event) {
    event.stopPropagation()
    onToggleFavorite?.(stadium.id)
  }

  function handleCardKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.(stadium)
    }
  }

  return (
    <article
      className="stadium-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(stadium)}
      onKeyDown={handleCardKeyDown}
      aria-label={`Ver detalhes do estádio ${stadium.name}`}
    >
      <div className="stadium-card__media">
        {hasPhoto ? (
          <img
            src={stadium.image}
            alt={`Estádio ${stadium.name}`}
            className="stadium-card__img"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="stadium-card__artwork"
            style={{
              '--arena-start': palette.start,
              '--arena-end': palette.end,
              '--arena-beam': palette.beam,
              '--arena-line': palette.line,
            }}
            aria-hidden="true"
          >
            <svg
              className="stadium-card__pitch-svg"
              viewBox="0 0 360 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M52 0L148 165H20L52 0Z" fill="var(--arena-beam)" fillOpacity="0.16" />
              <path d="M308 0L340 165H212L308 0Z" fill="var(--arena-line)" fillOpacity="0.14" />
              <path
                d="M28 118C74 62 286 62 332 118"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M54 128C96 84 264 84 306 128"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M62 142H298L330 202H30L62 142Z"
                fill="var(--arena-line)"
                fillOpacity="0.18"
                stroke="var(--arena-line)"
                strokeOpacity="0.55"
                strokeWidth="1.6"
              />
              <line
                x1="180"
                y1="142"
                x2="180"
                y2="202"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.5"
              />
              <ellipse
                cx="180"
                cy="172"
                rx="28"
                ry="12"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
              />
              <circle cx="180" cy="172" r="2.5" fill="var(--arena-line)" />
            </svg>
            <span className="stadium-card__artwork-label">
              {isLicensed ? 'Arena Oficial' : 'Arena Original eFootball'}
            </span>
          </div>
        )}

        <div className="stadium-card__scrim" aria-hidden="true" />

        <div className="stadium-card__top-bar">
          <span
            className={`stadium-badge ${
              isLicensed ? 'stadium-badge--licensed' : 'stadium-badge--generic'
            }`}
          >
            {isLicensed ? '★ Licenciado' : 'Genérico'}
          </span>

          <div className="stadium-card__top-right">
            <span className="stadium-code">{formatStadiumCode(stadium.id)}</span>
            <button
              type="button"
              className={`fav-button ${isFavorite ? 'is-favorited' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite
                  ? `Remover ${stadium.name} dos favoritos`
                  : `Adicionar ${stadium.name} aos favoritos`
              }
              aria-pressed={isFavorite}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                aria-hidden="true"
              >
                <path
                  d="M12 20.5s-7-4.5-9.2-8.4C1.2 9.2 2.6 5.5 6.3 5.1c2-.2 3.7.8 4.7 2.3 1-1.5 2.7-2.5 4.7-2.3 3.7.4 5.1 4.1 3.5 7-2.2 3.9-9.2 8.4-9.2 8.4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {stadium.country && (
          <div className="stadium-card__country">
            <span aria-hidden="true">{getCountryFlag(stadium.country)}</span>
            <span>{stadium.country}</span>
          </div>
        )}
      </div>

      <div className="stadium-card__body">
        <h3 className="stadium-card__name">{stadium.name}</h3>

        <div className="stadium-card__meta">
          <span className="stadium-card__club">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3L4.5 6.2V11.8C4.5 16.5 7.7 20.5 12 21.8C16.3 20.5 19.5 16.5 19.5 11.8V6.2L12 3Z"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinejoin="round"
              />
            </svg>
            <span>{stadium.club || 'Estádio neutro / sem clube fixo'}</span>
          </span>
          <span className="stadium-card__cta" aria-hidden="true">
            Detalhes →
          </span>
        </div>
      </div>

      <div className="stadium-card__accent-bar" aria-hidden="true" />
    </article>
  )
}
