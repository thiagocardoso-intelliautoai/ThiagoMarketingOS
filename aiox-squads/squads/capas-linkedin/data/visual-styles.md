# Estilos Visuais — Capas LinkedIn & Instagram

> **Design System:** Consultar `../../data/design-system.md` para paleta master, tipografia e regras globais.
> **Anti-AI Rules:** Consultar `../../data/anti-ai-design-rules.md` antes de criar qualquer capa.

## Perfil

- **Nome:** Thiago C.Lima
- **@:** othiago-clima
- **Foto de perfil:** Supabase `content-assets/source-photos/profile-photo.png` _(fallback: `assets/profile-photo.png`)_
- **Banco de fotos pessoais:** Supabase `source_photos` table _(fallback: `assets/photos/`)_

> 📌 **Source of truth: Supabase.** Fallback: `assets/` local (fase de transição).
> Para listar fotos disponíveis: `node shared/scripts/list-source-photos-cli.js`

---

## Viewport e Formato

Todas as capas usam:
- **Viewport:** 1080 x 1350 (4:5, otimizado para feed LinkedIn e Instagram)
- **Formato final:** PNG (renderizado de HTML via Puppeteer headless)
- **HTML:** Self-contained, sem dependências externas exceto Google Fonts

---

## Estilo 1: Rascunho no Papel

### Conceito
Foto real de papel/caderno em cenário contextual + infográfico desenhado à lápis por cima do papel. Parece que o Thiago realmente rascunhou o conteúdo à mão. É o estilo mais humano e anti-IA possível — impossível confundir com template.

> **NOTA:** Este estilo usa paleta ORGÂNICA (não a paleta master digital), conforme definido no Design System global.

### Quando Usar
- **Posts com MUITA informação** — condensa em infográfico visual
- **Hook fraco** — a foto + rascunho param o scroll independente do texto
- Posts de Credibilidade (C) e Alcance (A)
- Quando o post tem dados, frameworks, listas ou fluxos que ficam melhores visualizados
- Quando quer gerar "saves" (infográfico = salvamento)

### Perde Quando
- Conteúdo é puramente verbal (frase isolada) — vai melhor como Quote Card
- Conteúdo é puramente numérico (1 dado central) — vai melhor como Micro-Infográfico
- O tom exige formalidade premium (matéria-colab) — vai melhor como Editorial Clean carrossel

### Pipeline de Criação
1. **Analisar o post** — identificar os dados/conceitos-chave que serão visualizados
2. **Selecionar foto do banco Supabase** via `node shared/scripts/list-source-photos-cli.js --category papers` — escolher cenário adequado ao tom _(fallback: `assets/papers/`)_
3. **Identificar a área do papel** na foto — mapear coordenadas onde o rascunho vai ficar
4. **Desenhar infográfico estilo lápis** sobre o papel — usando geração de imagem
5. **O cenário ao redor do papel permanece intocado** — só o papel recebe o rascunho

### Especificações
| Elemento | Valor |
|----------|-------|
| Fundo | Foto real do banco Supabase (`source_photos`, category=papers). Fallback: `assets/papers/` |
| Caderno | Moleskine preto com elástico, páginas lisas (sem linhas) |
| Cor do papel | Creme/off-white (varia com iluminação) |
| Abertura | Sempre duas páginas — área útil DUPLA |
| Infográfico | Estilo lápis/caneta realista, desenhado SOBRE as páginas |
| Conteúdo do rascunho | Dados-chave, frameworks, fluxos, listas do post |
| Marca | "Thiago C.Lima" discreto no canto, fora do papel, 18px, cor `#64748B` (`--text-muted`) |
| Max elementos | 3-5 blocos de informação no infográfico |

### Cenários Disponíveis (6 fotos)
| Foto | Cenário | Melhor Para |
|------|---------|-------------|
| `paper-01` | Mão segurando caderno + monitor WS | Vendas B2B, WS |
| `paper-02` | Mão segurando caderno + monitor WS + logos | Credibilidade, empresas |
| `paper-03` | Caderno na cama + caderno WS fechado ao lado | Frameworks, fluxos longos (paisagem) |
| `paper-04` | Selfie + setup dual monitor | Bastidores, storytelling |
| `paper-05` | Selfie close, rosto parcialmente coberto | Provocação, opinião forte |
| `paper-06` | Caderno na cama + garrafa + WS ao fundo | Reflexão, planejamento |

### Padrão da Iluminação
- Fonte principal: luz dos monitores (tom quente amarelo/laranja)
- Ambiente escuro — contraste natural entre papel claro e fundo escuro
- Iluminação lateral cria sombras suaves — **usar a favor do realismo do rascunho**

### Tipos de Infográfico Permitidos
- **Fluxo/Pipeline** — setas conectando etapas (ex: "Lead → Qualificação → Fechamento")
- **Lista numerada** — 3-5 itens com ícones simples à lápis
- **Comparação** — dois lados (ex: "Antes vs. Depois", "Certo vs. Errado")
- **Framework** — diagrama simples (ex: quadrantes, pirâmide, funil)
- **Dados hero** — número grande + contexto desenhado ao redor

### Regras
- O rascunho deve parecer REAL — traço de lápis/caneta, não tipografia digital
- **NUNCA** usar fonte digital sobre o papel — tudo deve parecer manuscrito
- O papel é o canvas — o cenário ao redor NÃO é alterado
- O rascunho deve respeitar a **dobra central** das duas páginas — usar como separador natural
- Cenário deve variar entre capas para não repetir
- Se o banco de fotos Supabase (`source_photos`, category=papers) estiver vazio, **NÃO gerar** este estilo — usar outro
- O infográfico deve ser LEGÍVEL — não é rabisco, é rascunho organizado
- Máximo 5 blocos de informação — se tem mais, simplificar

### Banco de Fotos
- **Source of truth:** Supabase — tabela `source_photos`, category `papers`
- **Listar fotos:** `node shared/scripts/list-source-photos-cli.js --category papers`
- **Fallback local:** `assets/papers/` (fase de transição)
- **Catálogo completo:** metadados na tabela `source_photos` (description, best_for, orientation)
- **Formato:** JPG, mín. 1080px largura
- **Caderno:** Moleskine preto, páginas lisas creme, sempre aberto em 2 páginas
- **O usuário gerencia via Supabase** — pode adicionar, remover e alterar a qualquer momento

---

## Estilo 2: Pessoa + Texto

### Conceito
Foto real do Thiago ou do contexto com overlay de texto protegido por gradient. Conexão humana + mensagem.

> **NOTA:** Este estilo usa foto real como base — accent e paleta digital não se aplicam.

### Quando Usar
- Posts de Engajamento (E) e Alcance (A)
- Bastidor, palestra, visita a cliente, storytelling pessoal
- Quando há foto contextual disponível no banco

### Perde Quando
- Tema é abstrato/conceitual sem cena real para ancorar
- Não há foto contextual adequada no banco
- O conteúdo é puramente teórico (framework, dado, opinião sem cena) — vai melhor como Caderno Rascunhado ou Editorial

### Pipeline de Seleção de Imagem
1. **Analisar banco de fotos** via `node shared/scripts/list-source-photos-cli.js --category photos` — selecionar a mais adequada ao tema/emoção _(fallback: `assets/photos/`)_
2. **Decidir se usa original ou adapta** — avaliar se precisa de alteração por IA
3. **Se adaptar: validar** — analisar se a alteração mantém realismo
4. **Se validação falhar** — usar imagem original (fallback seguro)

### Especificações
| Elemento | Valor |
|----------|-------|
| Foto | Do banco Supabase (`source_photos`, category=photos) — contextualizada ao tema. Fallback: `assets/photos/` |
| Overlay | Gradient 60%+ para contraste (bottom→top ou radial) |
| Texto | Inter ou Montserrat, 44-56px / 600+, #FFFFFF |
| Posição | Terço inferior ou terço superior (lei dos terços) |
| Max palavras | 3-7 |
| Text-shadow | `0 2px 12px rgba(0,0,0,0.6)` obrigatório |
| Assinatura | "Thiago C.Lima" — Inter 500, 20px, #FFFFFF opacity 60% |

### Regras de Adaptação por IA
- **NUNCA** alterar características faciais
- **NUNCA** mudar a expressão
- **PODE** alterar fundo, iluminação, enquadramento
- **PODE** adicionar objetos contextuais coerentes
- **Sempre manter realismo** — se parecer artificial, usar original

---

## Estilo 3: Print de Autoridade

### Conceito
Screenshot estilizado de uma fonte de autoridade (tweet, notícia, comentário) com contexto visual. Consistente com o estilo Twitter-Style do carrossel.

### Quando Usar
- Posts de Credibilidade (C) e Alcance (A)
- Quando o post comenta uma notícia/declaração de terceiro
- Quando quer "bridge" — conectar ao que o público já conhece

### Perde Quando
- Não há print real disponível (e não há tema público para buscar)
- A reação precisa de desenvolvimento longo em ≥3 etapas (vai melhor como carrossel Twitter-Style)
- O tema é abstrato e não responde a nada público específico

### Pipeline de Criação (Print de Autoridade)
1. Operador escolhe estilo 4 no checkpoint inicial (step-01)
2. Designer chama task `tasks/obter-print-autoridade.md` (3 caminhos: upload manual / EXA + Playwright / EXA curado com 3 candidatos)
3. **Checkpoint humano obrigatório** — operador valida o print escolhido antes do render
4. Print salvo em `output/prints/<slug>/print.png` + `metadata.json` (URL origem, autor, domínio, hash, atribuição)
5. Designer renderiza HTML 1080×1350 com print + texto da opinião do Thiago + atribuição automática lida do metadata
6. Puppeteer headless → PNG (`scripts/render-cover.js`)
7. Upload Supabase via `node ../../shared/scripts/upload-cover-cli.js`

### Especificações
| Elemento | Valor |
|----------|-------|
| Fundo | `#1A1A2E` (Charcoal — `--bg-dark`) |
| Header | Foto circular 80px + "Thiago C.Lima" 28px + "@othiago-clima" 22px, cor `#F1F5F9` (Chalk) |
| Texto do Thiago | 38-48px / 700, `#F1F5F9` (Chalk) — opinião/chamada sobre o print |
| Print | Screenshot centralizado, `border-radius: 0px` (regra Anti-AI), `box-shadow: 0 8px 32px rgba(0,0,0,0.4)` |
| Container do print | `background: #27293D` (`--surface`), `border: 1px solid #3F3F5C` (`--border`), `padding: 24px` |
| Atribuição | "via @fulano" ou "Fonte: XYZ", 18px, `#64748B` (`--text-muted`) |
| Assinatura | "Thiago C.Lima" — Inter 500, 20px, `#64748B` (`--text-muted`), rodapé |

### Regras
- Header SEMPRE presente (consistência com carrossel Twitter-style)
- Print deve ocupar max 40-50% da área vertical da capa
- Texto do Thiago deve ser o elemento principal (print é suporte)
- Screenshot deve estar legível — se necessário, recortar trecho relevante

---

## Tipografia Consolidada (Todos os Estilos)

| Elemento | Rascunho no Papel | Pessoa+Texto | Print de Autoridade |
|----------|:-----------------:|:------------:|:-------------------:|
| Viewport | 1080 x 1350 | 1080 x 1350 | 1080 x 1350 |
| Hero text | Manuscrito/lápis | 44-56px/600 | 38-48px/700 |
| Subtitle | Manuscrito/lápis | — | 22-28px/500 |
| Caption | 18px/400 (marca) | — | 18px/400 |
| Font | Lápis real (imagem) | Inter / Montserrat | Inter |

---

## REFAC-002 — CTA-Block Condicional (`cta_arte`)

> Quando o post é lead magnet (`is_lead_magnet=true` no front-matter do `post-final.md`), o Designer renderiza um bloco de CTA dentro da arte. Quando é `false`, o bloco é removido do HTML antes do render.

### Princípio operativo

- O `cta_arte` (ex: "Comente FRAMEWORK pra receber na DM") **vai DENTRO da arte**, nunca no body do post.
- Faixa inferior, contraste alto, ≤ 10% da altura total (135px de 1350px).
- Defesa §6.10 do `linkedin-algorithm-2026-reference.md`: ao manter o bait fora do texto, não é detectado pelo NLP do feed; quem captura é quem está engajado o suficiente para ler a arte.

### Especificação por estilo

#### Estilo 1 — Rascunho no Papel
| Atributo | Valor |
|----------|-------|
| Posição | Faixa inferior do papel (~10% da altura útil) |
| Estilo | **Manuscrito** a lápis/caneta — NUNCA tipografia digital sobre o papel |
| Sublinhado | Linha ondulada à mão livre |
| Cor | Lápis preto/cinza-escuro (mesmo do rascunho) |
| Comprimento | ≤ 60 caracteres (1 linha) |
| Implementação | Trecho extra no prompt do `generate-cover-pro.js` — ver `templates/rascunho-papel.md` seção "CTA-BLOCK Condicional" |

#### Estilo 2 — Pessoa + Texto
| Atributo | Valor |
|----------|-------|
| Posição | Faixa absoluta, `bottom: 0`, full-width |
| Background | Gradient escuro 0% → 95% (rgba(0,0,0,X)) — protege contraste sobre foto |
| Tipografia | Inter 26px / 600, branco `#FFFFFF` |
| Padding | 18px vertical × 40px horizontal |
| Altura máxima | 130px (≤10% de 1350px) |
| Letter-spacing | -0.005em |
| Implementação | `.cta-bar` no `templates/pessoa-texto.html` entre marcadores `<!-- CTA-BLOCK -->` e `<!-- /CTA-BLOCK -->` |

#### Estilo 3 — Print de Autoridade
| Atributo | Valor |
|----------|-------|
| Posição | Inline ao final do `.cover` (margin-top 28px após footer-line) |
| Background | Gradient teal accent (rgba(20,184,166,X)) — coerente com a paleta accent do estilo |
| Border-top | 1px solid rgba(20,184,166,0.5) |
| Tipografia | Inter 26px / 600, Chalk `#F1F5F9` |
| Padding | 22px vertical × 32px horizontal |
| Altura máxima | 130px |
| Implementação | `.cta-bar` no `templates/print-autoridade.html` entre marcadores `<!-- CTA-BLOCK -->` e `<!-- /CTA-BLOCK -->` |

### Regra de render

1. Designer abre `output/post-final.md`, faz parse do front-matter YAML.
2. Se `is_lead_magnet=true`: substitui `{{ cta_arte }}` pelo valor literal e mantém o bloco.
3. Se `is_lead_magnet=false` (ou ausente): **deleta** todo o conteúdo entre `<!-- CTA-BLOCK -->` e `<!-- /CTA-BLOCK -->` (inclusive os comentários) antes do `render-cover.js`.
4. Validação visual: o bloco não deve ocupar mais que 10% da altura (135px); se `cta_arte` for tão longo que ultrapasse, encurtar o texto, NUNCA aumentar a faixa.
