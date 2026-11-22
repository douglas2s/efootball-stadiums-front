
import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="EFOOTBALL STADIUMS API",
    description="API para catalogar os estádios do eFootball",
    version="1.0.0"
)

# Permitir comunicação com o React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Localização do arquivo JSON
DATA_FILE = Path(__file__).parent / "data" / "stadiums.json"


def load_stadiums():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/")
def home():
    return {
        "message": "EFOOTBALL-STADIUMS API funcionando!",
        "status": "online"
    }


@app.get("/stadiums")
def get_stadiums():
    return load_stadiums()


@app.get("/stadiums/{stadium_id}")
def get_stadium(stadium_id: int):
    stadiums = load_stadiums()

    for stadium in stadiums:
        if stadium["id"] == stadium_id:
            return stadium

    raise HTTPException(
        status_code=404,
        detail="Estádio não encontrado"
    )


@app.get("/stadiums/category/{category}")
def get_stadiums_by_category(category: str):
    stadiums = load_stadiums()

    filtered = [
        stadium for stadium in stadiums
        if stadium["category"].lower() == category.lower()
    ]

    return filtered
