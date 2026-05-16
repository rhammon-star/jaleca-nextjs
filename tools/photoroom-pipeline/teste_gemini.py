#!/usr/bin/env python3
"""Teste: Gemini edita pose da modelo na foto do jaleco."""

import os
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY"
client = genai.Client(api_key=GEMINI_API_KEY)

foto = Path("/Users/rhammon/SiteJaleca/jaleca-nextjs/tools/photoroom-pipeline/output/prod61908_var62109_Areia_sem_fundo.png")
image_bytes = foto.read_bytes()

response = client.models.generate_content(
    model="gemini-3.1-flash-image-preview",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        "Mantenha exatamente o mesmo jaleco (cor areia, modelo slim pala feminino). "
        "Mude apenas a pose: coloque a modelo de lado (vista lateral 90 graus), "
        "mostrando o perfil. Fundo branco limpo. Qualidade profissional de e-commerce."
    ],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        out = Path("output/gemini_pose_lateral.png")
        out.write_bytes(part.inline_data.data)
        print(f"✅ Salvo: {out}")
        break
else:
    print("Resposta texto:", response.text)
