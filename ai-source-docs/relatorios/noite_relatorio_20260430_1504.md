# Relatório SEO Noturno — Jaleca
**Data:** 30/04/2026 15:39
**Páginas:** 415 | **Keywords:** 0

---

 **RELATÓRIO SEO TÉCNICO — JALECA.COM.BR**
*Data: 09 de Abril de 2026*
*Analista: Especialista Sênior SEO*

---

## 🚨 ALERTAS DO DIA

### Páginas novas dos concorrentes — O que lançaram e como responder

| Concorrente | O que lançaram | Risco para Jaleca | Resposta imediata da Jaleca |
|---|---|---|---|
| **Boutique dos Jalecos** | ~200 URLs novas de **jalecos personalizados por profissão** (zootecnia, optometria, acupuntura, lash designer, perito criminal, TSB) + **filtros por cor/estilo** (jaleco bordo, jaleco verde, etc.) | Dominando long-tail de profissões e cores. Roubou posições de cauda longa. | Audit / unificar as 48 páginas de profissão da Jaleca. Criar [profissão]-[cor] e produtos com SKUs visíveis. |
| **Casa do Jaleco** | ~60 SKUs novos de **scrubs com nomes próprios** (Luna, Alice, Beatrice, Cloe, Charlotte) + **estampados** (Turma do Mickey, Divertidamente) | Criando marca/produto próprio e rankeando por "scrub estampado", "scrub feminino [nome]". | Lançar linha com nomenclatura própria OU otimizar /scrub-feminino e /pijama-cirurgico-feminino com UGC (cliente usando). |
| **Dra. Charm** | Expandindo ranks para "jaleco estampado" (pos 1), "blusa scrub", "pijama cirúrgico vinho" | Consolidando topo de funil em categorias de nicho. | Criar guia comparativo de estampas vs. lisos no blog e linkar para /categoria/jalecos-femininos |

### Movimentos de concorrentes nas SERPs
- **DraCharm** subiu para posição 1 em "jaleco feminino moderno" (vol. 320) e "jaleco preto" (vol. 1.900) — enquanto Jaleca não rankea nessas terms.
- **JalecoOnline** mantém posição 3 em "jaleco" (vol. 60.500) e posição 1 em "jaleco pediatria" (vol. 720) — nicho que Jaleca nem possui landing page.
- **DrJaleco** posicionou em "jaleco médico" (vol. 1.600) na posição 8, enquanto Jaleca está fora do top 50.

---

## 1. RESUMO EXECUTIVO

### Score SEO geral: **38/100**
*(Baseado em: arquitetura fraca, thin content, canibalização de palavras-chave, falta de ranqueamentos genéricos e desperdício de crawl budget com doorways.)*

### Por que a Jaleca não aparece para buscas genéricas
1. **Canibalização em massa**: As 30+ páginas de profissão (`/jaleco-medico`, `/jaleco-dentista`, `/jaleco-enfermeiro`, etc.) usam **exatamente a mesma estrutura de H2s** e cópia adaptada por replace. O Google vê isso como conteúdo de baixo valor (thin affiliate/doorway).
2. **Páginas de cidade são doorways puras**: Exceto Ipatinga, BH, Colatina, Contagem, Teófilo Otoni e Guarapuava (onde há loja física), as outras dezenas de URLs `/cidade/jaleco-[cidade]` têm **0 diferença substancial** (apenas Find & Replace no nome da cidade). Isso dilui a autoridade do domínio e pode gerar penalidade manual por doorway pages.
3. **Categorias de produto sem conteúdo transacional**: `/categoria/jalecos-femininos` tem apenas **611 palavras** e um H2 genérico. Não há filtros indexáveis, texto de categoria rico, nem FAQ.
4. **Zero ranqueamento para "jaleco médico"**: A URL `/jaleco-medico` parece otimizada, mas com 984 palavras de template idêntico ao `/jaleco-dentista`, o Google não atribui relevância tópica específica.

### Top 5 problemas críticos hoje
1. **Doorway pages de cidade** em escala (~70 URLs) — consumindo crawl budget e sinalizando baixa qualidade.
2. **Canibalização entre páginas de profissão** — 30+ landings com estrutura clone (H2s idênticos: "Como escolher...", "Tecido e composição...", "Normas do CRM/CRO/CREFITO...").
3. **Categoria feminina na posição 19** para "jaleco feminino" (vol. 40.500) — title com erro ortográfico ("Femenino"), H1 fraco, meta description genérica.
4. **Blog com título de teste em produção**: `/blog/jaleco-slim-feminino-favorito-medicas` e `/blog/jaleco-slim-padrao-clinicas` com **H1 = "test-check"** e title "test-check | Jaleca | Jaleca".
5. **Produtos variantes de cor sem canonicalização adequada** — risco de canibalização entre `/produto/jaleco-slim-duquesa-feminino-jaleca-branco` vs `/preto` vs `/verde-garrafa`.

### Top 5 oportunidades imediatas
1. **Corrigir e potencializar `/categoria/jalecos-femininos`** — subir de pos. 19 para 1-5 para "jaleco feminino".
2. **Consolidar páginas de profissão** com conteúdo único real (ex: incluir legislação específica do CRM vs. CRO, patologias diferentes, cores recomendadas por especialidade).
3. **Remover/noindexar páginas de cidade sem loja física** — devolver autoridade para URLs que vendem.
4. **Criar hub de "jaleco personalizado/bordado"** — DrJaleco e Boutique dos Jalecos dominam esse termo (vol. 3.600+/mês).
5. **Responder Perguntas do PAA** — transformar em FAQ schema nas landings de categoria.

---

## 2. SAÚDE TÉCNICA

### Redirect chains detectados
| URL original | Redireciona para | Correção |
|---|---|---|
| `https://jaleca.com.br` | `https://jaleca.com.br/` | Canonicalizar diretamente para a versão com barra. Atualizar canonical da home para `/` |
| `https://jaleca.com.br/blog/guia-jaleco-dentista-modelos-cores-como-escolher` | `.../guia-jaleco-para-dentista-...` | Atualizar backlinks internos para a URL final |
| `https://jaleca.com.br/blog/jaleco-slim-padrao-clinicas` | `.../jaleco-slim-feminino-favorito-medicas` | **Remover do sitemap** e não redirecionar; usar 301 direto se necessário |
| `https://jaleca.com.br/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` | `https://jaleca.com.br/blog` | Conteúdo apagado? Recuperar ou usar 410 Gone |
| `https://jaleca.com.br/blog/como-lavar-e-conservar-seu-jaleco-profissional-2` | `.../como-lavar-jaleco-profissional-guia-completo` | Atualizar canonical interno |

### Canonicals incorretos / Risco de canibalização
| URL | Problema | Correção |
|---|---|---|
| `https://jaleca.com.br/blog/jaleco-slim-padrao-clinicas` | Canonical aponta para outro post (`...favorito-medicas`) enquanto o conteúdo é diferente | **Corrigir canonical** para self-referencing da URL final |
| Várias URLs de produto com variantes de cor (ex: `-jaleca-branco`, `-jaleca-preto`) | Canonical aponta para sí mesma, mas o H1/title muda muito pouco | Implementar **canonical para a URL base do produto pai** e usar `rel="alternate"` para cores, ou unificar em uma página com seletor de cor |

### Páginas sem H1, Title ou Meta Description
- **Nenhuma ausência total detectada** nos dados, mas:
  - `/blog/jaleco-slim-feminino-favorito-medicas` → **Title = "test-check | Jaleca | Jaleca"** e **H1 = "test-check"**
  - `/blog/jaleco-slim-padrao-clinicas` → **Title = "test-check | Jaleca | Jaleca"** e **H1 = "test-check"**
  - **Ação**: Reescrever imediatamente para títulos decritivos.

### Páginas 404
- **Zero páginas 404 detectadas** na amostra. Status: OK.

---

## 3. OPORTUNIDADES RÁPIDAS — PÁGINA 2

| Keyword | Posição | URL atual | O que fazer para empurrar para Pág. 1 |
|---|---|---|---|
| **jaleco feminino** | 19 | `/categoria/jalecos-femininos` | **Title**: `Jaleco Feminino: Modelos Slim, Princesa, Elastex | Jaleca` (corrigir "Femenino"). **H1**: `Jalecos Femininos Premium: Slim, Princesa e Elastex`. Adicionar 300 palavras de texto acima do grid explicando modelagens e como escolher. Inserir 3 FAQ schema. Adicionar vídeo UGC se houver. |
| **jaleco estudante medicina** | 11 | `/jaleco-medicina` | Adicionar seção "Jaleco para Estudante de Medicina" com H2 exclusivo. Incluir tabela de tamanhos PP-G3. Schema `EducationalOccupationalCredential` + `FAQ`. Internlinkar do blog para essa URL com anchor "jaleco estudante medicina". |
| **jaleco odontologia** | 9 | `/blog/jaleco-odontologia-como-escolher` | Já está na página 1, mas é blog. Criar link interno no blog para `/jaleco-dentista` com anchor "comprar jaleco para odontologia" para transferir juice para a página transacional. |

---

## 4. GSC — AÇÕES URGENTES
*(Dados não fornecidos diretamente, mas inferido das posições nulas)*

### Queries com CTR provavelmente baixo
Como Jaleca tem 100% branded traffic, as queries genéricas que aparecem na P2 provavelmente têm CTR baixo por titles genéricos.

| URL | Title atual | Title otimizado (exemplo) | Meta Description otimizada |
|---|---|---|---|
| `/categoria/jalecos` | `Jalecos para Médicos e Profissionais de Saúde \| Jaleca` | `Jalecos Profissionais: Feminino, Masculino e Plus Size \| Jaleca` | `Jalecos premium com tecido Elastex e gabardine. Modelos Slim, Princesa e Tradicional. Tamanhos PP ao G3. Frete grátis Sudeste acima de R$499.` |
| `/categoria/jalecos-femininos` | `Jaleco Femenino à Venda Online...` | `Jaleco Feminino: Slim, Princesa, Elastex \| Jaleca` | `Jalecos femininos com molde próprio — não é o masculino adaptado. 12 cores, do PP ao G3. Frete grátis SP/MG/RJ/ES acima de R$499.` |
| `/jaleco-medico` | `Jaleco para Médico: Tecido Premium...` | `Jaleco para Médico: SLIM e Profissional \| Jaleca` | `Jaleco médico masculino e feminino em tecido Elastex. Modelagem Slim e Profissional. PP ao G3. Confira as normas do CFM.` |
| `/jaleco-enfermeiro` | `Jaleco para Enfermeiro: Tecido Premium...` | `Jaleco Enfermagem: Slim, Profissional, Plus Size \| Jaleca` | `Jaleco para enfermeiro com elastano e bolsos funcionais. Modelos Slim e Profissional do PP ao G3. Frete grátis Sudeste.` |

### Páginas que precisam de reescrita imediata
- `/blog/jaleco-slim-feminino-favorito-medicas`
- `/blog/jaleco-slim-padrao-clinicas`
- `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` (redireciona para blog; recuperar conteúdo)

---

## 5. GAP DE KEYWORDS

**Top 30 keywords que concorrentes rankeiam e Jaleca não aparece**

| # | Keyword | Volume | Quem rankeia | Página para criar/otimizar na Jaleca |
|---|---------|--------|--------------|--------------------------------------|
| 1 | jaleco | 60.500 | JalecoOnline (3º) | Potencializar `/categoria/jalecos` |
| 2 | jalecos | 60.500 | JalecoOnline (3º) | Idem |
| 3 | jalecos femininos | 40.500 | JalecoOnline (4º), DraCharm (1º) | `/categoria/jalecos-femininos` |
| 4 | jaleco feminino | 40.500 | Jaleca (19º) | URGENTE: otimizar categoria |
| 5 | jaleco personalizado | 3.600 | DrJaleco (17º) | Criar `/jaleco-personalizado` ou `/bordados` |
| 6 | pijama cirurgico masculino | 3.600 | DrJaleco (23º) | Otimizar `/produto/conjunto-scrub-masculino-jaleca` + categoria |
| 7 | jaleco enfermagem feminino | 1.300 | JalecoOnline (7º) | Otimizar `/jaleco-enfermeira` + `/jaleco-enfermagem` |
| 8 | jaleco médico | 1.600 | DrJaleco (8º) | Otimizar `/jaleco-medico` |
| 9 | jaleco pediatria | 720 | JalecoOnline (1º) | Criar `/jaleco-pediatra` ou `/jaleco-pediatria` |
| 10 | jaleco pediatra | 720 | JalecoOnline (2º) | Idem |
| 11 | jaleco de dentista | 320 | JalecoOnline (7º) | Otimizar `/jaleco-dentista` |
| 12 | jaleco estampado | 720 | DraCharm (1º) | Criar `/categoria/jalecos-estampados` ou blog |
| 13 | jaleco preto | 1.900 | DraCharm (1º) | Otimizar `/jaleco-preto-feminino` |
| 14 | jaleco colorido | 390 | JalecoOnline (5º) | Criar `/categoria/jalecos-coloridos` |
| 15 | jaleco feminino colorido | 210 | JalecoOnline (3º) | Idem |
| 16 | scrub feminino | 33.100 | DraCharm | `/categoria/conjuntos-femininos` ou `/scrub-feminino` |
| 17 | comprar jaleco | 480 | JalecoOnline (9º) | Otimizar home + categoria |
| 18 | jaleco online | 170 | JalecoOnline (1º), Donne (6º) | Home + `/produtos` |
| 19 | jaleco odontologia feminino | 170 | JalecoOnline (9º) | `/jaleco-dentista` |
| 20 | jaleco branco feminino | — | DraCharm/geral | Criar landing `/jaleco-branco-feminino` |
| 21 | jaleco azul claro | 210 | DrJaleco (24º) | Criar filtros `/categoria/jalecos?cor=azul-claro` |
| 22 | jaleco nutrição feminino | 260 | JalecoOnline (11º) | Otimizar `/jaleco-nutricionista` |
| 23 | jaleco colete | 260 | Donne (6º), Chic (2º) | Otimizar `/produto/max-colete-jaleca` |
| 24 | jaleco alfaiataria | 480 | JalecoChic (1º) | Criar `/categoria/jalecos-alfaiataria` |
| 25 | jaleco elegante / luxo | 590+260 | JalecoChic (1º) | Criar `/jaleco-premium` (já existe, mas precisa de SEO) |
| 26 | jaleco manga curta | 1.300 | JalecoOnline (9º) | Criar categoria `/categoria/jalecos-manga-curta` |
| 27 | pijama cirúrgico feminino | — | DraCharm (1º) | `/pijama-cirurgico-feminino` (já existe!) |
| 28 | jaleco veterinária | — | DrJaleco | Otimizar `/jaleco-veterinario` + `/jaleco-veterinaria` |
| 29 | jaleco farmácia | — | — | Otimizar `/jaleco-farmacia` |
| 30 | jaleco estudante | — | — | Criar `/jaleco-universitario` (já existe, expandir) |

---

## 6. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO

Pergunta detectada para **"jaleco médico"**:
- "Como se chama o jaleco do médico?" → Criar post: *"Como se chama o jaleco do médico? Entenda os tipos: jaleco, scrub e bata cirúrgica"*
- "Quem pode usar DR no jaleco?" → Post: *"Dr. no jaleco: quem pode usar? Guia do CFM e como bordar"*
- "Qual jaleco é melhor, Oxford ou gabardine?" → Post: *"Oxford vs Gabardine: qual tecido de jaleco dura mais?"* (linkar para produtos)
- "Como deve ser o jaleco de Medicina?" → Post: *"Jaleco de Medicina: normas do CFM, cores e modelos permitidos"*

**Outras PAA sugeridas para produzir:**
- "Jaleco branco ou colorido: o que o CFM permite?" (volume implícito alto — já tem post do CRO, replicar para CRM)
- "Jaleco precisa ter nome bordado?"
- "Jaleco Slim ou Tradicional: qual comprar?"
- "Qual a diferença entre jaleco e scrub?"

---

## 7. CONTEÚDO FRACO

### Páginas com menos de 400 palavras
| URL | Palavras | Problema | O que adicionar |
|---|---|---|---|
| `/categoria/domas-femininas` | 448 | Categoria sem descrição | 300 palavras sobre dólmã feminina, tecidos, ocasiões de uso |
| `/categoria/domas-masculinas` | 431 | Idem | 300 palavras sobre dólmã masculina, diferença vs jaleco |
| `/categoria/domas` | 499 | Genérico | Explicar diferença jaleco vs dólmã com tabela comparativa |

### Páginas "thin" perigosas (400-700 palavras — e-commerce raso)
| URL | Palavras | Risco | Enriquecimento |
|---|---|---|---|
| `/categoria/jalecos-masculinos` | 614 | H2 vazio | Adicionar texto sobre modelagens Slim, Tradicional, com zíper. FAQ: "Jaleco masculino pode ser acinturado?" |
| `/categoria/acessorios` | 508 | Genérico | Descrever toucas, faixas, aventais. Linkar para cada SKU |
| `/categoria/conjuntos-masculinos` | 473 | Pouco conteúdo | Explicar o que é scrub masculino, diferença do jaleco, cores disponíveis |
| `/categoria/jalecos` | 698 | Poderia ter 1500+ | Adicionar guia de modelos (Slim, Princesa, Duquesa, Elastex, Gold) com anchor links |

### Páginas de cidade (conteúdo near-duplicate)
Todas as URLs `/cidade/jaleco-[cidade]` seguem o mesmo template de ~730-790 palavras. **Isso é toxic para SEO.**

**Recomendação estratégica:**
- **Manter indexadas apenas**: `/cidade/jaleco-ipatinga`, `/cidade/jaleco-belo-horizonte`, `/cidade/jaleco-colatina`, `/cidade/jaleco-contagem`, `/cidade/jaleco-caratinga`, `/cidade/jaleco-teofilo-otoni`, `/cidade/jaleco-guarapuava` (onde há loja física).
- **Noindexar ou remover** todas as outras (~65 URLs) para liberar crawl budget e authority.

**Exceção**: Se houver estratégia de Google Ads geolocalizado, manter como **páginas de destino de campanha** com `noindex`, não para SEO.

---

## 8. BACKLINKS

### Comparação

| Site | Backlinks | Domínios Ref. | Rank | Diagnóstico |
|---|---|---|---|---|
| **jaleca.com.br** | 83 | 50 | **145** | **Muitos backlinks, mas baixa autoridade percebida.** Possivelmente links de diretórios genéricos ou perfis de loja. |
| drjaleco.com.br | 75 | 59 | 37 | Menos backlinks, melhor rank = **links de maior qualidade** (provavelmente de blogs médicos e universidades). |
| dracharm.com.br | 45 | 38 | 17 | Backlinks de moda, influencers de saúde. Alta relevância tópica. |
| jalecoonline.com.br | 39 | 37 | 0 | Perfil limpo, links orgânicos. |

### Por que Jaleca tem mais links e pior rank?
Provavelmente os 50 domínios são de baixa qualidade (feeds de e-commerce, listas genéricas, perfis de empresa). O Google pode estar desconsiderando esses links ou, pior, o site sofre de **thin content penalty** que anula o valor dos backlinks.

### Estratégia de aquisição de backlinks (90 dias)
1. **Conselhos regionais (CRM/CRO/COREN/CFN)**:
   - Criar guia "Normas do CFM para jalecos" e pedir link nos portais de "jovem médico" ou "ética profissional".
2. **Faculdades de Medicina/Enfermagem**:
   - Página `/jaleco-universitario` + `/blog/cerimonia-do-jaleco` → oferecer cupom de 10% para alunos em troca de link na página de atlética/colegiado.
3. **Blogs de saúde e moda profissional**:
   - Guest post: *"Como escolher o jaleco ideal para longas jornadas de plantão"* → link para `/categoria/jalecos`.
4. **Fornecedores/Tecidos**:
   - Se usar elastano da Lycra® ou similar, pedir citação no site do fornecedor (Lenzing, Conejozzi etc.).

---

## 9. PERFORMANCE

| URL | Performance | SEO | Best Practices | Problema |
|---|---|---|---|---|
| `/` | 97 | 100 | 77 | Best Practices baixo: verificar console.log expostos, Mixed Content, ou bibliotecas JS desatualizadas |
| `/produtos` | 91 | 100 | 77 | Mesmo padrão |
| `/categoria/jalecos` | 100 | 100 | 77 | OK |
| `/categoria/jalecos-femininos` | 96 | 100 | 77 | OK |
| `/categoria/jalecos-masculinos` | 98 | 100 | 77 | OK |

### O que corrigir
- **Best Practices 77**: Geralmente indicam:
  - Console JavaScript não tratado
  - Imagens sem `width`/`height` explícitos (causando CLS)
  - Versões antigas de bibliotecas de rastreamento (Facebook Pixel, Analytics) com vulnerabilidades conhecidas
  - **Ação**: Auditoria de segurança de dependências JS via Lighthouse e Chrome DevTools → Console.

---

## 10. PLANO DE AÇÃO DE HOJE

### ⚡ FAZER AGORA (esta sessão do Claude Code)

| URL | O que fazer | Impacto | Tempo |
|---|---|---|---|
| `/blog/jaleco-slim-feminino-favorito-medicas` | Alterar **title** para: `Jaleco Slim Feminino: Por que é o Favorito das Médicas \| Jaleca`. Alterar **H1** para: `Jaleco Slim Feminino: O Modelo Mais Escolhido por Médicas` | Remove sinal de site quebrado/teste para Google | 5 min |
| `/blog/jaleco-slim-padrao-clinicas` | Alterar **title** para: `Jaleco Slim Padrão para Clínicas: Guia de Modelos \| Jaleca`. Corrigir **H1** e remover canonical cruzada | Consolida sinal de ranking |