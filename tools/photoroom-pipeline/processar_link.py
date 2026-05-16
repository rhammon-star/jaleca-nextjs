#!/usr/bin/env python3
"""Processa 1 foto: gera 4 poses (Gemini) + upscale 4K (fal.ai) em cada."""

import os, requests
from pathlib import Path
from google import genai
from google.genai import types
import fal_client

os.environ["FAL_KEY"] = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"
GEMINI_KEY = "AIzaSyDgJ_W7XH4nuwND1LT3Q_WbyVPz6SuW0iY"
client = genai.Client(api_key=GEMINI_KEY)
OUTPUT = Path("output")
OUTPUT.mkdir(exist_ok=True)

FOTO_URL = "https://wp.jaleca.com.br/wp-content/uploads/2026/04/Foto-15-02-2023-17-07-32-1-scaled.jpg"
NOME = "princesa_vinho"

INSTRUCAO_BASE = (
    "Mantenha exatamente o mesmo jaleco feminino cor vinho/bordô (modelo slim princesa). "
    "IMPORTANTE: o jaleco NÃO tem nenhuma placa, logo, etiqueta ou zíper nas costas — as costas são completamente lisas e limpas. "
    "Não adicione nenhum detalhe que não existe na foto original. "
    "O rosto da modelo deve ser natural, humano e realista, sem aparência artificial ou de boneca. "
    "Fundo branco limpo. Imagem profissional de e-commerce, alta qualidade."
)

POSES = [
    ("lateral", "Coloque a modelo de lado (vista lateral 90 graus), mostrando o perfil completo do jaleco."),
    ("traseira", "Coloque a modelo de costas, mostrando a parte traseira completamente lisa do jaleco, sem nenhuma placa ou logo."),
    ("detalhe", "Zoom no jaleco do busto até a cintura, modelo levemente inclinada, mostrando detalhes da frente."),
    ("movimento", "Modelo caminhando levemente, jaleco em movimento natural, pose dinâmica e elegante."),
]

# 1. Baixar foto original uma vez
print("Baixando foto original...")
img_original = requests.get(FOTO_URL, timeout=30).content
print(f"   {len(img_original)//1024}KB\n")

def gerar_pose(img_bytes: bytes, instrucao: str, nome_pose: str) -> Path:
    print(f"  Gemini → pose '{nome_pose}'...")
    resp = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"),
            f"{INSTRUCAO_BASE} {instrucao}"
        ],
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )
    for part in resp.candidates[0].content.parts:
        if part.inline_data:
            path = OUTPUT / f"{NOME}_{nome_pose}_pose.png"
            path.write_bytes(part.inline_data.data)
            print(f"  Salvo: {path.name}")
            return path
    raise Exception(f"Gemini não retornou imagem para pose {nome_pose}")


def upscale_4k(pose_path: Path, nome_pose: str) -> Path:
    print(f"  fal.ai → upscale 4K '{nome_pose}'...")
    url_tmp = fal_client.upload_file(str(pose_path))
    result = fal_client.run(
        "fal-ai/clarity-upscaler",
        arguments={
            "image_url": url_tmp,
            "scale_factor": 4,
            "prompt": "professional e-commerce photo, medical coat vinho color, clean white background, sharp details",
            "creativity": 0.1,
            "resemblance": 0.9,
        }
    )
    final_bytes = requests.get(result["image"]["url"], timeout=60).content
    from PIL import Image
    import io
    png_img = Image.open(io.BytesIO(final_bytes)).convert("RGB")
    final_path = OUTPUT / f"{NOME}_{nome_pose}_4k.webp"
    png_img.save(final_path, "WEBP", quality=92, method=6)
    dims = png_img.size
    print(f"  ✅ {final_path.name} — {dims[0]}x{dims[1]}px ({final_path.stat().st_size//1024}KB)")
    return final_path


resultados = []
for i, (nome_pose, instrucao) in enumerate(POSES, 1):
    print(f"\n[{i}/4] Pose: {nome_pose}")
    try:
        pose_path = gerar_pose(img_original, instrucao, nome_pose)
        final_path = upscale_4k(pose_path, nome_pose)
        resultados.append(final_path)
    except Exception as e:
        print(f"  ❌ Erro: {e}")

print(f"\n{'='*50}")
print(f"✅ {len(resultados)}/4 fotos geradas:")
for r in resultados:
    print(f"   {r.name}")
