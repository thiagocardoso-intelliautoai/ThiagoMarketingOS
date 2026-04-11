# Task: Publicar no Thiago Marketing OS

## Metadata
- **Step:** step-07-publish-to-ccc
- **Agent:** designer (Dani Design)
- **Input:** `output/cover-input.md`, `output/cover-report.md`
- **Output:** `output/publish-report.md`

---

## Context Loading

Carregar antes de executar:
- `output/cover-input.md` — Post de texto original (título, body, CTA, hashtags)
- `output/cover-report.md` — Relatório da capa (slug, paths)

---

## Instructions

### Process
1. Ler `cover-input.md` para extrair:
   - **Título** do post (hook)
   - **Tema** (tema original)
   - **hookText** (hook do post)
   - **body** (texto completo do post)
   - **CTA** (call to action)
   - **Hashtags** (lista)
2. Ler `cover-report.md` para obter:
   - **Slug** da capa
   - **Path da capa PNG**
   - **Estilo visual usado**
3. Montar objeto de post no formato do Thiago Marketing OS
4. Ler o arquivo `content-command-center/data/inbox.json`
5. Adicionar o novo post ao array `posts` (sem remover os existentes)
6. Salvar o `inbox.json` atualizado

### Formato do Post

```json
{
  "title": "[Título/hook do post]",
  "theme": "[Tema original]",
  "pillar": "A",
  "hookText": "[Hook do post]",
  "hookStructure": "Capa Visual",
  "framework": "[Framework do post (PAS, Contraste, etc.)]",
  "body": "[Texto completo do post]",
  "cta": "[CTA extraído]",
  "hashtags": ["#Tag1", "#Tag2"],
  "sources": [],
  "reviewScore": null,
  "status": "aprovado",
  "urgency": "urgente",
  "contentType": "cover",
  "derivations": {
    "cover": {
      "slug": "[slug]",
      "coverPath": "output/covers/[slug]/cover.png",
      "style": "[estilo visual usado]"
    }
  }
}
```

### Importante
- **Dedup:** Verificar se já existe um post com o mesmo título antes de adicionar
- **Preservar:** Não remover posts existentes no inbox.json
- O post aparecerá automaticamente no Thiago Marketing OS na próxima vez que a página for carregada

---

## Output Format

```
# Publish Report

## Status: OK

## Post Criado
- Título: [título]
- Tema: [tema]
- Content Type: cover
- Slug: [slug]
- Cover: [path]
- Style: [estilo]

## Thiago Marketing OS
- Arquivo: content-command-center/data/inbox.json
- Posts no inbox: [total]
- Novo post adicionado: ✅
```

---

## Veto Conditions

Rejeitar e reportar erro se:
1. `cover-input.md` não existe ou está vazio
2. `inbox.json` não pode ser escrito

---

## Quality Criteria

- [ ] Post adicionado ao inbox.json com todos os campos obrigatórios
- [ ] contentType definido como "cover"
- [ ] derivations.cover com slug, coverPath e style corretos
- [ ] Posts existentes preservados no inbox.json
