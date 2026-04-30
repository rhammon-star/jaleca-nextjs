#!/usr/bin/env python3
"""
Script Noturno Jaleca — Auditoria SEO Completa
Firecrawl raspa site + concorrentes
DataForSEO busca palavras-chave
Kimi analisa tudo e gera relatório

Rodar à noite:
cd ~/sitejaleca/jaleca-nextjs
source .venv/bin/activate
python3 tools/kimi/noite_seo_completo.py
"""

import os
import json
import time
import requests
from datetime import datetime
from dotenv import load_dotenv
from xml.etree import ElementTree as ET

load_dotenv()

# Credenciais
FIRECRAWL_KEY = os.getenv("FIRECRAWL_API_KEY")
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
KIMI_MODEL = os.getenv("OPENROUTER_MODEL", "moonshotai/kimi-k2.6")
DATAFORSEO_AUTH = os.getenv("SEOFORDATA_USER")

# Configurações
SITEMAP_URL = "https://jaleca.com.br/sitemap.xml"
OUTPUT_DIR = os.path.expanduser("~/sitejaleca/jaleca-nextjs/ai-source-docs/relatorios")
os.makedirs(OUTPUT_DIR, exist_ok=True)

TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M")

# Concorrentes
CONCORRENTES = [
    {"nome": "Jaleco Online",        "url": "https://www.jalecoonline.com.br/"},
    {"nome": "Dr. Jaleco",           "url": "https://drjaleco.com.br/"},
    {"nome": "Dra. Charm",           "url": "https://www.dracharm.com.br/"},
    {"nome": "Donne Jalecos",        "url": "https://donnejalecos.com.br/"},
    {"nome": "JalecoChic",           "url": "https://www.jalecochic.com.br/"},
    {"nome": "Jussara Nunes",        "url": "https://jussaranunes.com.br/"},
    {"nome": "Boutique dos Jalecos", "url": "https://www.boutiquedosjalecos.com.br/"},
    {"nome": "Casa do Jaleco",       "url": "https://www.casadojaleco.com/feminino"},
    {"nome": "Primeira Cor",         "url": "https://loja.primeiracorjalecos.com/jalecos/jalecos-femininos"},
    {"nome": "Brancura",             "url": "https://www.brancura.com.br/mulheres/jalecos-femininos"},
]

# Palavras-chave semente para pesquisa
KEYWORDS_SEMENTE = [
    "jaleco feminino",
    "jaleco médico",
    "jaleco personalizado",
    "jaleco bordado",
    "uniforme saúde",
    "scrub médico",
    "jaleco colorido",
    "jaleco estampado",
    "jaleco enfermagem",
    "uniforme hospitalar",
]


# ─────────────────────────────────────────
# FIRECRAWL
# ─────────────────────────────────────────

def get_urls_from_sitemap():
    print("\n📋 Lendo sitemap da Jaleca...")
    r = requests.get(SITEMAP_URL, timeout=30)
    root = ET.fromstring(r.content)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [u.find("sm:loc", ns).text for u in root.findall("sm:url", ns)]
    print(f"   ✅ {len(urls)} URLs encontradas")
    return urls


def scrape_url(url):
    try:
        r = requests.post(
            "https://api.firecrawl.dev/v1/scrape",
            headers={
                "Authorization": f"Bearer {FIRECRAWL_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "url": url,
                "formats": ["extract"],
                "extract": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title":            {"type": "string"},
                            "meta_description": {"type": "string"},
                            "h1":               {"type": "string"},
                            "h2_list":          {"type": "array", "items": {"type": "string"}},
                            "word_count":       {"type": "number"},
                            "canonical":        {"type": "string"},
                            "has_images":       {"type": "boolean"},
                            "main_content":     {"type": "string"}
                        }
                    }
                }
            },
            timeout=30
        )
        data = r.json()
        if data.get("success"):
            ext = data.get("data", {}).get("extract", {})
            return {"url": url, "status": "ok", **ext}
        else:
            return {"url": url, "status": "error", "error": data.get("error", "unknown")}
    except Exception as e:
        return {"url": url, "status": "error", "error": str(e)}


def raspar_jaleca(urls):
    print(f"\n🔍 Raspando {len(urls)} páginas da Jaleca...")
    results = []
    for i, url in enumerate(urls, 1):
        print(f"   [{i:3}/{len(urls)}] {url[:70]}", end=" ", flush=True)
        result = scrape_url(url)
        results.append(result)
        print("✅" if result["status"] == "ok" else f"❌ {result.get('error','')}")
        time.sleep(0.5)
    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"\n   📊 {ok} ok / {len(urls)-ok} erros")
    return results


def raspar_concorrentes():
    print("\n🔍 Raspando concorrentes...")
    results = []
    for c in CONCORRENTES:
        print(f"   {c['nome']}...", end=" ", flush=True)
        result = scrape_url(c["url"])
        result["concorrente"] = c["nome"]
        results.append(result)
        print("✅" if result["status"] == "ok" else "❌")
        time.sleep(1)
    return results


# ─────────────────────────────────────────
# DATAFORSEO
# ─────────────────────────────────────────

def buscar_keywords_dataforseo():
    print("\n🔑 Buscando palavras-chave no DataForSEO...")
    headers = {
        "Authorization": f"Basic {DATAFORSEO_AUTH}",
        "Content-Type": "application/json"
    }

    # Palavras-chave relacionadas à Jaleca no Brasil
    payload = [
        {
            "keywords": KEYWORDS_SEMENTE,
            "location_code": 1001767,  # Brasil
            "language_code": "pt",
            "limit": 100
        }
    ]

    try:
        r = requests.post(
            "https://api.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live",
            headers=headers,
            json=payload,
            timeout=60
        )
        data = r.json()
        if data.get("status_code") == 20000:
            items = data["tasks"][0]["result"][0].get("items", [])
            keywords = [
                {
                    "keyword": item["keyword"],
                    "volume": item.get("keyword_info", {}).get("search_volume", 0),
                    "cpc": item.get("keyword_info", {}).get("cpc", 0),
                    "competition": item.get("keyword_info", {}).get("competition", 0),
                    "difficulty": item.get("keyword_properties", {}).get("keyword_difficulty", 0)
                }
                for item in items
            ]
            # Ordena por volume
            keywords.sort(key=lambda x: x["volume"] or 0, reverse=True)
            print(f"   ✅ {len(keywords)} palavras-chave encontradas")
            return keywords
        else:
            print(f"   ❌ Erro DataForSEO: {data.get('status_message')}")
            return []
    except Exception as e:
        print(f"   ❌ Erro: {e}")
        return []


def buscar_keywords_concorrentes():
    print("\n🔑 Buscando palavras-chave dos concorrentes no DataForSEO...")
    headers = {
        "Authorization": f"Basic {DATAFORSEO_AUTH}",
        "Content-Type": "application/json"
    }

    dominios = [
        "jalecoonline.com.br",
        "drjaleco.com.br",
        "dracharm.com.br",
        "jalecochic.com.br",
    ]

    resultados = {}
    for dominio in dominios:
        try:
            payload = [
                {
                    "target": dominio,
                    "location_code": 1001767,
                    "language_code": "pt",
                    "limit": 50
                }
            ]
            r = requests.post(
                "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live",
                headers=headers,
                json=payload,
                timeout=60
            )
            data = r.json()
            if data.get("status_code") == 20000:
                items = data["tasks"][0]["result"][0].get("items", [])
                kws = [
                    {
                        "keyword": item.get("keyword_data", {}).get("keyword", ""),
                        "position": item.get("ranked_serp_element", {}).get("serp_item", {}).get("rank_absolute", 0),
                        "volume": item.get("keyword_data", {}).get("keyword_info", {}).get("search_volume", 0)
                    }
                    for item in items
                ]
                resultados[dominio] = kws
                print(f"   ✅ {dominio}: {len(kws)} keywords")
            else:
                print(f"   ❌ {dominio}: {data.get('status_message')}")
                resultados[dominio] = []
            time.sleep(1)
        except Exception as e:
            print(f"   ❌ {dominio}: {e}")
            resultados[dominio] = []

    return resultados


# ─────────────────────────────────────────
# KIMI — ANÁLISE COMPLETA
# ─────────────────────────────────────────

def analisar_com_kimi(jaleca_pages, concorrentes_data, keywords, keywords_concorrentes):
    print("\n🤖 Enviando tudo para o Kimi analisar...")

    prompt = f"""Você é um especialista sênior em SEO técnico e e-commerce brasileiro.

Analise os dados completos do site jaleca.com.br — uma loja de jalecos, scrubs e uniformes profissionais para área da saúde.

═══════════════════════════════
DADOS DO SITE JALECA ({len(jaleca_pages)} páginas)
═══════════════════════════════
{json.dumps(jaleca_pages, ensure_ascii=False, indent=2)}

═══════════════════════════════
DADOS DOS CONCORRENTES
═══════════════════════════════
{json.dumps(concorrentes_data, ensure_ascii=False, indent=2)}

═══════════════════════════════
PALAVRAS-CHAVE DO MERCADO (Top 100 por volume)
═══════════════════════════════
{json.dumps(keywords[:100], ensure_ascii=False, indent=2)}

═══════════════════════════════
PALAVRAS-CHAVE DOS CONCORRENTES
═══════════════════════════════
{json.dumps(keywords_concorrentes, ensure_ascii=False, indent=2)}

═══════════════════════════════
GERE O SEGUINTE RELATÓRIO COMPLETO:
═══════════════════════════════

## 1. RESUMO EXECUTIVO
- Score SEO geral da Jaleca (0-100)
- Top 5 problemas críticos
- Top 5 oportunidades imediatas
- Comparação geral com concorrentes

## 2. ERROS TÉCNICOS
- Páginas com erro (liste URLs)
- Redirects problemáticos
- Canonicals incorretos

## 3. PROBLEMAS DE TÍTULO (TITLE TAG)
- Ausentes (liste URLs)
- Duplicados (liste grupos)
- Muito curtos (<30 chars) ou longos (>60 chars)
- Sugestões de melhoria para top 10 páginas

## 4. PROBLEMAS DE META DESCRIPTION
- Ausentes (liste URLs)
- Duplicadas
- Fora do tamanho ideal (155-160 chars)
- Sugestões de melhoria para top 10 páginas

## 5. PROBLEMAS DE H1
- Ausentes (liste URLs)
- Duplicados
- Inconsistentes com o título

## 6. PÁGINAS COM CONTEÚDO FRACO
- Menos de 400 palavras (liste URLs)
- Sem imagens
- Sugestão: quais páginas priorizar para enriquecer conteúdo

## 7. ANÁLISE DE CONCORRENTES
- O que os concorrentes fazem melhor que a Jaleca em SEO
- Estrutura de categorias e URLs deles vs Jaleca
- Títulos e meta descriptions deles (exemplos dos melhores)
- Diferenciais que a Jaleca pode explorar

## 8. GAP DE PALAVRAS-CHAVE
- Top 30 palavras-chave com alto volume que concorrentes rankeiam mas Jaleca provavelmente não
- Para cada keyword: volume estimado, dificuldade, sugestão de página para criar ou otimizar

## 9. OPORTUNIDADES DE CONTEÚDO (+400 palavras)
- Liste 10 páginas existentes que precisam de mais conteúdo
- Para cada uma: sugestão de tópicos e subtópicos para chegar em 400+ palavras
- Liste 5 novas páginas/categorias para criar

## 10. PLANO DE AÇÃO PRIORIZADO
Organize por impacto e esforço:

### CRÍTICO (fazer esta semana)
- Item, URL afetada, o que fazer, impacto esperado

### ALTO IMPACTO (fazer este mês)
- Item, URL afetada, o que fazer, impacto esperado

### MÉDIO PRAZO (próximo trimestre)
- Item, o que fazer, impacto esperado

Seja extremamente específico. Cite URLs reais. Dê exemplos concretos de títulos, meta descriptions e conteúdo melhorado.
O objetivo final é tirar a Jaleca do 100% tráfego branded e conquistar tráfego orgânico genérico."""

    r = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://jaleca.com.br",
            "X-Title": "Jaleca SEO Night Audit"
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


# ─────────────────────────────────────────
# SALVAR RELATÓRIO
# ─────────────────────────────────────────

def salvar_tudo(jaleca_pages, concorrentes_data, keywords, keywords_concorrentes, analise):
    # Dados brutos
    raw = {
        "timestamp": TIMESTAMP,
        "jaleca_pages": jaleca_pages,
        "concorrentes": concorrentes_data,
        "keywords": keywords,
        "keywords_concorrentes": keywords_concorrentes
    }
    raw_file = f"{OUTPUT_DIR}/noite_raw_{TIMESTAMP}.json"
    with open(raw_file, "w") as f:
        json.dump(raw, f, ensure_ascii=False, indent=2)

    # Relatório Kimi
    report_file = f"{OUTPUT_DIR}/noite_relatorio_{TIMESTAMP}.md"
    with open(report_file, "w") as f:
        f.write(f"# Relatório SEO Noturno — Jaleca\n")
        f.write(f"**Data:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"**Páginas analisadas:** {len(jaleca_pages)}\n")
        f.write(f"**Concorrentes:** {len(concorrentes_data)}\n")
        f.write(f"**Palavras-chave coletadas:** {len(keywords)}\n\n")
        f.write("---\n\n")
        f.write(analise)

    # Atualiza ai-memory para o Claude pegar amanhã
    memory_file = os.path.expanduser(
        "~/sitejaleca/jaleca-nextjs/ai-source-docs/historico/ultima-auditoria-noturna.md"
    )
    os.makedirs(os.path.dirname(memory_file), exist_ok=True)
    with open(memory_file, "w") as f:
        f.write(f"# Última Auditoria Noturna\n")
        f.write(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")
        f.write(f"Relatório completo: {report_file}\n\n")
        f.write("## Resumo para o Claude\n")
        f.write(analise[:2000])
        f.write("\n\n_[ver relatório completo no arquivo acima]_")

    print(f"\n✅ Relatório salvo: {report_file}")
    print(f"✅ Dados brutos: {raw_file}")
    print(f"✅ Memória atualizada: {memory_file}")
    return report_file


# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────

def main():
    inicio = time.time()
    print("=" * 60)
    print("🌙 AUDITORIA NOTURNA JALECA")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)

    # 1. Sitemap
    urls = get_urls_from_sitemap()

    # 2. Raspa Jaleca
    jaleca_pages = raspar_jaleca(urls)

    # 3. Raspa concorrentes
    concorrentes_data = raspar_concorrentes()

    # 4. Keywords do mercado
    keywords = buscar_keywords_dataforseo()

    # 5. Keywords dos concorrentes
    keywords_concorrentes = buscar_keywords_concorrentes()

    # 6. Kimi analisa tudo
    analise = analisar_com_kimi(jaleca_pages, concorrentes_data, keywords, keywords_concorrentes)

    # 7. Salva tudo
    report_file = salvar_tudo(jaleca_pages, concorrentes_data, keywords, keywords_concorrentes, analise)

    duracao = int(time.time() - inicio)
    print("\n" + "=" * 60)
    print(f"🎉 AUDITORIA CONCLUÍDA em {duracao//60}min {duracao%60}s")
    print(f"📄 Relatório: {report_file}")
    print("\nAmanhã, abra o Claude Code e digite:")
    print("  /iniciar-jaleca")
    print("  Leia o relatório da auditoria noturna e me diga as prioridades")
    print("=" * 60)


if __name__ == "__main__":
    main()
