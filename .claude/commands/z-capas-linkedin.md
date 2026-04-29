---
description: Squad Capas LinkedIn & Instagram — pipeline de criação de capas visuais (imagem única)
---

# Squad Capas LinkedIn & Instagram

**Pipeline de criação de capas visuais para posts de texto.**

## Ativação

1. Leia o arquivo `aiox-squads/squads/capas-linkedin/squad.yaml` para entender a squad
2. Leia o workflow em `aiox-squads/squads/capas-linkedin/workflows/workflow.yaml`
3. Siga os steps na ordem definida no workflow
4. Para cada step `type: checkpoint` — pare e aguarde input do usuário
5. Para cada step `type: agent` — leia o arquivo do agente e a task correspondente
6. Carregue os dados de referência listados em `data/` conforme necessário

## Estilos Visuais Disponíveis

Ao iniciar, apresente os 5 estilos ao usuário:

1. 📝 **Rascunho no Papel** — Infográfico à lápis sobre foto real de papel
2. 👤 **Pessoa + Texto** — Foto real com overlay de texto 
3. 📊 **Micro-Infográfico** — Um dado/métrica hero visualizado
4. 🖼️ **Print de Autoridade** — Screenshot + opinião do Thiago
5. ⚡ **Quote Card** — Citação editorial premium

## Input Necessário

- Post de texto finalizado (do squad de pesquisa ou manual)
- Escolha do estilo visual (1-5)

## Output

- Capa em PNG (1080x1350) pronta para LinkedIn e Instagram
- Upload automático para o Supabase

## Step Final — Upload da Capa

Após aprovação da capa renderizada:

1. Executar o CLI para upload no Supabase:
   ```bash
   node aiox-squads/shared/scripts/upload-cover-cli.js --slug "SLUG" --file output/covers/SLUG/cover.png --style "ESTILO" --post-title "TITULO_DO_POST"
   ```
2. Verificar output: `✅ Capa "SLUG" uploaded → URL_PUBLICA`
3. Verificar no CCC que a capa aparece no preview do post

> **Nota:** O CLI busca automaticamente o post_id pelo título no Supabase.
> O post precisa ter sido salvo previamente via `save-post-cli.js`.
> É idempotente — pode rodar múltiplas vezes sem duplicar (upsert).
