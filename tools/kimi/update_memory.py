import os
import hashlib
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]

SOURCE_DIR = PROJECT_ROOT / "ai-source-docs"
MEMORY_DIR = PROJECT_ROOT / "ai-memory"
CACHE_DIR = PROJECT_ROOT / ".ai-cache" / "gemini"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY não encontrada. Verifique o arquivo .env na raiz do projeto.")


def file_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()


def read_allowed_files(base_dir: Path, max_chars_per_file: int = 50_000) -> str:
    allowed_extensions = {
        ".md", ".txt", ".csv", ".json", ".html", ".xml", ".yml", ".yaml"
    }

    parts = []

    if not base_dir.exists():
        return ""

    for path in sorted(base_dir.rglob("*")):
        if not path.is_file():
            continue

        if path.suffix.lower() not in allowed_extensions:
            continue

        try:
            raw = path.read_text(encoding="utf-8", errors="ignore")
            text = raw[:max_chars_per_file]

            if len(raw) > max_chars_per_file:
                text += "\n\n[ARQUIVO CORTADO PARA ECONOMIZAR TOKENS]\n"

            relative = path.relative_to(PROJECT_ROOT)
            parts.append(f"\n\n--- FILE: {relative} ---\n{text}")

        except Exception as e:
            parts.append(f"\n\n--- FILE: {path} ---\nERRO AO LER: {e}")

    return "\n".join(parts)


def read_memory() -> str:
    parts = []

    for path in sorted(MEMORY_DIR.glob("*.md")):
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
            parts.append(f"\n\n--- MEMORY: {path.name} ---\n{text}")
        except Exception as e:
            parts.append(f"\n\n--- MEMORY: {path.name} ---\nERRO AO LER: {e}")

    return "\n".join(parts)


def call_gemini(prompt: str, cache_key: str) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE_DIR / f"{cache_key}.md"

    if cache_file.exists():
        print(f"Usando cache local: {cache_file}")
        return cache_file.read_text(encoding="utf-8", errors="ignore")

    print(f"Chamando Gemini ({GEMINI_MODEL}) via API...")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

    system_instruction = (
        "Você é o gestor de memória técnica do projeto Jaleca. "
        "Sua função é ler documentos brutos, consolidar contexto, remover duplicidade, "
        "marcar incertezas como PENDENTE e gerar uma memória curta e útil para Claude Code. "
        "Não invente informações. Não mande Claude ler documentos brutos."
    )

    payload = {
        "system_instruction": {
            "parts": [{"text": system_instruction}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 60000,
        }
    }

    response = requests.post(url, json=payload, timeout=900)
    response.raise_for_status()

    data = response.json()
    result = data["candidates"][0]["content"]["parts"][0]["text"]

    cache_file.write_text(result, encoding="utf-8")
    return result


def split_sections(result: str) -> dict:
    import re

    sections = {}

    pattern = r"===\s*([0-9]{2}-[A-Z0-9ÇÃÕÁÉÍÓÚÂÊÔÀÜ\-]+\.md)\s*==="
    matches = list(re.finditer(pattern, result))

    if not matches:
        return sections

    for i, match in enumerate(matches):
        filename = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(result)
        content = result[start:end].strip()

        if content:
            sections[filename] = content

    return sections


def write_memory_file(filename: str, content: str):
    path = MEMORY_DIR / filename
    path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"Atualizado: {path.relative_to(PROJECT_ROOT)}")


def main():
    source_docs = read_allowed_files(SOURCE_DIR)
    current_memory = read_memory()

    combined_hash = file_hash(source_docs + current_memory)

    prompt = f"""
Atualize a memória oficial do projeto Jaleca.

Data atual: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

Você receberá:
1. memória atual;
2. documentos brutos em /ai-source-docs/.

Objetivo:
Criar uma memória operacional para que o Claude Code execute tarefas sem ler documentos brutos.

Regras:
- Consolidar informações.
- Remover duplicidades.
- Manter decisões técnicas.
- Manter status SEO.
- Separar estratégia GPT.
- Separar conteúdo/blog Gemini.
- Separar backlog aprovado para Claude.
- Marcar como PENDENTE quando algo não estiver claro.
- Não inventar informações.
- Não mandar Claude ler /ai-source-docs/.
- Cada seção deve ter no máximo 12 bullets.
- Não escreva textos longos.
- Não explique o processo.
- Não pare antes de gerar todas as seções.

MEMÓRIA ATUAL:
{current_memory}

DOCUMENTOS BRUTOS:
{source_docs}

Responda exatamente neste formato:

=== 00-CONTEXTO-GERAL.md ===
[conteúdo]

=== 01-STATUS-ATUAL.md ===
[conteúdo]

=== 02-DECISOES-TECNICAS.md ===
[conteúdo]

=== 03-SEO-MEMORIA.md ===
[conteúdo]

=== 04-BACKLOG-CLAUDE.md ===
[conteúdo]

=== 05-AREAS-CRITICAS.md ===
[conteúdo]

=== 06-HISTORICO-RESUMIDO.md ===
[conteúdo]

=== 07-REGRAS-DOS-AGENTES.md ===
[conteúdo]

=== 08-RESUMO-PARA-CLAUDE.md ===
[conteúdo]

=== 09-LOG-GEMINI.md ===
[conteúdo]

=== 10-ESTRATEGIA-GPT.md ===
[conteúdo]

=== 11-BLOG-GEMINI.md ===
[conteúdo]
"""

    result = call_gemini(prompt, cache_key=combined_hash)
    sections = split_sections(result)

    expected_files = [
        "00-CONTEXTO-GERAL.md",
        "01-STATUS-ATUAL.md",
        "02-DECISOES-TECNICAS.md",
        "03-SEO-MEMORIA.md",
        "04-BACKLOG-CLAUDE.md",
        "05-AREAS-CRITICAS.md",
        "06-HISTORICO-RESUMIDO.md",
        "07-REGRAS-DOS-AGENTES.md",
        "08-RESUMO-PARA-CLAUDE.md",
        "09-LOG-GEMINI.md",
        "10-ESTRATEGIA-GPT.md",
        "11-BLOG-GEMINI.md",
    ]

    for filename in expected_files:
        content = sections.get(filename)
        if content:
            write_memory_file(filename, content)
        else:
            print(f"Aviso: seção não retornada: {filename}")

    print("\nMemória atualizada com Gemini.")
    print("Agora o Claude Code deve ler somente /ai-memory/.")


if __name__ == "__main__":
    main()
