#!/usr/bin/env python3
"""
Script Noturno Completo v2 — Jaleca SEO
=========================================
1.  Sitemap da Jaleca
2.  Raspa páginas da Jaleca (scraper local — sem Firecrawl)
3.  Raspa concorrentes (scraper local — sem Firecrawl)
4.  Detecta páginas NOVAS dos concorrentes (compara com dia anterior)
5.  Keywords do mercado (DataForSEO)
6.  Keywords dos concorrentes (DataForSEO)
7.  Posições DIÁRIAS da Jaleca no Google — top 50 keywords (DataForSEO)
8.  Monitoramento SERP — detecta quando concorrente sobe/cai posição
9.  Backlinks Jaleca vs concorrentes (DataForSEO)
10. Core Web Vitals mobile (DataForSEO)
11. GSC diário — queries com CTR baixo + páginas que perderam posição
12. Saúde técnica — canonicals, 404s, redirect chains
13. Oportunidades — keywords posição 11-20 + People Also Ask
14. Kimi analisa TUDO e gera relatório completo

Rodar à noite:
cd ~/sitejaleca/jaleca-nextjs
source .venv/bin/activate
python3 tools/kimi/noite_seo_completo.py
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
]

KEYWORDS_SEMENTE = TOP_KEYWORDS[:12]

DFS_HEADERS = {
    "Authorization": f"Basic {DFS_AUTH}",
    "Content-Type": "application/json"
}
BRASIL = 2076  # location_code correto para Brasil no DataForSEO


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
    r = requests.get(SITEMAP_URL, timeout=30)
    root = ET.fromstring(r.content)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [u.find("sm:loc", ns).text for u in root.findall("sm:url", ns)]
    log(f"   ✅ {len(urls)} URLs")
    return urls


# ══════════════════════════════════════════
# 2. SCRAPER LOCAL — raspar Jaleca (sem Firecrawl)
# ══════════════════════════════════════════

SCRAPE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JalecaSEOBot/1.0)",
    "Accept-Language": "pt-BR,pt;q=0.9"
}

def _html_to_markdown(soup):
    """Converte body da página em texto limpo para o Kimi processar."""
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    return " ".join(soup.get_text(separator=" ").split())[:6000]


def _extrair_basico(url, soup, status_code, redirect_url):
    """Extrai campos SEO sem LLM (rápido, zero custo)."""
    title_tag = soup.find("title")
    h1_tag    = soup.find("h1")
    meta_desc = soup.find("meta", attrs={"name": re.compile("description", re.I)})
    canonical = soup.find("link", rel="canonical")
    h2_tags   = [h.get_text(strip=True) for h in soup.find_all("h2")]
    imgs      = soup.find_all("img")

    # Schema.org types
    schema_blocks = soup.find_all("script", attrs={"type": "application/ld+json"})
    schema_types  = []
    for blk in schema_blocks:
        try:
            d = json.loads(blk.string or "")
            t = d.get("@type") if isinstance(d, dict) else None
            if t:
                schema_types.append(t if isinstance(t, str) else str(t))
        except Exception:
            pass

    text = _html_to_markdown(soup)
    word_count = len(text.split())

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
        "has_images":       len(imgs) > 0,
        "image_count":      len(imgs),
    }


def scrape(url):
    """
    Substitui o Firecrawl: faz fetch direto + extração local via BeautifulSoup.
    Zero créditos externos — usa só requests + bs4.
    """
    try:
        resp = requests.get(url, headers=SCRAPE_HEADERS, timeout=20, allow_redirects=True)
        redirect_url = resp.url if resp.url != url else ""
        soup = BeautifulSoup(resp.content, "html.parser")
        return _extrair_basico(url, soup, resp.status_code, redirect_url)
    except requests.exceptions.HTTPError as e:
        return {"url": url, "status": "error", "error": f"HTTP {e.response.status_code}"}
    except Exception as e:
        return {"url": url, "status": "error", "error": str(e)}


def raspar_jaleca(urls):
    log(f"🔍 Raspando {len(urls)} páginas da Jaleca...")
    results = []
    for i, url in enumerate(urls, 1):
        print(f"   [{i:3}/{len(urls)}] {url[:65]}", end=" ", flush=True)
        r = scrape(url)
        results.append(r)
        print("✅" if r["status"] == "ok" else "❌")
        time.sleep(0.5)
    ok = sum(1 for r in results if r["status"] == "ok")
    erros = [r for r in results if r["status"] != "ok"]
    log(f"   📊 {ok} ok / {len(urls)-ok} erros")
    return results, erros


# ══════════════════════════════════════════
# 3. SCRAPER LOCAL — raspar concorrentes (sem Firecrawl)
# ══════════════════════════════════════════

def raspar_concorrentes():
    log("🔍 Raspando home dos concorrentes...")
    results = []
    for c in CONCORRENTES:
        print(f"   {c['nome']}...", end=" ", flush=True)
        r = scrape(c["url"])
        r["concorrente"] = c["nome"]
        r["dominio"] = c["dominio"]
        results.append(r)
        print("✅" if r["status"] == "ok" else "❌")
        time.sleep(1)
    return results


# ══════════════════════════════════════════
# 4. DETECTAR PÁGINAS NOVAS DOS CONCORRENTES
# ══════════════════════════════════════════

def get_sitemap_urls(sitemap_url):
    try:
        r = requests.get(sitemap_url, timeout=15)
        root = ET.fromstring(r.content)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        return set(u.find("sm:loc", ns).text for u in root.findall("sm:url", ns))
    except:
        return set()


def detectar_paginas_novas_concorrentes():
    log("🆕 Detectando páginas novas dos concorrentes...")
    novidades = {}

    for c in CONCORRENTES:
        cache_file = f"{CACHE_DIR}/sitemap_{c['dominio']}_{YESTERDAY}.json"
        hoje_urls = get_sitemap_urls(c["sitemap"])

        # Carrega cache de ontem
        ontem_urls = set()
        if os.path.exists(cache_file):
            with open(cache_file) as f:
                ontem_urls = set(json.load(f))

        # Salva cache de hoje
        cache_hoje = f"{CACHE_DIR}/sitemap_{c['dominio']}_{TODAY}.json"
        with open(cache_hoje, "w") as f:
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
    items = result.get("items", [])
    kws = sorted([
        {
            "keyword":    i["keyword"],
            "volume":     i.get("keyword_info", {}).get("search_volume", 0),
            "cpc":        i.get("keyword_info", {}).get("cpc", 0),
            "difficulty": i.get("keyword_properties", {}).get("keyword_difficulty", 0)
        }
        for i in items
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
    items = result.get("items", [])
    return sorted([
        {
            "keyword":  i.get("keyword_data", {}).get("keyword", ""),
            "position": i.get("ranked_serp_element", {}).get("serp_item", {}).get("rank_absolute", 0),
            "volume":   i.get("keyword_data", {}).get("keyword_info", {}).get("search_volume", 0)
        }
        for i in items
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
# 7. POSIÇÕES DIÁRIAS JALECA — top 50 keywords
# ══════════════════════════════════════════

def buscar_posicoes_diarias():
    log("📈 Posições diárias da Jaleca (top 50 keywords)...")

    # Busca posições atuais para as top keywords
    posicoes_hoje = []
    for kw in TOP_KEYWORDS:
        result = dfs_post(
            "serp/google/organic/live/advanced",
            [{
                "keyword":       kw,
                "location_code": BRASIL,
                "language_code": "pt",
                "device":        "desktop",
                "depth":         20
            }]
        )
        items = result.get("items", [])
        # Procura Jaleca no resultado
        jaleca_pos = None
        for item in items:
            if item.get("type") == "organic" and JALECA_DOMAIN in item.get("url", ""):
                jaleca_pos = {
                    "keyword":  kw,
                    "position": item.get("rank_absolute"),
                    "url":      item.get("url"),
                    "title":    item.get("title")
                }
                break
        if not jaleca_pos:
            jaleca_pos = {"keyword": kw, "position": None, "url": None, "title": None}
        posicoes_hoje.append(jaleca_pos)
        time.sleep(0.5)

    # Salva snapshot de hoje
    snapshot_file = f"{CACHE_DIR}/posicoes_jaleca_{TODAY}.json"
    with open(snapshot_file, "w") as f:
        json.dump(posicoes_hoje, f, ensure_ascii=False, indent=2)

    # Compara com ontem
    snapshot_ontem = f"{CACHE_DIR}/posicoes_jaleca_{YESTERDAY}.json"
    variacoes = []
    if os.path.exists(snapshot_ontem):
        with open(snapshot_ontem) as f:
            ontem = {p["keyword"]: p["position"] for p in json.load(f)}
        for p in posicoes_hoje:
            pos_hoje = p["position"]
            pos_ontem = ontem.get(p["keyword"])
            if pos_hoje and pos_ontem:
                delta = pos_ontem - pos_hoje  # positivo = subiu
                if abs(delta) >= 2:
                    variacoes.append({
                        "keyword": p["keyword"],
                        "ontem":   pos_ontem,
                        "hoje":    pos_hoje,
                        "delta":   delta,
                        "movimento": "⬆️ SUBIU" if delta > 0 else "⬇️ CAIU"
                    })

    log(f"   ✅ {len(posicoes_hoje)} keywords monitoradas, {len(variacoes)} variações")
    return posicoes_hoje, variacoes


# ══════════════════════════════════════════
# 8. MONITORAMENTO SERP — concorrentes
# ══════════════════════════════════════════

def monitorar_serp_concorrentes():
    log("🔭 Monitorando SERP dos concorrentes (top 10 keywords)...")
    serp_hoje = {}

    for kw in TOP_KEYWORDS[:10]:
        result = dfs_post(
            "serp/google/organic/live/advanced",
            [{
                "keyword":       kw,
                "location_code": BRASIL,
                "language_code": "pt",
                "device":        "desktop",
                "depth":         10
            }]
        )
        items = result.get("items", [])
        posicoes = []
        for item in items:
            if item.get("type") == "organic":
                dominio = item.get("domain", "")
                posicoes.append({
                    "position": item.get("rank_absolute"),
                    "dominio":  dominio,
                    "url":      item.get("url"),
                    "title":    item.get("title")
                })
        serp_hoje[kw] = posicoes
        time.sleep(0.5)

    # Salva snapshot
    snapshot_file = f"{CACHE_DIR}/serp_concorrentes_{TODAY}.json"
    with open(snapshot_file, "w") as f:
        json.dump(serp_hoje, f, ensure_ascii=False, indent=2)

    # Compara com ontem
    alertas = []
    snapshot_ontem = f"{CACHE_DIR}/serp_concorrentes_{YESTERDAY}.json"
    if os.path.exists(snapshot_ontem):
        with open(snapshot_ontem) as f:
            ontem_data = json.load(f)
        for kw, posicoes in serp_hoje.items():
            ontem_posicoes = {p["dominio"]: p["position"] for p in ontem_data.get(kw, [])}
            for p in posicoes:
                dom = p["dominio"]
                pos_hoje = p["position"]
                pos_ontem = ontem_posicoes.get(dom)
                if pos_hoje and pos_ontem and abs(pos_ontem - pos_hoje) >= 2:
                    delta = pos_ontem - pos_hoje
                    alertas.append({
                        "keyword":    kw,
                        "dominio":    dom,
                        "ontem":      pos_ontem,
                        "hoje":       pos_hoje,
                        "delta":      delta,
                        "movimento":  "⬆️ SUBIU" if delta > 0 else "⬇️ CAIU"
                    })

    log(f"   ✅ {len(TOP_KEYWORDS[:10])} keywords monitoradas, {len(alertas)} movimentos de concorrentes")
    return serp_hoje, alertas


# ══════════════════════════════════════════
# 9. BACKLINKS
# ══════════════════════════════════════════

def buscar_backlinks():
    log("🔗 Backlinks Jaleca vs concorrentes...")
    dominios = [JALECA_DOMAIN] + [c["dominio"] for c in CONCORRENTES[:4]]
    resultados = {}
    for dominio in dominios:
        result = dfs_post(
            "backlinks/summary/live",
            [{"target": dominio, "include_subdomains": True}]
        )
        resultados[dominio] = {
            "backlinks":         result.get("backlinks", 0),
            "referring_domains": result.get("referring_domains", 0),
            "rank":              result.get("rank", 0),
            "spam_score":        result.get("spam_score", 0)
        }
        log(f"   ✅ {dominio}: {resultados[dominio]['backlinks']} backlinks")
        time.sleep(1)
    return resultados


# ══════════════════════════════════════════
# 10. CORE WEB VITALS
# ══════════════════════════════════════════

def buscar_cwv(urls):
    log("⚡ Core Web Vitals mobile...")
    amostra = ["https://jaleca.com.br"] + [u for u in urls if "/produto" in u or "/categoria" in u][:4]
    resultados = []
    for url in amostra:
        result = dfs_post(
            "on_page/lighthouse/live/json",
            [{"url": url, "device": "mobile"}]
        )
        cats = result.get("categories", {})
        resultados.append({
            "url":            url,
            "performance":    round(cats.get("performance", {}).get("score", 0) * 100),
            "seo":            round(cats.get("seo", {}).get("score", 0) * 100),
            "accessibility":  round(cats.get("accessibility", {}).get("score", 0) * 100),
            "best_practices": round(cats.get("best-practices", {}).get("score", 0) * 100),
        })
        time.sleep(2)
    log(f"   ✅ {len(resultados)} páginas")
    return resultados


# ══════════════════════════════════════════
# 11. GSC DIÁRIO — CTR baixo + perdas de posição
# ══════════════════════════════════════════

def buscar_dados_gsc():
    log("📊 GSC — queries com CTR baixo e perdas de posição...")

    hoje = datetime.now().strftime("%Y-%m-%d")
    semana_atras = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    duas_semanas = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")

    # Queries com impressões altas e CTR baixo (esta semana)
    result_semana = dfs_post(
        "keywords_data/google_search_console/errors/live",
        [{
            "website":        f"https://{JALECA_DOMAIN}",
            "date_from":      semana_atras,
            "date_to":        hoje,
            "search_type":    "web",
            "location_code":  BRASIL,
            "language_code":  "pt"
        }]
    )

    # Busca dados de performance
    result_perf = dfs_post(
        "keywords_data/google_search_console/live",
        [{
            "website":       f"https://{JALECA_DOMAIN}",
            "date_from":     semana_atras,
            "date_to":       hoje,
            "search_type":   "web",
            "location_code": BRASIL,
            "language_code": "pt"
        }]
    )

    queries_ctr_baixo = []
    perdas_posicao = []

    items = result_perf.get("items", [])
    for item in items:
        impressoes = item.get("impressions", 0)
        ctr = item.get("ctr", 0)
        posicao = item.get("position", 0)
        keyword = item.get("keyword", "")

        # CTR baixo com muitas impressões
        if impressoes > 100 and ctr < 0.05:
            queries_ctr_baixo.append({
                "keyword":    keyword,
                "impressoes": impressoes,
                "ctr":        round(ctr * 100, 2),
                "posicao":    round(posicao, 1),
                "problema":   "Título/meta description fraco — reescrever"
            })

    # Compara posições com semana anterior
    result_anterior = dfs_post(
        "keywords_data/google_search_console/live",
        [{
            "website":       f"https://{JALECA_DOMAIN}",
            "date_from":     duas_semanas,
            "date_to":       semana_atras,
            "search_type":   "web",
            "location_code": BRASIL,
            "language_code": "pt"
        }]
    )

    posicoes_anterior = {i.get("keyword"): i.get("position") for i in result_anterior.get("items", [])}
    for item in items:
        kw = item.get("keyword")
        pos_atual = item.get("position", 0)
        pos_ant = posicoes_anterior.get(kw)
        if pos_ant and pos_atual and pos_atual - pos_ant > 3:
            perdas_posicao.append({
                "keyword":        kw,
                "posicao_antes":  round(pos_ant, 1),
                "posicao_agora":  round(pos_atual, 1),
                "queda":          round(pos_atual - pos_ant, 1)
            })

    queries_ctr_baixo.sort(key=lambda x: x["impressoes"], reverse=True)
    perdas_posicao.sort(key=lambda x: x["queda"], reverse=True)

    log(f"   ✅ {len(queries_ctr_baixo)} queries CTR baixo, {len(perdas_posicao)} perdas de posição")
    return queries_ctr_baixo[:20], perdas_posicao[:20]


# ══════════════════════════════════════════
# 12. SAÚDE TÉCNICA — canonicals, 404s
# ══════════════════════════════════════════

def verificar_saude_tecnica(jaleca_pages, erros_scrape):
    log("🩺 Verificando saúde técnica...")

    problemas = {
        "paginas_404":           [],
        "canonical_incorreto":   [],
        "sem_canonical":         [],
        "redirect_chains":       [],
        "sem_title":             [],
        "sem_h1":                [],
        "sem_meta_description":  []
    }

    for p in jaleca_pages:
        url = p.get("url", "")

        if p.get("status") == "error":
            problemas["paginas_404"].append(url)
            continue

        canonical = p.get("canonical", "")
        if not canonical:
            problemas["sem_canonical"].append(url)
        elif canonical != url and not canonical.startswith("https://jaleca.com.br"):
            problemas["canonical_incorreto"].append({"url": url, "canonical": canonical})

        redirect = p.get("redirect_url", "")
        if redirect and redirect != url:
            problemas["redirect_chains"].append({"url": url, "redirect_para": redirect})

        if not p.get("title"):
            problemas["sem_title"].append(url)

        if not p.get("h1"):
            problemas["sem_h1"].append(url)

        if not p.get("meta_description"):
            problemas["sem_meta_description"].append(url)

    total = sum(len(v) for v in problemas.values())
    log(f"   ✅ {total} problemas técnicos encontrados")
    return problemas


# ══════════════════════════════════════════
# 13. OPORTUNIDADES — posição 11-20 + PAA
# ══════════════════════════════════════════

def buscar_oportunidades(posicoes_jaleca):
    log("💡 Oportunidades — keywords posição 11-20...")

    # Keywords em posição 11-20 (página 2 do Google — fáceis de empurrar)
    pagina_2 = [
        p for p in posicoes_jaleca
        if p.get("position") and 11 <= p["position"] <= 20
    ]
    pagina_2.sort(key=lambda x: x["position"])
    log(f"   ✅ {len(pagina_2)} keywords na página 2")

    # People Also Ask para top 5 keywords
    log("💡 People Also Ask...")
    paa_resultados = {}
    for kw in TOP_KEYWORDS[:5]:
        result = dfs_post(
            "serp/google/organic/live/advanced",
            [{
                "keyword":       kw,
                "location_code": BRASIL,
                "language_code": "pt",
                "device":        "desktop",
                "depth":         10
            }]
        )
        items = result.get("items", [])
        paa = []
        for item in items:
            if item.get("type") == "people_also_ask":
                for q in item.get("items", []):
                    paa.append(q.get("title", ""))
        if paa:
            paa_resultados[kw] = paa
        time.sleep(0.5)

    log(f"   ✅ PAA coletado para {len(paa_resultados)} keywords")
    return pagina_2, paa_resultados


# ══════════════════════════════════════════
# 14. KIMI — análise completa
# ══════════════════════════════════════════

def analisar_com_kimi(dados):
    log("🤖 Kimi analisando tudo (5-10 min)...")

    prompt = f"""Você é especialista sênior em SEO técnico e e-commerce brasileiro.

Analise os dados completos do site jaleca.com.br — loja de jalecos, scrubs e uniformes para área da saúde, em Ipatinga/MG.

PROBLEMA CENTRAL: O site tem 100% tráfego branded e zero tráfego orgânico genérico. Meta: rankeam para "jaleco feminino", "jaleco médico" e similares.

=== PÁGINAS JALECA ({len(dados['jaleca_pages'])} páginas) ===
{json.dumps(dados['jaleca_pages'], ensure_ascii=False)}

=== ERROS DE RASPAGEM ===
{json.dumps(dados['erros_scrape'], ensure_ascii=False)}

=== CONCORRENTES ===
{json.dumps(dados['concorrentes'], ensure_ascii=False)}

=== PÁGINAS NOVAS DOS CONCORRENTES HOJE ===
{json.dumps(dados['paginas_novas'], ensure_ascii=False)}

=== KEYWORDS DO MERCADO ===
{json.dumps(dados['kw_mercado'][:100], ensure_ascii=False)}

=== KEYWORDS DOS CONCORRENTES ===
{json.dumps(dados['kw_concorrentes'], ensure_ascii=False)}

=== POSIÇÕES DIÁRIAS DA JALECA ===
{json.dumps(dados['posicoes_hoje'], ensure_ascii=False)}

=== VARIAÇÕES DE POSIÇÃO DA JALECA (vs ontem) ===
{json.dumps(dados['variacoes_jaleca'], ensure_ascii=False)}

=== MOVIMENTOS DE CONCORRENTES NAS SERPs ===
{json.dumps(dados['alertas_concorrentes'], ensure_ascii=False)}

=== BACKLINKS ===
{json.dumps(dados['backlinks'], ensure_ascii=False)}

=== CORE WEB VITALS MOBILE ===
{json.dumps(dados['cwv'], ensure_ascii=False)}

=== GSC — QUERIES COM CTR BAIXO ===
{json.dumps(dados['queries_ctr_baixo'], ensure_ascii=False)}

=== GSC — PÁGINAS QUE PERDERAM POSIÇÃO ===
{json.dumps(dados['perdas_posicao'], ensure_ascii=False)}

=== SAÚDE TÉCNICA ===
{json.dumps(dados['saude_tecnica'], ensure_ascii=False)}

=== KEYWORDS NA PÁGINA 2 (posição 11-20) ===
{json.dumps(dados['pagina_2'], ensure_ascii=False)}

=== PEOPLE ALSO ASK ===
{json.dumps(dados['paa'], ensure_ascii=False)}

GERE RELATÓRIO COMPLETO:

## 🚨 ALERTAS DO DIA
- Páginas novas dos concorrentes (o que lançaram e como responder)
- Movimentos de posição de concorrentes (quem subiu/caiu e por quê)
- Variações de posição da Jaleca (o que melhorou/piorou)

## 1. RESUMO EXECUTIVO
- Score SEO geral (0-100)
- Por que a Jaleca não aparece para buscas genéricas
- Top 5 problemas críticos hoje
- Top 5 oportunidades imediatas

## 2. SAÚDE TÉCNICA
- 404s, canonicals incorretos, redirect chains
- Páginas sem title, H1, meta description
- Liste URLs específicas para cada problema

## 3. OPORTUNIDADES RÁPIDAS — PÁGINA 2
- Keywords em posição 11-20 que podem subir para página 1
- Para cada: o que fazer para empurrar (melhorar title? mais conteúdo? backlink?)

## 4. GSC — AÇÕES URGENTES
- Queries com CTR baixo: reescreva o title e meta description (dê exemplos)
- Páginas que perderam posição: diagnóstico e solução

## 5. GAP DE KEYWORDS
- Top 30 keywords que concorrentes rankeiam e Jaleca não
- Para cada: volume, dificuldade, página para criar ou otimizar

## 6. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO
- Perguntas frequentes para criar FAQs ou posts de blog
- Priorize por volume e relevância

## 7. CONTEÚDO FRACO
- Páginas com menos de 400 palavras (liste URLs)
- Sugestão de tópicos para enriquecer cada uma

## 8. BACKLINKS
- Comparação Jaleca vs concorrentes
- Como conseguir backlinks para jaleca.com.br (sites de saúde, faculdades, blogs médicos)

## 9. PERFORMANCE
- Páginas com score abaixo de 70
- O que corrigir

## 10. PLANO DE AÇÃO DE HOJE

### ⚡ FAZER AGORA (esta sessão do Claude Code)
URL | O que fazer | Impacto | Tempo estimado

### 📅 ESTA SEMANA
URL | O que fazer | Impacto

### 📆 ESTE MÊS
O que fazer | Impacto

Seja extremamente específico. Cite URLs reais. Dê exemplos concretos de títulos, metas e conteúdo melhorado."""

    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://jaleca.com.br",
            "X-Title": "Jaleca SEO Night v2"
        },
        json={
            "model": KIMI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 16000
        },
        timeout=600
    )
    data = r.json()
    return data["choices"][0]["message"]["content"]


# ══════════════════════════════════════════
# SALVAR
# ══════════════════════════════════════════

def salvar(dados, analise):
    raw_file = f"{OUTPUT_DIR}/noite_raw_{TIMESTAMP}.json"
    with open(raw_file, "w") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

    report_file = f"{OUTPUT_DIR}/noite_relatorio_{TIMESTAMP}.md"
    with open(report_file, "w") as f:
        f.write(f"# Relatório SEO Noturno — Jaleca\n")
        f.write(f"**Data:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"**Páginas:** {len(dados['jaleca_pages'])} | **Keywords:** {len(dados['kw_mercado'])}\n\n---\n\n")
        f.write(analise)

    memory_file = f"{HISTORY_DIR}/ultima-auditoria-noturna.md"
    with open(memory_file, "w") as f:
        f.write(f"# Última Auditoria Noturna\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"Relatório: {report_file}\n\n")
        f.write("## Resumo executivo\n")
        f.write(analise[:3000])
        f.write("\n\n_[ver relatório completo acima]_\n")

    log(f"✅ Relatório: {report_file}")
    log(f"✅ Raw: {raw_file}")
    log(f"✅ Memória: {memory_file}")
    return report_file


# ══════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════

def main():
    inicio = time.time()
    print("=" * 60)
    print("🌙 AUDITORIA NOTURNA COMPLETA v2 — JALECA")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)

    urls                         = get_urls_jaleca()
    jaleca_pages, erros_scrape   = raspar_jaleca(urls)
    concorrentes                 = raspar_concorrentes()
    paginas_novas                = detectar_paginas_novas_concorrentes()
    kw_mercado                   = buscar_keywords_mercado()
    kw_concorrentes              = buscar_keywords_concorrentes()
    posicoes_hoje, variacoes     = buscar_posicoes_diarias()
    serp_conc, alertas_conc      = monitorar_serp_concorrentes()
    backlinks                    = buscar_backlinks()
    cwv                          = buscar_cwv(urls)
    queries_ctr_baixo, perdas    = buscar_dados_gsc()
    saude_tecnica                = verificar_saude_tecnica(jaleca_pages, erros_scrape)
    pagina_2, paa                = buscar_oportunidades(posicoes_hoje)

    dados = {
        "timestamp":            TIMESTAMP,
        "jaleca_pages":         jaleca_pages,
        "erros_scrape":         erros_scrape,
        "concorrentes":         concorrentes,
        "paginas_novas":        paginas_novas,
        "kw_mercado":           kw_mercado,
        "kw_concorrentes":      kw_concorrentes,
        "posicoes_hoje":        posicoes_hoje,
        "variacoes_jaleca":     variacoes,
        "serp_concorrentes":    serp_conc,
        "alertas_concorrentes": alertas_conc,
        "backlinks":            backlinks,
        "cwv":                  cwv,
        "queries_ctr_baixo":    queries_ctr_baixo,
        "perdas_posicao":       perdas,
        "saude_tecnica":        saude_tecnica,
        "pagina_2":             pagina_2,
        "paa":                  paa
    }

    analise = analisar_com_kimi(dados)
    report  = salvar(dados, analise)

    duracao = int(time.time() - inicio)
    print("\n" + "=" * 60)
    print(f"🎉 CONCLUÍDO em {duracao//60}min {duracao%60}s")
    print(f"📄 {report}")
    print("\nAmanhã abra o Claude Code e digite:")
    print("  /iniciar-jaleca")
    print("  Leia a última auditoria noturna e me diga as prioridades de hoje")
    print("=" * 60)


if __name__ == "__main__":
    main()
