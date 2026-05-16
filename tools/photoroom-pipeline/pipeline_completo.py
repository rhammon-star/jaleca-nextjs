#!/usr/bin/env python3
"""
Pipeline completo — Jaleca
WooCommerce → fal.ai upscale → Fashn.ai poses → WooCommerce
"""

from __future__ import annotations
import os, sys, io, time, random, requests, fal_client, cv2, numpy as np
from pathlib import Path
from collections import defaultdict
from PIL import Image

# ─── Credenciais ─────────────────────────────────────────────────────────────

os.environ["FAL_KEY"] = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"

WC_URL    = "https://wp.jaleca.com.br/wp-json/wc/v3"
WC_AUTH   = ("ck_249fd8f54810651d8ab8f2393f0a3ae32ea29399", "cs_b5491d7176b4d1eddad40f63260f1e30cb67e659")
WP_AUTH   = ("contato@jaleca.com.br", "y6dH RnuE dKbD 46Wa zylK zB7Q")
FASHN_KEY = "fa-9ADJsBcpDZGh-llQCcdjYo3fBpefUcLXLIgLy"
FASHN_HDR = {"Authorization": f"Bearer {FASHN_KEY}", "Content-Type": "application/json"}

OUTPUT = Path("output")
OUTPUT.mkdir(exist_ok=True)

# ─── Pool de poses variadas ───────────────────────────────────────────────────

POOL_POSES = [
    "model walking naturally, coat flowing, dynamic elegant pose, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model sitting on a stool, legs crossed, hands on lap, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model with one hand on hip, slight smile, confident pose, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model with head slightly tilted, arms relaxed at sides, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model in three-quarter view showing left side profile, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model in three-quarter view showing right side profile, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model with arms crossed, confident professional pose, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model leaning slightly forward, hands clasped in front, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model with both hands in coat pockets, relaxed stance, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "close-up from waist up showing coat collar and chest details, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
    "model mid-stride walking towards camera, natural movement, clean white background, preserve brand logo exactly as original, keep coat silhouette exactly as original with no added slits or openings",
]

# ─── WooCommerce ─────────────────────────────────────────────────────────────

def wc_get(endpoint, params={}):
    r = requests.get(f"{WC_URL}/{endpoint}", auth=WC_AUTH, params=params)
    r.raise_for_status()
    return r.json()

def wc_variacoes(produto_id):
    return wc_get(f"products/{produto_id}/variations", {"per_page": 100})

def uma_por_cor(variacoes):
    por_cor = defaultdict(list)
    for v in variacoes:
        for a in v.get("attributes", []):
            if a["name"].lower() in ("cor", "color", "colour"):
                por_cor[a["option"].strip()].append(v)
    return [sorted(lista, key=lambda x: x["id"])[0] for lista in por_cor.values()]

def wp_upload(img_bytes, filename, mime="image/webp"):
    for tentativa in range(3):
        try:
            r = requests.post(
                "https://wp.jaleca.com.br/wp-json/wp/v2/media",
                headers={"Content-Disposition": f'attachment; filename="{filename}"', "Content-Type": mime},
                data=img_bytes, auth=WP_AUTH, timeout=60,
            )
            r.raise_for_status()
            return r.json()["id"]
        except Exception as e:
            if tentativa < 2:
                print(f"    ⚠️  Upload falhou, tentando novamente em 5s... ({e})")
                time.sleep(5)
            else:
                raise

def wc_atualizar_variacao(produto_id, variacao_id, image_id, gallery_ids, todos_vids=None):
    # Atualiza imagem principal via WC REST
    r = requests.put(
        f"{WC_URL}/products/{produto_id}/variations/{variacao_id}",
        auth=WC_AUTH,
        json={"image": {"id": image_id}},
    )
    r.raise_for_status()

    # Salva galeria via WC REST no PRODUTO PAI com meta key woodmart_variation_gallery_data
    if gallery_ids:
        # Ler meta atual para não sobrescrever outras variações
        r2 = requests.get(f"{WC_URL}/products/{produto_id}", auth=WC_AUTH)
        r2.raise_for_status()
        # Acumular galerias de todas as cores do produto nesta execução
        # Nunca misturar com dados antigos do banco — sobrescrever limpo
        if not hasattr(wc_atualizar_variacao, "_gallery_cache"):
            wc_atualizar_variacao._gallery_cache = {}
        cache = wc_atualizar_variacao._gallery_cache
        if produto_id not in cache:
            cache[produto_id] = {}
        cache[produto_id][str(variacao_id)] = ",".join(str(i) for i in gallery_ids)

        r3 = requests.put(
            f"{WC_URL}/products/{produto_id}",
            auth=WC_AUTH,
            json={"meta_data": [{"key": "woodmart_variation_gallery_data", "value": cache[produto_id]}]},
        )
        r3.raise_for_status()
        print(f"    Galeria WoodMart salva no pai #{produto_id}: {cache[produto_id]}")

def wc_atualizar_produto(produto_id):
    r = requests.put(f"{WC_URL}/products/{produto_id}", auth=WC_AUTH, json={"status": "publish"})
    r.raise_for_status()

# ─── fal.ai upscale ───────────────────────────────────────────────────────────

def upscale(img_bytes, nome):
    tmp = OUTPUT / f"_tmp_{nome}.jpg"
    tmp.write_bytes(img_bytes)
    url_tmp = fal_client.upload_file(str(tmp))
    result = fal_client.run(
        "fal-ai/clarity-upscaler",
        arguments={"image_url": url_tmp, "scale_factor": 2, "creativity": 0.05, "resemblance": 0.95}
    )
    final_bytes = requests.get(result["image"]["url"], timeout=60).content
    img = Image.open(io.BytesIO(final_bytes)).convert("RGB")
    out = OUTPUT / f"{nome}_upscale.webp"
    img.save(out, "WEBP", quality=92, method=6)
    tmp.unlink(missing_ok=True)
    print(f"    Upscale: {img.size[0]}x{img.size[1]}px ({out.stat().st_size//1024}KB)")
    return out.read_bytes()

# ─── Fashn.ai ─────────────────────────────────────────────────────────────────

def fashn_gerar(foto_url, prompt, nome):
    r = requests.post("https://api.fashn.ai/v1/run", headers=FASHN_HDR, json={
        "model_name": "product-to-model",
        "inputs": {
            "product_image": foto_url,
            "prompt": prompt,
            "resolution": "2k",
            "generation_mode": "balanced",
        }
    })
    r.raise_for_status()
    pid = r.json()["id"]

    while True:
        data = requests.get(f"https://api.fashn.ai/v1/status/{pid}", headers=FASHN_HDR).json()
        if data["status"] == "completed":
            img_bytes = requests.get(data["output"][0], timeout=60).content
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            out = OUTPUT / f"{nome}.webp"
            img.save(out, "WEBP", quality=92, method=6)
            print(f"    Fashn: {img.size[0]}x{img.size[1]}px ({out.stat().st_size//1024}KB)")
            return out.read_bytes()
        elif data["status"] == "failed":
            raise Exception(f"Fashn falhou: {data.get('error')}")
        time.sleep(3)

# ─── Enquadramento inteligente ───────────────────────────────────────────────

def enquadrar_modelo(img):
    """Remove excesso de fundo branco ao redor da modelo sem cortar nenhuma parte do corpo."""
    w, h = img.size
    arr = np.array(img)

    # Detectar pixels não-brancos (modelo, sombra, roupa)
    # Threshold: pixel é "conteúdo" se qualquer canal < 240
    mascara = np.any(arr < 240, axis=2)

    linhas = np.where(mascara.any(axis=1))[0]
    colunas = np.where(mascara.any(axis=0))[0]

    if len(linhas) == 0 or len(colunas) == 0:
        print("    ⚠️  Conteúdo não detectado — sem recorte")
        return img

    topo   = max(0, linhas[0]  - 30)   # 30px de respiro no topo
    base   = min(h, linhas[-1] + 30)   # 30px de respiro na base
    esq    = max(0, colunas[0] - 20)
    dir_   = min(w, colunas[-1] + 20)

    cropped = img.crop((esq, topo, dir_, base))
    return cropped

# ─── Pipeline por cor ──────────────────────────────────────────────────────────

def processar_cor(produto_id, variacao, poses_usadas, todas_variacoes_cor=None, dry_run=False):
    vid = variacao["id"]
    cor = next((a["option"] for a in variacao.get("attributes", []) if a["name"].lower() in ("cor","color")), "sem-cor")
    # IDs de todas as variações desta cor (para salvar galeria em cada tamanho)
    todos_vids = [v["id"] for v in (todas_variacoes_cor or [variacao])]
    img_src = variacao.get("image", {}).get("src", "")

    print(f"\n  Cor: {cor} (variação #{vid})")

    if not img_src:
        print("  ⚠️  Sem imagem — pulando")
        return

    # 1. Baixar foto original, enquadrar inteligentemente e converter para WebP
    print("  1. Baixando e enquadrando foto original...")
    original = requests.get(img_src, timeout=30).content
    img = Image.open(io.BytesIO(original)).convert("RGB")
    w, h = img.size

    img = enquadrar_modelo(img)
    print(f"    Original: {w}x{h}px → Enquadrada: {img.size[0]}x{img.size[1]}px")

    # Melhoria de qualidade com PIL (grátis)
    from PIL import ImageEnhance
    img = ImageEnhance.Sharpness(img).enhance(1.3)
    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Color(img).enhance(1.1)

    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=92, method=6)
    principal_bytes = buf.getvalue()
    print(f"    Tamanho WebP: ({len(principal_bytes)//1024}KB)")

    # 2. Selecionar poses únicas para esta cor
    disponíveis = [p for i, p in enumerate(POOL_POSES) if i not in poses_usadas]
    if len(disponíveis) < 2:
        disponíveis = POOL_POSES  # reinicia se esgotou
    poses_escolhidas = random.sample(disponíveis, min(3, len(disponíveis)))
    for p in poses_escolhidas:
        poses_usadas.add(POOL_POSES.index(p))

    if dry_run:
        out = OUTPUT / f"{produto_id}_{vid}_{cor.replace(' ','-')}_principal.webp"
        out.write_bytes(principal_bytes)
        print(f"  💾 [dry-run] Principal salva: {out.name}")
        for i, pose in enumerate(poses_escolhidas, 1):
            print(f"  💾 [dry-run] Pose {i}: {pose[:60]}...")
        return

    # 3. Upload foto principal
    print("  2. Subindo foto principal...")
    nome_base = f"jaleca-{produto_id}-{vid}-{cor.replace(' ','-').lower()}"
    id_principal = wp_upload(principal_bytes, f"{nome_base}-principal.webp")

    # 4. Gerar e subir poses extras
    gallery_ids = []
    for i, pose in enumerate(poses_escolhidas, 1):
        print(f"  3.{i} Gerando pose {i} com Fashn.ai...")
        if i > 1 or True:  # sempre aguarda antes de chamar Fashn.ai
            print(f"    Aguardando 15s (rate limit)...")
            time.sleep(15)
        try:
            pose_bytes = fashn_gerar(img_src, pose, f"{produto_id}_{vid}_{cor.replace(' ','-')}_pose{i}")
            pid_wp = wp_upload(pose_bytes, f"{nome_base}-pose{i}.webp")
            gallery_ids.append(pid_wp)
        except Exception as e:
            print(f"    ❌ Pose {i} falhou: {e}")

    # 5. Atualizar variação no WooCommerce — imagem principal na variação processada
    # galeria salva para TODOS os tamanhos desta cor
    print(f"  4. Atualizando variação (principal: {id_principal}, galeria: {gallery_ids}, tamanhos: {todos_vids})...")
    wc_atualizar_variacao(produto_id, vid, id_principal, gallery_ids, todos_vids)
    print(f"  ✅ Cor '{cor}' concluída!")

# ─── Pipeline do produto ───────────────────────────────────────────────────────

def processar_produto(produto_id, dry_run=False):
    print(f"\n{'='*55}")
    print(f"Produto #{produto_id}{' [DRY-RUN]' if dry_run else ''}")
    print(f"{'='*55}")

    variacoes = wc_variacoes(produto_id)
    cores = uma_por_cor(variacoes)
    print(f"Cores encontradas: {len(cores)}")

    # Agrupar todas variações por cor para salvar galeria em cada tamanho
    from collections import defaultdict
    por_cor = defaultdict(list)
    for v in variacoes:
        cor = next((a["option"] for a in v.get("attributes", []) if a["name"].lower() in ("cor","color","colour")), None)
        if cor:
            por_cor[cor.strip()].append(v)

    poses_usadas = set()
    for idx, v in enumerate(cores):
        cor = next((a["option"] for a in v.get("attributes", []) if a["name"].lower() in ("cor","color","colour")), "sem-cor")
        todas_da_cor = por_cor.get(cor.strip(), [v])
        if idx > 0 and not dry_run:
            print(f"\n  Aguardando 30s entre cores (rate limit Fashn.ai)...")
            time.sleep(30)
        processar_cor(produto_id, v, poses_usadas, todas_variacoes_cor=todas_da_cor, dry_run=dry_run)

    if not dry_run:
        print("\nAtualizando produto...")
        wc_atualizar_produto(produto_id)

    print(f"\n✅ Produto #{produto_id} concluído!")

# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    """
    Uso:
      python3 pipeline_completo.py teste 61683     # dry-run, não sobe
      python3 pipeline_completo.py rodar 61683     # executa de verdade
    """
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    cmd, pid = sys.argv[1], int(sys.argv[2])

    if cmd == "teste":
        processar_produto(pid, dry_run=True)
    elif cmd == "rodar":
        processar_produto(pid, dry_run=False)
    else:
        print(__doc__)
