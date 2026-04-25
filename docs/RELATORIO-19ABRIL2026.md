# Relatório Completo — Jaleca.com.br
## Data: 19 de Abril de 2026
## Gerado em: 13h30 BRT

---

## 1. O QUE FOI FEITO HOJE

### 1.1 Estratégia — Topical Authority com Google Trends

**Técnica aplicada:**
1. Captura de dados reais do Google Trends via `pytrends` (Brasil, 12 meses) para 22 profissões
2. Keywords de maior volume inseridas naturalmente nos textos dos hubs
3. Todo conteúdo passou por AI_BLACKLIST + humanização automática
4. Publicação de 2 posts de blog por profissão (dúvidas reais da profissão + produto)
5. Deploy em produção

**Resultado:** 22 páginas hub atualizadas + 44 posts publicados.

---

### 1.2 Keywords do Google Trends — por profissão

| Profissão | Keyword #1 (top volume) | Volume |
|---|---|---|
| Dentista | jaleco para dentista | 50 |
| Podólogo | jaleco para podologo | 15 |
| Biomédico | uniforme biomedicina | 12 |
| Enfermeiro | jaleco enfermagem | 58 ← MAIOR |
| Fisioterapeuta | jaleco fisioterapia | 18 |
| Nutricionista | jaleco nutricionista | 25 |
| Médico | roupa médico | 50 |
| Barbeiro | jaleco barbearia | 40 |
| Tatuador | jaleco tatuador | 20 |
| Esteticista | jaleco estetica | 35 |
| Massagista | jaleco massagem | 22 |
| Cabeleireiro | jaleco para cabeleireiro | 30 |
| Churrasqueiro | avental churrasqueiro | 28 |
| Sushiman | dolma sushiman | 15 |
| Cozinheiro | dolma chef | 20 |
| Professor | roupa professor | 52 ← 2º MAIOR |
| Vendedor | jaleco loja | 36 |
| Advogado | roupa advogado | 32 |
| Pastor | roupas ministério | 25 |
| Psicóloga | jaleco psicologia | 29 |
| Farmacêutico | jaleco farmacia | 17 |

---

### 1.3 Páginas Hub Atualizadas (22 páginas)

Todas em produção. O que foi atualizado em cada hub:
- `metadata.title` — título SEO com keyword Trends
- `metadata.description` — description com keywords long-tail
- `hero.subtitulo` — frase de impacto com keyword principal
- `guia.secoes[0]` — primeiro parágrafo do guia reescrito com keywords Trends

**Cluster Saúde (7 hubs)**
| Página | URL |
|---|---|
| Jaleco para Dentista | jaleca.com.br/jaleco-dentista |
| Jaleco para Podólogo | jaleca.com.br/jaleco-podologo |
| Jaleco para Biomédico | jaleca.com.br/jaleco-biomedico |
| Jaleco para Enfermeiro | jaleca.com.br/jaleco-enfermeiro |
| Jaleco para Fisioterapeuta | jaleca.com.br/jaleco-fisioterapeuta |
| Jaleco para Nutricionista | jaleca.com.br/jaleco-nutricionista |
| Jaleco para Médico | jaleca.com.br/jaleco-medico |

**Cluster Beleza (5 hubs)**
| Página | URL |
|---|---|
| Jaleco para Barbeiro | jaleca.com.br/jaleco-barbeiro |
| Jaleco para Tatuador | jaleca.com.br/jaleco-tatuador |
| Jaleco para Esteticista | jaleca.com.br/jaleco-esteticista |
| Jaleco para Massagista | jaleca.com.br/jaleco-massagista |
| Jaleco para Cabeleireiro | jaleca.com.br/jaleco-cabeleireiro |

**Cluster Gastronomia (3 hubs — produto: Dólmã)**
| Página | URL |
|---|---|
| Dólmã para Churrasqueiro | jaleca.com.br/jaleco-churrasqueiro |
| Dólmã para Sushiman | jaleca.com.br/jaleco-sushiman |
| Dólmã para Cozinheiro | jaleca.com.br/jaleco-cozinheiro |

**Cluster Serviços (2 hubs)**
| Página | URL |
|---|---|
| Jaleco/Uniforme Professor | jaleca.com.br/jaleco-professor |
| Jaleco para Vendedor | jaleca.com.br/jaleco-vendedor |

**Cluster Escritório (4 hubs — produto: Conjunto)**
| Página | URL |
|---|---|
| Conjunto para Advogado | jaleca.com.br/jaleco-advogado |
| Conjunto para Pastor | jaleca.com.br/jaleco-pastor |
| Jaleco/Conjunto Psicóloga | jaleca.com.br/jaleco-psicologa |
| Jaleco para Farmacêutico | jaleca.com.br/jaleco-farmaceutico |

**Páginas extras (produto alternativo)**
| Página | URL |
|---|---|
| Dólmã para Churrasqueiro | jaleca.com.br/dolma-churrasqueiro |
| Dólmã para Sushiman | jaleca.com.br/dolma-sushiman |
| Dólmã para Cozinheiro | jaleca.com.br/dolma-cozinheiro |
| Conjunto para Advogado | jaleca.com.br/conjunto-advogado |
| Conjunto para Pastor | jaleca.com.br/conjunto-pastor |
| Conjunto para Psicóloga | jaleca.com.br/conjunto-psicologa |
| Conjunto para Farmacêutico | jaleca.com.br/conjunto-farmaceutico |
| Uniforme para Professor | jaleca.com.br/uniforme-professor |

---

### 1.4 Estrutura de Topical Authority — Links Internos

```
Pillar: /uniformes-profissionais-saude
  └── /jaleco-dentista
  └── /jaleco-podologo
  └── /jaleco-biomedico
  └── /jaleco-enfermeiro
  └── /jaleco-fisioterapeuta
  └── /jaleco-nutricionista
  └── /jaleco-medico
      └── Blog posts linkando de volta para o hub

/jaleco-barbeiro (cluster beleza — sem pillar ainda)
/jaleco-tatuador
/jaleco-esteticista
/jaleco-massagista
/jaleco-cabeleireiro

/jaleco-churrasqueiro (cluster gastronomia)
/jaleco-sushiman
/jaleco-cozinheiro

/jaleco-professor (cluster serviços)
/jaleco-vendedor

/jaleco-advogado (cluster escritório)
/jaleco-pastor
/jaleco-psicologa
/jaleco-farmaceutico
```

**Linking bidirecional implementado:**
- Cada hub linka para os outros hubs do mesmo cluster (CLUSTER_LINKS)
- Cluster saúde linka de volta ao pillar `/uniformes-profissionais-saude`
- Pillar linka para todos os 7 hubs de saúde

---

### 1.5 Posts de Blog Publicados (42 posts — 2 a apagar)

**⚠️ Apagar no WP Admin:** IDs 62687 e 62689 (barbeiro duplicados)

**Cluster Saúde — 14 posts**
| # | Título | Link |
|---|---|---|
| 1 | Jaleco para Dentista: NR-32 e Escolha Certa | jaleca.com.br/blog/jaleco-dentista-nr32-escolha-certa |
| 2 | Jaleco: Branco Clássico ou Cores? O que o CRO aprova | jaleca.com.br/blog/jaleco-dentista-branco-ou-colorido-o-que-o-cro-permite |
| 3 | Jaleco para Podólogo: Elastano é Essencial | jaleca.com.br/blog/jaleco-podologo-elastano-atendimento-sentado |
| 4 | Higienização do Jaleco de Podólogo: Cuidado Essencial | jaleca.com.br/blog/higienizacao-jaleco-podologo-pe-diabetico |
| 5 | Jaleco para Biomédico: A Roupa que Comunica na Estética | jaleca.com.br/blog/jaleco-biomedico-harmonizacao-roupa-comunica |
| 6 | Jaleco: Laboratório vs. Estética para Biomédicos | jaleca.com.br/blog/jaleco-laboratorio-vs-estetica-biomedico |
| 7 | Jaleco de Enfermagem: COFEN e Escolha Certa | jaleca.com.br/blog/jaleco-enfermagem-cofen-escolha-certa |
| 8 | Jaleco de Enfermagem: Lavagem Pós-Plantão Essencial | jaleca.com.br/blog/como-lavar-jaleco-enfermagem-contaminacao-biologica |
| 9 | Jaleco de Fisioterapia: O Elastano que Liberta Seu Movimento | jaleca.com.br/blog/jaleco-fisioterapia-elastano-rpg-pilates |
| 10 | Jaleco Fisioterapeuta: Curto ou Longo? | jaleca.com.br/blog/jaleco-curto-ou-longo-para-fisioterapeuta-depende-da-especialidade |
| 11 | Jaleco Nutricionista: Poder e Autoridade | jaleca.com.br/blog/jaleco-nutricionista-autoridade-emagrecimento |
| 12 | Jaleco de Nutricionista: CFN Apoia e Pacientes Confiam | jaleca.com.br/blog/jaleco-nutricionista-branco-cfn-confianca-pacientes |
| 13 | Jaleco Médico na Telemedicina: Por que o Branco Ainda Importa | jaleca.com.br/blog/jaleco-medico-telemedicina-por-que-branco-importa-camera |
| 14 | Jaleco Fora do Consultório: O Que Diz o CFM? | jaleca.com.br/blog/jaleco-fora-consultorio-cfm |

**Cluster Beleza — 10 posts**
| # | Título | Link |
|---|---|---|
| 15 | Jaleco: O Que Muda do Médico para a Barbearia? | jaleca.com.br/blog/jaleco-barbearia-vs-jaleco-medico-diferencas-e-tendencias |
| 16 | Jaleco de Barbearia: Limpeza e Conservação Essenciais | jaleca.com.br/blog/como-lavar-e-conservar-jaleco-barbearia |
| 17 | Jaleco Tatuador: Biossegurança e Exigências Sanitárias | jaleca.com.br/blog/jaleco-tatuador-vigilancia-sanitaria-estudio-tatuagem |
| 18 | Biossegurança em Estúdios de Tatuagem: Seu Aliado Essencial | jaleca.com.br/blog/biosseguranca-estudio-tatuagem-epi-jaleco-sangue-tinta |
| 19 | Jaleco de Estética: Seu Aliado em CAPES, HIMEC e Harmonização | jaleca.com.br/blog/jaleco-de-estetica-capes-himec-harmonizacao-facial |
| 20 | O Poder do Jaleco na Percepção do Cliente na Estética | jaleca.com.br/blog/jaleco-esteticista-percepcao-cliente |
| 21 | Jaleco para Massagem: Mobilidade e Higiene Essenciais | jaleca.com.br/blog/jaleco-massagista-mobilidade-higiene-drenagem |
| 22 | Uniforme Massagista: Conforto e Profissionalismo | jaleca.com.br/blog/uniforme-massagista-spa-clinica-conforto-apresentacao |
| 23 | Jaleco Antiestático: O Fim do Cabelo Grudado no Jaleco | jaleca.com.br/blog/jaleco-antiestatico-problema-salao |
| 24 | Padronize sua equipe: Uniformes para salões de beleza | jaleca.com.br/blog/padronizar-equipe-cabeleireiros-uniformes-salao |

**Cluster Gastronomia — 6 posts**
| # | Título | Link |
|---|---|---|
| 25 | Dólmã ou Avental: O Que Usa o Churrasqueiro Profissional? | jaleca.com.br/blog/dolma-ou-avental-churrasqueiro-profissional |
| 26 | Kit Churrasqueiro Profissional: Dólmã e Mais | jaleca.com.br/blog/kit-uniforme-churrasqueiro-profissional-dolma-avental |
| 27 | Dólmã para Sushiman: Higiene e Imagem | jaleca.com.br/blog/dolma-sushiman-higiene-apresentacao |
| 28 | Uniforme Sushiman: Dólmã e Mais na Cozinha Japonesa | jaleca.com.br/blog/uniforme-sushiman-dolma-cozinha-japonesa |
| 29 | Dólmã Chef: Por Que Profissionais Preferem ao Jaleco? | jaleca.com.br/blog/dolma-chef-por-que-cozinheiro-nao-troca-por-jaleco |
| 30 | Dólmã Ideal para Personal Chef e Alta Gastronomia | jaleca.com.br/blog/como-escolher-a-dolma-certa-para-personal-chef-e-alta-gastronomia |

**Cluster Serviços — 4 posts**
| # | Título | Link |
|---|---|---|
| 31 | Jaleco para Professor: Faz Diferença? | jaleca.com.br/blog/jaleco-professor-diferenca-sala-aula |
| 32 | Uniforme de Professor EAD: Do Estúdio à Sala de Aula | jaleca.com.br/blog/uniforme-professor-ead-aulas-hibridas-camera |
| 33 | Jaleco de Loja: O Uniforme que Transforma Confiança | jaleca.com.br/blog/jaleco-de-loja-uniforme-confianca-cliente |
| 34 | Jaleco para Loja: Padronize com Estilo | jaleca.com.br/blog/jaleco-para-loja-padronizacao-equipe-identidade |

**Cluster Escritório — 8 posts**
| # | Título | Link |
|---|---|---|
| 35 | Roupa de Advogado: Vista-se para Vencer no Tribunal | jaleca.com.br/blog/roupa-advogado-tribunal |
| 36 | Conjunto ou Jaleco: O Advogado que Impõe Autoridade | jaleca.com.br/blog/conjunto-ou-jaleco-advogado-autoridade |
| 37 | Vestimenta Pastoral: Reverência e Fé na Roupa | jaleca.com.br/blog/roupa-pastor-evangelico-reverencia-fe |
| 38 | Vestimenta Pastoral: Trajes para Cerimônias e Cultos | jaleca.com.br/blog/conjunto-pastoral-o-que-usar-em-cerimonias-e-cultos |
| 39 | Jaleco de Psicologia: O Impacto Invisível | jaleca.com.br/blog/jaleco-psicologia-dinamica-atendimento |
| 40 | Terapia Online: Vestindo o Vínculo na Câmera | jaleca.com.br/blog/terapia-online-vestindo-vinculo-camera |
| 41 | Jaleco Farmacêutico: Essencial na Rotina Clínica | jaleca.com.br/blog/jaleco-farmacia-manga-longa-antimicrobiano-farmaceutico |
| 42 | Jaleco Farmácia: RDC 67 e Ozempic | jaleca.com.br/blog/jaleco-farmacia-rdc-67-ozempic-manipulacao |

---

## 2. GOOGLE SEARCH CONSOLE — Últimos 28 dias (22/03 a 19/04/2026)

### 2.1 Visão Geral
| Métrica | Valor |
|---|---|
| **Cliques totais** | 353 |
| **Impressões totais** | 7.517 |
| **CTR médio** | 4,7% |
| **Posição média** | 7,1 |

### 2.2 Tendência de Cliques (últimos 17 dias)
| Data | Cliques | Impressões | CTR | Posição |
|---|---|---|---|---|
| 03/04 | 17 | 118 | 14,4% | 7,7 |
| 04/04 | 13 | 148 | 8,8% | 7,4 |
| 05/04 | 8 | 112 | 7,1% | 11,6 |
| 06/04 | 22 | 286 | 7,7% | 6,6 |
| 07/04 | 27 | 374 | 7,2% | 5,8 |
| 08/04 | 22 | 315 | 7,0% | 5,7 |
| 09/04 | 27 | 327 | 8,3% | 5,9 |
| 10/04 | 10 | 326 | 3,1% | 8,2 |
| 11/04 | 6 | 230 | 2,6% | 7,4 |
| 12/04 | 15 | 218 | 6,9% | 8,1 |
| 13/04 | 16 | 372 | 4,3% | 6,2 |
| **14/04** | **34** | 632 | 5,4% | 6,3 |
| **15/04** | **43** | 1.054 | 4,1% | 8,3 |
| **16/04** | **50** | **1.129** | 4,4% | 6,6 |
| 17/04 | 31 | 1.068 | 2,9% | 7,1 |
| 18/04 | 12 | 784 | 1,5% | 7,2 |

📈 **Impressões explodiram a partir de 14/04** (de ~300/dia para 1.000+/dia) — efeito das páginas de cidade e hubs sendo indexadas.

### 2.3 Top Queries
| Query | Cliques | Impressões | CTR | Posição |
|---|---|---|---|---|
| **jaleca** | 138 | 398 | **34,7%** | 2,1 |
| jaleca ipatinga | 5 | 30 | 16,7% | 1,3 |
| jalecos uberlândia | 3 | 10 | 30,0% | 6,5 |
| jaleca bh | 2 | 7 | 28,6% | 1,1 |
| jaleca colatina | 2 | 38 | 5,3% | 2,7 |
| jaleca londrina | 2 | 49 | 4,1% | 3,5 |
| como lavar jaleco branco | 1 | 44 | 2,3% | 11,0 |
| jaleco slim feminino | 1 | 10 | 10,0% | 6,6 |
| **jalecos** | 1 | 30 | 3,3% | **36,4** ← CRÍTICO |
| jalecos em belém | 1 | 31 | 3,2% | 6,5 |

⚠️ **"jalecos" posição 36** — palavra-chave mais valiosa, ainda longe da página 1. Meta: top 10.

### 2.4 Top Páginas por Cliques
| Página | Cliques | Impressões | CTR | Posição |
|---|---|---|---|---|
| **Homepage** | 213 | 2.718 | 7,8% | 7,7 |
| /cidade/jaleco-uberlandia | 6 | 79 | 7,6% | 8,9 |
| /loja-matriz | 6 | 239 | 2,5% | 4,9 |
| /cidade/jaleco-belem | 5 | 202 | 2,5% | 6,3 |
| /cidade/jaleco-campina-grande | 5 | 66 | 7,6% | 6,6 |
| /cidade/jaleco-campo-grande | 5 | 155 | 3,2% | 6,2 |
| /cidade/jaleco-manaus | 5 | 84 | 6,0% | 6,0 |
| /cidade/jaleco-porto-alegre | 4 | 106 | 3,8% | 8,8 |
| /blog/como-lavar-jaleco-branco | 2 | 236 | 0,9% | 5,5 |

📌 **Hubs de profissão ainda não aparecem** — foram indexados hoje, impacto esperado em 2-4 semanas.

---

## 3. META ADS E GOOGLE ADS

> ⚠️ Tokens de API ficam no Vercel (não acessíveis localmente). Dados completos no relatório diário enviado por email às 19h BRT.

### O que sabemos (configuração atual):
**Meta Ads:**
- Conta: `act_2098470580937214`
- Campanhas ativas: Remarketing (ROAS 4,9x, R$20/dia) ✅
- Campanhas pausadas: Awareness (ROAS 0,83x), Lookalike (ROAS 0,85x)
- 3 campanhas de vídeo criadas (Lookalike, Saúde, Beleza) — aguardam criativo manual no Ads Manager
- Token expira: 13/06/2026

**Google Ads:**
- Conta: `444-659-1621`
- Search "Jaleca - Search - Jalecos": R$70/dia, Maximizar Cliques
- Shopping "Jaleca - Shopping - Produtos": R$30/dia
- Negativos adicionados: [jaleco] e [jalecos] exato (evita tráfego genérico)
- Meta: 30 compras → trocar para Maximizar Conversões

---

## 4. FERRAMENTAS DE ANÁLISE CONFIGURADAS

| Ferramenta | Status | URL/Acesso |
|---|---|---|
| **Google Search Console** | ✅ Ativo | search.google.com/search-console → sc-domain:jaleca.com.br |
| **Google Analytics 4** | ✅ Ativo | ID: G-SHBE64GDP7 |
| **Meta Pixel** | ✅ Ativo | ID: 566059928254677 |
| **ContentSquare** | ✅ Gravando (549 sessões em 17/04) | contentsquare.com → Project 741528 |
| **Vercel Speed Insights** | ✅ Ativo | vercel.com/jaleca |
| **Meta Events Manager** | ✅ Ativo | business.facebook.com → Pixel 566059928254677 |
| **Google Merchant Center** | ✅ Ativo | ID: 5759143798 |
| **Bling ERP** | ✅ Integrado | bling.com.br |
| **Tawk.to Chat** | ✅ Ativo | tawk.to |

---

## 5. ESTRUTURA TÉCNICA DAS PÁGINAS HUB

### Componentes por hub (`HubProfissaoTemplate.tsx`):
1. **Breadcrumb** — Home → [Pillar se saúde] → Profissão
2. **Hero** — H1 dinâmico com keyword Trends, subtítulo, 2 CTAs
3. **Produtos em destaque** — filtrado por tipo (jaleco/dólmã/conjunto)
4. **Guia lateral (sticky)** — 5 seções: tecido, modelagem, cores, ergonomia, normas
5. **Tabela de comparação** — Slim vs Profissional
6. **Links do cluster** — navegação interna entre profissões próximas
7. **FAQ** — 8 perguntas com schema FAQPage (rich snippet)
8. **CTA final** — link para categoria do produto

### Produto dinâmico por cluster:
- Saúde + Beleza + Serviços → **Jaleco** (`/categoria/jalecos`)
- Gastronomia → **Dólmã** (`/categoria/domas`)
- Escritório → **Conjunto** (`/categoria/conjuntos`)

### Schema SEO em cada hub:
- `Article` schema com keywords
- `FAQPage` schema (8 perguntas/respostas)
- Breadcrumb schema
- Canonical URL única por hub

---

## 6. PENDÊNCIAS ABERTAS

| # | Pendência | Prioridade | Ação |
|---|---|---|---|
| 1 | Apagar posts duplicados barbeiro (IDs 62687, 62689) | Alta | WP Admin → Posts → Lixeira |
| 2 | Criar pillar pages de beleza, gastronomia, serviços, escritório | Média | PRD v3 prevê subpilares |
| 3 | Monitorar indexação dos 44 posts no GSC | Média | Checar em 7 dias |
| 4 | Anúncios de vídeo Meta (3 ad sets aguardam criativo) | Alta | Meta Ads Manager manualmente |
| 5 | Campanha Search Google Ads → Maximizar Conversões após 30 compras | Média | Verificar Google Ads |
| 6 | Token Meta Ads expira 13/06/2026 | Futura | Renovar via Graph API Explorer |
| 7 | "jalecos" posição 36 → trabalhar link building | Alta | SEO off-page |
| 8 | 7 páginas /dia-das-maes/* — monitorar indexação GSC | Alta | Ver lembrete 28/04 |

---

## 7. LINKS RÁPIDOS PARA VALIDAÇÃO

- **Blog completo:** jaleca.com.br/blog
- **Pillar Saúde:** jaleca.com.br/uniformes-profissionais-saude
- **Hub Dentista (referência):** jaleca.com.br/jaleco-dentista
- **Hub Médico:** jaleca.com.br/jaleco-medico
- **Hub Barbeiro:** jaleca.com.br/jaleco-barbeiro
- **Hub Dólmã Churrasqueiro:** jaleca.com.br/dolma-churrasqueiro
- **Hub Conjunto Advogado:** jaleca.com.br/conjunto-advogado
- **WP Admin:** wp.jaleca.com.br/wp-admin
- **GSC:** search.google.com/search-console
- **ContentSquare:** contentsquare.com (Project 741528)
- **Vercel:** vercel.com/jaleca

---
*Arquivo gerado em 19/04/2026 — Claude Code*
