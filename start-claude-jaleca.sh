#!/bin/bash

cd ~/sitejaleca/jaleca-nextjs || exit 1

source .venv/bin/activate

echo "Ambiente Jaleca ativado."
echo "Projeto: $(pwd)"
echo "Python: $(which python3)"
echo ""
echo "Iniciando Claude Code..."

claude
