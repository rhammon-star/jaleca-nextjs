#!/usr/bin/env python3
"""
Pipeline de fotos de produto — Jaleca
Fluxo: WooCommerce → PhotoRoom (3 variações) → WooCommerce
"""

from __future__ import annotations
import os
import sys
import requests
from pathlib import Path
from collections import defaultdict
from typing import Union

# ─── Configuração ────────────────────────────────────────────────────────────

WC_URL = "https://wp.jaleca.com.br/wp-json/wc/v3"
WC_KEY = os.getenv("WOOCOMMERCE_CONSUMER_KEY", "ck_249fd8f54810651d8ab8f2393f0a3ae32ea29399")
WC_SECRET = os.getenv("WOOCOMMERCE_CONSUMER_SECRET", "cs_b5491d7176b4d1eddad40f63260f1e30cb67e659")
WC_AUTH = (WC_KEY, WC_SECRET)

PHOTOROOM_API_KEY = os.getenv("PHOTOROOM_API_KEY", "sandbox_sk_pr_default_17f746f5a20df494c75389f8d2466ccb6a3f503d")
PHOTOROOM_HEADERS = {"x-api-key": PHOTOROOM_API_KEY}

OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

# ─── WooCommerce ─────────────────────────────────────────────────────────────

def wc_get(endpoint: str, params: dict = {}) -> dict | list:
    r = requests.get(f"{WC_URL}/{endpoint}", auth=WC_AUTH, params=params)
    r.raise_for_status()
    return r.json()


def wc_listar_produtos(pagina=1, por_pagina=10) -> list:
    return wc_get("products", {"page": pagina, "per_page": por_pagina, "type": "variable"})


def wc_listar_variacoes(produto_id: int) -> list:
    return wc_get(f"products/{produto_id}/variations", {"per_page": 100})


def wc_upload_imagem(image_bytes: bytes, filename: str) -> int:  # type: ignore
    """Faz upload de imagem para a Media Library do WP e retorna o ID."""
    url = "https://wp.jaleca.com.br/wp-json/wp/v2/media"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Content-Type": "image/jpeg",
    }
    auth = ("contato@jaleca.com.br", "y6dH RnuE dKbD 46Wa zylK zB7Q")
    r = requests.post(url, headers=headers, data=image_bytes, auth=auth)
    r.raise_for_status()
    return r.json()["id"]


def wc_atualizar_imagens_variacao(produto_id: int, variacao_id: int, image_ids: list[int]):
    """Atualiza as imagens de uma variação no WooCommerce."""
    imagens = [{"id": img_id} for img_id in image_ids]
    r = requests.put(
        f"{WC_URL}/products/{produto_id}/variations/{variacao_id}",
        auth=WC_AUTH,
        json={"image": imagens[0]} if imagens else {},
    )
    r.raise_for_status()
    return r.json()


# ─── PhotoRoom ───────────────────────────────────────────────────────────────

def photoroom_edit(image_bytes: bytes, params: dict) -> bytes:
    """Envia imagem para PhotoRoom Image Editing API."""
    r = requests.post(
        "https://image-api.photoroom.com/v2/edit",
        headers=PHOTOROOM_HEADERS,
        files={"imageFile": ("photo.jpg", image_bytes, "image/jpeg")},
        data=params,
    )
    r.raise_for_status()
    return r.content


def gerar_fundo_branco(image_bytes: bytes) -> bytes:
    """Remove fundo e retorna PNG transparente — Basic API (/v1/segment)."""
    r = requests.post(
        "https://sdk.photoroom.com/v1/segment",
        headers=PHOTOROOM_HEADERS,
        files={"image_file": ("photo.jpg", image_bytes, "image/jpeg")},
    )
    r.raise_for_status()
    return r.content  # PNG sem fundo


# ─── Pipeline por variação ────────────────────────────────────────────────────

def selecionar_uma_variacao_por_cor(variacoes: list) -> list:
    """
    Retorna 1 variação por cor — a primeira encontrada (menor ID = geralmente menor tamanho).
    """
    por_cor = defaultdict(list)
    for v in variacoes:
        cor = None
        for attr in v.get("attributes", []):
            if attr["name"].lower() in ("cor", "color", "colour"):
                cor = attr["option"].strip().lower()
                break
        if cor:
            por_cor[cor].append(v)

    selecionadas = []
    for cor, lista in por_cor.items():
        lista.sort(key=lambda v: v["id"])
        selecionadas.append(lista[0])
    return selecionadas


def baixar_imagem(url: str) -> bytes:
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.content


def processar_variacao(produto_id: int, variacao: dict, dry_run=False):
    variacao_id = variacao["id"]
    cor = next(
        (a["option"] for a in variacao.get("attributes", []) if a["name"].lower() in ("cor", "color")),
        "sem-cor"
    )
    img_src = variacao.get("image", {}).get("src") or ""

    print(f"\n  Variação #{variacao_id} — Cor: {cor}")

    if not img_src:
        print("  ⚠️  Sem imagem na variação — pulando")
        return

    print(f"  Baixando imagem original...")
    original = baixar_imagem(img_src)

    print(f"  Removendo fundo (PhotoRoom segment)...")
    foto_sem_fundo = gerar_fundo_branco(original)

    if dry_run:
        base = OUTPUT_DIR / f"prod{produto_id}_var{variacao_id}_{cor.replace(' ', '_')}"
        out = base.parent / f"{base.name}_sem_fundo.png"
        out.write_bytes(foto_sem_fundo)
        print(f"  💾 Salvo: {out.name}")
        return

    print(f"  Subindo imagem para WP...")
    nome_base = f"jaleca-{produto_id}-{variacao_id}-{cor.replace(' ', '-').lower()}"
    id1 = wc_upload_imagem(foto_sem_fundo, f"{nome_base}-sem-fundo.png")
    wc_atualizar_imagens_variacao(produto_id, variacao_id, [id1])
    print(f"  ✅ Variação atualizada (ID imagem: {id1})")


# ─── Entry points ─────────────────────────────────────────────────────────────

def processar_produto(produto_id: int, dry_run=False):
    print(f"\n{'='*55}")
    print(f"Produto #{produto_id}")
    print(f"{'='*55}")

    variacoes = wc_listar_variacoes(produto_id)
    print(f"Total de variações: {len(variacoes)}")

    selecionadas = selecionar_uma_variacao_por_cor(variacoes)
    print(f"Variações selecionadas (1 por cor): {len(selecionadas)}")

    for v in selecionadas:
        processar_variacao(produto_id, v, dry_run=dry_run)

    print(f"\n✅ Produto #{produto_id} concluído!")


def teste_produto(produto_id: int):
    """Roda em dry-run: baixa e processa mas salva localmente, não sobe."""
    print(f"🧪 MODO TESTE — dry-run (não sobe para WooCommerce)\n")
    processar_produto(produto_id, dry_run=True)


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    """
    Uso:
      python pipeline.py teste 123          # processa produto 123, salva local (sem subir)
      python pipeline.py rodar 123          # processa e sobe para WooCommerce
      python pipeline.py listar             # lista produtos variáveis disponíveis
    """
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "listar":
        produtos = wc_listar_produtos(por_pagina=20)
        for p in produtos:
            print(f"  #{p['id']} — {p['name']}")

    elif cmd == "teste" and len(sys.argv) >= 3:
        teste_produto(int(sys.argv[2]))

    elif cmd == "rodar" and len(sys.argv) >= 3:
        processar_produto(int(sys.argv[2]), dry_run=False)

    else:
        print(__doc__)
