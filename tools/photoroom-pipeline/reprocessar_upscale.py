#!/usr/bin/env python3
"""Reprocessa fotos já geradas: baixa do WP, faz upscale 2x via fal.ai, re-sobe e atualiza."""

import os, sys, io, time, requests, fal_client
os.environ["FAL_KEY"] = "bd4c968c-2430-4760-95f3-6328bdb3ca06:dd7e76109019be8b7b0c2c492f0f2a7d"
sys.path.insert(0, ".")
from pipeline_completo import wp_upload, OUTPUT, WC_URL, WC_AUTH
from PIL import Image

# Todos os produtos já processados
PRODUTOS = [
    58981, 61201, 61683,
    59067, 59241, 59512, 59701,
    61343, 61273, 59324, 62062, 61772,
]

WP_MEDIA_URL = "https://wp.jaleca.com.br/wp-json/wp/v2/media"
WP_AUTH = ("contato@jaleca.com.br", "y6dH RnuE dKbD 46Wa zylK zB7Q")


def upscale_bytes(img_bytes, nome):
    tmp = OUTPUT / f"_upscale_tmp_{nome}.jpg"
    # Salva como JPEG para fal.ai (aceita melhor que webp)
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img.save(tmp, "JPEG", quality=95)
    print(f"    Enviando para fal.ai ({img.size[0]}x{img.size[1]}px)...")
    url_tmp = fal_client.upload_file(str(tmp))
    result = fal_client.run(
        "fal-ai/clarity-upscaler",
        arguments={"image_url": url_tmp, "scale_factor": 2, "creativity": 0.05, "resemblance": 0.95}
    )
    final_bytes = requests.get(result["image"]["url"], timeout=60).content
    img2 = Image.open(io.BytesIO(final_bytes)).convert("RGB")
    buf = io.BytesIO()
    img2.save(buf, "WEBP", quality=92, method=6)
    tmp.unlink(missing_ok=True)
    print(f"    Upscale: {img.size[0]}x{img.size[1]} → {img2.size[0]}x{img2.size[1]}px ({len(buf.getvalue())//1024}KB)")
    return buf.getvalue()


def get_wp_media_info(media_id):
    r = requests.get(f"{WP_MEDIA_URL}/{media_id}", auth=WP_AUTH, timeout=30)
    if r.status_code == 404:
        return None
    r.raise_for_status()
    return r.json()


def processar_produto(produto_id):
    print(f"\n{'='*55}")
    print(f"Produto #{produto_id}")
    print(f"{'='*55}")

    # Buscar variações
    r = requests.get(f"{WC_URL}/products/{produto_id}/variations", auth=WC_AUTH, params={"per_page": 100})
    r.raise_for_status()
    variacoes = r.json()

    # Buscar galeria atual do produto pai
    r2 = requests.get(f"{WC_URL}/products/{produto_id}", auth=WC_AUTH)
    r2.raise_for_status()
    produto = r2.json()
    gallery_meta = {}
    for m in produto.get("meta_data", []):
        if m["key"] == "woodmart_variation_gallery_data":
            gallery_meta = m["value"] or {}
            break

    print(f"  Variações: {len(variacoes)} | Galeria atual: {len(gallery_meta)} entradas")

    # Mapear variação → imagem principal
    nova_gallery = {}
    variacoes_atualizadas = []

    for v in variacoes:
        vid = v["id"]
        img_src = v.get("image", {}).get("src", "")
        img_id  = v.get("image", {}).get("id")

        if not img_src or not img_id:
            continue

        # Só reprocessa fotos jaleca geradas por nós (nome contém "jaleca-")
        media_info = get_wp_media_info(img_id)
        if not media_info:
            continue
        filename = media_info.get("slug", "")
        if "jaleca-" not in filename:
            print(f"  Variação #{vid}: foto original do fornecedor — pulando")
            continue

        print(f"\n  Variação #{vid} — {filename}")

        # Upscale da foto principal
        try:
            img_bytes = requests.get(img_src, timeout=30).content
            upscaled = upscale_bytes(img_bytes, f"{produto_id}_{vid}_principal")
            novo_id = wp_upload(upscaled, f"{filename}-up2x.webp")
            print(f"    Principal: #{img_id} → #{novo_id}")

            # Atualizar imagem principal da variação
            requests.put(
                f"{WC_URL}/products/{produto_id}/variations/{vid}",
                auth=WC_AUTH,
                json={"image": {"id": novo_id}}
            ).raise_for_status()

            variacoes_atualizadas.append((vid, novo_id))
        except Exception as e:
            print(f"    ❌ Principal falhou: {e}")
            continue

        # Upscale das fotos da galeria desta variação
        gallery_str = gallery_meta.get(str(vid), "")
        if gallery_str:
            old_ids = [int(x) for x in gallery_str.split(",") if x.strip()]
            novos_ids = []
            for j, gid in enumerate(old_ids, 1):
                time.sleep(5)
                try:
                    ginfo = get_wp_media_info(gid)
                    if not ginfo:
                        print(f"    Galeria #{gid}: não encontrada — pulando")
                        novos_ids.append(gid)
                        continue
                    gslug = ginfo.get("slug", "")
                    gsrc  = ginfo.get("source_url", "")
                    gbytes = requests.get(gsrc, timeout=30).content
                    gup = upscale_bytes(gbytes, f"{produto_id}_{vid}_pose{j}")
                    gid_novo = wp_upload(gup, f"{gslug}-up2x.webp")
                    novos_ids.append(gid_novo)
                    print(f"    Galeria pose {j}: #{gid} → #{gid_novo}")
                    time.sleep(10)
                except Exception as e:
                    print(f"    ❌ Galeria pose {j} #{gid} falhou: {e}")
                    novos_ids.append(gid)
            nova_gallery[str(vid)] = ",".join(str(i) for i in novos_ids)
        else:
            if variacoes_atualizadas:
                nova_gallery[str(vid)] = ""

        time.sleep(15)

    # Salvar nova galeria no produto pai
    if nova_gallery:
        # Mesclar com entradas que não foram processadas
        merged = {**gallery_meta, **nova_gallery}
        requests.put(
            f"{WC_URL}/products/{produto_id}",
            auth=WC_AUTH,
            json={"meta_data": [{"key": "woodmart_variation_gallery_data", "value": merged}]}
        ).raise_for_status()
        print(f"\n  ✅ Galeria atualizada: {len(nova_gallery)} variações reprocessadas")
    else:
        print(f"\n  ⚠️  Nenhuma variação reprocessada")


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    produtos = [int(x) for x in sys.argv[1:]] if len(sys.argv) > 1 else PRODUTOS

    erros = []
    for i, pid in enumerate(produtos, 1):
        print(f"\n{'#'*60}")
        print(f"[{i}/{len(produtos)}] Produto #{pid}")
        print(f"{'#'*60}")
        try:
            processar_produto(pid)
        except Exception as e:
            print(f"❌ ERRO: {e}")
            erros.append((pid, str(e)))

        if i < len(produtos):
            print(f"\n⏳ Aguardando 30s...")
            time.sleep(30)

    print(f"\n{'='*60}")
    print(f"CONCLUÍDO — Erros: {len(erros)}/{len(produtos)}")
    for pid, err in erros:
        print(f"  #{pid}: {err}")
