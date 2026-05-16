#!/usr/bin/env python3
"""Re-roda apenas as cores que falharam por falta de crédito."""

import sys, time, requests, io, random
sys.path.insert(0, ".")
from pipeline_completo import (
    wc_variacoes, wp_upload, fashn_gerar, wc_atualizar_variacao,
    wc_atualizar_produto, POOL_POSES, OUTPUT
)
from PIL import Image, ImageEnhance
from pipeline_completo import enquadrar_modelo
import numpy as np

WC_URL  = "https://wp.jaleca.com.br/wp-json/wc/v3"
WC_AUTH = ("ck_249fd8f54810651d8ab8f2393f0a3ae32ea29399", "cs_b5491d7176b4d1eddad40f63260f1e30cb67e659")

# Cores pendentes: (produto_id, variacao_id, nome_cor)
PENDENTES = [
    (59324, 61665, "Marinho"),
    (59324, 61660, "Verde Musgo"),
    (59324, 61655, "Verde Claro"),
    (62062, 62144, "Rosê"),
    (62062, 62103, "Marinho"),
    (61772, 61870, "Chumbo Giz"),
    (61772, 61865, "Vinho Giz"),
    (61772, 61860, "Rosê"),
    (61772, 61855, "Preto Giz"),
    (61772, 61850, "Preto"),
    (61772, 61845, "Marinho Giz"),
    (61772, 61840, "Marinho"),
    (61772, 61835, "Areia"),
]

erros = []

for i, (produto_id, variacao_id, cor) in enumerate(PENDENTES, 1):
    print(f"\n[{i}/{len(PENDENTES)}] #{produto_id} — {cor} (var #{variacao_id})")

    # Buscar foto da variação
    r = requests.get(f"{WC_URL}/products/{produto_id}/variations/{variacao_id}", auth=WC_AUTH)
    variacao = r.json()
    img_src = variacao.get("image", {}).get("src", "")

    if not img_src:
        print("  ⚠️  Sem imagem — pulando")
        continue

    try:
        # Baixar, enquadrar e melhorar foto principal
        original = requests.get(img_src, timeout=30).content
        img = Image.open(io.BytesIO(original)).convert("RGB")
        img = enquadrar_modelo(img)
        img = ImageEnhance.Sharpness(img).enhance(1.3)
        img = ImageEnhance.Contrast(img).enhance(1.1)
        img = ImageEnhance.Color(img).enhance(1.1)
        buf = io.BytesIO()
        img.save(buf, "WEBP", quality=92, method=6)
        principal_bytes = buf.getvalue()

        nome_base = f"jaleca-{produto_id}-{variacao_id}-{cor.replace(' ','-').lower()}"
        id_principal = wp_upload(principal_bytes, f"{nome_base}-principal.webp")
        print(f"  Principal: #{id_principal}")

        # Gerar 3 poses
        poses = random.sample(POOL_POSES, 3)
        gallery_ids = []
        for j, pose in enumerate(poses, 1):
            print(f"  Pose {j}/3...")
            time.sleep(15)
            try:
                pose_bytes = fashn_gerar(img_src, pose, f"{produto_id}_{variacao_id}_pose{j}")
                pid_wp = wp_upload(pose_bytes, f"{nome_base}-pose{j}.webp")
                gallery_ids.append(pid_wp)
            except Exception as e:
                print(f"  ❌ Pose {j} falhou: {e}")

        wc_atualizar_variacao(produto_id, variacao_id, id_principal, gallery_ids)
        print(f"  ✅ {cor} concluída! Galeria: {gallery_ids}")

    except Exception as e:
        print(f"  ❌ ERRO: {e}")
        erros.append((produto_id, variacao_id, cor, str(e)))

    if i < len(PENDENTES):
        time.sleep(30)

print(f"\n{'='*50}")
print(f"CONCLUÍDO — Erros: {len(erros)}/{len(PENDENTES)}")
for e in erros:
    print(f"  #{e[0]} {e[2]}: {e[3]}")
