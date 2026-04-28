# Task: Publicar Post no Thiago Marketing OS

> Step 09 do pipeline — executada após aprovação do Thiago.
> Salva o post aprovado em inbox.json para importação automática pela plataforma.

---

## Metadata
- **Step:** step-09-publish-to-ccc
- **Agent:** redator
- **Input:** `output/post-final.md`
- **Output:** `content-command-center/data/inbox.json` (atualizado)

---

## Instruções

### 1. Ler output/post-final.md e extrair campos

| Campo do arquivo | Campo do JSON |
|---|---|
| Linha do hook (primeira linha do post) | `hookText` |
| `Estrutura de Hook:` | `hookStructure` |
| `Tema:` | `theme` |
| `Framework:` | `framework` |
| `Pilar ACRE:` → só a letra (A, C, R ou E) | `pillar` |
| Texto completo do post (entre `### Post` e `### Revisão`) | `body` |
| Última linha do post (CTA) | `cta` |
| `Fonte(s):` → array | `sources` |
| Score numérico (ex: 94.65 → 94) | `reviewScore` |

**`title`** = primeiros 80 chars do hookText, sem pontuação final.

**`urgency`**: usar `"urgente"` por padrão para posts aprovados.

**`status`**: sempre `"aprovado"`.

**`contentType`**: sempre `"text"`.

### 2. Montar objeto JSON

```json
{
  "title": "<primeiros 80 chars do hook>",
  "theme": "<Tema do metadata>",
  "pillar": "<A|C|R|E>",
  "hookText": "<linha completa do hook>",
  "hookStructure": "<estrutura de hook>",
  "framework": "<framework>",
  "body": "<texto completo do post>",
  "cta": "<última linha do post>",
  "sources": ["<fonte1>"],
  "reviewScore": 94,
  "status": "aprovado",
  "urgency": "urgente",
  "contentType": "text"
}
```

### 3. Atualizar inbox.json

Ler `content-command-center/data/inbox.json`.

Verificar se já existe post com o mesmo `title` — se sim, não adicionar (dedup).

Adicionar o novo objeto ao array `posts`.

Salvar o arquivo atualizado.

### 4. Exibir relatório

```
📤 Post publicado no Thiago Marketing OS

Arquivo: content-command-center/data/inbox.json
Título: [título]
Score: [score]%
Status: aprovado

→ A plataforma importará automaticamente no próximo refresh.
```

---

## Veto Conditions

1. ❌ `post-final.md` não existe ou score < 80%
2. ❌ Post com mesmo título já existe no inbox (não duplicar)
3. ❌ `body` está vazio

---

## Quality Criteria

- [ ] Todos os campos obrigatórios presentes (title, hookText, body, status)
- [ ] Score extraído corretamente como número inteiro
- [ ] Posts existentes preservados no inbox.json
- [ ] Relatório exibido confirmando gravação
