#!/usr/bin/env python3
"""Teste: fashn-vton-1.5 via HF Space — virtual try-on grátis."""

import requests, time, json, io, shutil, uuid
from pathlib import Path
from PIL import Image

HF_TOKEN  = "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"
SPACE_URL = "https://fashn-ai-fashn-vton-1-5.hf.space"
OUTPUT    = Path("output")
OUTPUT.mkdir(exist_ok=True)

HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

# Foto do jaleco (produto em modelo)
JALECO_URL = "https://wp.jaleca.com.br/wp-content/uploads/2026/04/Foto-15-02-2023-17-07-32-1-scaled.jpg"

# Foto de modelo base em pose diferente (para trocar a roupa)
# Usamos uma foto de modelo profissional em fundo branco
MODEL_POSE_URL = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80"

def run_tryon(person_url, garment_url, nome):
    session_hash = uuid.uuid4().hex[:10]
    print(f"\n  Submetendo para fashn-vton-1.5... (session: {session_hash})")

    # 1. Enviar para a fila
    payload = {
        "data": [
            {"url": person_url,  "meta": {"_type": "gradio.FileData"}},
            {"url": garment_url, "meta": {"_type": "gradio.FileData"}},
            "tops",     # category
            "model",    # garment_photo_type (foto do jaleco em modelo)
            50,         # num_timesteps
            1.5,        # guidance_scale
            42,         # seed
            True,       # segmentation_free
        ]
    }

    r = requests.post(
        f"{SPACE_URL}/gradio_api/queue/join?fn_index=0&session_hash={session_hash}",
        headers={**HEADERS, "Content-Type": "application/json"},
        json=payload,
        timeout=30,
    )
    print(f"  Queue status: {r.status_code} — {r.text[:100]}")
    r.raise_for_status()
    event_id = r.json()["event_id"]
    print(f"  Event ID: {event_id}")

    # 2. Aguardar resultado via stream
    print("  Aguardando processamento...")
    with requests.get(
        f"{SPACE_URL}/gradio_api/queue/data?session_hash={session_hash}",
        headers=HEADERS,
        stream=True,
        timeout=300,
    ) as resp:
        for line in resp.iter_lines():
            if not line:
                continue
            text = line.decode("utf-8")
            if text.startswith("data: "):
                data = json.loads(text[6:])
                msg = data.get("msg", "")
                print(f"    → {msg}")
                if msg == "process_completed":
                    output = data.get("output", {})
                    result_data = output.get("data", [])
                    if result_data:
                        img_info = result_data[0]
                        img_url = img_info.get("url") if isinstance(img_info, dict) else None
                        if img_url:
                            # URL relativa → absoluta
                            if img_url.startswith("/"):
                                img_url = SPACE_URL + img_url
                            print(f"    Imagem URL: {img_url}")
                            img_bytes = requests.get(img_url, headers=HEADERS, timeout=60).content
                            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                            out = OUTPUT / f"{nome}.webp"
                            img.save(out, "WEBP", quality=92)
                            print(f"  ✅ Salvo: {out.name} — {img.size[0]}x{img.size[1]}px ({out.stat().st_size//1024}KB)")
                            return out
                    print(f"    Resultado raw: {str(result_data)[:200]}")
                    return None
                elif msg == "process_errored":
                    raise Exception(f"Erro: {data}")

# Teste com 1 jaleco
print("="*50)
print("Teste fashn-vton-1.5 (HF Space — GRÁTIS)")
print("="*50)
run_tryon(MODEL_POSE_URL, JALECO_URL, "hf_vton_resultado")
print("\n✅ Concluído!")
