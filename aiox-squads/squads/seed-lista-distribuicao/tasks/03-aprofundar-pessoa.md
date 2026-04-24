# Task: Aprofundar Pessoa da Lista

> Step A1 do fluxo de aprofundamento — Gerar ângulos novos para pessoa que já está na lista ativa.

---

## Metadata
- **Step:** step-A1-aprofundar-pessoa
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** nome da pessoa (obrigatório) + input livre do Thiago (opcional)
- **Output:** `output/angulos-aprofundados.md`

---

## Context Loading

Carregar antes de executar:
- `output/lista-distribuicao.md` — Lista ativa (para ver ângulos existentes da pessoa)
- `data/gate-rules.md` — Regras do gate da lente e arquétipos de matéria
- `data/linkedin-strategy.md` — Lente e mecânica de distribuição
- `agents/pesquisador-alvos.md` — Persona do Paulo Prospector
- `templates/aprofundamento-template.md` — Formato de output

---

## Quando usar esta task

3 situações típicas:
1. **Conteúdo novo:** Thiago leu post novo da pessoa e quer extrair ângulo dali
2. **Movimento público:** Pessoa mudou de empresa, lançou produto, tomou decisão polêmica → ângulo novo
3. **Exploração:** Ângulos iniciais já foram usados e Thiago quer explorar leituras menos óbvias

---

## Instruções

### 1. Validar Pessoa na Lista

Verificar em `output/lista-distribuicao.md` que a pessoa existe na lista ativa.
- Se **não existe** → rejeitar imediatamente. Esta task é para pessoas já aprovadas. Para pessoa nova, usar task 01 (pesquisar alvos).

### 2. Carregar Ângulos Existentes

Listar todos os ângulos que a pessoa já tem na lista:
```
Ângulos existentes de [nome]:
1. [Arquétipo] — "[título]" — Status: [status]
2. [Arquétipo] — "[título]" — Status: [status]
```

Esses ângulos são referência para evitar duplicata. **Não regenerar nenhum deles.**

### 3. Processar Input do Thiago

**Se o Thiago passou input livre:**
- Ancorar pesquisa no input (ex: "vi esse post dela sobre X" → pesquisar esse post, extrair ângulo a partir dele)
- Ângulo proposto precisa ter conexão direta com o input, não ser genérico
- Se o input aponta pra evidência específica, usar como evidência principal do ângulo

**Se o Thiago NÃO passou input livre:**
- Pesquisar movimento público recente da pessoa (últimos 30-60 dias) usando `web_search` e `web_fetch`
- Buscar: posts novos, mudanças de cargo, lançamentos, decisões públicas, falas em eventos, cases novos
- Se não houve movimento público recente relevante, considerar ângulos baseados em material público existente que ainda não foi explorado

### 4. Formular Ângulos Novos

Para cada ângulo novo, seguir o mesmo formato da task de pesquisa:

```
### Ângulo [N+1]
- **Arquétipo:** [classificação — ver gate-rules.md]
- **Título pela lente:** "[título formulado]"
- **Evidências específicas deste ângulo:**
  1. [evidência]
  2. [evidência adicional se houver]
- **Risco:** [1 linha — ou "Nenhum identificado"]
- **Origem:** [input do Thiago: "[reproduzir input]" / pesquisa de movimento recente]
- **Não-duplicata:** ✅ Diferente dos ângulos existentes porque [justificativa em 1 linha]
```

### 5. Validar Não-Duplicata

Para cada ângulo proposto, verificar contra os ângulos existentes:
- Tese é diferente? (não é reformulação)
- Evidências são diferentes? (não são as mesmas em outra ordem)
- Leitura é diferente? (não é o mesmo ângulo com arquétipo diferente)

Se qualquer ângulo proposto for duplicata → **descartar antes de apresentar.**

### 6. Lidar com Esgotamento

Se não conseguir formular nenhum ângulo novo distinto dos existentes:
- **Retornar vazio com justificativa honesta**
- Exemplo: "Pessoa já tem ângulos esgotados nas leituras óbvias; sugerir aguardar movimento público novo"
- **Não forçar ângulo superficial só pra não retornar vazio**

---

## Output Format

Usar template de `templates/aprofundamento-template.md`:

```
# Aprofundamento: [nome da pessoa] — [data]

## Input do Thiago
[input reproduzido — ou "Nenhum — pesquisa livre de movimento recente"]

## Ângulos Existentes (referência)
1. [Arquétipo] — "[título]"
2. [Arquétipo] — "[título]"

---

## Ângulos Novos Propostos

### Ângulo [N+1]
[formato completo]

---

## Resultado
- Total de ângulos novos propostos: [N]
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Pessoa não está na lista ativa (usar task 01 para pessoas novas)
2. ❌ Ângulo duplica um existente (mesma tese, mesmas evidências)
3. ❌ Ângulo não ancorado no input do Thiago (quando input foi fornecido)
4. ❌ Ângulo genérico sem evidência específica
5. ❌ Ângulo não passa no gate da lente (não formulável pela lente "Built, not prompted")
6. ❌ Informações inventadas (não públicas/verificáveis)

---

## Quality Criteria

- [ ] Pessoa validada como existente na lista ativa
- [ ] Ângulos existentes listados como referência
- [ ] Cada ângulo novo tem arquétipo + título + evidências + risco + origem + validação de não-duplicata
- [ ] Ângulos são genuinamente distintos dos existentes
- [ ] Input do Thiago respeitado (quando fornecido)
- [ ] Gate da lente aplicado em cada ângulo
- [ ] Retorno honesto se esgotado (não forçar)

---

## Próximo Passo

→ **step-A2**: ⏸️ CHECKPOINT — Thiago revisa ângulos novos e aprova quais entram na ficha da pessoa
→ Após aprovação: task 02 (atualizar lista) em Modo B adiciona ângulos aprovados à ficha
