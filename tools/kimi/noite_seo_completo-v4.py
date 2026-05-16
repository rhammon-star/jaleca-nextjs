#!/usr/bin/env python3
"""
Script Noturno Completo v4 — Jaleca SEO
=========================================
Novos módulos v4 (sobre v3):
  - robots.txt: verifica bloqueios de recursos
  - GSC 28d vs 28d anterior + 90d tendência + filtro Brasil + breakdown dispositivo
  - Detecção de titles/H1 duplicados entre páginas
  - Detecção de páginas órfãs (sem links internos)
  - Detecção de cannibalização por keyword
  - Detecção de soft 404s (200 com conteúdo vazio)
  - Monitoramento de páginas críticas no GSC
  - Histórico acumulado local (snapshots diários)
  - CWV em 10 páginas
  - Análise de intenção de busca por keyword (transacional/informacional/comercial)
  - Auditoria de Schema Markup por página (Product, BreadcrumbList, AggregateRating, FAQ)
  - Produtos fora de estoque (scrape + alerta de URL vazia)
  - Análise de faceted navigation (URLs com parâmetros de filtro)
  - Verificação de renderização JS (conteúdo visível sem JS vs com JS)
  - E-A-T para nicho saúde (autor, credencial, links para órgãos)
  - Arquitetura de concorrentes (internal linking e categorias)
  - Monitoramento de preço vs concorrentes (scrape de preço)
  - Indexação real via GSC URL Inspection API (páginas críticas)
  - Kimi sem limite de tokens
  - Prompt Kimi com 20 seções detalhadas
  - Gera arquivo de análise para revisão humana (não salva na memória do Claude)

Rodar à noite:
cd ~/sitejaleca/jaleca-nextjs
source .venv/bin/activate
python3 tools/kimi/noite_seo_completo-v4.py
"""

import os
import json
import time
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv
from xml.etree import ElementTree as ET
from bs4 import BeautifulSoup
import re
from collections import defaultdict
from urllib.parse import urlparse, parse_qs
from platformdirs import user_config_dir
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleAuthRequest
from googleapiclient.discovery import build

load_dotenv()

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
KIMI_MODEL     = os.getenv("OPENROUTER_MODEL", "moonshotai/kimi-k2.6")
DFS_AUTH       = os.getenv("SEOFORDATA_USER")

SITEMAP_URL   = "https://jaleca.com.br/sitemap.xml"
JALECA_DOMAIN = "jaleca.com.br"
OUTPUT_DIR    = os.path.expanduser("~/sitejaleca/jaleca-nextjs/ai-source-docs/relatorios")
HISTORY_DIR   = os.path.expanduser("~/sitejaleca/jaleca-nextjs/ai-source-docs/historico")
CACHE_DIR     = os.path.expanduser("~/sitejaleca/jaleca-nextjs/ai-source-docs/cache")

for d in [OUTPUT_DIR, HISTORY_DIR, CACHE_DIR]:
    os.makedirs(d, exist_ok=True)

TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M")
TODAY     = datetime.now().strftime("%Y%m%d")
YESTERDAY = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")

PAGINAS_CRITICAS = [
    "https://jaleca.com.br/jaleco-enfermagem",
    "https://jaleca.com.br/jaleco-medico",
    "https://jaleca.com.br/jaleco-nutricionista",
    "https://jaleca.com.br/jaleco-dentista",
    "https://jaleca.com.br/jaleco-feminino",
    "https://jaleca.com.br/scrub-feminino",
    "https://jaleca.com.br/pijama-cirurgico-feminino",
    "https://jaleca.com.br/categoria/jalecos-femininos",
    "https://jaleca.com.br/nossas-lojas",
]

CONCORRENTES = [
    {"nome": "Jaleco Online",        "url": "https://www.jalecoonline.com.br/",                                "dominio": "jalecoonline.com.br",        "sitemap": "https://www.jalecoonline.com.br/sitemap.xml"},
    {"nome": "Dr. Jaleco",           "url": "https://drjaleco.com.br/",                                       "dominio": "drjaleco.com.br",            "sitemap": "https://drjaleco.com.br/sitemap.xml"},
    {"nome": "Dra. Charm",           "url": "https://www.dracharm.com.br/",                                   "dominio": "dracharm.com.br",            "sitemap": "https://www.dracharm.com.br/sitemap.xml"},
    {"nome": "Donne Jalecos",        "url": "https://donnejalecos.com.br/",                                   "dominio": "donnejalecos.com.br",        "sitemap": "https://donnejalecos.com.br/sitemap.xml"},
    {"nome": "JalecoChic",           "url": "https://www.jalecochic.com.br/",                                 "dominio": "jalecochic.com.br",          "sitemap": "https://www.jalecochic.com.br/sitemap.xml"},
    {"nome": "Jussara Nunes",        "url": "https://jussaranunes.com.br/",                                   "dominio": "jussaranunes.com.br",        "sitemap": "https://jussaranunes.com.br/sitemap.xml"},
    {"nome": "Boutique dos Jalecos", "url": "https://www.boutiquedosjalecos.com.br/",                        "dominio": "boutiquedosjalecos.com.br",  "sitemap": "https://www.boutiquedosjalecos.com.br/sitemap.xml"},
    {"nome": "Casa do Jaleco",       "url": "https://www.casadojaleco.com/feminino",                         "dominio": "casadojaleco.com",           "sitemap": "https://www.casadojaleco.com/sitemap.xml"},
    {"nome": "Primeira Cor",         "url": "https://loja.primeiracorjalecos.com/jalecos/jalecos-femininos", "dominio": "primeiracorjalecos.com",     "sitemap": "https://loja.primeiracorjalecos.com/sitemap.xml"},
    {"nome": "Brancura",             "url": "https://www.brancura.com.br/mulheres/jalecos-femininos",        "dominio": "brancura.com.br",            "sitemap": "https://www.brancura.com.br/sitemap.xml"},
]

# URLs de concorrentes para monitorar preço
CONCORRENTES_PRECO = [
    {"nome": "Brancura",      "url": "https://www.brancura.com.br/mulheres/jalecos-femininos",        "seletor_preco": ".price"},
    {"nome": "Casa do Jaleco","url": "https://www.casadojaleco.com/feminino",                         "seletor_preco": ".price"},
    {"nome": "Dr. Jaleco",    "url": "https://drjaleco.com.br/",                                      "seletor_preco": ".price"},
]

TOP_KEYWORDS = [
    "jaleco feminino", "jaleco médico", "jaleco personalizado",
    "jaleco bordado", "uniforme saúde", "scrub médico",
    "jaleco colorido", "jaleco estampado", "jaleco enfermagem",
    "uniforme hospitalar", "jaleco manga longa", "jaleco manga curta",
    "jaleco feminino colorido", "jaleco médico feminino", "jaleco com bordado",
    "jaleco barato", "jaleco online", "comprar jaleco",
    "jaleco branco feminino", "jaleco azul médico",
    "scrub feminino", "pijama cirúrgico", "roupa hospitalar",
    "jaleco estudante medicina", "jaleco farmácia",
    "jaleco odontologia", "jaleco veterinária", "jaleco nutrição",
    "jaleco enfermagem feminino", "jaleco personalizado bordado",
    "jaleco para medica", "jaleco para enfermeira", "jaleco para nutricionista",
    "jaleco para fisioterapeuta", "jaleco para esteticista", "jaleco para psicologa",
    "jaleco slim feminino", "jaleco gestante", "jaleco plus size feminino",
    "jaleco feminino são paulo", "jaleco feminino rio de janeiro",
    "jaleco feminino belo horizonte", "jaleco feminino curitiba",
    "jaleco feminino porto alegre", "jaleco feminino campinas",
    "jaleco feminino salvador", "jaleco feminino recife",
    "jaleco medica são paulo", "jaleco medica belo horizonte",
    "jaleco de enfermagem", "jaleco de médico", "jaleco enfermeiro",
    "jaleco nutricionista", "jaleco dentista", "jaleco fisioterapeuta",
]

KEYWORDS_SEMENTE = TOP_KEYWORDS[:12]

DFS_HEADERS = {
    "Authorization": f"Basic {DFS_AUTH}",
    "Content-Type": "application/json"
}
BRASIL = 2076


def log(msg):
    print(f"{datetime.now().strftime('%H:%M:%S')} {msg}", flush=True)


def dfs_post(endpoint, payload):
    try:
        r = requests.post(
            f"https://api.dataforseo.com/v3/{endpoint}",
            headers=DFS_HEADERS,
            json=payload,
            timeout=90
        )
        data = r.json()
        if data.get("status_code") == 20000:
            results = data["tasks"][0].get("result", [])
            return results[0] if results else {}
        log(f"   ⚠️  DataForSEO {endpoint}: {data.get('status_message')}")
        return {}
    except Exception as e:
        log(f"   ⚠️  DataForSEO {endpoint}: {e}")
        return {}


# ══════════════════════════════════════════
# 1. SITEMAP JALECA
# ══════════════════════════════════════════

def get_urls_jaleca():
    log("📋 Lendo sitemap da Jaleca...")
    try:
        r = requests.get(SITEMAP_URL, timeout=30)
        root = ET.fromstring(r.content)
        ns   = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = [u.find("sm:loc", ns).text for u in root.findall("sm:url", ns)]
        log(f"   ✅ {len(urls)} URLs no sitemap")
        extras = [p for p in PAGINAS_CRITICAS if p not in urls]
        if extras:
            urls.extend(extras)
            log(f"   ➕ {len(extras)} páginas críticas adicionadas")
        return urls
    except Exception as e:
        log(f"   ⚠️  Erro sitemap: {e}")
        return PAGINAS_CRITICAS


# ══════════════════════════════════════════
# 1b. ROBOTS.TXT
# ══════════════════════════════════════════

def verificar_robots_txt():
    log("🤖 Verificando robots.txt...")
    try:
        r = requests.get(f"https://{JALECA_DOMAIN}/robots.txt", timeout=15)
        conteudo = r.text
        problemas = []
        for linha in conteudo.splitlines():
            linha = linha.strip()
            if linha.startswith("Disallow:"):
                path = linha.replace("Disallow:", "").strip()
                if path in ["/", "/_next/", "/api/"] or ".js" in path or ".css" in path:
                    problemas.append(f"⚠️ Possível bloqueio crítico: {linha}")
        log(f"   ✅ robots.txt ok — {len(problemas)} alertas")
        return {"conteudo": conteudo[:2000], "problemas": problemas, "status": r.status_code}
    except Exception as e:
        log(f"   ⚠️  robots.txt erro: {e}")
        return {"conteudo": "", "problemas": [str(e)], "status": 0}


# ══════════════════════════════════════════
# 2. SCRAPER LOCAL
# ══════════════════════════════════════════

SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JalecaSEOBot/1.0)",
    "Accept-Language": "pt-BR,pt;q=0.9"
}


def _html_to_text(soup):
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    return " ".join(soup.get_text(separator=" ").split())[:8000]


def _extrair_basico(url, soup, status_code, redirect_url):
    title_tag   = soup.find("title")
    h1_tag      = soup.find("h1")
    meta_desc   = soup.find("meta", attrs={"name": re.compile("description", re.I)})
    canonical   = soup.find("link", rel="canonical")
    robots_meta = soup.find("meta", attrs={"name": re.compile("robots", re.I)})
    h2_tags     = [h.get_text(strip=True) for h in soup.find_all("h2")]
    imgs        = soup.find_all("img")
    imgs_sem_alt = [i.get("src", "")[:80] for i in imgs if not i.get("alt", "").strip()]

    # Schema.org
    schema_blocks = soup.find_all("script", attrs={"type": "application/ld+json"})
    schema_types, schema_raw = [], []
    for blk in schema_blocks:
        try:
            d = json.loads(blk.string or "")
            t = d.get("@type") if isinstance(d, dict) else None
            if t:
                schema_types.append(t if isinstance(t, str) else str(t))
                schema_raw.append(d)
        except Exception:
            pass

    # Preço na página
    preco = ""
    for sel in [".price", "[itemprop='price']", ".woocommerce-Price-amount", ".amount"]:
        el = soup.select_one(sel)
        if el:
            preco = el.get_text(strip=True)[:30]
            break

    # Autor / credencial (E-A-T)
    autor = ""
    for sel in ["[rel='author']", ".author", "[itemprop='author']", ".byline"]:
        el = soup.select_one(sel)
        if el:
            autor = el.get_text(strip=True)[:60]
            break

    # Links para órgãos de saúde (E-A-T)
    links_saude = []
    dominios_saude = ["cofen.gov.br", "cfm.org.br", "crf.org.br", "cro.org.br", "anvisa.gov.br", "saude.gov.br"]
    for a in soup.find_all("a", href=True):
        if any(d in a["href"] for d in dominios_saude):
            links_saude.append(a["href"])

    # Links internos
    links_internos = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("/") or JALECA_DOMAIN in href:
            links_internos.append(href)

    text       = _html_to_text(soup)
    word_count = len(text.split())
    noindex    = False
    if robots_meta:
        noindex = "noindex" in robots_meta.get("content", "").lower()

    return {
        "url":              url,
        "status":           "ok",
        "status_code":      status_code,
        "redirect_url":     redirect_url or "",
        "title":            title_tag.get_text(strip=True) if title_tag else "",
        "meta_description": meta_desc["content"].strip() if meta_desc and meta_desc.get("content") else "",
        "h1":               h1_tag.get_text(strip=True) if h1_tag else "",
        "h2_list":          h2_tags[:10],
        "word_count":       word_count,
        "canonical":        canonical["href"].strip() if canonical and canonical.get("href") else "",
        "has_schema":       len(schema_types) > 0,
        "schema_types":     schema_types,
        "schema_raw":       schema_raw[:3],
        "has_images":       len(imgs) > 0,
        "image_count":      len(imgs),
        "imgs_sem_alt":     imgs_sem_alt[:5],
        "noindex":          noindex,
        "links_internos":   links_internos[:20],
        "preco_na_pagina":  preco,
        "autor":            autor,
        "links_saude":      links_saude[:5],
    }


def scrape(url):
    try:
        resp         = requests.get(url, headers=SCRAPE_HEADERS, timeout=20, allow_redirects=True)
        redirect_url = resp.url if resp.url != url else ""
        soup         = BeautifulSoup(resp.content, "html.parser")
        return _extrair_basico(url, soup, resp.status_code, redirect_url)
    except Exception as e:
        return {"url": url, "status": "error", "error": str(e)}


def raspar_jaleca(urls):
    log(f"🔍 Raspando {len(urls)} páginas da Jaleca...")
    results = []
    for i, url in enumerate(urls, 1):
        print(f"   [{i:3}/{len(urls)}] {url[:65]}", end=" ", flush=True)
        r = scrape(url)
        results.append(r)
        print("✅" if r["status"] == "ok" else f"❌ {r.get('error','')}")
        time.sleep(0.4)
    ok = sum(1 for r in results if r["status"] == "ok")
    log(f"   📊 {ok} ok / {len(urls)-ok} erros")
    return results, [r for r in results if r["status"] != "ok"]


# ══════════════════════════════════════════
# 2b. SOFT 404s — página retorna 200 mas está vazia
# ══════════════════════════════════════════

def detectar_soft_404s(jaleca_pages):
    log("👻 Detectando soft 404s (200 com conteúdo vazio)...")
    soft = []
    for p in jaleca_pages:
        if p.get("status") != "ok" or p.get("status_code", 200) != 200:
            continue
        word_count = p.get("word_count", 0)
        h1         = p.get("h1", "").strip()
        url        = p.get("url", "")
        if word_count < 50 or not h1:
            soft.append({"url": url, "word_count": word_count, "h1": h1, "problema": "Página 200 mas quase sem conteúdo — Google trata como 404"})
    log(f"   ✅ {len(soft)} soft 404s detectados")
    return soft


# ══════════════════════════════════════════
# 2c. DUPLICATAS — titles e H1
# ══════════════════════════════════════════

def detectar_duplicatas(jaleca_pages):
    log("🔁 Detectando titles e H1 duplicados...")
    titles, h1s = defaultdict(list), defaultdict(list)
    noindex_pages = []
    for p in jaleca_pages:
        if p.get("status") != "ok":
            continue
        url = p.get("url", "")
        t   = p.get("title", "").strip()
        h   = p.get("h1", "").strip()
        if t: titles[t].append(url)
        if h: h1s[h].append(url)
        if p.get("noindex"): noindex_pages.append(url)
    titles_dup = {t: u for t, u in titles.items() if len(u) > 1}
    h1s_dup    = {h: u for h, u in h1s.items() if len(u) > 1}
    log(f"   ✅ {len(titles_dup)} titles dup, {len(h1s_dup)} H1 dup, {len(noindex_pages)} noindex")
    return {"titles_duplicados": titles_dup, "h1_duplicados": h1s_dup, "paginas_noindex": noindex_pages}


# ══════════════════════════════════════════
# 2d. PÁGINAS ÓRFÃS
# ══════════════════════════════════════════

def detectar_paginas_orfas(jaleca_pages, urls_sitemap):
    log("🔗 Detectando páginas órfãs...")
    todos_links = set()
    for p in jaleca_pages:
        for link in p.get("links_internos", []):
            if link.startswith("/"):
                todos_links.add(f"https://{JALECA_DOMAIN}{link.split('?')[0].rstrip('/')}")
            elif JALECA_DOMAIN in link:
                todos_links.add(link.split("?")[0].rstrip("/"))
    orfas = [u for u in urls_sitemap if u.split("?")[0].rstrip("/") not in todos_links and u != f"https://{JALECA_DOMAIN}/"]
    log(f"   ✅ {len(orfas)} páginas órfãs")
    return orfas[:30]


# ══════════════════════════════════════════
# 2e. SCHEMA MARKUP AUDIT
# ══════════════════════════════════════════

def auditar_schema(jaleca_pages):
    log("🧩 Auditando Schema Markup...")
    paginas_sem_schema    = []
    schema_incompleto     = []
    tem_aggregate_rating  = []
    tem_product           = []
    tem_faq               = []

    for p in jaleca_pages:
        if p.get("status") != "ok":
            continue
        url    = p.get("url", "")
        tipos  = p.get("schema_types", [])
        raw    = p.get("schema_raw", [])

        if not tipos:
            paginas_sem_schema.append(url)
            continue

        if "Product" in tipos:
            tem_product.append(url)
            # Verifica campos obrigatórios
            for blk in raw:
                if blk.get("@type") == "Product":
                    faltando = [f for f in ["name", "image", "offers", "description"] if not blk.get(f)]
                    if faltando:
                        schema_incompleto.append({"url": url, "faltando": faltando})

        if "AggregateRating" in tipos or any("aggregateRating" in str(r) for r in raw):
            tem_aggregate_rating.append(url)

        if "FAQPage" in tipos:
            tem_faq.append(url)

    # Páginas de produto sem Product schema
    produto_urls = [p["url"] for p in jaleca_pages if "/produto/" in p.get("url", "") and p.get("status") == "ok"]
    produto_sem_schema = [u for u in produto_urls if u not in tem_product]

    log(f"   ✅ {len(tem_product)} Product, {len(tem_faq)} FAQ, {len(tem_aggregate_rating)} Rating, {len(produto_sem_schema)} produtos sem schema")
    return {
        "paginas_sem_schema":    paginas_sem_schema[:20],
        "schema_incompleto":     schema_incompleto[:20],
        "produtos_sem_schema":   produto_sem_schema[:20],
        "tem_aggregate_rating":  len(tem_aggregate_rating),
        "tem_product":           len(tem_product),
        "tem_faq":               len(tem_faq),
    }


# ══════════════════════════════════════════
# 2f. FACETED NAVIGATION — URLs com parâmetros
# ══════════════════════════════════════════

def analisar_faceted_navigation(urls):
    log("🔀 Analisando faceted navigation (URLs com parâmetros)...")
    parametrizadas = []
    for url in urls:
        parsed = urlparse(url)
        if parsed.query:
            params = parse_qs(parsed.query)
            parametrizadas.append({
                "url":       url,
                "parametros": list(params.keys()),
                "risco":     "Alto — verificar se tem canonical ou noindex"
            })
    log(f"   ✅ {len(parametrizadas)} URLs parametrizadas detectadas")
    return parametrizadas[:30]


# ══════════════════════════════════════════
# 2g. E-A-T — nicho saúde
# ══════════════════════════════════════════

def auditar_eat(jaleca_pages):
    log("🏥 Auditando E-A-T (Expertise, Authority, Trust) para nicho saúde...")
    paginas_sem_autor        = []
    paginas_sem_links_saude  = []
    paginas_com_autor        = []
    paginas_com_links_saude  = []

    # Só audita páginas de blog e profissão (conteúdo editorial)
    urls_editorial = [
        p for p in jaleca_pages
        if p.get("status") == "ok" and (
            "/blog/" in p.get("url", "") or
            any(k in p.get("url", "") for k in ["/jaleco-medic", "/jaleco-enfer", "/jaleco-nutri", "/jaleco-dent", "/jaleco-fisio"])
        )
    ]

    for p in urls_editorial:
        url = p.get("url", "")
        if p.get("autor"):
            paginas_com_autor.append({"url": url, "autor": p["autor"]})
        else:
            paginas_sem_autor.append(url)

        if p.get("links_saude"):
            paginas_com_links_saude.append({"url": url, "links": p["links_saude"]})
        else:
            paginas_sem_links_saude.append(url)

    log(f"   ✅ {len(urls_editorial)} páginas editoriais auditadas — {len(paginas_sem_autor)} sem autor, {len(paginas_sem_links_saude)} sem links de saúde")
    return {
        "paginas_sem_autor":       paginas_sem_autor[:20],
        "paginas_sem_links_saude": paginas_sem_links_saude[:20],
        "paginas_com_autor":       paginas_com_autor[:10],
        "total_auditado":          len(urls_editorial),
    }


# ══════════════════════════════════════════
# 2h. INTENÇÃO DE BUSCA — classifica keywords
# ══════════════════════════════════════════

def classificar_intencao_keywords(posicoes_jaleca, gsc_pos_4_20):
    log("🎯 Classificando intenção de busca por keyword...")

    # Padrões de intenção
    transacional  = ["comprar", "compre", "preço", "frete", "entrega", "online", "barato", "oferta", "desconto", "loja"]
    informacional = ["como", "qual", "quando", "o que", "diferença", "guia", "dicas", "melhor", "certo", "ideal"]
    comercial     = ["feminino", "masculino", "slim", "bordado", "personalizado", "plus size", "colorido", "branco"]

    def classifica(kw):
        kw_lower = kw.lower()
        if any(p in kw_lower for p in transacional):
            return "transacional"
        if any(p in kw_lower for p in informacional):
            return "informacional"
        if any(p in kw_lower for p in comercial):
            return "comercial_investigativa"
        return "navegacional"

    resultado = []
    for p in posicoes_jaleca:
        kw = p.get("keyword", "")
        resultado.append({
            "keyword":  kw,
            "intencao": classifica(kw),
            "posicao":  p.get("position"),
            "url":      p.get("url"),
        })

    # Também classifica oportunidades GSC 4-20
    for p in gsc_pos_4_20[:20]:
        kw = p.get("keyword", "")
        p["intencao"] = classifica(kw)

    # Agrupa por intenção
    por_intencao = defaultdict(list)
    for r in resultado:
        por_intencao[r["intencao"]].append(r)

    resumo = {k: len(v) for k, v in por_intencao.items()}
    log(f"   ✅ Intenção classificada: {resumo}")
    return {"por_intencao": dict(por_intencao), "resumo": resumo}


# ══════════════════════════════════════════
# 2i. VERIFICAÇÃO JS — conteúdo visível sem JS
# ══════════════════════════════════════════

def verificar_renderizacao_js(urls_amostra):
    log("⚙️  Verificando renderização JS (conteúdo visível sem JS)...")
    problemas = []
    # Compara o que o scraper simples vê vs o que deveria ter
    urls = [u for u in urls_amostra if "/produto/" in u or "/categoria/" in u][:5]
    for url in urls:
        r = scrape(url)
        wc = r.get("word_count", 0)
        if wc < 100 and r.get("status") == "ok":
            problemas.append({
                "url":         url,
                "word_count":  wc,
                "problema":    "Conteúdo pode estar sendo carregado via JS — Google pode não ver os produtos"
            })
        time.sleep(0.5)
    log(f"   ✅ {len(problemas)} páginas com possível problema de renderização JS")
    return problemas


# ══════════════════════════════════════════
# 2j. ARQUITETURA DE CONCORRENTES
# ══════════════════════════════════════════

def analisar_arquitetura_concorrentes():
    log("🏗️  Analisando arquitetura de concorrentes (categorias + internal linking)...")
    resultados = []
    for c in CONCORRENTES[:4]:
        r = scrape(c["url"])
        if r.get("status") != "ok":
            resultados.append({"concorrente": c["nome"], "erro": r.get("error")})
            continue

        # Extrai links de navegação (categorias)
        try:
            resp = requests.get(c["url"], headers=SCRAPE_HEADERS, timeout=20, allow_redirects=True)
            soup = BeautifulSoup(resp.content, "html.parser")
            nav_links = []
            for nav in soup.find_all(["nav", "header", "ul"]):
                for a in nav.find_all("a", href=True):
                    texto = a.get_text(strip=True)
                    href  = a["href"]
                    if texto and len(texto) > 2:
                        nav_links.append({"texto": texto, "href": href[:80]})
            nav_links = nav_links[:20]
        except:
            nav_links = []

        resultados.append({
            "concorrente":    c["nome"],
            "dominio":        c["dominio"],
            "h1":             r.get("h1", ""),
            "h2_list":        r.get("h2_list", [])[:5],
            "word_count":     r.get("word_count", 0),
            "schema_types":   r.get("schema_types", []),
            "nav_links":      nav_links,
            "image_count":    r.get("image_count", 0),
        })
        time.sleep(1)

    log(f"   ✅ {len(resultados)} concorrentes analisados")
    return resultados


# ══════════════════════════════════════════
# 2k. MONITORAMENTO DE PREÇO VS CONCORRENTES
# ══════════════════════════════════════════

def monitorar_precos_concorrentes():
    log("💰 Monitorando preços dos concorrentes...")
    resultados = []
    for c in CONCORRENTES_PRECO:
        try:
            resp = requests.get(c["url"], headers=SCRAPE_HEADERS, timeout=20, allow_redirects=True)
            soup = BeautifulSoup(resp.content, "html.parser")
            precos = []
            for el in soup.select(c["seletor_preco"])[:5]:
                texto = el.get_text(strip=True)
                if texto and any(c in texto for c in ["R$", "R $", "BRL"]):
                    precos.append(texto[:30])
            # Fallback: busca qualquer menção a preço
            if not precos:
                matches = re.findall(r"R\$\s*[\d.,]+", resp.text)
                precos  = matches[:5]

            resultados.append({
                "concorrente": c["nome"],
                "url":         c["url"],
                "precos_vistos": precos,
                "menor_preco": min(precos, key=lambda x: float(re.sub(r"[^\d,]", "", x).replace(",", ".") or "0")) if precos else "N/A"
            })
        except Exception as e:
            resultados.append({"concorrente": c["nome"], "erro": str(e)})
        time.sleep(1)

    log(f"   ✅ Preços coletados de {len(resultados)} concorrentes")
    return resultados


# ══════════════════════════════════════════
# 3. SCRAPER — concorrentes (home)
# ══════════════════════════════════════════

def raspar_concorrentes():
    log("🔍 Raspando home dos concorrentes...")
    results = []
    for c in CONCORRENTES:
        print(f"   {c['nome']}...", end=" ", flush=True)
        r = scrape(c["url"])
        r["concorrente"] = c["nome"]
        r["dominio"]     = c["dominio"]
        results.append(r)
        print("✅" if r["status"] == "ok" else "❌")
        time.sleep(1)
    return results


# ══════════════════════════════════════════
# 4. PÁGINAS NOVAS DOS CONCORRENTES
# ══════════════════════════════════════════

def get_sitemap_urls(sitemap_url):
    try:
        r    = requests.get(sitemap_url, timeout=15)
        root = ET.fromstring(r.content)
        ns   = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        return set(u.find("sm:loc", ns).text for u in root.findall("sm:url", ns))
    except:
        return set()


def detectar_paginas_novas_concorrentes():
    log("🆕 Detectando páginas novas dos concorrentes...")
    novidades = {}
    for c in CONCORRENTES:
        cache_file = f"{CACHE_DIR}/sitemap_{c['dominio']}_{YESTERDAY}.json"
        hoje_urls  = get_sitemap_urls(c["sitemap"])
        ontem_urls = set()
        if os.path.exists(cache_file):
            with open(cache_file) as f:
                ontem_urls = set(json.load(f))
        with open(f"{CACHE_DIR}/sitemap_{c['dominio']}_{TODAY}.json", "w") as f:
            json.dump(list(hoje_urls), f)
        novas = hoje_urls - ontem_urls
        if novas:
            novidades[c["nome"]] = list(novas)
            log(f"   🚨 {c['nome']}: {len(novas)} páginas novas!")
        else:
            log(f"   ✅ {c['nome']}: sem novidades")
        time.sleep(0.5)
    return novidades


# ══════════════════════════════════════════
# 5. DATAFORSEO — keywords do mercado
# ══════════════════════════════════════════

def buscar_keywords_mercado():
    log("🔑 Keywords do mercado...")
    result = dfs_post(
        "dataforseo_labs/google/keyword_suggestions/live",
        [{"keywords": KEYWORDS_SEMENTE, "location_code": BRASIL, "language_code": "pt", "limit": 100}]
    )
    kws = sorted([
        {"keyword": i["keyword"], "volume": i.get("keyword_info", {}).get("search_volume", 0),
         "cpc": i.get("keyword_info", {}).get("cpc", 0), "difficulty": i.get("keyword_properties", {}).get("keyword_difficulty", 0)}
        for i in result.get("items", [])
    ], key=lambda x: x["volume"] or 0, reverse=True)
    log(f"   ✅ {len(kws)} keywords")
    return kws


# ══════════════════════════════════════════
# 6. DATAFORSEO — keywords concorrentes
# ══════════════════════════════════════════

def buscar_ranked(dominio, limit=50):
    result = dfs_post(
        "dataforseo_labs/google/ranked_keywords/live",
        [{"target": dominio, "location_code": BRASIL, "language_code": "pt", "limit": limit}]
    )
    return sorted([
        {"keyword": i.get("keyword_data", {}).get("keyword", ""),
         "position": i.get("ranked_serp_element", {}).get("serp_item", {}).get("rank_absolute", 0),
         "volume": i.get("keyword_data", {}).get("keyword_info", {}).get("search_volume", 0)}
        for i in result.get("items", [])
    ], key=lambda x: x["position"])


def buscar_keywords_concorrentes():
    log("🔑 Keywords dos concorrentes...")
    resultados = {}
    for c in CONCORRENTES[:5]:
        kws = buscar_ranked(c["dominio"])
        resultados[c["dominio"]] = kws
        log(f"   ✅ {c['dominio']}: {len(kws)} keywords")
        time.sleep(1)
    return resultados


# ══════════════════════════════════════════
# 7. POSIÇÕES DIÁRIAS JALECA
# ══════════════════════════════════════════

def buscar_posicoes_diarias():
    log("📈 Posições diárias da Jaleca...")
    posicoes_hoje = []
    for kw in TOP_KEYWORDS:
        result = dfs_post(
            "serp/google/organic/live/advanced",
            [{"keyword": kw, "location_code": BRASIL, "language_code": "pt", "device": "desktop", "depth": 20}]
        )
        jaleca_pos = {"keyword": kw, "position": None, "url": None, "title": None}
        for item in result.get("items", []):
            if item.get("type") == "organic" and JALECA_DOMAIN in item.get("url", ""):
                jaleca_pos = {"keyword": kw, "position": item.get("rank_absolute"), "url": item.get("url"), "title": item.get("title")}
                break
        posicoes_hoje.append(jaleca_pos)
        time.sleep(0.5)

    with open(f"{CACHE_DIR}/posicoes_jaleca_{TODAY}.json", "w") as f:
        json.dump(posicoes_hoje, f, ensure_ascii=False, indent=2)

    variacoes = []
    snap_ontem = f"{CACHE_DIR}/posicoes_jaleca_{YESTERDAY}.json"
    if os.path.exists(snap_ontem):
        with open(snap_ontem) as f:
            ontem = {p["keyword"]: p["position"] for p in json.load(f)}
        for p in posicoes_hoje:
            pos_h, pos_o = p["position"], ontem.get(p["keyword"])
            if pos_h and pos_o and abs(pos_o - pos_h) >= 2:
                delta = pos_o - pos_h
                variacoes.append({"keyword": p["keyword"], "ontem": pos_o, "hoje": pos_h, "delta": delta, "movimento": "⬆️ SUBIU" if delta > 0 else "⬇️ CAIU"})

    log(f"   ✅ {len(posicoes_hoje)} keywords, {len(variacoes)} variações")
    return posicoes_hoje, variacoes


# ══════════════════════════════════════════
# 7b. HISTÓRICO ACUMULADO LOCAL
# ══════════════════════════════════════════

def buscar_historico_acumulado():
    log("📈 Histórico acumulado (snapshots locais 30 dias)...")
    kws_monit = TOP_KEYWORDS[:15]
    historico = defaultdict(list)
    for dias in range(30, 0, -1):
        data    = (datetime.now() - timedelta(days=dias)).strftime("%Y%m%d")
        arquivo = f"{CACHE_DIR}/posicoes_jaleca_{data}.json"
        if not os.path.exists(arquivo):
            continue
        with open(arquivo) as f:
            for s in json.load(f):
                if s.get("keyword") in kws_monit:
                    historico[s["keyword"]].append({"data": data, "posicao": s.get("position")})

    resultado = []
    for kw, pontos in historico.items():
        vals = [p["posicao"] for p in pontos if p["posicao"]]
        if vals:
            resultado.append({
                "keyword":        kw,
                "pontos_7d":      pontos[-7:],
                "media_7d":       round(sum(vals[-7:]) / len(vals[-7:]), 1) if vals[-7:] else None,
                "melhor":         min(vals),
                "pior":           max(vals),
                "tendencia":      "⬆️ melhorando" if len(vals) >= 2 and vals[-1] < vals[0] else "⬇️ piorando" if len(vals) >= 2 and vals[-1] > vals[0] else "➡️ estável"
            })
    log(f"   ✅ Histórico de {len(resultado)} keywords")
    return resultado


# ══════════════════════════════════════════
# 8. SERP — concorrentes
# ══════════════════════════════════════════

def monitorar_serp_concorrentes():
    log("🔭 Monitorando SERP dos concorrentes (top 10 keywords)...")
    serp_hoje = {}
    for kw in TOP_KEYWORDS[:10]:
        result = dfs_post(
            "serp/google/organic/live/advanced",
            [{"keyword": kw, "location_code": BRASIL, "language_code": "pt", "device": "desktop", "depth": 10}]
        )
        serp_hoje[kw] = [
            {"position": i.get("rank_absolute"), "dominio": i.get("domain", ""), "url": i.get("url"), "title": i.get("title")}
            for i in result.get("items", []) if i.get("type") == "organic"
        ]
        time.sleep(0.5)

    with open(f"{CACHE_DIR}/serp_concorrentes_{TODAY}.json", "w") as f:
        json.dump(serp_hoje, f, ensure_ascii=False, indent=2)

    alertas = []
    snap_ontem = f"{CACHE_DIR}/serp_concorrentes_{YESTERDAY}.json"
    if os.path.exists(snap_ontem):
        with open(snap_ontem) as f:
            ontem_data = json.load(f)
        for kw, posicoes in serp_hoje.items():
            ontem_pos = {p["dominio"]: p["position"] for p in ontem_data.get(kw, [])}
            for p in posicoes:
                dom = p["dominio"]
                ph, po = p["position"], ontem_pos.get(dom)
                if ph and po and abs(po - ph) >= 2:
                    delta = po - ph
                    alertas.append({"keyword": kw, "dominio": dom, "ontem": po, "hoje": ph, "delta": delta, "movimento": "⬆️ SUBIU" if delta > 0 else "⬇️ CAIU"})

    log(f"   ✅ {len(TOP_KEYWORDS[:10])} keywords, {len(alertas)} movimentos")
    return serp_hoje, alertas


# ══════════════════════════════════════════
# 9. BACKLINKS
# ══════════════════════════════════════════

def buscar_backlinks():
    log("🔗 Backlinks...")
    dominios   = [JALECA_DOMAIN] + [c["dominio"] for c in CONCORRENTES[:4]]
    resultados = {}
    for dom in dominios:
        result = dfs_post("backlinks/summary/live", [{"target": dom, "include_subdomains": True}])
        resultados[dom] = {"backlinks": result.get("backlinks", 0), "referring_domains": result.get("referring_domains", 0), "rank": result.get("rank", 0), "spam_score": result.get("spam_score", 0)}
        log(f"   ✅ {dom}: {resultados[dom]['backlinks']} backlinks")
        time.sleep(1)
    return resultados


# ══════════════════════════════════════════
# 10. CORE WEB VITALS — 10 páginas
# ══════════════════════════════════════════

def buscar_cwv(urls):
    log("⚡ Core Web Vitals mobile (10 páginas)...")
    amostra = list(dict.fromkeys([
        "https://jaleca.com.br",
        "https://jaleca.com.br/jaleco-feminino",
        "https://jaleca.com.br/jaleco-medico",
        "https://jaleca.com.br/jaleco-enfermagem",
        "https://jaleca.com.br/scrub-feminino",
        "https://jaleca.com.br/categoria/jalecos-femininos",
        "https://jaleca.com.br/produtos",
        "https://jaleca.com.br/nossas-lojas",
    ] + [u for u in urls if "/produto/" in u][:2]))[:10]

    resultados = []
    for url in amostra:
        result = dfs_post("on_page/lighthouse/live/json", [{"url": url, "device": "mobile"}])
        cats   = result.get("categories", {})
        resultados.append({
            "url": url,
            "performance":    round(cats.get("performance", {}).get("score", 0) * 100),
            "seo":            round(cats.get("seo", {}).get("score", 0) * 100),
            "accessibility":  round(cats.get("accessibility", {}).get("score", 0) * 100),
            "best_practices": round(cats.get("best-practices", {}).get("score", 0) * 100),
        })
        time.sleep(2)
    log(f"   ✅ {len(resultados)} páginas")
    return resultados


# ══════════════════════════════════════════
# 11. GSC — COMPLETO
# ══════════════════════════════════════════

def _gsc_service():
    token_file = os.path.join(user_config_dir("mcp-gsc"), "token.json")
    scopes     = ["https://www.googleapis.com/auth/webmasters"]
    creds      = Credentials.from_authorized_user_file(token_file, scopes)
    if creds.expired and creds.refresh_token:
        creds.refresh(GoogleAuthRequest())
        with open(token_file, "w") as f:
            f.write(creds.to_json())
    return build("searchconsole", "v1", credentials=creds, cache_discovery=False)


def _gsc_query(service, date_from, date_to, dimensions=None, row_limit=1000, filters=None):
    body = {
        "startDate":  date_from,
        "endDate":    date_to,
        "dimensions": dimensions or ["query"],
        "rowLimit":   row_limit,
        "searchType": "web",
    }
    if filters:
        body["dimensionFilterGroups"] = filters
    return service.searchanalytics().query(siteUrl=f"sc-domain:{JALECA_DOMAIN}", body=body).execute().get("rows", [])


def buscar_dados_gsc():
    log("📊 GSC — análise completa (28d+90d, Brasil, dispositivo)...")
    hoje = datetime.now().strftime("%Y-%m-%d")
    d28  = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    d56  = (datetime.now() - timedelta(days=56)).strftime("%Y-%m-%d")
    d90  = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
    f_br = [{"filters": [{"dimension": "country", "operator": "equals", "expression": "bra"}]}]

    try:
        svc           = _gsc_service()
        rows_atual    = _gsc_query(svc, d28, hoje, filters=f_br)
        rows_anterior = _gsc_query(svc, d56, d28, filters=f_br)
        rows_90d      = _gsc_query(svc, d90, hoje, filters=f_br, row_limit=500)
    except Exception as e:
        log(f"   ⚠️  GSC API erro: {e}")
        return [], [], []

    pos_anterior = {r["keys"][0]: r.get("position", 0) for r in rows_anterior}

    queries_ctr_baixo = sorted([
        {"keyword": r["keys"][0], "impressoes": int(r.get("impressions", 0)), "ctr": round(r.get("ctr", 0)*100, 2),
         "posicao": round(r.get("position", 0), 1), "problema": "Título/meta fraco"}
        for r in rows_atual if r.get("impressions", 0) > 100 and r.get("ctr", 0) < 0.05
    ], key=lambda x: x["impressoes"], reverse=True)

    perdas = sorted([
        {"keyword": r["keys"][0], "posicao_antes": round(pos_anterior.get(r["keys"][0], 0), 1),
         "posicao_agora": round(r.get("position", 0), 1), "queda": round(r.get("position", 0) - pos_anterior.get(r["keys"][0], 0), 1)}
        for r in rows_atual
        if pos_anterior.get(r["keys"][0]) and r.get("position", 0) - pos_anterior.get(r["keys"][0], 0) > 3
    ], key=lambda x: x["queda"], reverse=True)

    tendencia_90d = sorted([
        {"keyword": r["keys"][0], "impressoes": int(r.get("impressions", 0)), "cliques": int(r.get("clicks", 0)),
         "ctr": round(r.get("ctr", 0)*100, 2), "posicao": round(r.get("position", 0), 1)}
        for r in rows_90d
    ], key=lambda x: x["impressoes"], reverse=True)[:20]

    log(f"   ✅ {len(queries_ctr_baixo)} CTR baixo, {len(perdas)} perdas, {len(tendencia_90d)} top 90d")
    return queries_ctr_baixo[:20], perdas[:20], tendencia_90d


def buscar_gsc_por_dispositivo():
    log("📱 GSC — mobile vs desktop...")
    hoje = datetime.now().strftime("%Y-%m-%d")
    d28  = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    try:
        svc  = _gsc_service()
        rows = _gsc_query(svc, d28, hoje, dimensions=["device"], row_limit=10)
        return [{"device": r["keys"][0], "cliques": int(r.get("clicks", 0)), "impressoes": int(r.get("impressions", 0)), "ctr": round(r.get("ctr", 0)*100, 2), "posicao": round(r.get("position", 0), 1)} for r in rows]
    except Exception as e:
        log(f"   ⚠️  {e}")
        return []


def buscar_gsc_paginas_criticas():
    log("🎯 GSC — páginas críticas monitoradas...")
    hoje  = datetime.now().strftime("%Y-%m-%d")
    d28   = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    paths = [p.replace(f"https://{JALECA_DOMAIN}", "") for p in PAGINAS_CRITICAS]
    try:
        svc  = _gsc_service()
        rows = _gsc_query(svc, d28, hoje, dimensions=["page", "query"], row_limit=2000)
    except Exception as e:
        log(f"   ⚠️  {e}")
        return []
    resultado = sorted([
        {"url": r["keys"][0], "keyword": r["keys"][1], "cliques": int(r.get("clicks", 0)),
         "impressoes": int(r.get("impressions", 0)), "ctr": round(r.get("ctr", 0)*100, 2), "posicao": round(r.get("position", 0), 1)}
        for r in rows
        if any(r["keys"][0].replace(f"https://{JALECA_DOMAIN}", "").startswith(p) for p in paths)
    ], key=lambda x: x["impressoes"], reverse=True)
    log(f"   ✅ {len(resultado)} entradas páginas críticas")
    return resultado[:50]


def buscar_gsc_por_pagina():
    log("📊 GSC — dados por página (28d, Brasil)...")
    hoje  = datetime.now().strftime("%Y-%m-%d")
    d28   = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    f_br  = [{"filters": [{"dimension": "country", "operator": "equals", "expression": "bra"}]}]
    try:
        svc  = _gsc_service()
        rows = _gsc_query(svc, d28, hoje, dimensions=["page"], row_limit=500, filters=f_br)
        return sorted([
            {"url": r["keys"][0], "cliques": int(r.get("clicks", 0)), "impressoes": int(r.get("impressions", 0)),
             "ctr": round(r.get("ctr", 0)*100, 2), "posicao": round(r.get("position", 0), 1)}
            for r in rows
        ], key=lambda x: x["impressoes"], reverse=True)
    except Exception as e:
        log(f"   ⚠️  {e}")
        return []


def buscar_gsc_posicao_4_20():
    log("📊 GSC — queries posição 4-20...")
    hoje  = datetime.now().strftime("%Y-%m-%d")
    d28   = (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d")
    f_br  = [{"filters": [{"dimension": "country", "operator": "equals", "expression": "bra"}]}]
    try:
        svc  = _gsc_service()
        rows = _gsc_query(svc, d28, hoje, dimensions=["query", "page"], row_limit=1000, filters=f_br)
        return sorted([
            {"keyword": r["keys"][0], "url": r["keys"][1], "posicao": round(r.get("position", 0), 1),
             "impressoes": int(r.get("impressions", 0)), "cliques": int(r.get("clicks", 0)), "ctr": round(r.get("ctr", 0)*100, 2)}
            for r in rows if 4 <= r.get("position", 0) <= 20 and r.get("impressions", 0) >= 50
        ], key=lambda x: x["impressoes"], reverse=True)[:50]
    except Exception as e:
        log(f"   ⚠️  {e}")
        return []


# ══════════════════════════════════════════
# 11b. GSC URL INSPECTION — indexação real
# ══════════════════════════════════════════

def verificar_indexacao_gsc(urls_criticas):
    log("🔎 GSC URL Inspection — indexação real das páginas críticas...")
    resultados = []
    try:
        svc = _gsc_service()
        for url in urls_criticas[:5]:
            try:
                resp = svc.urlInspection().index().inspect(
                    body={"inspectionUrl": url, "siteUrl": f"sc-domain:{JALECA_DOMAIN}"}
                ).execute()
                result = resp.get("inspectionResult", {})
                index  = result.get("indexStatusResult", {})
                resultados.append({
                    "url":             url,
                    "verdict":         index.get("verdict", ""),
                    "coverage_state":  index.get("coverageState", ""),
                    "last_crawl":      index.get("lastCrawlTime", ""),
                    "robots_txt_state": index.get("robotsTxtState", ""),
                    "indexing_state":  index.get("indexingState", ""),
                    "page_fetch":      index.get("pageFetchState", ""),
                })
                time.sleep(1)
            except Exception as e:
                resultados.append({"url": url, "erro": str(e)})
    except Exception as e:
        log(f"   ⚠️  URL Inspection erro: {e}")
        return []

    log(f"   ✅ {len(resultados)} URLs inspecionadas")
    return resultados


# ══════════════════════════════════════════
# 12. CANNIBALIZAÇÃO
# ══════════════════════════════════════════

def detectar_canibalizacao(gsc_paginas_criticas):
    log("⚔️  Detectando cannibalização...")
    kw_urls = defaultdict(list)
    for row in gsc_paginas_criticas:
        kw, url, imp = row.get("keyword",""), row.get("url",""), row.get("impressoes", 0)
        if kw and url and imp >= 20:
            kw_urls[kw].append({"url": url, "impressoes": imp, "posicao": row.get("posicao")})
    cann = {kw: sorted(urls, key=lambda x: x["impressoes"], reverse=True) for kw, urls in kw_urls.items() if len(urls) > 1}
    log(f"   ✅ {len(cann)} casos de cannibalização")
    return cann


# ══════════════════════════════════════════
# 12b. GAP DE KEYWORDS
# ══════════════════════════════════════════

def buscar_gap_keywords():
    log("🔍 Gap de keywords...")
    jaleca_kws = buscar_ranked(JALECA_DOMAIN, limit=200)
    jaleca_set = {k["keyword"] for k in jaleca_kws}
    gaps = []
    for c in CONCORRENTES[:5]:
        for k in buscar_ranked(c["dominio"], limit=100):
            if k["keyword"] not in jaleca_set and k.get("volume", 0) and k["volume"] >= 100:
                gaps.append({"keyword": k["keyword"], "volume": k["volume"], "concorrente": c["nome"], "pos_conc": k["position"]})
        time.sleep(1)
    seen = {}
    for g in gaps:
        kw = g["keyword"]
        if kw not in seen or g["volume"] > seen[kw]["volume"]:
            seen[kw] = g
    gaps_uniq = sorted(seen.values(), key=lambda x: x["volume"], reverse=True)
    log(f"   ✅ {len(gaps_uniq)} keywords gap")
    return gaps_uniq[:60]


# ══════════════════════════════════════════
# 12c. ANÁLISE EDITORIAL
# ══════════════════════════════════════════

def analisar_conteudo_editorial():
    log("📝 Análise editorial — Jaleca vs concorrentes...")
    urls = [{"url": f"https://{JALECA_DOMAIN}/", "tipo": "jaleca"},
            {"url": f"https://{JALECA_DOMAIN}/categoria/jalecos-femininos", "tipo": "jaleca"},
            {"url": f"https://{JALECA_DOMAIN}/jaleco-medico", "tipo": "jaleca"},
            {"url": f"https://{JALECA_DOMAIN}/scrub-feminino", "tipo": "jaleca"}] + \
           [{"url": c["url"], "tipo": "concorrente"} for c in CONCORRENTES[:5]]

    resultados = []
    for item in urls:
        result = dfs_post("content_analysis/search/live", [{"url": item["url"], "keyword": "jaleco feminino"}])
        items  = result.get("items", [])
        if items:
            r = items[0]
            resultados.append({"url": item["url"], "tipo": item["tipo"], "word_count": r.get("word_count", 0),
                                "readability": r.get("readability_score", 0), "keyword_density": r.get("keyword_density", 0),
                                "headings_count": len(r.get("headings", [])), "images_count": r.get("images_count", 0)})
        time.sleep(0.5)

    log(f"   ✅ {len(resultados)} páginas analisadas")
    return resultados


# ══════════════════════════════════════════
# 12d. SEARCH VOLUME + CPC
# ══════════════════════════════════════════

def buscar_volume_cpc():
    log("💰 Volume + CPC...")
    result = dfs_post("dataforseo_labs/google/keyword_suggestions/live",
        [{"keywords": TOP_KEYWORDS[:10], "location_code": BRASIL, "language_code": "pt", "limit": 50, "include_seed_keyword": True}])
    return sorted([
        {"keyword": i.get("keyword",""), "volume": i.get("keyword_info",{}).get("search_volume",0),
         "cpc": i.get("keyword_info",{}).get("cpc",0), "competition": i.get("keyword_info",{}).get("competition","")}
        for i in result.get("items", [])
    ], key=lambda x: x["volume"] or 0, reverse=True)


# ══════════════════════════════════════════
# 12e. GOOGLE SHOPPING
# ══════════════════════════════════════════

def monitorar_google_shopping():
    log("🛒 Google Shopping...")
    resultados = []
    for kw in ["jaleco feminino", "jaleco médico feminino", "scrub feminino", "jaleco bordado"]:
        result = dfs_post("serp/google/organic/live/advanced",
            [{"keyword": kw, "location_code": BRASIL, "language_code": "pt", "device": "desktop", "depth": 20}])
        jaleca, todos = [], []
        for item in result.get("items", []):
            if item.get("type") in ("shopping", "paid", "top_stories"):
                for sub in item.get("items", [item]):
                    url  = sub.get("url", item.get("url",""))
                    loja = sub.get("domain", item.get("domain",""))
                    e    = {"loja": loja, "titulo": sub.get("title",""), "preco": sub.get("price",""), "posicao": sub.get("rank_absolute",0)}
                    todos.append(e)
                    if "jaleca" in url.lower() or "jaleca" in loja.lower():
                        jaleca.append(e)
        resultados.append({"keyword": kw, "jaleca_aparece": len(jaleca) > 0, "jaleca_produtos": jaleca, "top5_concorrentes": todos[:5]})
        time.sleep(0.5)
    log(f"   ✅ Shopping: {len(resultados)} keywords")
    return resultados


# ══════════════════════════════════════════
# 12f. WHOIS
# ══════════════════════════════════════════

def detectar_dominios_novos():
    log("🌐 WHOIS...")
    resultados = []
    for c in CONCORRENTES:
        result = dfs_post("domain_analytics/whois/overview/live", [{"domain": c["dominio"]}])
        items  = result.get("items", [])
        if items:
            r = items[0]
            resultados.append({"dominio": c["dominio"], "criado_em": r.get("created_datetime",""), "anos_de_vida": r.get("domain_age",0)})
        time.sleep(0.3)
    return sorted(resultados, key=lambda x: x.get("anos_de_vida",999))


# ══════════════════════════════════════════
# 12g. SAÚDE TÉCNICA COMPLETA
# ══════════════════════════════════════════

def verificar_saude_tecnica(jaleca_pages, erros_scrape):
    log("🩺 Saúde técnica...")
    p = {"paginas_404": [], "canonical_incorreto": [], "sem_canonical": [], "redirect_chains": [],
         "sem_title": [], "sem_h1": [], "sem_meta_description": [], "canonical_externo": [],
         "paginas_com_noindex": [], "imagens_sem_alt": []}

    for page in jaleca_pages:
        url = page.get("url","")
        if page.get("status") == "error" or page.get("status_code",200) == 404:
            p["paginas_404"].append(url); continue
        canonical = page.get("canonical","")
        if not canonical:
            p["sem_canonical"].append(url)
        elif canonical != url and not canonical.startswith(f"https://{JALECA_DOMAIN}"):
            p["canonical_externo"].append({"url": url, "canonical": canonical})
        elif canonical != url:
            p["canonical_incorreto"].append({"url": url, "canonical": canonical})
        if page.get("redirect_url") and page["redirect_url"] != url:
            p["redirect_chains"].append({"url": url, "redirect_para": page["redirect_url"]})
        if not page.get("title"):       p["sem_title"].append(url)
        if not page.get("h1"):          p["sem_h1"].append(url)
        if not page.get("meta_description"): p["sem_meta_description"].append(url)
        if page.get("noindex"):         p["paginas_com_noindex"].append(url)
        if page.get("imgs_sem_alt"):    p["imagens_sem_alt"].append({"url": url, "imgs": page["imgs_sem_alt"]})

    log(f"   ✅ {sum(len(v) for v in p.values())} problemas técnicos")
    return p


# ══════════════════════════════════════════
# 13. OPORTUNIDADES PAA
# ══════════════════════════════════════════

def buscar_oportunidades(posicoes_jaleca):
    log("💡 Oportunidades posição 11-20 + PAA...")
    pagina_2 = sorted([p for p in posicoes_jaleca if p.get("position") and 11 <= p["position"] <= 20], key=lambda x: x["position"])

    paa = {}
    for kw in TOP_KEYWORDS[:5]:
        result = dfs_post("serp/google/organic/live/advanced",
            [{"keyword": kw, "location_code": BRASIL, "language_code": "pt", "device": "desktop", "depth": 10}])
        perguntas = [q.get("title","") for item in result.get("items",[]) if item.get("type")=="people_also_ask" for q in item.get("items",[])]
        if perguntas: paa[kw] = perguntas
        time.sleep(0.5)

    log(f"   ✅ {len(pagina_2)} na página 2, PAA para {len(paa)} keywords")
    return pagina_2, paa


# ══════════════════════════════════════════
# 14. KIMI — análise sem limite de tokens
# ══════════════════════════════════════════

def analisar_com_kimi(dados):
    log("🤖 Kimi analisando tudo (sem limite de tokens — pode levar 10-20 min)...")

    prompt = f"""Você é especialista sênior em SEO técnico e e-commerce brasileiro, com foco em moda profissional/saúde.

Analise os dados completos do site jaleca.com.br — loja de jalecos, scrubs e uniformes para área da saúde, Ipatinga/MG.

CONTEXTO CRÍTICO:
- Meta: sair de 100% tráfego branded para orgânico genérico ("jaleco feminino", "jaleco médico", etc.)
- Cannibalização corrigida em 05/05/2026: /jaleco-enfermagem, /jaleco-enfermeiro, /jaleco-enfermagem-feminino (canonical apontam para /jaleco-enfermagem)
- /jaleco-medico teve title reescrito em 05/05/2026 para "Jaleco de Médico: Feminino e Masculino..."
- Redirects blog corrigidos em 05/05/2026
- Concorrente mais agressivo: Boutique dos Jalecos (long-tail profissão + bordado)
- Nicho YMYL (saúde) — E-A-T é fator crítico de ranqueamento

=== ROBOTS.TXT ===
{json.dumps(dados['robots_txt'], ensure_ascii=False)}

=== PÁGINAS JALECA RASPADAS ({len(dados['jaleca_pages'])} páginas) ===
{json.dumps(dados['jaleca_pages'][:80], ensure_ascii=False)}

=== ERROS / 404s ===
{json.dumps(dados['erros_scrape'], ensure_ascii=False)}

=== SOFT 404s (200 com conteúdo vazio) ===
{json.dumps(dados['soft_404s'], ensure_ascii=False)}

=== DUPLICATAS (titles e H1) ===
{json.dumps(dados['duplicatas'], ensure_ascii=False)}

=== PÁGINAS ÓRFÃS ===
{json.dumps(dados['paginas_orfas'], ensure_ascii=False)}

=== SCHEMA MARKUP AUDIT ===
{json.dumps(dados['schema_audit'], ensure_ascii=False)}

=== FACETED NAVIGATION (URLs parametrizadas) ===
{json.dumps(dados['faceted_nav'], ensure_ascii=False)}

=== E-A-T AUDIT (nicho saúde) ===
{json.dumps(dados['eat_audit'], ensure_ascii=False)}

=== VERIFICAÇÃO RENDERIZAÇÃO JS ===
{json.dumps(dados['renderizacao_js'], ensure_ascii=False)}

=== ARQUITETURA DOS CONCORRENTES (categorias + nav) ===
{json.dumps(dados['arquitetura_concorrentes'], ensure_ascii=False)}

=== PREÇOS DOS CONCORRENTES ===
{json.dumps(dados['precos_concorrentes'], ensure_ascii=False)}

=== CONCORRENTES (home) ===
{json.dumps(dados['concorrentes'], ensure_ascii=False)}

=== PÁGINAS NOVAS DOS CONCORRENTES HOJE ===
{json.dumps(dados['paginas_novas'], ensure_ascii=False)}

=== KEYWORDS DO MERCADO ===
{json.dumps(dados['kw_mercado'][:100], ensure_ascii=False)}

=== KEYWORDS DOS CONCORRENTES ===
{json.dumps(dados['kw_concorrentes'], ensure_ascii=False)}

=== POSIÇÕES DIÁRIAS DA JALECA ===
{json.dumps(dados['posicoes_hoje'], ensure_ascii=False)}

=== INTENÇÃO DE BUSCA POR KEYWORD ===
{json.dumps(dados['intencao_keywords'], ensure_ascii=False)}

=== VARIAÇÕES DE POSIÇÃO (vs ontem) ===
{json.dumps(dados['variacoes_jaleca'], ensure_ascii=False)}

=== HISTÓRICO ACUMULADO (30 dias) ===
{json.dumps(dados['historico_acumulado'], ensure_ascii=False)}

=== MOVIMENTOS CONCORRENTES NAS SERPs ===
{json.dumps(dados['alertas_concorrentes'], ensure_ascii=False)}

=== BACKLINKS ===
{json.dumps(dados['backlinks'], ensure_ascii=False)}

=== CORE WEB VITALS MOBILE ===
{json.dumps(dados['cwv'], ensure_ascii=False)}

=== GSC — CTR BAIXO (28d, Brasil) ===
{json.dumps(dados['queries_ctr_baixo'], ensure_ascii=False)}

=== GSC — PERDAS DE POSIÇÃO ===
{json.dumps(dados['perdas_posicao'], ensure_ascii=False)}

=== GSC — TENDÊNCIA 90 DIAS ===
{json.dumps(dados['tendencia_90d'], ensure_ascii=False)}

=== GSC — MOBILE VS DESKTOP ===
{json.dumps(dados['gsc_por_dispositivo'], ensure_ascii=False)}

=== GSC — PÁGINAS CRÍTICAS MONITORADAS ===
{json.dumps(dados['gsc_paginas_criticas'], ensure_ascii=False)}

=== GSC URL INSPECTION — INDEXAÇÃO REAL ===
{json.dumps(dados['indexacao_gsc'], ensure_ascii=False)}

=== GSC — POR PÁGINA ===
{json.dumps(dados['gsc_por_pagina'][:50], ensure_ascii=False)}

=== GSC — POSIÇÃO 4-20 ===
{json.dumps(dados['gsc_pos_4_20'], ensure_ascii=False)}

=== CANNIBALIZAÇÃO ===
{json.dumps(dados['cannibalizacao'], ensure_ascii=False)}

=== GAP DE KEYWORDS ===
{json.dumps(dados['gap_keywords'], ensure_ascii=False)}

=== SAÚDE TÉCNICA ===
{json.dumps(dados['saude_tecnica'], ensure_ascii=False)}

=== KEYWORDS PÁGINA 2 ===
{json.dumps(dados['pagina_2'], ensure_ascii=False)}

=== PEOPLE ALSO ASK ===
{json.dumps(dados['paa'], ensure_ascii=False)}

=== ANÁLISE EDITORIAL ===
{json.dumps(dados['conteudo_editorial'], ensure_ascii=False)}

=== VOLUME + CPC ===
{json.dumps(dados['volume_cpc'], ensure_ascii=False)}

=== GOOGLE SHOPPING ===
{json.dumps(dados['google_shopping'], ensure_ascii=False)}

=== WHOIS CONCORRENTES ===
{json.dumps(dados['dominios_novos'], ensure_ascii=False)}

---

GERE O RELATÓRIO MAIS DETALHADO E ESPECÍFICO POSSÍVEL. Não use termos vagos. Cite URLs reais, dê exemplos concretos de titles, metas, conteúdo. Use todos os dados acima.

## 🚨 ALERTAS DO DIA
- Páginas novas dos concorrentes + como responder
- Movimentos de posição de concorrentes + por quê
- Variações da Jaleca vs ontem + vs tendência 30 dias
- Alertas de cannibalização ativos

## 1. RESUMO EXECUTIVO
- Score SEO geral (0-100) com justificativa detalhada
- Por que a Jaleca não aparece para buscas genéricas (diagnóstico objetivo)
- Top 5 problemas críticos (URL específica + impacto estimado)
- Top 5 oportunidades (URL específica + ação concreta)

## 2. SAÚDE TÉCNICA COMPLETA
- 404s reais e soft 404s (liste URLs)
- Canonicals incorretos e externos
- Redirect chains
- Títulos e H1 duplicados entre páginas (risco de confusão)
- Páginas órfãs sem links internos
- robots.txt: bloqueios críticos?
- Imagens sem alt text (URLs + quantidade)
- Páginas com noindex inesperado

## 3. SCHEMA MARKUP
- Produtos sem Product schema (liste URLs)
- Schema com campos faltando (quais campos + quais URLs)
- Quantas páginas têm AggregateRating? Quantas deveriam ter?
- Oportunidades de FAQ schema não aproveitadas
- Recomendações específicas por tipo de página

## 4. E-A-T — NICHO SAÚDE
- Páginas sem autor identificado (lista completa)
- Páginas sem links para órgãos de saúde (COFEN, CFM, ANVISA)
- O que adicionar para aumentar E-A-T nas páginas de profissão
- Comparação com concorrentes: eles têm mais sinais de E-A-T?

## 5. FACETED NAVIGATION
- URLs parametrizadas detectadas — estão canonicalizadas?
- Risco de thin content em massa por filtros
- Recomendação: noindex, canonical ou URL limpa para cada caso

## 6. INTENÇÃO DE BUSCA
- Quais keywords transacionais a Jaleca não está rankeando?
- Páginas atuais correspondem à intenção correta?
- Exemplos concretos de desalinhamento intenção × conteúdo

## 7. CANNIBALIZAÇÃO — DIAGNÓSTICO COMPLETO
- Todos os casos detectados (keyword → URLs em conflito)
- Qual URL deve ser a "dona" e por quê
- Ação recomendada (canonical, 301, consolidar)
- Status das correções feitas em 05/05: já aparece no GSC?

## 8. OPORTUNIDADES RÁPIDAS — POSIÇÃO 4-20
- Keywords com 50+ impressões quase na página 1
- Para cada: URL atual + o que fazer exatamente
- Destaque keywords cidade×profissão

## 9. GSC — AÇÕES URGENTES
- Queries CTR baixo: reescreva title e meta (exemplos reais)
- Páginas que perderam posição: diagnóstico + solução
- Mobile vs desktop: se CTR mobile for muito menor, problema de UX

## 10. PÁGINAS CRÍTICAS — STATUS DETALHADO
- Para cada URL em PAGINAS_CRITICAS: posição, tendência, CTR, indexação real (URL Inspection)
- /jaleco-enfermagem: a correção do canonical de 05/05 já surtiu efeito?
- /jaleco-medico: o novo title melhorou o CTR?

## 11. GAP DE KEYWORDS
- Top 30 gaps por volume: concorrente + URL a criar/otimizar
- Gaps de cidade×profissão
- Gaps de profissão não coberta

## 12. GSC — PÁGINAS COM ALTO IMPRESSÃO, CTR BAIXO
- Páginas com 500+ impressões e CTR abaixo de 3%
- Reescreva title e meta com exemplos concretos

## 13. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO
- Perguntas para FAQs ou posts (priorize por relevância comercial)

## 14. CONTEÚDO FRACO
- Páginas < 400 palavras: o que adicionar especificamente
- Comparação word count Jaleca vs concorrentes por página

## 15. PERFORMANCE
- Páginas com CWV score < 70: o que corrigir
- Diferença mobile vs desktop

## 16. GOOGLE SHOPPING
- Jaleca aparece? Em qual posição?
- Quem domina? O que fazer (feed, título, preço)

## 17. INTELIGÊNCIA COMPETITIVA
- Preços dos concorrentes: Jaleca está competitiva?
- Arquitetura dos concorrentes: o que copiar (e melhorar)?
- Quem lançou páginas novas hoje e qual a estratégia?

## 18. E-COMMERCE — PRODUTOS E ESTOQUE
- Páginas de produto com conteúdo vazio ou thin
- Produtos sem schema Product
- Recomendações de descrição de produto

## 19. RENDERIZAÇÃO JS
- Conteúdo invisível para o Googlebot detectado?
- URLs afetadas e solução

## 20. PLANO DE AÇÃO

### ⚡ FAZER AGORA (próxima sessão do Claude Code)
| URL | O que fazer exatamente | Impacto | Tempo |
(Máximo 5 ações de maior ROI)

### 📅 ESTA SEMANA
| URL / Escopo | O que fazer | Impacto |

### 📆 ESTE MÊS
| O que fazer | Impacto |

Seja cirúrgico. Cada recomendação deve ter URL real, ação específica e exemplo concreto."""

    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://jaleca.com.br",
            "X-Title": "Jaleca SEO Night v4"
        },
        json={
            "model":    KIMI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=1200
    )
    data = r.json()
    return data["choices"][0]["message"]["content"]


# ══════════════════════════════════════════
# SALVAR — gera arquivo para revisão humana
# ══════════════════════════════════════════

def salvar(dados, analise):
    raw_file    = f"{OUTPUT_DIR}/noite_raw_{TIMESTAMP}.json"
    report_file = f"{OUTPUT_DIR}/noite_relatorio_{TIMESTAMP}.md"

    with open(raw_file, "w") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

    with open(report_file, "w") as f:
        f.write(f"# Relatório SEO Noturno v4 — Jaleca\n")
        f.write(f"**Data:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"**Páginas:** {len(dados['jaleca_pages'])} | **Keywords:** {len(dados['kw_mercado'])}\n\n")
        f.write(f"**INSTRUÇÕES:** Envie este arquivo para análise. Não salve na memória do Claude.\n\n---\n\n")
        f.write(analise)

    # Atualiza apenas o ponteiro para o último relatório (arquivo mínimo)
    with open(f"{HISTORY_DIR}/ultima-auditoria-noturna.md", "w") as f:
        f.write(f"# Última Auditoria Noturna\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"Relatório completo: {report_file}\n")
        f.write(f"Raw data: {raw_file}\n")
        f.write(f"Páginas auditadas: {len(dados['jaleca_pages'])}\n")
        f.write(f"Keywords monitoradas: {len(TOP_KEYWORDS)}\n")
        f.write(f"\n> Abra o relatório acima para análise completa.\n")
        f.write(f"> Não leia este arquivo como substituto — ele é só um ponteiro.\n")

    log(f"✅ Relatório: {report_file}")
    log(f"✅ Raw:       {raw_file}")
    return report_file


# ══════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════

def main():
    inicio = time.time()
    print("=" * 60)
    print("🌙 AUDITORIA NOTURNA COMPLETA v4 — JALECA")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)

    urls                               = get_urls_jaleca()
    robots_txt                         = verificar_robots_txt()
    jaleca_pages, erros_scrape         = raspar_jaleca(urls)
    soft_404s                          = detectar_soft_404s(jaleca_pages)
    duplicatas                         = detectar_duplicatas(jaleca_pages)
    paginas_orfas                      = detectar_paginas_orfas(jaleca_pages, urls)
    schema_audit                       = auditar_schema(jaleca_pages)
    faceted_nav                        = analisar_faceted_navigation(urls)
    eat_audit                          = auditar_eat(jaleca_pages)
    renderizacao_js                    = verificar_renderizacao_js(urls)
    arquitetura_concorrentes           = analisar_arquitetura_concorrentes()
    precos_concorrentes                = monitorar_precos_concorrentes()
    concorrentes                       = raspar_concorrentes()
    paginas_novas                      = detectar_paginas_novas_concorrentes()
    kw_mercado                         = buscar_keywords_mercado()
    kw_concorrentes                    = buscar_keywords_concorrentes()
    posicoes_hoje, variacoes           = buscar_posicoes_diarias()
    historico_acumulado                = buscar_historico_acumulado()
    serp_conc, alertas_conc            = monitorar_serp_concorrentes()
    backlinks                          = buscar_backlinks()
    cwv                                = buscar_cwv(urls)
    queries_ctr_baixo, perdas, t90d    = buscar_dados_gsc()
    gsc_por_dispositivo                = buscar_gsc_por_dispositivo()
    gsc_paginas_criticas               = buscar_gsc_paginas_criticas()
    indexacao_gsc                      = verificar_indexacao_gsc(PAGINAS_CRITICAS)
    gsc_por_pagina                     = buscar_gsc_por_pagina()
    gsc_pos_4_20                       = buscar_gsc_posicao_4_20()
    intencao_keywords                  = classificar_intencao_keywords(posicoes_hoje, gsc_pos_4_20)
    cannibalizacao                     = detectar_canibalizacao(gsc_paginas_criticas)
    gap_keywords                       = buscar_gap_keywords()
    conteudo_editorial                 = analisar_conteudo_editorial()
    volume_cpc                         = buscar_volume_cpc()
    google_shopping                    = monitorar_google_shopping()
    dominios_novos                     = detectar_dominios_novos()
    saude_tecnica                      = verificar_saude_tecnica(jaleca_pages, erros_scrape)
    pagina_2, paa                      = buscar_oportunidades(posicoes_hoje)

    dados = {
        "timestamp":               TIMESTAMP,
        "robots_txt":              robots_txt,
        "jaleca_pages":            jaleca_pages,
        "erros_scrape":            erros_scrape,
        "soft_404s":               soft_404s,
        "duplicatas":              duplicatas,
        "paginas_orfas":           paginas_orfas,
        "schema_audit":            schema_audit,
        "faceted_nav":             faceted_nav,
        "eat_audit":               eat_audit,
        "renderizacao_js":         renderizacao_js,
        "arquitetura_concorrentes":arquitetura_concorrentes,
        "precos_concorrentes":     precos_concorrentes,
        "concorrentes":            concorrentes,
        "paginas_novas":           paginas_novas,
        "kw_mercado":              kw_mercado,
        "kw_concorrentes":         kw_concorrentes,
        "posicoes_hoje":           posicoes_hoje,
        "intencao_keywords":       intencao_keywords,
        "variacoes_jaleca":        variacoes,
        "historico_acumulado":     historico_acumulado,
        "serp_concorrentes":       serp_conc,
        "alertas_concorrentes":    alertas_conc,
        "backlinks":               backlinks,
        "cwv":                     cwv,
        "queries_ctr_baixo":       queries_ctr_baixo,
        "perdas_posicao":          perdas,
        "tendencia_90d":           t90d,
        "gsc_por_dispositivo":     gsc_por_dispositivo,
        "gsc_paginas_criticas":    gsc_paginas_criticas,
        "indexacao_gsc":           indexacao_gsc,
        "gsc_por_pagina":          gsc_por_pagina,
        "gsc_pos_4_20":            gsc_pos_4_20,
        "cannibalizacao":          cannibalizacao,
        "gap_keywords":            gap_keywords,
        "conteudo_editorial":      conteudo_editorial,
        "volume_cpc":              volume_cpc,
        "google_shopping":         google_shopping,
        "dominios_novos":          dominios_novos,
        "saude_tecnica":           saude_tecnica,
        "pagina_2":                pagina_2,
        "paa":                     paa,
    }

    analise = analisar_com_kimi(dados)
    report  = salvar(dados, analise)

    duracao = int(time.time() - inicio)
    print("\n" + "=" * 60)
    print(f"🎉 CONCLUÍDO em {duracao//60}min {duracao%60}s")
    print(f"📄 Relatório gerado: {report}")
    print(f"\n⚠️  INSTRUÇÃO: Envie o arquivo acima para análise.")
    print(f"    NÃO salve o conteúdo na memória do Claude.")
    print(f"    Abra o arquivo e leia diretamente para análise.")
    print("=" * 60)


if __name__ == "__main__":
    main()
