# Handoff: Feature Lead Magnet no Content Command Center

> **Para:** Architect (Aria)
> **Data:** 2026-04-30
> **Contexto:** Feature solicitada durante sessão de Seed Pautas Centrais.
> **Prioridade:** Média — não bloqueia produção de conteúdo hoje, mas precisa de plano antes de postar o primeiro lead magnet.

---

## Problema

Algumas subpautas (e posts que delas nascem) são lead magnets — conteúdo que leva a um material externo (squad, vídeo aula, PDF, etc.). Atualmente o CCC não distingue lead magnet de post normal, não tem badge visível e não tem estado para rastrear se o material do lead magnet foi produzido.

---

## Solução Esperada (requisitos funcionais)

### 1. Badge "Lead Magnet" nas Pautas Centrais (tela de Subpautas)

**Onde:** Tela/card de Subpauta no CCC.

**O que:**
- Badge visível `🎯 Lead Magnet` ao lado do título da subpauta.
- Badge deve ser configurável por subpauta (campo boolean no Supabase).
- Ao clicar ou hover no badge: tooltip ou painel lateral mostrando o **checklist do lead magnet** (o que precisa ser feito para o material existir — ex: "construir squad", "gravar vídeo aula").

---

### 2. Feature de Rastreamento na Tela de Conteúdo (posts individuais)

**Onde:** Ao abrir um post que está associado a uma subpauta lead magnet.

**O que:**

#### Badge de status (ao lado de "Urgente" / "Relevante")
- Se o post é lead magnet: badge `🎯 Lead Magnet` aparece.

#### Toggle de status do material
Dentro do post, seção **"Material do Lead Magnet"**:

| Estado | Label | Visual |
|--------|-------|--------|
| Material não produzido | `A fazer` | Botão **vermelho** |
| Material produzido | `Já` | Botão **verde** |

#### Campo de observação (só disponível quando "Já")
- Quando togglado para "Já": abre campo de texto livre.
- Uso típico: colar o link do material (URL do squad, link do vídeo, etc.).
- O campo salva no Supabase vinculado ao post.

#### Persistência visual
- Badge ao lado de "Urgente"/"Relevante" fica **verde** se material está "Já", **vermelho** se "A fazer".
- Badge é visível na listagem de posts sem precisar abrir o post.

---

## Dados / Schema (sugestão para o Data Engineer)

### Tabela `subpautas` (ou equivalente) — novos campos:
```sql
is_lead_magnet boolean DEFAULT false,
lead_magnet_checklist text[] -- array de strings com os itens do checklist
```

### Tabela `posts` — novos campos:
```sql
lead_magnet_status text CHECK (lead_magnet_status IN ('a_fazer', 'concluido')) DEFAULT 'a_fazer',
lead_magnet_observation text, -- URL ou nota livre
lead_magnet_updated_at timestamptz
```

---

## Exemplos reais do que seria marcado como Lead Magnet

### Subpauta 1.3 (seed atual):
> "Como automatizar seu processo comercial sem contratar agência de IA"

**Checklist:**
- [ ] Construir squad de diagnóstico + recomendação por perfil técnico
- [ ] Gravar vídeo aula ensinando a usar o squad (iniciantes)
- [ ] Publicar squad para acesso via link

**Status esperado quando publicar o post:** botão vermelho (material "A fazer") → ao concluir squad + vídeo, muda para verde com link do material.

---

## Escopo explícito (o que NÃO está no escopo desta feature)

- Não inclui sistema de analytics de conversão do lead magnet.
- Não inclui integração com ferramentas de captura de email (isso seria feature separada).
- Não inclui automação de notificação quando material muda de status.

---

## Prompt para ativar o Architect

Cole o bloco abaixo no Claude Code para ativar o Aria:

```
/architect

*analyze

Preciso de um plano arquitetural para a feature "Lead Magnet" no Content Command Center (CCC).

**Contexto:**
- CCC é um dashboard web em Vanilla JS + Supabase (sem framework de frontend).
- Já existe uma tela de Pautas/Subpautas e uma tela de Conteúdo (posts).
- Handoff completo em: `aiox-project/docs/handoff-lead-magnet-ccc.md`

**O que preciso do plano:**
1. Mudanças de schema no Supabase (tabelas, campos, RLS se necessário).
2. Componentes/elementos de UI a criar ou modificar (badge, toggle, campo de observação).
3. Pontos de integração com o código existente do CCC (onde adicionar lógica).
4. Sequência de implementação recomendada (o que o Dev deve fazer primeiro).
5. Estimativa de complexidade por parte.

Leia o handoff antes de responder. Não implemente — só o plano.
```
