# Anti-AI Design Rules — Capas LinkedIn & Instagram

> **Contexto:** Feedback real do Thiago: "Bato o olho e falo 'feito por IA'."
> Este documento é OBRIGATÓRIO para TODA capa gerada. Ler ANTES de criar qualquer HTML.

---

## O Problema

IA gera design "tecnicamente correto" mas visualmente genérico. O resultado parece
template: polido demais, simétrico demais, previsível demais. Falta a imperfeição
intencional, a contenção, e as decisões inesperadas que um designer humano faz.

---

## 🚫 Padrões Proibidos (AI Tell-Tales)

### 1. Gradient Text Fill
```css
/* ❌ PROIBIDO */
background: linear-gradient(...);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```
- **Por quê:** É o clichê #1 de "premium dark UI" por IA. Todo prompt gera isso.
- **Alternativa:** Cor sólida flat. Se quiser destaque, use peso/tamanho diferente, não gradiente no texto.

### 2. Radial Glow / Background Glow
```css
/* ❌ PROIBIDO */
background: radial-gradient(circle, rgba(x,x,x,0.08) 0%, transparent 70%);
```
- **Por quê:** Glow circular sutil atrás de elementos é o marcador visual mais reconhecível de design por IA.
- **Alternativa:** Fundo flat limpo, ou textura de noise/grain CSS (ver seção Texturas Permitidas).

### 3. Ícones Literais Decorativos
- **Proibido:** Colocar ícone de "alerta" em post sobre alerta. Ícone de "gráfico" em post sobre dados. Ícone de "cérebro" em post sobre IA.
- **Por quê:** IA escolhe ícones óbvios/literais. Designer humano não ilustra o conceito — comunica via tipografia.
- **Alternativa:** Sem ícone. Tipografia É o design. Se absolutamente necessário, use elemento gráfico abstrato (linha, barra, ponto) em vez de pictograma.

### 4. Simetria Perfeita / Centralização Total
- **Proibido:** Todos os elementos centralizados verticalmente no eixo.
- **Por quê:** IA empilha tudo no centro porque não sabe criar tensão visual.
- **Alternativa:** Alinhamento à esquerda ou misto. Grid editorial. Peso visual deslocado para um terço. Criar assimetria intencional.

### 5. Connector Dots / Arrows
```css
/* ❌ PROIBIDO */
.connector-dot { width: 4px; height: 4px; border-radius: 50%; }
```
- **Por quê:** Parece componente de UI (stepper, wizard). Não é design editorial.
- **Alternativa:** Whitespace generoso entre blocos. A hierarquia tipográfica comunica relação, não dots.

### 6. Boxes com Border + Border-Radius
```css
/* ❌ PROIBIDO para elementos decorativos */
border: 1px solid rgba(...);
border-radius: 8px;
background: rgba(..., 0.04);
```
- **Por quê:** Parece card de dashboard/SaaS. Canva-like.
- **Alternativa:** Sem box. Texto direto com tipografia assertiva. Se precisar separar, use uma regra horizontal fina (2px, cor muted) ou espaço negativo.

### 7. Múltiplos Elementos Decorativos
- **Proibido:** Mais de 2 elementos decorativos na mesma capa (ícone + glow + barra lateral + connector + box = 5 elementos).
- **Por quê:** IA empilha efeitos porque não sabe exercer contenção. Designer humano faz 1-2 escolhas fortes e deixa o resto respirar.
- **Regra:** Máximo 2 elementos decorativos por capa. Um primário (ex: regra horizontal) e um secundário (ex: aspas grandes). Whitespace preenche o resto.

### 8. Paleta "Óbvia"
- **Proibido:** Vermelho para "perigo/alerta". Verde para "sucesso". Azul para "tecnologia". Laranja para "urgência".
- **Por quê:** IA associa cor literal ao sentimento. Designer humano subverte expectativas.
- **Alternativa:** Usar paleta inesperada mas coerente. Amber/gold para urgência (em vez de vermelho). Slate/charcoal para seriedade (em vez de preto puro). Consultar referências editoriais (The Economist, Bloomberg, HBR).

---

## ✅ Padrões Obrigatórios (Human Design Markers)

### 1. Tipografia Sólida
- Cores flat, sem gradiente no texto
- Hierarquia por tamanho + peso + cor, não por efeitos
- Usar Inter com variação de peso: 400 para corpo, 700-900 para destaque
- Permitido: uma palavra em cor de acento para destaque semântico

### 2. Assimetria Intencional
- Pelo menos um elemento deslocado do centro
- Usar grid editorial: margens assimétricas, texto alinhado à esquerda
- Peso visual no terço superior ou inferior, não exatamente no meio
- Referência: layout de revista (The Economist, Bloomberg Businessweek)

### 3. Espaço Negativo Generoso
- Espaço VAZIO é o design. Não preencher com elementos decorativos.
- Mínimo 30% do viewport deve ser espaço "vazio" (fundo limpo)
- Whitespace entre blocos > 48px
- Respiração visual = profissionalismo

### 4. Textura Sutil (quando necessário)
```css
/* ✅ Noise/grain texture via SVG filter (sutil, orgânico) */
.cover::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  pointer-events: none;
}
```
- Noise texture em opacity <5% adiciona caráter humano
- Alternativa a glows e gradientes
- Faz o fundo parecer "impresso" em vez de "renderizado"

### 5. Referências Editoriais
Cada capa deve poder responder: "Onde um humano veria esse layout?"
- Bloomberg terminal / data viz
- The Economist infographics
- McKinsey / BCG one-slide insights
- Annual report covers
- NÃO: Canva templates, Dribble shots, Behance "premium dark UI"

### 6. Contenção (Restraint)
- Antes de adicionar um elemento, perguntar: "Isso adiciona informação ou só decoração?"
- Se a resposta é "decoração", não adicionar
- Cada elemento deve justificar sua existência comunicando algo
- Regra: se tirar o elemento e a mensagem fica mais clara, tire

### 7. Uma Cor de Acento, Máximo
- Paleta: fundo + texto + UMA cor de acento
- A cor de acento destaca A INFORMAÇÃO MAIS IMPORTANTE, não "enfeita"
- Não usar gradiente na cor de acento — cor flat sólida

---

## Checklist Obrigatório Pré-Entrega

Antes de renderizar qualquer capa, verificar:

- [ ] Zero gradient text fills
- [ ] Zero radial glows / background glows
- [ ] Zero ícones literais/óbvios
- [ ] Não é 100% centralizado — tem assimetria intencional
- [ ] Máx. 2 elementos decorativos
- [ ] Cor de acento é flat (não gradiente)
- [ ] Pelo menos 30% de espaço negativo
- [ ] Paleta não é "óbvia" (não é vermelho=perigo, verde=sucesso)
- [ ] Passa o "teste do olho": parece editorial, não template

---

## O Teste Final

> Mostre a capa para alguém e pergunte: "Isso foi feito por uma pessoa ou por IA?"
> Se a resposta é "IA" — refaça. Não é opcional.
