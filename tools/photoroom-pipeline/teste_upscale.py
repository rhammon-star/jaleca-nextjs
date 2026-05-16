#!/usr/bin/env python3
"""Upscale 4K via fal.ai Clarity Upscaler."""

import fal_client
import requests
from pathlib import Path

FAL_KEY = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"

import os
os.environ["FAL_KEY"] = FAL_KEY

foto = Path("output/imagen_pose_lateral_4k.png")
print(f"Enviando para upscale: {foto.name} ({foto.stat().st_size//1024}KB)...")

# Upload da imagem para fal.ai
url = fal_client.upload_file(str(foto))
print(f"URL temporária: {url}")

# Upscale 4K
result = fal_client.run(
    "fal-ai/clarity-upscaler",
    arguments={
        "image_url": url,
        "scale_factor": 4,
        "prompt": "professional e-commerce photo, medical coat, clean white background, sharp details",
        "creativity": 0.1,
        "resemblance": 0.9,
    }
)

img_url = result["image"]["url"]
print(f"Upscale concluído! Baixando...")

r = requests.get(img_url, timeout=60)
out = Path("output/upscale_4k_final.png")
out.write_bytes(r.content)

from PIL import Image
img = Image.open(out)
print(f"✅ Salvo: {out}")
print(f"   Resolução final: {img.size[0]}x{img.size[1]}px ({out.stat().st_size//1024}KB)")
