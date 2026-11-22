import { useEffect, useState } from 'react'
import {
  formatStadiumCode,
  getArenaPalette,
  getCountryFlag,
} from '../utils/stadiumHelpers'
import './StadiumModal.css'

export function StadiumModal({
  stadium,
  isFavorite,
  isRandomPick = false,
  onToggleFavorite,
  onPickAnother,
  onClose,
}) {
  const [imageFailed, setImageFailed] = useState(false)

  // Fecha com tecla Escape e trava o scroll do fundo enquanto o modal estiver aberto
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!stadium) return null

  const isLicensed = stadium.category === 'licensed'
  const hasPhoto = Boolean(stadium.image) && !imageFailed
  const palette = getArenaPalette(stadium.id)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-stadium-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-media">
          {hasPhoto ? (
            <img
              src={stadium.image}
              alt={`Foto do estádio ${stadium.name}`}
              className="modal-media__img"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div
              className="modal-media__artwork"
              style={{
                '--arena-start': palette.start,
                '--arena-end': palette.end,
                '--arena-beam': palette.beam,
                '--arena-line': palette.line,
              }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 480 260" className="modal-media__svg" fill="none">
                <path d="M64 0L200 205H24L64 0Z" fill="var(--arena-beam)" fillOpacity="0.2" />
                <path d="M416 0L456 205H280L416 0Z" fill="var(--arena-line)" fillOpacity="0.16" />
                <path
                  d="M36 138C96 68 384 68 444 138"
                  stroke="rgba(255,255,255,0.34)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M84 168H396L442 242H38L84 168Z"
                  fill="var(--arena-line)"
                  fillOpacity="0.2"
                  stroke="var(--arena-line)"
                  strokeOpacity="0.6"
                  strokeWidth="1.8"
                />
                <line
                  x1="240"
                  y1="168"
                  x2="240"
                  y2="242"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.6"
                />
                <ellipse
                  cx="240"
                  cy="205"
                  rx="36"
                  ry="15"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth="1.6"
                />
                <circle cx="240" cy="205" r="3" fill="var(--arena-line)" />
              </svg>
            </div>
          )}

          <div className="modal-media__scrim" aria-hidden="true" />

          <div className="modal-media__top">
            <div className="modal-media__badges">
              {isRandomPick && (
                <span className="modal-pill modal-pill--volt">🎲 Estádio Sorteado</span>
              )}
              <span
                className={`modal-pill ${
                  isLicensed ? 'modal-pill--licensed' : 'modal-pill--generic'
                }`}
              >
                {isLicensed ? '★ Licenciado' : 'Genérico'}
              </span>
              <span className="modal-pill modal-pill--code">
                {formatStadiumCode(stadium.id)}
              </span>
            </div>

            <button
              id="close-stadium-modal"
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Fechar detalhes do estádio"
            >
              ×
            </button>
          </div>

          <div className="modal-media__headline">
            <p className="modal-media__club">
              {stadium.club || 'Arena Original eFootball'}
            </p>
            <h2 id="modal-stadium-title" className="modal-media__title">
              {stadium.name}
            </h2>
          </div>
        </div>

        <div className="modal-body">
          <dl className="modal-specs">
            <div className="modal-spec">
              <dt>País</dt>
              <dd>
                {stadium.country
                  ? `${getCountryFlag(stadium.country)} ${stadium.country}`
                  : '🏟️ Internacional / Original'}
              </dd>
            </div>
            <div className="modal-spec">
              <dt>Clube Mandante</dt>
              <dd>{stadium.club || 'Sem clube fixo (estádio neutro)'}</dd>
            </div>
            <div className="modal-spec">
              <dt>Categoria</dt>
              <dd>{isLicensed ? 'Estádio Oficial Licenciado' : 'Estádio Genérico do Jogo'}</dd>
            </div>
            <div className="modal-spec">
              <dt>Identificador na API</dt>
              <dd>
                <code>/stadiums/{stadium.id}</code>
              </dd>
            </div>
          </dl>

          <div className="modal-actions">
            <button
              id="modal-toggle-favorite"
              type="button"
              className={`modal-btn ${isFavorite ? 'modal-btn--danger' : 'modal-btn--primary'}`}
              onClick={() => onToggleFavorite(stadium.id)}
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
              <span>{isFavorite ? 'Nos seus Favoritos' : 'Adicionar aos Favoritos'}</span>
            </button>

            {onPickAnother && (
              <button
                id="modal-roll-another"
                type="button"
                className="modal-btn modal-btn--volt"
                onClick={onPickAnother}
              >
                🎲 Sortear outro
              </button>
            )}

            {stadium.image && (
              <a
                href={stadium.image}
                target="_blank"
                rel="noreferrer"
                className="modal-btn modal-btn--ghost"
              >
                Abrir imagem ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
