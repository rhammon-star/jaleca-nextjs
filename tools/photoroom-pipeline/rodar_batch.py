#!/usr/bin/env python3
"""Batch pipeline — 11 produtos priorizados."""

import sys, time
sys.path.insert(0, ".")
from pipeline_completo import processar_produto

PRODUTOS = [
    # 58981 ✅ | 61201 ✅
    (59067, "Jaleco Slim Princesa Feminino"),        # incompleto — só Marinho feito
    (59241, "Jaleco Slim Elastex Feminino"),         # zerado pela limpeza
    (59512, "Conjunto Dólmã Cozinheiro Feminino"),   # zerado pela limpeza
    (59701, "Conjunto Dólmã Cozinheiro Masculino"),  # zerado pela limpeza
    (61343, "Jaleco Slim Gold Feminino"),
    (61273, "Jaleco Slim Dama Feminino"),
    (59324, "Conjunto Princesa Nobre Feminino"),
    (62062, "Conjunto Laço Feminino"),
    (61772, "Conjunto Executiva Feminino"),
]

erros = []

for i, (pid, nome) in enumerate(PRODUTOS, 1):
    print(f"\n{'#'*60}")
    print(f"[{i}/{len(PRODUTOS)}] {nome}")
    print(f"{'#'*60}")
    try:
        processar_produto(pid)
    except Exception as e:
        print(f"\n❌ ERRO no produto #{pid}: {e}")
        erros.append((pid, nome, str(e)))

    if i < len(PRODUTOS):
        print(f"\n⏳ Aguardando 60s antes do próximo produto...")
        time.sleep(60)

print(f"\n{'='*60}")
print("BATCH CONCLUÍDO")
print(f"{'='*60}")
print(f"Sucesso: {len(PRODUTOS) - len(erros)}/{len(PRODUTOS)}")
if erros:
    print("\nErros:")
    for pid, nome, err in erros:
        print(f"  #{pid} {nome}: {err}")
