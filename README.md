# eFootball Stadiums

Catálogo interativo de estádios licenciados e genéricos do **eFootball**, desenvolvido com **FastAPI** no backend e **React 19 + Vite** (CSS puro com Design System Dark & Light) no frontend.

## Funcionalidades

- **Temas Dark e Light** com persistência no `localStorage`, detecção da preferência do sistema e script anti-piscada (FOUC).
- **Hero Matchday Spotlight** com destaque rotativo de arenas licenciadas.
- **Busca tolerante a acentos** por nome do estádio, clube mandante ou país.
- **Filtros combinados** por categoria (`Todos`, `Licenciados`, `Genéricos`, `Favoritos`) e seletor dinâmico de país.
- **Sistema de Favoritos** salvo no navegador via `localStorage`.
- **Modal de Detalhes acessível** (fecha com `Esc` ou clique fora) exibindo ficha completa do estádio.
- **Sorteador de Estádio ("🎲 Sortear estádio")** respeitando os filtros ativos para escolher o palco da próxima partida.

## Estrutura do Projeto

```text
efootball-stadiums-main/
├── backend/
│   ├── data/stadiums.json       # Base de 27 estádios (18 licenciados + 9 genéricos)
│   ├── main.py                  # API FastAPI com CORS configurado
│   └── requirements.txt         # Dependências Python
└── frontend/
    ├── .env.example             # Configuração da URL da API (VITE_API_URL)
    ├── index.html               # Fontes Google + script de boot do tema
    └── src/
        ├── components/          # Header, FilterBar, StadiumCard, StadiumModal
        ├── hooks/               # useTheme, useStadiums, useFavorites
        ├── services/            # api.js (camada HTTP com AbortSignal)
        └── utils/               # stadiumHelpers.js (bandeiras, busca sem acentos)
```

## Como Rodar Localmente

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# Linux/macOS:
source .venv/bin/activate
# Windows (PowerShell):
# .\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn main:app --reload
```

A API ficará disponível em `http://localhost:8000` (documentação interativa em `http://localhost:8000/docs`).

**Endpoints disponíveis:**
- `GET /` — status da API
- `GET /stadiums` — lista todos os estádios
- `GET /stadiums/{stadium_id}` — detalhes de um estádio pelo ID
- `GET /stadiums/category/{category}` — filtra por `licensed` ou `generic`

### 2. Frontend (React + Vite)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador.