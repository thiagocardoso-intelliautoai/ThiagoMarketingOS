# Task: Publicar Matéria no Thiago Marketing OS

> Step 07 do pipeline — executada após aprovação do Thiago (step-06).
> Salva a matéria em inbox.json e atualiza o status do ângulo em inbox-distribuicao.json.

---

## Metadata
- **Step:** step-07-publish-to-ccc
- **Agent:** redator-materia (Rita Redatora)
- **Input:** `output/materia-{slug}-{angulo}.md`, `Ângulo ID` do input original
- **Output:** `content-command-center/data/inbox.json` + `content-command-center/data/inbox-distribuicao.json`

---

## Instruções

### 1. Extrair campos da matéria

Ler `output/materia-{slug}-{angulo}.md` e extrair:

| Campo do arquivo | Campo do JSON |
|---|---|
| `**Ângulo:**` → título pela lente (parte depois do `—`) | `title` e `hookText` |
| Texto completo da matéria (Seção 1 até o fechamento, com `<!-- slide -->`) | `body` |
| Gancho de DM — Tom Direto | `cta` |
| `**Pessoa:**` | para montar `theme` |

**`title`** = título pela lente completo.

**`hookText`** = primeiro parágrafo da Seção 1 (abertura/hook da matéria).

**`theme`** = `"Matéria-colab — [nome da pessoa]"`.

**`body`** = texto completo incluindo marcações `<!-- slide -->` (o squad de carrosséis usa essas marcações).

**`cta`** = gancho de DM Tom Direto (≤ 280 chars).

**`status`** = `"aprovado"`.

**`urgency`** = `"urgente"`.

**`contentType`** = `"text"`.

### 2. Atualizar inbox.json

Ler `content-command-center/data/inbox.json`.

Verificar se já existe post com o mesmo `title` — se sim, não adicionar (dedup).

Adicionar o novo objeto ao array `posts`.

Salvar.

### 3. Atualizar status do ângulo em inbox-distribuicao.json

Ler `content-command-center/data/inbox-distribuicao.json`.

Adicionar uma entrada no array `status_updates`:

```json
{ "angulo_id": "<Ângulo ID do input>", "status": "materia_em_producao" }
```

Salvar.

### 4. Exibir relatório

```
📤 Matéria publicada no Thiago Marketing OS

Arquivo 1: content-command-center/data/inbox.json
  Título: [título pela lente]
  Pessoa: [nome]
  Status: aprovado

Arquivo 2: content-command-center/data/inbox-distribuicao.json
  Ângulo ID: [id]
  Status atualizado: materia_em_producao

→ A plataforma importará automaticamente no próximo refresh.
→ Próximo passo: squad carrosseis-linkedin para criar os slides (Editorial Clean).
```

---

## Veto Conditions

1. ❌ `output/materia-{slug}-{angulo}.md` não existe
2. ❌ Matéria com o mesmo título já existe no inbox (não duplicar)
3. ❌ `Ângulo ID` não foi fornecido no input (não atualizar status)

---

## Quality Criteria

- [ ] `title` = título pela lente completo (não truncado)
- [ ] `body` inclui todas as seções com marcações `<!-- slide -->`
- [ ] `cta` = gancho de DM Direto (≤ 280 chars)
- [ ] Status do ângulo atualizado para `materia_em_producao`
- [ ] Posts e status existentes preservados nos dois arquivos
