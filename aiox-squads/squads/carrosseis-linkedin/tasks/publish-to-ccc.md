# Task: Publicar no Content Command Center

## Metadata
- **Step:** step-11-publish-to-ccc
- **Agent:** designer (Denis Design)
- **Input:** `output/carousel-copy.md`, `output/carousel-pdf-report.md`
- **Output:** `output/publish-report.md`

---

## Context Loading

Carregar antes de executar:
- `output/carousel-copy.md` — Copy aprovado (caption + slides + CTA + hashtags)
- `output/carousel-pdf-report.md` — Relatório do PDF gerado (slug, path, páginas)

---

## Instructions

### Process
1. Ler `carousel-copy.md` para extrair:
   - **Título** do carrossel (hook do slide 1)
   - **Tema** (tema original)
   - **hookText** (hook)
   - **body** (caption completa do LinkedIn)
   - **CTA** (call to action)
   - **Hashtags** (lista)
2. Ler `carousel-pdf-report.md` para obter:
   - **Slug** do carrossel
   - **Path do PDF**
   - **Número de slides**
3. Montar objeto de post no formato do Content Command Center
4. Ler o arquivo `content-command-center/data/inbox.json`
5. Adicionar o novo post ao array `posts` (sem remover os existentes)
6. Salvar o `inbox.json` atualizado

### Formato do Post

```json
{
  "title": "[Título/hook do carrossel]",
  "theme": "[Tema original]",
  "pillar": "A",
  "hookText": "[Hook do slide 1]",
  "hookStructure": "Carrossel",
  "framework": "Carrossel Visual",
  "body": "[Caption completa do LinkedIn]",
  "cta": "[CTA extraído]",
  "hashtags": ["#Tag1", "#Tag2"],
  "sources": [],
  "reviewScore": null,
  "status": "aprovado",
  "urgency": "urgente",
  "contentType": "carousel",
  "derivations": {
    "carousel": {
      "slug": "[slug]",
      "pdfPath": "output/slides/[slug]/carrossel-[slug].pdf",
      "slidesCount": 7
    }
  }
}
```

### Importante
- **Dedup:** Verificar se já existe um post com o mesmo título antes de adicionar
- **Preservar:** Não remover posts existentes no inbox.json
- O post aparecerá automaticamente no Content Command Center (`https://content-command-center-rose.vercel.app/`) na próxima vez que a página for carregada

---

## Output Format

```
# Publish Report

## Status: OK

## Post Criado
- Título: [título]
- Tema: [tema]
- Content Type: carousel
- Slug: [slug]
- PDF: [path]
- Slides: [N]

## Content Command Center
- Arquivo: content-command-center/data/inbox.json
- Posts no inbox: [total]
- Novo post adicionado: ✅
```

---

## Veto Conditions

Rejeitar e reportar erro se:
1. `carousel-copy.md` não existe ou está vazio
2. `inbox.json` não pode ser escrito

---

## Quality Criteria

- [ ] Post adicionado ao inbox.json com todos os campos obrigatórios
- [ ] contentType definido como "carousel"
- [ ] derivations.carousel com slug, pdfPath e slidesCount corretos
- [ ] Posts existentes preservados no inbox.json
