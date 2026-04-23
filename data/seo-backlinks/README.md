# SEO Backlinks Cleanup — Jaleca.com.br
Generated: 2026-04-23

## PROBLEMA
- 60 broken backlinks apontando para jaleca.com.br (status 526 Cloudflare)
- 36 domínios PBN spam com links não autorizados
- Spam score atual: 14 (pode subir se não limpar)
- 28 domínios em comum com amodabranca.com.br (mesmo fornecedor PBN)

## AÇÕES

### 1. UPLOAD DISAVOW (5 min) — Google Search Console
URL: https://search.google.com/search-console/disavow-links
Arquivo: disavow-jaleca.txt (36 domínios PBN)

Passos:
1. Abra Google Search Console > selecione jaleca.com.br
2. Vá em Links > More > Disavow links
3. Clique Upload Disavow File
4. Selecione o arquivo: data/seo-backlinks/disavow-jaleca.txt
5. Confirme o upload

### 2. CLOUDFLARE REDIRECTS (10 min) — Cylex URLs
URL: https://dash.cloudflare.com > Rules > Redirect Rules

19 regras de redirect (source URL -> destination):
- /londrina/by-jaleco-12993282.html -> /
- /londrina/use-trust-11753042.html -> /
- /londrina/jaleca-londrina-12996647.html -> /
- /londrina/melissa-moda-evangelica-13366669.html -> /
- /londrina/flor-d-liz-moda-feminina-ltda-11009071.html -> /
- /londrina/industria-e-comercio-de-uniformes-nelliza-ltda-11223851.html -> /
- /londrina/claupa-confeccoes-ltda-11223834.html -> /
- /londrina/karilu-uniformes-11223880.html -> /
- /londrina/j-s-sport-12665331.html -> /
- /londrina/happyness-confeccoes-masculino-feminino-e-infantil-11705603.html -> /
- /londrina/atelier-dos-uniformes-gisele-11223830.html -> /
- /londrina/sonia-swarca-confeccoes-11210987.html -> /
- /londrina/emporio-k-tricot-jd-piza-11704505.html -> /
- /londrina/linha-fina-uniformes-12665722.html -> /
- /londrina/cartas-na-manga-uniformes-sociais-personalizados-12579597.html -> /
- /londrina/erva-cha-casual-13046641.html -> /
- /londrina/paint-horse-moda-country-12255400.html -> /
- /londrina/kidbaby-confeccoes-12210942.html -> /
- /londrina/uniformes-londrina-12956956.html -> /

### 3. EMAIL REMOVAL REQUESTS (opcional)
Arquivo: pbn-removal-email-template.txt
Domínios: 34 domínios PBN para tentar remoção manual

## RESULTADO ESPERADO
- After disavow: spam score cai para 5-8
- After redirects: 19 links legítimos voltando a funcionar
- 4-8 semanas: Google reavalia perfil e posições melhoram

## ARQUIVOS
- disavow-jaleca.txt — para Google Disavow Tool
- cloudflare-cylex-redirects.txt — para Cloudflare Redirect Rules
- pbn-removal-email-template.txt — template para emails
- report.json — resumo dos dados
- broken-backlinks-full.json — dados completos dos 60 links