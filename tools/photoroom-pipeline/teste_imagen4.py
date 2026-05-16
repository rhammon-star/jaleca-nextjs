#!/usr/bin/env python3
"""Gera foto 4K com Imagen 4 a partir da foto original do jaleco."""

import requests
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY"
client = genai.Client(api_key=GEMINI_API_KEY)

# Usa a foto original do WooCommerce (melhor qualidade que o output com marca d'água)
foto_url = "https://wp.jaleca.com.br/wp-content/uploads/2026/04/IMG_0455-scaled.jpg"
r = requests.get(foto_url, timeout=30)
image_bytes = r.content
print(f"Foto original: {len(image_bytes)//1024}KB")

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        "Mantenha exatamente o mesmo jaleco feminino cor areia/bege (modelo slim pala). "
        "Mude apenas a pose: coloque a modelo de lado (vista lateral 90 graus), mostrando o perfil completo do jaleco. "
        "Fundo branco limpo. Imagem profissional de e-commerce, altíssima qualidade, 4K."
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        out = Path("output/imagen_pose_lateral_4k.png")
        out.write_bytes(part.inline_data.data)
        size = len(part.inline_data.data) // 1024
        print(f"✅ Salvo: {out} ({size}KB)")
        break
else:
    print("Sem imagem. Texto:", response.text[:200] if response.text else "vazio")
