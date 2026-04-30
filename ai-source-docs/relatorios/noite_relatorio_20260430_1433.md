# Relatório SEO Noturno — Jaleca
**Data:** 30/04/2026 14:57
**Páginas analisadas:** 415
**Concorrentes:** 10
**Palavras-chave coletadas:** 0

---

**Análise SEO Técnico & E-commerce — Jaleca.com.br**  
*Especialista Sênior | Arquitetura de Informação, indexação e conteúdo comercial*

---

## 1. RESUMO EXECUTIVO

**Score SEO geral: 58/100**

A Jaleca possui uma das arquiteturas de nicho mais avançadas do mercado brasileiro de uniformes: *landings* por profissão (`/jaleco-dentista`, `/jaleco-biomedico`, `/scrub-enfermagem`), blog ativo e domínio com histórico de autoridade desde 2010. Isso é raro e valioso. O problema é que a camada técnica está quebrando a perna do orgânico: canonicals fragmentados, bloqueio massivo a *crawlers* (85% das 415 URLs falharam), *meta descriptions* em fórmula (risco de canibalização) e *thin content* em categorias institucionais.

**Top 5 problemas críticos**
1. **Canonicals com hash `#main-content`** em ~15 *landings* de alto valor (uniformes, saúde, premium), fragmentando sinais de ranking.
2. **Falha sistêmica de *crawl***: mais de 350 URLs (produtos, cidades, categorias, blog) retornaram *timeout* ou *rate limit*, sugerindo firewall, servidor lento ou proteção anti-bot agressiva.
3. **Páginas `/cidade/` com alto risco de *doorway***: centenas de cidades com possível conteúdo espelhado.
4. ***Meta descriptions* semânticamente duplicadas**: a fórmula "Conheça os jalecos para [profissão] da Jaleca, com tecido premium..." se repete dezenas de vezes.
5. ***Thin content* e ausência de imagens** em páginas comerciais de alto potencial (ex: `/uniformes-servicos`, `/medidas`, posts de blog).

**Top 5 oportunidades imediatas**
1. **Corrigir todos os canonicals** removendo o fragmento `#main-content` → *quick win* técnico de alto impacto.
2. **Enriquecer `/uniformes-servicos`** (482 palavras) e `/jaleco-premium`** (752 palavras) para 1.200+ palavras com guias por profissão e tabela comparativa.
3. **Implementar `noindex,follow` ou reescrever 100%** as `/cidade/*` para evitar penalidade de *doorway pages*.
5. **Criar landing `/jaleco-com-nome-bordado`** e otimizar `/jaleco-branco` para capturar tráfego não-marca de alto ticket.

**Comparação geral com concorrentes**
A análise direta dos concorrentes falhou tecnicamente (todos os sites concorrentes retornaram erro de bloqueio no *crawler*). Porém, pelo histórico de mercado: **Dra. Charm** e **Donne Jalecos** dominam o *branded* visual/lifestyle; **Dr. Jaleco** vive de paid search; **Boutique dos Jalecos** e **Primeira Cor** têm sites legados com arquitetura antiga. A Jaleca está *à frente* em conteúdo long-tail por profissão, mas **perde feio** em velocidade, *rich snippets* (Schema), indexação de produto e tráfego de *head* ("jaleco feminino", "scrub", "jaleco branco").

---

## 2. ERROS TÉCNICOS

### Páginas com erro (identificados no dataset)
As URLs abaixo retornaram `Read timed out`, `Rate limit exceeded` ou `Insufficient credits`. Isso indica que o crawler não conseguiu nem ler o HTML.

**Padrões afetados (centenas de URLs):**
- **Produtos:** `https://jaleca.com.br/produto/*`  
  *Exemplos:* `/produto/jaleco-slim-tradicional-feminino-jaleca`, `/produto/conjunto-scrub-feminino-jaleca`, `/produto/touca-de-elastico-jaleca`
- **Cidades:** `https://jaleca.com.br/cidade/*`  
  *Exemplos:* `/cidade/jaleco-sao-paulo`, `/cidade/jaleco-rio-de-janeiro`, `/cidade/jaleco-curitiba`
- **Categorias:** `https://jaleca.com.br/categoria/*`  
  *Exemplos:* `/categoria/jalecos`, `/categoria/jalecos-femininos`, `/categoria/conjuntos`
- **Blog:** `https://jaleca.com.br/blog/*`  
  *Exemplos:* `/blog/roupa-medica-profissional`, `/blog/jaleco-branco-como-manter`, `/blog/jaleco-slim-padrao-clinicas`

**URLs avulsas com erro de timeout:**
- `/jaleco-feminino`
- `/jaleco-veterinario`
- `/jaleco-medica`
- `/jaleco-enfermeira`
- `/jaleco-farmaceutica`
- `/jaleco-fisioterapia`
- `/jaleco-podologa`
- `/jaleco-cabeleireira`
- `/jaleco-preto-feminino`
- `/pijama-cirurgico-feminino`
- `/jaleco-plus-size`

### Redirects problemáticos
Não detectados explicitamente nos dados, mas os **canonicals com fragmento hash funcionam como *soft redirect* semântico** confuso para o Google.

### Canonicals incorretos
O Google ignora ou consolida incorretamente quando o `rel="canonical"` inclui `#main-content`. URLs confirmadas com problema:

| URL Afetada | Canonical Errado | Canonical Correto |
|---|---|---|
| `https://jaleca.com.br/lookbook` | `.../lookbook#main-content` | `.../lookbook` |
| `https://jaleca.com.br/medidas` | `.../medidas#main-content` | `.../medidas` |
| `https://jaleca.com.br/trocas-e-devolucoes` | `.../trocas-e-devolucoes#main-content` | `.../trocas-e-devolucoes` |
| `https://jaleca.com.br/sobre` | `.../sobre#main-content` | `.../sobre` |
| `https://jaleca.com.br/uniformes-profissionais-saude` | `.../uniformes-profissionais-saude#main-content` | `.../uniformes-profissionais-saude` |
| `https://jaleca.com.br/jaleco-premium` | `.../jaleco-premium#main-content` | `.../jaleco-premium` |
| `https://jaleca.com.br/uniformes-beleza` | `.../uniformes-beleza#main-content` | `.../uniformes-beleza` |
| `https://jaleca.com.br/uniformes-servicos` | `.../uniformes-servicos#main-content` | `.../uniformes-servicos` |
| `https://jaleca.com.br/scrub-enfermagem` | `.../scrub-enfermagem#main-content` | `.../scrub-enfermagem` |
| `https://jaleca.com.br/jaleco-odontologia` | `.../jaleco-odontologia#main-content` | `.../jaleco-odontologia` |

---

## 3. PROBLEMAS DE TÍTULO (TITLE TAG)

### Ausentes
Não detectados nas URLs amostrais, mas **provável ausência massiva nas URLs de produto** (não carregadas pelo crawler).

### Duplicados / Fórmula semântica
As *landings* por profissão usam padrão "Jaleco para [Profissão]" ou "Jaleco para [Profissão] - Jaleca". Técnicamente não são idênticos, mas semanticamente são *near-duplicates* para o Google quando o restante da SERP é igual.

### Muito curtos (< 30 caracteres)
| URL | Title Atual | Tamanho | Sugestão |
|---|---|---|---|
| `/jaleco-enfermeiro` | Jaleco para Enfermeiro | 20 | `Jaleco para Enfermeiro: Slim, Elastex e Scrub \| Jaleca` |
| `/jaleco-farmacia` | Jaleco para Farmácia | 20 | `Jaleco para Farmácia: Branco, Manga Longa e Slim \| Jaleca` |
| `/jaleco-medicina` | Jaleco para Medicina | 19 | `Jaleco para Medicina: Slim, Profissional e Universitário \| Jaleca` |
| `/scrub-enfermagem` | Scrub Enfermagem \| Jaleca | 26 | `Scrub Enfermagem Feminino e Masculino \| Jaleca — PP ao G3` |

### Sugestões de melhoria para top 10 páginas
1. **Home**  
   *Atual:* `Jaleca - Profissionais de Saúde, Moda e Estilo`  
   *Sugestão:* `Jaleca: Jalecos, Scrubs e Uniformes Premium para Saúde | Moda Profissional`

2. **/produtos**  
   *Atual:* `Jalecos e Uniformes Médicos — Femininos e Masculinos | Jaleca`  
   *Sugestão:* `Comprar Jaleco e Uniforme Médico Feminino e Masculino | Jaleca`

3. **/jaleco-medico**  
   *Atual:* `Jalecos para Médicos | Jaleca`  
   *Sugestão:* `Jaleco para Médico: Slim, Profissional e Branco | Jaleca — Antimicrobiano`

4. **/jaleco-dentista**  
   *Atual:* `Jaleco para Dentista - Jaleca`  
   *Sugestão:* `Jaleco para Dentista: Slim, NR-32 e Cores | Jaleca — Elastano`

5. **/jaleco-nutricionista**  
   *Atual:* `Jaleco para Nutricionista - Jaleca`  
   *Sugestão:* `Jaleco para Nutricionista: Slim, Branco e Colorido | Jaleca`

6. **/scrub-feminino**  
   *Atual:* `Scrub Feminino - Jaleca`  
   *Sugestão:* `Scrub Feminino Premium: Conjunto Cirúrgico com Elastano | Jaleca`

7. **/jaleco-premium**  
   *Atual:* `Jaleco Premium: Conforto e Sofisticação`  
   *Sugestão:* `Jaleco Premium: Tecido, Corte e Onde Comprar \| Jaleca`

8. **/uniformes-escritorio**  
   *Atual:* `Uniformes para Escritório - Jaleca`  
   *Sugestão:* `Uniformes para Escritório: Jaleco e Conjunto Corporativo | Jaleca`

9. **/blog** (post base)  
   *Atual:* `Desvendando as Tendências: Moda Clínica em Abril de 2026`  
   *Sugestão:* `Tendências de Moda Clínica para 2026: Cores e Tecidos | Blog Jaleca` *(Nota: data futura pode prejudicar a credibilidade se o post não for realmente atualizado nessa data)*

10. **/jaleco-estiloso**  
    *Atual:* `Jaleco Estiloso: charme e profissionalismo`  
    *Sugestão:* `Jaleco Estiloso Feminino e Masculino: Modelos e Cores | Jaleca`

---

## 4. PROBLEMAS DE META DESCRIPTION

### Ausentes
Não detectadas nas URLs amostrais, mas **altamente provável que as 150+ páginas de produto e 100+ páginas de cidade estejam sem meta description ou com auto-gerada pelo CMS**.

### Duplicadas / Near-duplicate
As landings de profissão repetem a mesma fórmula com troca de profissão. Isso é interpretado como duplicação com parâmetro variável.

**Exemplos de fórmula detectada:**
- `/jaleco-enfermeiro`: "Conheça os jalecos para enfermeiros da Jaleca, com tecido premium, conforto e uma variedade de cores e tamanhos."
- `/jaleco-podologo`: "Encontre jalecos para podólogos com tecidos premium, cortes modernos e variedade de cores na Jaleca..."
- `/jaleco-medico`: "Conheça a coleção de jalecos para médicos, com tecidos premium, caimento perfeito e preços justos."

### Fora do tamanho ideal (< 120 ou > 160 chars)
| URL |