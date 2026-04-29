---
description: Squad Criar Matéria-Colab — pipeline de ângulo aprovado a matéria completa pronta pra publicar
---

# 📝 Squad: Criar Matéria-Colab

**Pipeline: ângulo aprovado → matéria-colab completa → pronta pra carrossel Editorial Clean.**
Recebe ângulo específico aprovado do seed-lista-distribuicao, pesquisa em profundidade, estrutura narrativa, redige matéria finalizada com marcações de slide, gera ganchos de DM e headlines. NÃO é briefing — é matéria COMPLETA pronta pra publicar.

> **Substitui:** `briefing-materia-colab` (deprecated).

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/criar-materia-colab/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/criar-materia-colab/workflows/workflow.yaml`
3. Carregue os perfis dos agentes:
   - **Ivan Investigador 🔬**: `aiox-squads/squads/criar-materia-colab/agents/investigador-materia.md`
   - **Rita Redatora ✍️**: `aiox-squads/squads/criar-materia-colab/agents/redator-materia.md`
4. Carregue os dados de referência em `aiox-squads/squads/criar-materia-colab/data/`
   - `linkedin-strategy.md` — Estratégia LinkedIn (lente, mecânica, lacuna)
   - `formato-materia-colab.md` — O que é e o que NÃO é matéria-colab
   - `atomos-estrategicos.md` — 6 átomos estratégicos (OBRIGATÓRIO)
   - `veto-conditions.md` — 6 condições de veto (qualquer uma = rejeitar)
5. Carregue o template em `aiox-squads/squads/criar-materia-colab/templates/`
   - `materia-template.md` — Template da matéria completa com marcações de slide
6. Carregue as tasks em `aiox-squads/squads/criar-materia-colab/tasks/`
   - `01-pesquisar-profundidade.md` — Pesquisa além do seed
   - `02-estruturar-narrativa.md` — Arco narrativo + evidências
   - `03-redigir-materia.md` — Matéria completa com frases (não bullets)
   - `04-gerar-dm-headlines.md` — Ganchos de DM + headlines alternativas
   - `05-review-materia.md` — Auto-review + veto check + score
   - `06-persistir-supabase.md` — Salvar no banco de dados
7. **Siga o pipeline linear abaixo:**

## Pipeline (8 Steps)

| Step | Tipo | Agent | Descrição |
|------|------|-------|-----------|
| 00 | ⏸️ Checkpoint | — | Receber ângulo aprovado + input livre do Thiago |
| 01 | 🤖 Agente | 🔬 Ivan | Pesquisar pessoa em profundidade além do seed |
| 02 | 🤖 Agente | ✍️ Rita | Estruturar narrativa (3-5 seções com evidência ancorada) |
| 03 | 🤖 Agente | ✍️ Rita | Redigir matéria completa (frases, não bullets) |
| 04 | 🤖 Agente | ✍️ Rita | Gerar ganchos de DM (3 tons) + headlines alternativas |
| 05 | 🤖 Agente | ✍️ Rita | Auto-review: veto check + completude + score (≥ 7/10) |
| 06 | ⏸️ Checkpoint | — | Aprovação final do Thiago |
| 07 | 🤖 Agente | ✍️ Rita | **Persistir no Supabase** — Atualiza status do ângulo |

## Input Necessário

1. **Nome da pessoa** (sujeito da matéria — obrigatório)
2. **Ângulo específico aprovado** (obrigatório):
   - Arquétipo (ex: Tech Builder com Método, Líder Enterprise com Resultado)
   - Título pela lente (ex: "Quando IA vira processo, não slide")
   - Evidências (posts, cases, citações do seed)
   - Risco declarado (se houver)
3. **Input livre do Thiago** (opcional — ex: "foca no case X", "tom mais duro", "rime com minha última falha documentada")

## Regras Importantes

- **Matéria, NÃO briefing.** Output é matéria completa com frases escritas, arco narrativo e marcações de slide
- **Tese minha, pessoa como evidência.** A tese é do Thiago. A pessoa é evidência viva. Se sair como elogio, falhou
- **6 átomos estratégicos obrigatórios.** Carregar TODOS antes de qualquer task
- **6 condições de veto.** QUALQUER uma disparar = rejeitar matéria, refazer
- **Risco respeitado.** Se o ângulo tem risco, endereçar com tese desafiadora real
- **Citação verificável ou nada.** Nunca inventar citação
- **Editorial Clean sempre.** Caderno NUNCA na matéria-colab
- **Input do Thiago tem precedência** sobre defaults do squad
- **Marcações de slide** (`<!-- slide -->`) entre seções — pronto pra squad de carrosséis

## Veto Conditions (Resumo)

1. ❌ Matéria sem tese minha (vira elogio)
2. ❌ Citação inventada ou atribuída sem fonte
3. ❌ Matéria que sugere reunião/entrevista com a pessoa
4. ❌ Tom que parece colab tradicional (agradecimento, celebração)
5. ❌ Formato visual diferente de Editorial Clean
6. ❌ Ignorar o risco declarado no ângulo

## Output

- Dossiê aprofundado em `output/dossie-{slug}.md`
- Matéria completa em `output/materia-{slug}-{angulo}.md`
- Score e status de review incluídos na matéria

## Downstream

Matéria aprovada alimenta o squad `carrosseis-linkedin` (formato Editorial Clean).

## Step Final — Persistir no Banco de Dados

Após aprovação da matéria (Step 06):

1. Executar o CLI para atualizar status do ângulo no Supabase:
   ```bash
   node aiox-squads/shared/scripts/save-distribuicao-cli.js --update-status --pessoa "NOME" --angulo-titulo "TITULO" --status materia_em_producao
   ```
2. Verificar output: `✅ Status atualizado: materia_em_producao`
3. O ângulo agora aparece com status atualizado na aba Distribuição da plataforma

> **Nota:** O CLI busca automaticamente a pessoa e o ângulo pelo nome/título.
> Quando o carrossel for publicado, atualizar para `publicada`.
