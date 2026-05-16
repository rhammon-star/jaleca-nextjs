#!/usr/bin/env python3
"""
Pipeline unificado Jaleca — rode com:
  python3 rodar_tudo.py

Faz tudo automaticamente:
  1. Carrega progresso salvo (não repete o que já foi feito)
  2. Fashn.ai: gera 3 poses por cor
  3. fal.ai: upscale 2x em cada foto (se crédito disponível)
  4. Sobe para WP Media e atualiza variações no WooCommerce
  5. Salva progresso após cada cor concluída
"""

import os, sys, io, time, json, random, requests, fal_client
os.environ["FAL_KEY"] = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"

sys.path.insert(0, ".")
from pathlib import Path
from collections import defaultdict
from PIL import Image, ImageEnhance

# ─── Credenciais ──────────────────────────────────────────────────────────────

WC_URL    = "https://wp.jaleca.com.br/wp-json/wc/v3"
WC_AUTH   = ("ck_249fd8f54810651d8ab8f2393f0a3ae32ea29399", "cs_b5491d7176b4d1eddad40f63260f1e30cb67e659")
WP_AUTH   = ("contato@jaleca.com.br", "y6dH RnuE dKbD 46Wa zylK zB7Q")
FASHN_KEY = "fa-9ADJsBcpDZGh-llQCcdjYo3fBpefUcLXLIgLy"
FASHN_HDR = {"Authorization": f"Bearer {FASHN_KEY}", "Content-Type": "application/json"}

OUTPUT   = Path("output")
PROGRESSO = Path("progresso.json")
OUTPUT.mkdir(exist_ok=True)

# ─── Produtos a processar ─────────────────────────────────────────────────────
# Adicione ou remova IDs aqui conforme necessário

PRODUTOS = [
    (58981,  "Jaleco Slim Princesa Manga Longa Feminino"),
    (61201,  "Jaleco Slim Princesa Manga Curta Feminino v2"),
    (61683,  "Jaleco Slim Princesa Manga Curta Feminino"),
    (59067,  "Jaleco Slim Princesa Feminino"),
    (59241,  "Jaleco Slim Elastex Feminino"),
    (59512,  "Conjunto Dólmã Cozinheiro Feminino"),
    (59701,  "Conjunto Dólmã Cozinheiro Masculino"),
    (61343,  "Jaleco Slim Gold Feminino"),
    (61273,  "Jaleco Slim Dama Feminino"),
    (59324,  "Conjunto Princesa Nobre Feminino"),
    (62062,  "Conjunto Laço Feminino"),
    (61772,  "Conjunto Executiva Feminino"),
]

# ─── Pool de poses ────────────────────────────────────────────────────────────

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

# ─── Progresso ────────────────────────────────────────────────────────────────

def carregar_progresso():
    if PROGRESSO.exists():
        return json.loads(PROGRESSO.read_text())
    return {"concluidos": [], "galeria_cache": {}}

def salvar_progresso(prog):
    PROGRESSO.write_text(json.dumps(prog, indent=2, ensure_ascii=False))

def marcar_concluido(prog, chave):
    if chave not in prog["concluidos"]:
        prog["concluidos"].append(chave)
    salvar_progresso(prog)

# ─── fal.ai upscale ───────────────────────────────────────────────────────────

FAL_DISPONIVEL = None  # será detectado na primeira tentativa

def upscale(img_bytes, nome):
    global FAL_DISPONIVEL
    if FAL_DISPONIVEL is False:
        return img_bytes  # sem crédito — retorna original

    try:
        tmp = OUTPUT / f"_tmp_{nome}.jpg"
        img_in = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img_in.save(tmp, "JPEG", quality=95)

        url_tmp = fal_client.upload_file(str(tmp))
        result  = fal_client.run(
            "fal-ai/clarity-upscaler",
            arguments={"image_url": url_tmp, "scale_factor": 2, "creativity": 0.05, "resemblance": 0.95}
        )
        final_bytes = requests.get(result["image"]["url"], timeout=60).content
        img_out = Image.open(io.BytesIO(final_bytes)).convert("RGB")
        buf = io.BytesIO()
        img_out.save(buf, "WEBP", quality=92, method=6)
        tmp.unlink(missing_ok=True)

        FAL_DISPONIVEL = True
        print(f"    ⬆  fal.ai: {img_in.size[0]}x{img_in.size[1]} → {img_out.size[0]}x{img_out.size[1]}px")
        return buf.getvalue()

    except Exception as e:
        err = str(e).lower()
        if "credit" in err or "quota" in err or "balance" in err or "402" in err or "payment" in err:
            print(f"    ⚠️  fal.ai sem crédito — upscale desativado para esta sessão")
            FAL_DISPONIVEL = False
        else:
            print(f"    ⚠️  fal.ai erro ({e}) — usando imagem sem upscale")
        return img_bytes

# ─── WordPress / WooCommerce ──────────────────────────────────────────────────

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
                print(f"    ⚠️  Upload falhou, tentando em 5s... ({e})")
                time.sleep(5)
            else:
                raise

def wc_variacoes(produto_id):
    r = requests.get(f"{WC_URL}/products/{produto_id}/variations", auth=WC_AUTH, params={"per_page": 100})
    r.raise_for_status()
    return r.json()

def wc_atualizar_variacao(prog, produto_id, variacao_id, image_id, gallery_ids):
    # Imagem principal
    requests.put(
        f"{WC_URL}/products/{produto_id}/variations/{variacao_id}",
        auth=WC_AUTH, json={"image": {"id": image_id}}
    ).raise_for_status()

    # Galeria no produto pai (acumula por produto)
    if gallery_ids:
        pid_str = str(produto_id)
        if pid_str not in prog["galeria_cache"]:
            prog["galeria_cache"][pid_str] = {}
        prog["galeria_cache"][pid_str][str(variacao_id)] = ",".join(str(i) for i in gallery_ids)
        salvar_progresso(prog)

        requests.put(
            f"{WC_URL}/products/{produto_id}",
            auth=WC_AUTH,
            json={"meta_data": [{"key": "woodmart_variation_gallery_data", "value": prog["galeria_cache"][pid_str]}]}
        ).raise_for_status()
        print(f"    Galeria salva: {prog['galeria_cache'][pid_str]}")

def enquadrar_modelo(img):
    import numpy as np
    w, h = img.size
    arr  = np.array(img)
    mask = __import__("numpy").any(arr < 240, axis=2)
    rows = __import__("numpy").where(mask.any(axis=1))[0]
    cols = __import__("numpy").where(mask.any(axis=0))[0]
    if not len(rows) or not len(cols):
        return img
    return img.crop((max(0, cols[0]-20), max(0, rows[0]-30), min(w, cols[-1]+20), min(h, rows[-1]+30)))

# ─── Fashn.ai ─────────────────────────────────────────────────────────────────

def fashn_gerar(foto_url, prompt, nome):
    r = requests.post("https://api.fashn.ai/v1/run", headers=FASHN_HDR, json={
        "model_name": "product-to-model",
        "inputs": {"product_image": foto_url, "prompt": prompt, "resolution": "2k", "generation_mode": "balanced"}
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

# ─── Pipeline por cor ─────────────────────────────────────────────────────────

def processar_cor(prog, produto_id, variacao, poses_usadas):
    vid = variacao["id"]
    cor = next((a["option"] for a in variacao.get("attributes", []) if a["name"].lower() in ("cor","color","colour")), "sem-cor")
    chave = f"{produto_id}_{vid}"

    if chave in prog["concluidos"]:
        print(f"  ✅ {cor} (#{vid}) — já concluída, pulando")
        return

    img_src = variacao.get("image", {}).get("src", "")
    if not img_src:
        print(f"  ⚠️  {cor}: sem imagem — pulando")
        return

    print(f"\n  Cor: {cor} (#{vid})")

    # 1. Baixar, enquadrar, melhorar
    original = requests.get(img_src, timeout=30).content
    img = Image.open(io.BytesIO(original)).convert("RGB")
    w0, h0 = img.size
    img = enquadrar_modelo(img)
    img = ImageEnhance.Sharpness(img).enhance(1.3)
    img = ImageEnhance.Contrast(img).enhance(1.1)
    img = ImageEnhance.Color(img).enhance(1.1)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=92, method=6)
    principal_bytes = buf.getvalue()
    print(f"    Original: {w0}x{h0} → Enquadrada: {img.size[0]}x{img.size[1]}px ({len(principal_bytes)//1024}KB)")

    # 2. Upscale principal
    nome_base = f"jaleca-{produto_id}-{vid}-{cor.replace(' ','-').lower()}"
    principal_bytes = upscale(principal_bytes, f"{produto_id}_{vid}_principal")

    # 3. Upload principal
    id_principal = wp_upload(principal_bytes, f"{nome_base}-principal.webp")
    print(f"    Principal: #{id_principal}")

    # 4. Gerar poses com Fashn.ai
    disponiveis = [p for i, p in enumerate(POOL_POSES) if i not in poses_usadas]
    if len(disponiveis) < 2:
        disponiveis = POOL_POSES[:]
    poses_escolhidas = random.sample(disponiveis, min(3, len(disponiveis)))
    for p in poses_escolhidas:
        poses_usadas.add(POOL_POSES.index(p))

    gallery_ids = []
    for j, pose in enumerate(poses_escolhidas, 1):
        print(f"  Pose {j}/3...")
        time.sleep(15)
        try:
            pose_bytes = fashn_gerar(img_src, pose, f"{produto_id}_{vid}_pose{j}")
            pose_bytes = upscale(pose_bytes, f"{produto_id}_{vid}_pose{j}_up")
            pid_wp = wp_upload(pose_bytes, f"{nome_base}-pose{j}.webp")
            gallery_ids.append(pid_wp)
        except Exception as e:
            print(f"    ❌ Pose {j} falhou: {e}")

    # 5. Atualizar WooCommerce
    wc_atualizar_variacao(prog, produto_id, vid, id_principal, gallery_ids)
    marcar_concluido(prog, chave)
    print(f"  ✅ {cor} concluída! Galeria: {gallery_ids}")

# ─── Pipeline por produto ─────────────────────────────────────────────────────

def processar_produto(prog, produto_id, nome):
    chave_prod = f"prod_{produto_id}"
    if chave_prod in prog["concluidos"]:
        print(f"\n[SKIP] #{produto_id} {nome} — já concluído")
        return

    print(f"\n{'='*60}")
    print(f"#{produto_id} — {nome}")
    print(f"{'='*60}")

    variacoes = wc_variacoes(produto_id)

    # Agrupar por cor, pegar 1 representante por cor
    por_cor = defaultdict(list)
    for v in variacoes:
        cor = next((a["option"] for a in v.get("attributes", []) if a["name"].lower() in ("cor","color","colour")), None)
        if cor:
            por_cor[cor.strip()].append(v)

    cores_rep = [sorted(lista, key=lambda x: x["id"])[0] for lista in por_cor.values()]
    print(f"Cores: {len(cores_rep)} | Variações total: {len(variacoes)}")

    poses_usadas = set()
    for idx, v in enumerate(cores_rep):
        if idx > 0:
            print(f"\n  Aguardando 30s entre cores...")
            time.sleep(30)
        processar_cor(prog, produto_id, v, poses_usadas)

    # Publicar produto
    requests.put(f"{WC_URL}/products/{produto_id}", auth=WC_AUTH, json={"status": "publish"}).raise_for_status()
    marcar_concluido(prog, chave_prod)
    print(f"\n✅ Produto #{produto_id} concluído!")

# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    prog = carregar_progresso()

    total_conc = len([c for c in prog["concluidos"] if c.startswith("prod_")])
    print(f"\n{'#'*60}")
    print(f"  PIPELINE JALECA — fal.ai upscale {'ATIVO' if FAL_DISPONIVEL is not False else 'aguardando teste'}")
    print(f"  Progresso salvo: {len(prog['concluidos'])} itens concluídos")
    print(f"  Produtos na fila: {len(PRODUTOS)}")
    print(f"{'#'*60}")

    erros = []
    for i, (pid, nome) in enumerate(PRODUTOS, 1):
        print(f"\n[{i}/{len(PRODUTOS)}] {nome}")
        try:
            processar_produto(prog, pid, nome)
        except Exception as e:
            print(f"\n❌ ERRO #{{pid}}: {e}")
            erros.append((pid, nome, str(e)))

        if i < len(PRODUTOS):
            print(f"\n⏳ Aguardando 60s antes do próximo produto...")
            time.sleep(60)

    print(f"\n{'='*60}")
    print(f"PIPELINE CONCLUÍDO")
    print(f"Sucesso: {len(PRODUTOS) - len(erros)}/{len(PRODUTOS)}")
    print(f"fal.ai upscale usado: {'Sim' if FAL_DISPONIVEL else 'Não (sem crédito)'}")
    if erros:
        print("\nErros:")
        for pid, nome, err in erros:
            print(f"  #{pid} {nome}: {err}")

    print(f"\nProgresso salvo em: {PROGRESSO.resolve()}")
