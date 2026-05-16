#!/usr/bin/env python3
"""Teste: Fashn.ai product-to-model — 4 poses em 4K."""

import requests, time, io
from pathlib import Path
from PIL import Image

FASHN_KEY = "fa-9ADJsBcpDZGh-llQCcdjYo3fBpefUcLXLIgLy"
HEADERS = {"Authorization": f"Bearer {FASHN_KEY}", "Content-Type": "application/json"}
OUTPUT = Path("output")
OUTPUT.mkdir(exist_ok=True)

FOTO_URL = "https://wp.jaleca.com.br/wp-content/uploads/2026/04/Foto-15-02-2023-17-07-32-1-scaled.jpg"

POSES = [
    ("lateral",   "model standing sideways showing left profile, clean white background, professional e-commerce"),
    ("traseira",  "model from behind showing back of coat, completely smooth back with no zipper no logo no patches, clean white background"),
    ("detalhe",   "close-up from waist up showing coat details and collar, clean white background, sharp fabric detail"),
    ("movimento", "model walking dynamically, coat in natural movement, elegant pose, clean white background"),
]

def run_fashn(prompt: str) -> str:
    r = requests.post("https://api.fashn.ai/v1/run", headers=HEADERS, json={
        "model_name": "product-to-model",
        "inputs": {
            "product_image": FOTO_URL,
            "prompt": prompt,
            "resolution": "4k",
            "generation_mode": "quality",
        }
    })
    r.raise_for_status()
    return r.json()["id"]

def aguardar(prediction_id: str) -> str:
    while True:
        r = requests.get(f"https://api.fashn.ai/v1/status/{prediction_id}", headers=HEADERS)
        data = r.json()
        if data["status"] == "completed":
            return data["output"][0]
        elif data["status"] == "failed":
            raise Exception(f"Fashn falhou: {data.get('error')}")
        time.sleep(3)

def salvar_webp(url: str, path: Path):
    img_bytes = requests.get(url, timeout=60).content
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img.save(path, "WEBP", quality=92, method=6)
    print(f"  ✅ {path.name} — {img.size[0]}x{img.size[1]}px ({path.stat().st_size//1024}KB)")

for i, (nome, prompt) in enumerate(POSES, 1):
    print(f"\n[{i}/4] Pose: {nome}")
    try:
        pid = run_fashn(prompt)
        print(f"  Aguardando Fashn.ai (ID: {pid})...")
        img_url = aguardar(pid)
        salvar_webp(img_url, OUTPUT / f"fashn_{nome}_4k.webp")
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print("\n✅ Concluído!")
