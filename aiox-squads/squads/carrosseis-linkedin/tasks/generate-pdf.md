# Task: Gerar PDF do Carrossel

## Metadata
- **Step:** step-10-generate-pdf
- **Agent:** designer (Denis Design)
- **Input:** `output/slides-report.md`
- **Output:** `output/carousel-pdf-report.md`

---

## Context Loading

Carregar antes de executar:
- `output/slides-report.md` — Relatório com slug e lista de slides renderizados

---

## Instructions

### Process
1. Ler o `slides-report.md` para obter o **slug** do carrossel
2. Executar o comando determinístico:
   ```bash
   node aiox-squads/squads/carrosseis-linkedin/scripts/png-to-pdf.js output/slides/{slug}
   ```
3. Verificar que o arquivo `output/slides/{slug}/carrossel-{slug}.pdf` foi criado
4. Compilar relatório com path do PDF e número de páginas

### Importante
- **Sem browser tool** — o script `png-to-pdf.js` é 100% determinístico
- Lê PNGs do disco em ordem numérica (slide-01.png, slide-02.png, ...)
- Gera PDF com cada slide como página individual (1080×1350px, sem margens)
- O PDF fica pronto para upload direto no LinkedIn como carrossel

---

## Output Format

```
# PDF Report

## Slug
{slug-do-carrossel}

## PDF Gerado
- Path: output/slides/{slug}/carrossel-{slug}.pdf
- Páginas: {N}
- Dimensões: 810pt × 1012.5pt (1080×1350px)
- Status: OK

## Slides Incluídos
1. slide-01.png
2. slide-02.png
...
N. slide-NN.png
```

---

## Veto Conditions

Rejeitar e reportar erro se:
1. O comando retornar erro (PNGs não encontrados ou corrompidos)
2. O PDF não foi criado no disco

---

## Quality Criteria

- [ ] Comando executado sem erros
- [ ] PDF existe no disco com tamanho > 0 bytes
- [ ] Número de páginas do PDF = número de slides
