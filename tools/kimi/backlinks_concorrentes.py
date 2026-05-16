#!/usr/bin/env python3
"""
Análise de backlinks dos concorrentes via DataForSEO Backlinks API
"""
import requests
import base64
import json
from datetime import datetime

LOGIN = "rhammon@objetivasolucao.com.br"
PASSWORD = "82d240431788fc07"
AUTH = base64.b64encode(f"{LOGIN}:{PASSWORD}".encode()).decode()

HEADERS = {
    "Authorization": f"Basic {AUTH}",
    "Content-Type": "application/json",
}

CONCORRENTES = [
    "dracherie.com.br",
    "doutorjaleco.com.br",
    "jalecos.com.br",
    "estilojaleco.com.br",
    "ciadojaleco.com.br",
]

def get_backlinks_summary(domain):
    url = "https://api.dataforseo.com/v3/backlinks/summary/live"
    payload = [{"target": domain, "include_subdomains": True}]
    r = requests.post(url, headers=HEADERS, json=payload)
    data = r.json()
    try:
        item = data["tasks"][0]["result"][0]
        return {
            "domain": domain,
            "backlinks": item.get("backlinks", 0),
            "referring_domains": item.get("referring_domains", 0),
            "domain_rank": item.get("rank", 0),
            "broken_backlinks": item.get("broken_backlinks", 0),
        }
    except Exception as e:
        return {"domain": domain, "error": str(e)}

def get_referring_domains(domain, limit=50):
    url = "https://api.dataforseo.com/v3/backlinks/referring_domains/live"
    payload = [{
        "target": domain,
        "limit": limit,
        "order_by": ["rank,desc"],
        "include_subdomains": True,
    }]
    r = requests.post(url, headers=HEADERS, json=payload)
    data = r.json()
    try:
        items = data["tasks"][0]["result"][0]["items"]
        return [
            {
                "domain": i.get("domain", ""),
                "rank": i.get("rank", 0),
                "backlinks": i.get("backlinks", 0),
                "broken_backlinks": i.get("broken_backlinks", 0),
            }
            for i in (items or [])
        ]
    except Exception as e:
        return [{"error": str(e)}]

def main():
    print("=" * 60)
    print(f"🔗 ANÁLISE DE BACKLINKS — CONCORRENTES JALECA")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)

    all_referring = {}

    for domain in CONCORRENTES:
        print(f"\n📊 {domain}")
        summary = get_backlinks_summary(domain)
        if "error" in summary:
            print(f"   ❌ Erro: {summary['error']}")
            continue

        print(f"   Domain Rank : {summary['domain_rank']}")
        print(f"   Backlinks   : {summary['backlinks']:,}")
        print(f"   Ref Domains : {summary['referring_domains']:,}")
        print(f"   Quebrados   : {summary['broken_backlinks']:,}")

        print(f"   🔍 Top 50 domínios de referência...")
        domains = get_referring_domains(domain, limit=50)
        all_referring[domain] = domains

        for d in domains[:10]:
            if "error" not in d:
                print(f"      [{d['rank']:>4}] {d['domain']} — {d['backlinks']} links")

    # Domínios que linkam para MÚLTIPLOS concorrentes (oportunidades)
    print("\n" + "=" * 60)
    print("🎯 OPORTUNIDADES — domínios que linkam para 2+ concorrentes")
    print("=" * 60)

    domain_count = {}
    domain_to_competitors = {}
    for competitor, refs in all_referring.items():
        for ref in refs:
            d = ref.get("domain", "")
            if not d:
                continue
            domain_count[d] = domain_count.get(d, 0) + 1
            domain_to_competitors.setdefault(d, []).append(competitor)

    opportunities = sorted(
        [(d, c, domain_to_competitors[d]) for d, c in domain_count.items() if c >= 2],
        key=lambda x: -x[1]
    )

    for opp_domain, count, competitors in opportunities[:30]:
        print(f"   {opp_domain} ({count}x) → {', '.join(competitors)}")

    # Salvar resultado
    output = {
        "date": datetime.now().isoformat(),
        "summaries": {},
        "referring_domains": all_referring,
        "opportunities": [{"domain": d, "count": c, "competitors": comp} for d, c, comp in opportunities],
    }
    with open("tools/kimi/backlinks_concorrentes_result.json", "w") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Resultado salvo em tools/kimi/backlinks_concorrentes_result.json")

if __name__ == "__main__":
    main()
