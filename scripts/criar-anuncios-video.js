/**
 * CRIAR ANÚNCIOS DE VÍDEO — Meta Ads
 * 1. Faz upload do vídeo local para a conta de anúncios
 * 2. Aguarda processamento
 * 3. Cria criativo e anúncio nos 3 ad sets existentes
 */

require("dotenv").config({ path: ".env.google-ads" });
const fs   = require("fs");
const path = require("path");

const TOKEN      = (process.env.META_ADS_TOKEN || "").trim().replace(/\\n/g, "");
const ACCOUNT_ID = (process.env.META_ADS_ACCOUNT_ID || "").trim().replace(/\\n/g, ""); // act_2098470580937214
const BASE       = "https://graph.facebook.com/v21.0";

const VIDEO_PATH = "/Users/rhammon/Downloads/Jaleco-Jaleca-Slim-branco.MP4.MP4";

const AD_TEXT     = `Antes de você se apresentar, seu jaleco já foi avaliado.\nVista o que você merece.\n3x sem juros · Frete Grátis SP, RJ, MG, ES`;
const AD_HEADLINE = "Jalecos Jaleca — Compre Agora";
const AD_URL      = "https://jaleca.com.br/produtos?categoria=jalecos-femininos";

// Ad sets criados via API (por nome — sem acento, como aparecem na API)
const AD_SETS_NAMES = [
  "Lookalike 1% BR - Mulheres 22-50",
  "Saude - Profissionais Saude BR",
  "Beleza - Manicure Salao Cosmetologia",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function metaGet(path, params = {}) {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  const d = await r.json();
  if (d.error) throw new Error(`GET ${path}: ${d.error.message} (code ${d.error.code})`);
  return d;
}

async function metaPost(path, body) {
  const url  = `${BASE}/${path}`;
  const form = new URLSearchParams({ access_token: TOKEN, ...body });
  const r    = await fetch(url, { method: "POST", body: form });
  const d    = await r.json();
  if (d.error) {
    const detail = d.error.error_user_msg || "";
    throw new Error(`POST ${path}: ${d.error.message} (code ${d.error.code}) ${detail}`);
  }
  return d;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── STEP 1: Upload vídeo ────────────────────────────────────────────────────
async function uploadVideo() {
  console.log("\n📤 STEP 1 — Fazendo upload do vídeo...");

  if (!fs.existsSync(VIDEO_PATH)) {
    throw new Error(`Arquivo não encontrado: ${VIDEO_PATH}`);
  }

  const stat     = fs.statSync(VIDEO_PATH);
  const fileSize = stat.size;
  console.log(`  Arquivo: ${path.basename(VIDEO_PATH)}`);
  console.log(`  Tamanho: ${(fileSize / 1024 / 1024).toFixed(1)} MB`);

  // Upload via multipart form (não URLSearchParams — precisa de FormData com arquivo)
  const { FormData, Blob } = require("buffer") in global ? global : await import("node:buffer").catch(() => ({}));

  // Node 18+ tem FormData nativo. Node 16- precisa de pacote.
  // Vamos usar uma abordagem multipart manual para compatibilidade máxima.
  const boundary  = `----FormBoundary${Date.now()}`;
  const videoData = fs.readFileSync(VIDEO_PATH);
  const filename  = path.basename(VIDEO_PATH);

  const parts = [];

  function addField(name, value) {
    parts.push(
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`)
    );
  }

  addField("access_token", TOKEN);
  addField("name", "Jaleco Slim Branco - Vídeo Abr 2026");

  // arquivo
  parts.push(Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="source"; filename="${filename}"\r\nContent-Type: video/mp4\r\n\r\n`
  ));
  parts.push(videoData);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  const body = Buffer.concat(parts);

  const r = await fetch(`${BASE}/${ACCOUNT_ID}/advideos`, {
    method:  "POST",
    headers: {
      "Content-Type":   `multipart/form-data; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body,
  });

  const d = await r.json();
  if (d.error) {
    throw new Error(`Upload vídeo: ${d.error.message} (code ${d.error.code})`);
  }

  const videoId = d.id;
  console.log(`  ✅ Upload concluído! Video ID: ${videoId}`);
  return videoId;
}

// ─── STEP 2: Aguardar processamento ─────────────────────────────────────────
async function aguardarProcessamento(videoId) {
  console.log("\n⏳ STEP 2 — Aguardando processamento do vídeo...");
  const maxTentativas = 20;

  for (let i = 1; i <= maxTentativas; i++) {
    const data = await metaGet(videoId, { fields: "status,title" });
    const status = data.status?.video_status || data.status || "unknown";
    console.log(`  Tentativa ${i}/${maxTentativas}: status = ${status}`);

    if (status === "ready") {
      console.log(`  ✅ Vídeo pronto para uso!`);
      return;
    }

    if (status === "error") {
      throw new Error(`Vídeo com erro de processamento: ${JSON.stringify(data.status)}`);
    }

    // Aguarda 15s antes da próxima tentativa
    await sleep(15000);
  }

  console.log("  ⚠️  Tempo esgotado aguardando processamento. Tentando prosseguir mesmo assim...");
}

// ─── STEP 3: Buscar Page ID + Page Token ─────────────────────────────────────
let PAGE_TOKEN = null; // token da página (mais poderoso para criativos)

async function getPageId() {
  console.log("\n📄 STEP 3 — Buscando Page ID + Page Token...");

  try {
    const data = await metaGet("me/accounts", { fields: "id,name,access_token" });
    if (data.data && data.data.length > 0) {
      const page = data.data[0];
      console.log(`  ✅ Página: ${page.name} (ID: ${page.id})`);
      if (page.access_token) {
        PAGE_TOKEN = page.access_token;
        console.log(`  ✅ Page Token obtido`);
      }
      return page.id;
    }
  } catch (e) {
    console.log(`  ⚠️  me/accounts falhou: ${e.message}`);
  }

  // Fallback: busca em criativos existentes
  try {
    const ads = await metaGet(`${ACCOUNT_ID}/ads`, {
      fields: "creative{object_story_spec}",
      limit:  "10",
    });
    for (const ad of (ads.data || [])) {
      const pageId = ad.creative?.object_story_spec?.page_id;
      if (pageId) {
        console.log(`  ✅ Page ID encontrado via anúncio existente: ${pageId}`);
        return pageId;
      }
    }
  } catch (e) {
    console.log(`  ⚠️  Fallback ads falhou: ${e.message}`);
  }

  throw new Error("Não foi possível encontrar o Page ID. Verifique permissões do token.");
}

// metaPost com token customizado
async function metaPostWithToken(path, body, token) {
  const url  = `${BASE}/${path}`;
  const form = new URLSearchParams({ access_token: token, ...body });
  const r    = await fetch(url, { method: "POST", body: form });
  const d    = await r.json();
  if (d.error) {
    const detail = d.error.error_user_msg || "";
    throw new Error(`POST ${path}: ${d.error.message} (code ${d.error.code}) ${detail}`);
  }
  return d;
}

// ─── STEP 3b: Buscar thumbnail do vídeo ──────────────────────────────────────
async function getVideoThumbnail(videoId) {
  console.log(`\n🖼  Buscando thumbnail do vídeo ${videoId}...`);
  try {
    const data = await metaGet(videoId, { fields: "thumbnails" });
    const thumbs = data.thumbnails?.data || [];
    if (thumbs.length > 0) {
      // Prefere thumbnail preferida (is_preferred), senão pega a do meio
      const pref = thumbs.find(t => t.is_preferred) || thumbs[Math.floor(thumbs.length / 2)];
      console.log(`  ✅ Thumbnail: ${pref.uri.slice(0, 60)}...`);
      return pref.uri;
    }
  } catch (e) {
    console.log(`  ⚠️  Não foi possível buscar thumbnail: ${e.message}`);
  }
  // Fallback: imagem de produto do site
  return "https://wp.jaleca.com.br/wp-content/uploads/jaleco-slim-feminino.jpg";
}

// ─── STEP 4: Buscar ad sets pelo nome ───────────────────────────────────────
async function buscarAdSets(nomes) {
  console.log("\n🎯 STEP 4 — Buscando ad sets...");

  const data = await metaGet(`${ACCOUNT_ID}/adsets`, {
    fields: "id,name,status,campaign_id",
    limit:  "100",
  });

  const todos   = data.data || [];
  const paginas = [todos];

  // Paginação se houver mais
  let cursor = data.paging?.cursors?.after;
  let next   = data.paging?.next;
  while (next && cursor) {
    const page = await metaGet(`${ACCOUNT_ID}/adsets`, {
      fields: "id,name,status,campaign_id",
      limit:  "100",
      after:  cursor,
    });
    paginas.push(page.data || []);
    cursor = page.paging?.cursors?.after;
    next   = page.paging?.next;
    if (!next) break;
  }

  const todos_flat = paginas.flat();
  console.log(`  Todos os ad sets encontrados:`);
  todos_flat.forEach(a => console.log(`    - "${a.name}" (${a.id}) [${a.status}]`));

  const encontrados = [];
  const vistos = new Set();

  for (const nome of nomes) {
    // Busca exata primeiro
    let match = todos_flat.find(a => a.name === nome);
    if (!match) {
      // Busca parcial: palavras iniciais do nome
      const palavras = nome.toLowerCase().split(" ").slice(0, 2).join(" ");
      match = todos_flat.find(a => a.name.toLowerCase().startsWith(palavras));
    }
    if (!match) {
      // Busca por 1ª palavra
      const p1 = nome.toLowerCase().split(" - ")[0];
      match = todos_flat.find(a => a.name.toLowerCase().includes(p1) && !vistos.has(a.id));
    }

    if (match && !vistos.has(match.id)) {
      console.log(`  ✅ "${nome}" → "${match.name}" (ID: ${match.id})`);
      encontrados.push(match);
      vistos.add(match.id);
    } else {
      console.log(`  ⚠️  "${nome}" não encontrado.`);
    }
  }

  if (encontrados.length === 0) {
    throw new Error("Nenhum ad set correspondente encontrado. Ver lista acima.");
  }

  return encontrados;
}

// ─── STEP 5: Criar criativo e anúncio para cada ad set ──────────────────────
async function criarAnuncios(pageId, videoId, adSets, thumbnailUrl) {
  console.log("\n📢 STEP 5 — Criando anúncios...");

  const resultados = [];

  for (const adset of adSets) {
    console.log(`\n  → Ad set: "${adset.name}" (${adset.id})`);

    const videoData = {
      video_id: videoId,
      message:  AD_TEXT,
      call_to_action: {
        type:  "SHOP_NOW",
        value: { link: AD_URL },
      },
      title: AD_HEADLINE,
    };

    if (thumbnailUrl) {
      videoData.image_url = thumbnailUrl;
    }

    // Usa Page Token se disponível (contorna restrição de app em dev)
    const creativeToken = PAGE_TOKEN || TOKEN;
    const postFn = PAGE_TOKEN
      ? (path, body) => metaPostWithToken(path, body, PAGE_TOKEN)
      : metaPost;

    // Criativo
    const creative = await postFn(`${ACCOUNT_ID}/adcreatives`, {
      name: `Criativo Jaleco Slim Branco - ${adset.name.split(" ")[0]}`,
      object_story_spec: JSON.stringify({
        page_id: pageId,
        video_data: videoData,
      }),
    });
    console.log(`    ✅ Creative: ${creative.id}`);

    // Anúncio
    const ad = await metaPost(`${ACCOUNT_ID}/ads`, {
      name:     `Anúncio Jaleco Slim Branco - ${adset.name.split(" - ")[0]}`,
      adset_id: adset.id,
      creative: JSON.stringify({ creative_id: creative.id }),
      status:   "ACTIVE",
    });
    console.log(`    ✅ Anúncio: ${ad.id}`);

    resultados.push({ adset: adset.name, creative_id: creative.id, ad_id: ad.id });
  }

  return resultados;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("🎬 CRIAR ANÚNCIOS DE VÍDEO — JALECA");
  console.log("=".repeat(60));

  if (!TOKEN) throw new Error("META_ADS_TOKEN não encontrado no .env.local");
  if (!ACCOUNT_ID) throw new Error("META_ADS_ACCOUNT_ID não encontrado no .env.local");
  console.log(`\n  Conta: ${ACCOUNT_ID}`);

  try {
    // Se vídeo já foi enviado, usar ID existente (evita re-upload)
    const existingId = process.env.UPLOADED_VIDEO_ID || process.argv[2];
    let videoId;
    if (existingId) {
      videoId = existingId;
      console.log(`\n⏩ STEP 1 — Usando vídeo já enviado: ${videoId}`);
    } else {
      videoId = await uploadVideo();
      await aguardarProcessamento(videoId);
    }
    const thumbUrl   = await getVideoThumbnail(videoId);
    const pageId     = await getPageId();
    const adSets     = await buscarAdSets(AD_SETS_NAMES);
    const resultados = await criarAnuncios(pageId, videoId, adSets, thumbUrl);

    console.log("\n" + "=".repeat(60));
    console.log("✅ ANÚNCIOS CRIADOS!");
    console.log("=".repeat(60));
    console.log(`\n  Video ID na conta: ${videoId}`);
    console.log(`\n  Resumo:`);
    for (const r of resultados) {
      console.log(`  • ${r.adset}`);
      console.log(`      Creative: ${r.creative_id} | Ad: ${r.ad_id}`);
    }
    console.log(`
⚠️  Próximos passos:
  1. Abrir Meta Ads Manager e revisar os anúncios
  2. Clicar "Revisar e publicar" para resolver "Edições não publicadas"
  3. Deletar ad set rascunho "Novo conjunto de anúncios de Vendas"
    `);
  } catch (err) {
    console.error("\n❌ ERRO:", err.message);
    process.exit(1);
  }
}

main();
