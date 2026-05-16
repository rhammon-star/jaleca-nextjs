#!/usr/bin/env python3
"""Teste: gpt-image-1 edit com foto de referência + upscale 4K."""

import os, requests, base64, fal_client
from pathlib import Path
from openai import OpenAI
from PIL import Image
import io

os.environ["FAL_KEY"] = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"
client = OpenAI(api_key="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")
OUTPUT = Path("output")

FOTO_URL = "https://wp.jaleca.com.br/wp-content/uploads/2026/04/Foto-15-02-2023-17-07-32-1-scaled.jpg"
print("Baixando foto original...")
img_bytes = requests.get(FOTO_URL, timeout=30).content

print("Gerando pose traseira com gpt-image-1 (edit com referência)...")
response = client.images.edit(
    model="gpt-image-1",
    image=("original.jpg", img_bytes, "image/jpeg"),
    prompt=(
        "This is the same female model and the same wine/burgundy slim princess medical coat. "
        "Show her from behind — back view of the coat. "
        "The back of the coat is completely smooth: NO zipper, NO logo, NO patch, NO stains. "
        "Keep the same female model with natural realistic appearance. "
        "Clean white background. Professional e-commerce fashion photo."
    ),
    size="1024x1536",
    quality="high",
)

img_data = base64.b64decode(response.data[0].b64_json)
pose_path = OUTPUT / "gpt4o_traseira_pose.png"
pose_path.write_bytes(img_data)
print(f"Pose gerada: {pose_path.name} ({len(img_data)//1024}KB)")

print("Upscale 4K com fal.ai...")
url_tmp = fal_client.upload_file(str(pose_path))
result = fal_client.run(
    "fal-ai/clarity-upscaler",
    arguments={"image_url": url_tmp, "scale_factor": 4, "creativity": 0.1, "resemblance": 0.9}
)
final_bytes = requests.get(result["image"]["url"], timeout=60).content
final_img = Image.open(io.BytesIO(final_bytes)).convert("RGB")
final_path = OUTPUT / "gpt4o_traseira_4k.webp"
final_img.save(final_path, "WEBP", quality=92, method=6)
print(f"✅ {final_path.name} — {final_img.size[0]}x{final_img.size[1]}px ({final_path.stat().st_size//1024}KB)")
