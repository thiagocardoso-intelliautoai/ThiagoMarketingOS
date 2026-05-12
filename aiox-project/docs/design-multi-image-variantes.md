# Design Multi-Image Variantes — Decisão Estratégica

**Data:** 2026-05-09
**Story:** [REFAC-005A-DESIGN](stories/REFAC-005A-DESIGN-multi-image-variantes.md)
**Autor:** Squad Creator (Craft) + Thiago C.Lima
**Status:** **DEFERRED — decisão estratégica de NÃO implementar variantes multi-image agora**

---

## Contexto

Esta story foi criada após split do REFAC-005A original (que tratava "Multi-Image" como estilo novo — categoria errada, conforme análise do @analyst Atlas). A INFRA técnica (schema, CLI, vitrine carousel CCC) foi entregue em REFAC-005A-INFRA (Done, commits `b04b9e8`/`aaae81b`/`091ae24`).

**Esta story (DESIGN)** trataria de **variantes multi-image dos 3 estilos existentes** (Pessoa+Texto, Print de Autoridade, Rascunho no Papel) — proposição + fonte de fotos + range de N + critério de quando usar por variante.

## Análise de Viabilidade por Estilo

### Estilo 1 — Rascunho no Papel → **Não fit**

- **Caso a favor:** sequência de papéis com etapas distintas de um framework.
- **Caso contra (decisivo):**
  - Força do estilo é **condensação** (1 rascunho captura tudo). Diluir em N papéis perde o ponto.
  - Banco atual: 6 fotos em **contextos diferentes** — não casariam visualmente em sequência.
  - Pra funcionar precisaria de fotos novas do mesmo cenário com rascunhos diferentes (fricção alta de re-fotografar páginas do mesmo caderno).
  - Algoritmo §5.0: 1 rascunho já paga o "autoral" — multi não adiciona reach.
- **Veredito:** Não fit. Single-image continua sendo o caminho.

### Estilo 2 — Pessoa + Texto → **Candidato técnico forte, mas viabilidade real fraca**

- **Caso a favor:**
  - Estilo mais fotográfico-autoral do squad. Algoritmo §6.7 paga multi-image autoral.
  - Tipos de post fit (em tese): bastidor de evento, reunião com cliente, palestra, jornada visual.
- **Caso contra (decisivo, confirmado por Thiago em 2026-05-09):**
  - Thiago **raramente** tem 3-5 fotos autorais coerentes do mesmo evento/cena na prática.
  - Sem input frequente, gate de fonte rejeitaria 90%+ das tentativas → variante teórica que nunca seria usada.
- **Veredito:** Não implementar agora. Reabrir quando padrão de produção de fotos mudar.

### Estilo 3 — Print de Autoridade → **Não fit pelo padrão atual**

- **Caso a favor:** "compounding evidence" — múltiplos prints provando o mesmo ponto (mais persuasivo que 1).
- **Caso contra (decisivo, confirmado por Thiago em 2026-05-09):**
  - Frequência real de posts "compounding evidence" no padrão atual: **muito rara** (0-1 por mês).
  - Custo de design + impl não compensa o uso esperado.
  - Proposição base do estilo ("1 fonte = 1 reação") é coerente — não precisa de variante.
- **Veredito:** Não implementar agora. Reabrir se Thiago começar a fazer 3+ posts compounding-evidence por mês consistentemente.

## Decisão Final

**Não implementar nenhuma variante multi-image neste momento.**

Razão consolidada: o padrão de produção atual do Thiago (input fotográfico + tipo de post) **não justifica** o investimento de design completo + 6-10h de impl em variantes que ficariam ociosas. Multi-image como envelope técnico está disponível (REFAC-005A-INFRA Done), mas o conteúdo estratégico que justifica usá-lo não existe consistentemente hoje.

## Por que esta decisão NÃO é desperdício

A REFAC-005A-INFRA continua valendo plenamente:

1. **Schema multi-image dormente** — disponível sem nova migration quando Thiago decidir usar
2. **Caption por imagem** (`covers.caption`) — pode ser usada em single-image se Thiago quiser legendar capas no futuro
3. **Vitrine carousel CCC** — só ativa visualmente quando há >1 imagem; single-image continua renderizando como sempre
4. **Zero custo de manutenção** — backward compat garantido nos 8 ACs verificados

## Gate de Reabertura

Esta story sai de DEFERRED → Ready quando **qualquer um** dos seguintes for verdade por **≥2 meses consecutivos**:

- Thiago produz ≥3 fotos autorais coerentes em ≥2 eventos/cenas por mês (gate Pessoa+Texto Multi-Image)
- Thiago publica ≥3 posts "compounding evidence" por mês (gate Print Multi-Image)
- Surge proposição visual nova que pede multi-image (criar story separada, não reabrir esta)

Quando o gate disparar, **abrir uma nova story** focada na variante específica que justifica (não reabrir este escopo amplo).

## Decisões pré-execução ainda válidas (caso reaberto)

Se algum dia esta story for reaberta com gate disparado, as decisões já capturadas em 2026-05-09 continuam válidas:

- Vitrine no CCC: carousel horizontal com swipe (já implementado em REFAC-005A-INFRA)
- Overlay de texto: apenas na primeira imagem
- Range de N: por variante, sem teto global (algoritmo §6.7 floor de 3+)
- Narrativa: squad-creator decide caso a caso

## Referências

- Algoritmo: `linkedin-algorithm-2026-reference.md` §5.0, §5.1, §6.7
- Story: `aiox-project/docs/stories/REFAC-005A-DESIGN-multi-image-variantes.md`
- INFRA: `aiox-project/docs/stories/REFAC-005A-INFRA-multi-image-infra.md` (Done)
- Original superseded: `aiox-project/docs/stories/REFAC-005A-multi-image-design-impl.md`

---

**Conduzido por:** Craft (Squad Creator) em sessão guiada com Thiago, 2026-05-09.
**Validação estratégica:** Atlas (Analyst) — confirmou que decisão segue princípio "não implementar capacidade ociosa" do framework AIOX.
