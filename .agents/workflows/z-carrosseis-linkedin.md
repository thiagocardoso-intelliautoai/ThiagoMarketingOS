---
description: Squad Carrosséis LinkedIn — pipeline de criação de carrosséis visuais
---

# 🎯 Squad: Carrosséis LinkedIn

**Pipeline de criação de carrosséis visuais para LinkedIn.**
4 estilos: Twitter-style, Editorial Clean, Data-Driven, Notebook Raw.

## INSTRUÇÕES CRÍTICAS

1. Leia COMPLETAMENTE o arquivo `aiox-squads/squads/carrosseis-linkedin/squad.yaml`
2. Leia o workflow em `aiox-squads/squads/carrosseis-linkedin/workflows/workflow.yaml`
3. Carregue os perfis dos agentes:
   - **Caio Carrossel** (Copywriter): `aiox-squads/squads/carrosseis-linkedin/agents/copywriter.md`
   - **Denis Design** (Designer): `aiox-squads/squads/carrosseis-linkedin/agents/designer.md`
   - **Raul Revisão** (Reviewer): `aiox-squads/squads/carrosseis-linkedin/agents/reviewer.md`
4. Carregue os dados de referência em `aiox-squads/squads/carrosseis-linkedin/data/`
5. **Siga o pipeline de 11 steps com 5 checkpoints humanos + 2 automações pós-aprovação:**

## Pipeline

| Step | Tipo | Descrição |
|------|------|-----------|
| 01 | ⏸️ Checkpoint | Tema e Estilo Visual (input do usuário) |
| 02 | 🤖 Agente | Copywriter gera 5 ângulos |
| 03 | ⏸️ Checkpoint | Seleção do ângulo |
| 04 | 🤖 Agente | Copywriter cria copy (caption + slides) |
| 05 | ⏸️ Checkpoint | Aprovação do copy |
| 06 | 🤖 Agente | Designer cria slides visuais (HTML/CSS → PNG) |
| 07 | ⏸️ Checkpoint | Aprovação visual dos slides |
| 08 | 🤖 Agente | Reviewer faz revisão final |
| 09 | ⏸️ Checkpoint | Aprovação final |
| 10 | 🤖 Auto | Designer gera PDF (todos os PNGs em sequência) |
| 11 | 🤖 Auto | Upload do carrossel no Supabase |

## Para começar

Pergunte ao usuário:
1. **Qual o tema** do carrossel?
2. **Qual o estilo?**
   - 1 = **Twitter-style** → fundo preto, print de autoridade
   - 2 = **Editorial Clean** → fundo claro, tipografia bold, premium
   - 3 = **Data-Driven** → fundo navy, números gigantes, dados
   - 4 = **Notebook Raw** → papel craft, escrita manual, anti-AI

**Guia rápido:** Tem print? → 1. Framework/tutorial? → 2. Dados/números? → 3. Opinião/provocação? → 4. Não sabe? → 2.

Depois siga o workflow passo a passo, pausando nos checkpoints para aprovação humana.
Os steps 10 e 11 são **automáticos** — executam sem checkpoint após a aprovação final.

## Step Final — Upload do Carrossel (Step 11)

Após aprovação do carrossel renderizado (step 09) e geração do PDF (step 10):

1. Executar o CLI para upload no Supabase:
   ```bash
   node aiox-squads/shared/scripts/upload-carousel-cli.js --slug "SLUG" --slides-dir output/slides/SLUG/ --style "ESTILO" --post-title "TITULO_DO_POST"
   ```
2. Verificar output: `✅ Carrossel "SLUG" uploaded → N slides + PDF`
3. Verificar no CCC que o carrossel aparece navegável no preview

> **Nota:** O CLI detecta automaticamente os slides PNG (`slide-XX.png`) e o PDF no diretório.
> O post precisa ter sido salvo previamente via `save-post-cli.js`.
> É idempotente — pode rodar múltiplas vezes sem duplicar (upsert + re-insert de slides).
