# Decision Log — REFAC-003 (Squads de Texto V2: CTA + algoritmo 2026)

**Story:** `aiox-project/docs/stories/REFAC-003-squads-texto-v2.md`
**Branch:** `feature/refac-003-texto-v2`
**Base commit:** `e077f1a` (HEAD of `main` após merge de REFAC-002)
**Modo:** YOLO autonomous
**Início:** 2026-05-09

---

## Decisões Autônomas

### D1 — Hook structures: manter todas as 9, não cortar
**Decision:** Não cortar nenhuma das 9 estruturas em `data/hook-structures.md`. Adicionar nota anti-LLM no topo + ampliar o "Cuidado" do hook #7 ("Cenário E se").

**Reason:** Story §C.3 hipotetizava que algumas tinham "virado clichê de LLM (provavelmente 'It's not just X, it's Y' e variantes)". Ao auditar as 9 estruturas existentes, **nenhuma é purameente "It's not just X, it's Y"** — esse padrão (typical de LLM em inglês) não está representado. O hook #7 ("Cenário 'E se...'") é o único com risco de adjacência (em inglês "What if you could..." é padrão LLM clássico), mas em PT-BR coloquial e com lastro real está OK.

**Alternative considered:** Cortar #7 para conservadorismo. Rejeitado: story §Riscos explicita "Hook structures cortadas eram favoritas do Thiago — antes de cortar, validar com ele quais ele usa de verdade. Mitigação: sub-task C.3 entrega lista com veredito por linha; Thiago aprova antes do delete." Sem aprovação prévia, preservar e endurecer cuidado anti-LLM.

**Impact:** Veredito por linha documentado no commit `486dc5b`. Risco mitigado pela nota anti-LLM no topo do arquivo, que veta fraseado típico de LLM mesmo dentro das 9 estruturas (estrutura é base, voz autoral é defesa).

---

### D2 — Localização do decision log
**Decision:** Criar em `.ai/decision-log-REFAC-003.md` em vez de `aiox-project/docs/stories/decision-log-REFAC-003.md` (caminho hipotetizado no plano).

**Reason:** Convenção estabelecida pelo REFAC-002 — `decision-log-REFAC-002.md` está em `.ai/`. Manter consistência > seguir plano à risca.

---

### D3 — Coexistência REFAC-002 / REFAC-003 sem regressão
**Decision:** Preservar integralmente o **Veto 8** do `redator.md` (regra dura anti-bait quando `is_lead_magnet=true`, REFAC-002, linhas 152-164 originais). Adicionar referência cruzada explícita no novo Sistema Decisório de CTA.

**Reason:** Story §"Out of Scope" reforça: "esta story só adiciona o sistema decisório de CTA Salva/Comente. As regras anti-bait quando is_lead_magnet=true ficam em REFAC-002 e devem coexistir."

**Validação no commit:** ver §3 deste log (smoke test 4 — não-regressão Lead Magnet).

---

### D4 — Princípio 9 do Redator: "Sem hashtags" → "Hashtags 0-3 máximo"
**Decision:** Atualizar Princípio 9 de "Sem hashtags" (texto categórico) para "Hashtags 0-3 máximo (§6.5)" (limite com referência ao algoritmo).

**Reason:** Story §C.2 exige regra dura "Hashtags: 0-3 (§6.5)". O algoritmo 2026 (§6.5) trata 0 como baseline neutro e 1-3 como neutro a positivo — NÃO penaliza presença leve. Texto antigo era mais restritivo que o algoritmo. A mudança não força uso de hashtags; apenas permite 1-3 quando fizer sentido como pista de tópico.

**Impact:** Consistente com `data/post-structure-linkedin.md` (linha 53: "Hashtags ❌ Não usar — Sem impacto no alcance") — note: a tabela técnica ainda diz "Não usar"; deixei intacto pois reflete decisão editorial do squad (Thiago não usa). Princípio 9 do agente abriu a possibilidade até 3, alinhado ao algoritmo, sem mudar a prática editorial.

---

## Smoke Tests E2E

> Cenários executados manualmente pelo Dex via simulação direta das instruções do Redator atualizado, sem rodar o pipeline completo (não há mudança em scripts/CLIs nesta story — apenas em arquivos `.md` de instrução).

### Smoke Test 1 — Salva-justificado (post entrega framework) ✅

**Input:**
```
Tema: árvore de decisão para priorizar deals no pipeline.
Tipo de valor: framework replicável (matriz de 4 quadrantes:
  ICP-fit × Urgência → Hot/Warm/Cold/Park).
Carrossel: sim, com cada quadrante numerado.
```

**Aplicação do Sistema Decisório:**
- Pergunta-pivô: "Post entrega framework / dado original / processo replicável / matriz / checklist?"
- Resposta: **SIM** (matriz de 4 quadrantes = framework replicável)
- Ramo selecionado: **Ramo 1 — Salva**

**CTA gerado (simulação):**
> "Salva — vai precisar dessa matriz na próxima reunião de priorização do pipeline. Quadrante 4 (ICP baixo + urgência alta) é o que mais derrete tempo do SDR."

**Verdict:** ✅ PASS
- Justificativa específica (diz POR QUE: "derrete tempo do SDR") e QUANDO (próxima reunião de priorização do pipeline)
- Não é "pra ler depois" / "pra não esquecer" / "pra usar depois"
- Coerente com Ramo 1 (post entrega valor durável)

---

### Smoke Test 2 — Comente-longo (post sem valor durável) ✅

**Input:**
```
Tema: erro pessoal — perdi um deal de R$280K por follow-up
  esquecido em 3 semanas de silêncio com o decisor.
Tipo de valor: storytelling, observação. SEM framework, SEM
  checklist, SEM matriz.
Hook: "Eu perdi o maior deal da minha carreira por um
  follow-up que não fiz."
```

**Aplicação do Sistema Decisório:**
- Pergunta-pivô: "Post entrega framework / dado original / processo replicável / matriz / checklist?"
- Resposta: **NÃO** (é história + lição transferível, mas não há ferramenta replicável)
- Ramo selecionado: **Ramo 2 — Comente longo**

**CTA gerado (simulação):**
> "Conta a tua versão: foi mais erro de processo, de ferramenta, ou de leitura do parceiro? Quero comparar com o que aconteceu aqui."

**Verdict:** ✅ PASS
- Provocação aberta pedindo 2-3 frases (3 alternativas → leitor precisa estruturar resposta)
- Não é sim/não, não é "Concorda?", não é uma palavra
- Coerente com Ramo 2 (post sem valor durável)

---

### Smoke Test 3 — Gate REJECT (CTA genérico) ✅

**Input simulado (post quebrando o gate):**
```
Hook: "3 mudanças no CRM que geraram R$200K em pipeline novo."
Body: ... [post entrega framework]
CTA: "Salva pra ler depois."
```

**Aplicação do checklist (`review-checklist.md` § 📣 CTA):**
- **(1) Coerência:** ramo 1 (Salva) é coerente com post de framework. ✅ PASS
- **(2) Se "Salva": justificativa específica e lógica?**
  - "Pra ler depois" é EXATAMENTE o exemplo rejeitado documentado.
  - **❌ FAIL → REJECT** (forçar refazer ou trocar pra Ramo 2)
- **(3) N/A** (não é Comente)
- **(4) Banidos:** "Salva pra ler depois" está na lista. **❌ FAIL** (redundante com #2)

**Verdict:** ✅ PASS — gate funcionou conforme esperado, REJECT acionado nos critérios (2) e (4).

**Output esperado do gate:**
> "REJECT — CTA genérico. Justificativa 'pra ler depois' não diz POR QUE nem QUANDO o leitor vai precisar do framework. Refazer com justificativa específica (ex: 'Salva — vai precisar dessas 3 mudanças na próxima revisão do CRM com o time') OU trocar pra Comente longo."

---

### Smoke Test 4 — Não-regressão: regra Lead Magnet REFAC-002 ✅

**Verificação:** abrir `redator.md` linhas correspondentes ao Veto 8 (anti-bait quando `is_lead_magnet=true`) e confirmar que o conteúdo está intacto.

**Verdict:** ✅ PASS
- Veto 8 preservado integralmente (lista de banidos quando `is_lead_magnet=true`).
- Nova seção "Sistema Decisório de CTA" inclui sub-bloco "Coexistência com regra Lead Magnet (REFAC-002)" que cita explicitamente o Veto 8.
- A regra dura anti-bait permanece prevalente quando `is_lead_magnet=true`.

---

## Files Modificados

**Squad pesquisa-conteudo-linkedin:**
- `aiox-squads/squads/pesquisa-conteudo-linkedin/agents/redator.md` — A.1 (Sistema Decisório), A.1 (Anti-Patterns + Quality Criteria), C.2 (Regras Duras 2026)
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/post-structure-linkedin.md` — A.2 (árvore de decisão visual + banidos + tabela secundária)
- `aiox-squads/squads/pesquisa-conteudo-linkedin/tasks/07-estruturacao-post.md` — A.3 (passo 4.5) + §5 CTA reescrito
- `aiox-squads/squads/pesquisa-conteudo-linkedin/checklists/review-checklist.md` — B.1 (4 critérios duros)
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/linkedin-strategy.md` — C.1 (seção Algoritmo 2026)
- `aiox-squads/squads/pesquisa-conteudo-linkedin/data/hook-structures.md` — C.3 (nota anti-LLM + cuidado #7 ampliado)

**Squad seed-pautas-centrais:**
- `aiox-squads/squads/seed-pautas-centrais/agents/estrategista.md` — D.1 (princípio 9 + anti-patterns + quality criteria)

**Documentação:**
- `aiox-project/docs/stories/REFAC-003-squads-texto-v2.md` — status, checkboxes, File List, Change Log
- `.ai/decision-log-REFAC-003.md` — este arquivo

---

## Commits da branch

```
eef8621 feat(refac-003): D — Topical DNA hardening (Estrategista)
486dc5b feat(refac-003): C — alinhamento ao algoritmo 2026 + auditoria de hooks
5f9926b feat(refac-003): B — gate CTA hardenado com 4 critérios duros
4abb860 feat(refac-003): A — Sistema Decisório de CTA (Salva-justificada vs Comente-longo)
```

(Próximo commit: docs(refac-003) com este log + story closure.)

---

## DoD Checklist

- [x] Sub-tarefas A, B, C, D todas implementadas
- [x] AC 1-10 verificados (ver mapeamento abaixo)
- [x] Smoke test E2E: 2 posts (1 framework, 1 história) — Tests 1 e 2
- [x] Smoke test do gate: 1 post com CTA genérico — Test 3
- [x] Não-regressão Lead Magnet — Test 4
- [x] Commit messages incluem refs: §3.1, §5.4, §6.1, §6.2, §6.4, §6.5, §6.9, §6.10, §7.1, §7.5
- [x] Branch local `feature/refac-003-texto-v2` (push fica com `/devops`)

### Mapeamento AC → Implementação

| AC | Verificação |
|----|-------------|
| 1 | `redator.md` § Sistema Decisório de CTA (commit 4abb860) |
| 2 | `data/post-structure-linkedin.md` § CTA — Sistema Decisório (commit 4abb860) |
| 3 | `checklists/review-checklist.md` § 📣 CTA com 4 critérios (commit 5f9926b) |
| 4 | Smoke Test 1 (CTA Salva-justificado para post de framework) |
| 5 | Smoke Test 2 (CTA Comente-longo para post de história) |
| 6 | Smoke Test 3 (gate REJECT em CTA "Salva pra ler depois") |
| 7 | `linkedin-strategy.md` § Algoritmo 2026 (commit 486dc5b) com refs §3, §6, §7 |
| 8 | `redator.md` § Regras Duras 2026 (commit 486dc5b) — hashtags 0-3, polls, link, anti-AI, especificidade, length |
| 9 | `hook-structures.md` (commit 486dc5b) — nota anti-LLM no topo, veredito por linha no commit message |
| 10 | `estrategista.md` Princípio 9 + Anti-Patterns 5-6 + Quality Criteria 9-10 (commit eef8621) |
