# PRD — Blog Jaleca com IA Humanizada

## Objetivo

Criar um sistema de geração e atualização de conteúdo para o blog da Jaleca que:
1. **Reescreva textos existentes** — remova palavras/frases de IA, mantendo formatação e SEO
2. **Gere novos textos** — evitando palavras da blacklist em toda criação
3. **Soarque como brasileiro real** — tom conversational, não robótico

---

## Blacklist de Palavras e Frases

### CONECTIVOS ROBÓTICOS
```
Primeiramente, Ademais, Outrossim, Não obstante, Assim sendo,
Destarte, Logo após, Por conseguinte, Em síntese, Em suma,
No que diz respeito, No tocante a, No que tange, No que se refere,
Concernente a, No que concerne, No que diz respeito, No tocante,
Por forma que, De sorte que, De tal maneira que, De modo que,
A priori, A posteriori, Verb gratia, Por ora
```

### VERBOS POMPOSOS
```
Potencializar, Maximizar, Otimizar, Ressignificar, Externalizar,
Internalizar, Consolidar, Estruturar, Esquadrinhar, Perenizar,
Verticalizar, Enfatizar (excessivo), Destacar (excessivo),
Cumular, Agregar, Propender, Convergir, Tangenciar
```

### SUBSTANTIVOS ABSTRATOS
```
Funcionalidade (excessivo), Robustez, Paradigma, Ecosystem,
Expertise, Know-how, Insight (inglês sem necessidade),
Cutting-edge, State-of-the-art, Best practice, Workflow,
Output, Input, Deliverable, Touchpoint, Roadmap, Gap
```

### ADJETIVOS VAGOS
```
Inédito, Inovador (excessivo), Transformador, Exclusivo (excessivo),
Ágil (excessivo), Estratégico (excessivo), Abrangente, Consistente,
Profícuo, Nefasto, Pecunário, Íntegro
```

### LOCUÇÕES A EVITAR
```
É importante ressaltar que, É fundamental destacar que,
É válido salientar que, Deixe-me explicar, Como podemos observar,
Podemos notar que, É possível notar, Fica evidente, Nota-se que,
Ressalta-se que, Conclui-se que, É preciso destacar,
Neste sentido, Neste contexto, Nessa perspectiva,
Sob tal óptica, Pressupõe, Partindo desse princípio,
Com base nisso, À luz disso, Face ao exposto,
Posto isso, Isto posto, Cumpre destacar, Cabe ressaltar,
Faz-se necessário, Torna-se imperativo, É mister,
Não resta dúvida que, Inquestionavelmente, Indubitavelmente,
Sem sombra de dúvida, À priori, Sob hipótese alguma,
Em tempo algum
```

### EXPRESSÕES REPETIDAS
```
primeiramente, por exemplo (excessivo), ou seja,
na verdade, bom na verdade, entendeu?, né (forçado),
basicamente, essencialmente, teoricamente, praticamente,
virtualmente, eventualmente, possivelmente, provavelmente,
certamente, definitivamente
```

### TERMINOLOGIA TECH/IA (em contexto não-técnico)
```
Algoritmo, Machine learning, Inteligência artificial,
Automatização, Processamento de dados, Base de dados,
Dataset, Deep learning, Neural network
```

### FRASES INICIAIS ROBÓTICAS
```
Bem-vindo a este artigo, Neste artigo vamos falar sobre,
Você sabia que, Você já se perguntou, O que é realmente,
Aqui está o que você precisa saber, Sem mais delongas,
Vamos direto ao ponto, Citando, Segundo especialistas
```

---

## Regras de Geração de Conteúdo

### Tom e Estilo
- Escritor brasileiro real, não robô
- Usar contrações: "vc", "pra", "né", "tipo", "na verdade"
- Frases curtas e diretas
- Evitar encadeamento excessivo de frases
- Pular linhas entre parágrafos curtos

### Formatação
- Manter TODAS as tags HTML existentes (h2, h3, p, ul, li, strong, a)
- Não alterar links internos
- Preservar estrutura de SEO (meta description, slug, keywords)
- Manterno máximo 4 seções H2, sem H3

### Estrutura do Artigo
- Título direto (máx 60 chars)
- 2-3 parágrafos curtos por seção (máx 500-700 palavras total)
-Máximo 2 links internos (usar só URLs válidas da lista)
- Keywords integradas naturalmente, não forçadas

### Links Válidos (não inventar outros)
```
Categorias: /categoria/jalecos, /categoria/jalecos-femininos,
/categoria/jalecos-masculinos, /categoria/jalecos-personalizados,
/categoria/scrub, /categoria/conjuntos, /categoria/dolmas,
/categoria/calcados, /categoria/acessorios

Produtos: /produto/jaleco-slim-elastex-feminino-varias-cores-jaleca,
/produto/jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca,
/produto/jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca,
/produto/jaleco-universitario-unissex-jaleca,
/produto/jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca,
/produto/jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca,
/produto/conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca

Páginas: /produtos, /medida, /faq
```

---

## Fluxo de Trabalho

### 1. Reescrever Texto Existente
**Input:** Artigo com texto "pompas de IA"
**Processo:**
- Identificar frases da blacklist
- Substituir por equivalente brasileiro natural
- Manter formatação HTML intacta
- Manter keywords e estrutura SEO

**Output:** Texto reescrito, mesmo assunto, tom humano

### 2. Gerar Novo Texto
**Input:** Tema + keywords + contexto Jaleca
**Processo:**
- Consultar blacklist ANTES de gerar
- Evitar todas as palavras da lista
- Aplicar regras de tom e estilo
- Usar estrutura de artigo definida

**Output:** Artigo otimizado para SEO, tom humano, sem palavras de IA

---

## checklist de Validação

Após gerar/reescrever, verificar:
- [ ] Nenhuma palavra da blacklist presente
- [ ] Tom conversacional brasileiro
- [ ] Frases curtas e diretas
- [ ] Formatação HTML intacta
- [ ] Links internos válidos (só da lista)
- [ ] Keywords integradas naturalmente
- [ ] Sem frases iniciais robóticas

---

## Stack Técnica (para implementação)

- **Geração:** Gemini ou MiniMax com prompt direcionado
- **Blacklist:** Implementar como array no código, checar antes de output
- **Validação:** Função `isAIContent(text)` que retorna true se encontrar palavras da blacklist

---

## Status

- [x] PRD criado
- [ ] Implementar blacklist no código
- [ ] Criar função de validação
- [ ] Testar com artigo existente
- [ ] Aplicar em todos os posts do blog