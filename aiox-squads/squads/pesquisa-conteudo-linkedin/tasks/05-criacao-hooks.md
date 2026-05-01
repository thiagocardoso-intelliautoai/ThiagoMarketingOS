# Task: Criação de Hooks

> Step 05 do pipeline — Redator cria 3 opções de hook para a ideia aprovada.

---

## Objetivo

Criar 3 opções de hook usando estruturas DIFERENTES de `data/hook-structures.md`.
Max 210 caracteres cada. Recomendar o mais forte.

---

## Instruções

### 1. Receber a Ideia Aprovada e a História (se houver)
- Ler a ideia selecionada pelo Thiago no step-02 (Seleção e Decisão)
- Ler `output/historia-relevante.md` (gerado no step-04-historia) para verificar disponibilidade de história autêntica:
  - **`status: encontrada` ou `adjacente`:** história disponível — usar fala literal em ≥1 dos 3 hooks
  - **`status: skip` ou `nenhuma_encontrada`:** seguir sem história, todos os hooks marcados "✓ sem história"

### 2. Consultar Referências
- `data/hook-structures.md` — 9 estruturas validadas
- `data/tone-of-voice.md` — Tom e vocabulário
- `data/linkedin-strategy.md` — Lente e fontes de tese da ideia
- `output/historia-relevante.md` — fala literal e contexto da história disponível

### 3. Criar 3 Hooks (Estruturas DIFERENTES)

Para cada hook:
```
### Hook [A/B/C]
- **Estrutura usada:** [nome da estrutura de hook-structures.md]
- **Texto:** "[hook completo]"
- **Caracteres:** [contagem]
- **Por que funciona:** [1 frase justificando]
- **Origem:** ✓ usa fala de: [título da história em historia-relevante.md] | ✓ sem história
```

**Regra obrigatória quando `historia-relevante.md` tem `status: encontrada` ou `adjacente`:**
- ≥1 dos 3 hooks DEVE usar fala literal da história (citação direta entre aspas)
- Os outros podem ser sem história, mas pelo menos um deve aproveitar a história disponível
- Se `status: adjacente`: marcar explicitamente "sugestão adjacente — Thiago decide no step-06"

### 4. Recomendar o Mais Forte
```
### 🏆 Recomendação
Hook [A/B/C] — "[justificativa em 1-2 frases]"
```

---

## Regras Específicas

- ≤ 210 caracteres por hook (contar e confirmar)
- As 3 opções DEVEM usar estruturas diferentes
- Tom de voz conforme `data/tone-of-voice.md`
- Sem vocabulário proibido (game changer, sinergia, hack, disruptivo, etc.)
- Teste de leitura em voz alta — se não soa natural, reescrever

---

## Output

→ `output/hooks.md` com 3 opções + recomendação

## Próximo Passo

→ **step-06**: ⏸️ CHECKPOINT — Thiago escolhe o hook
