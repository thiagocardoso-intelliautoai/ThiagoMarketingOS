# Task: Pesquisar Perfil do Alvo

> Step 01 do pipeline — Pesquisar publicamente a pessoa para montar dossiê.

---

## Metadata
- **Step:** step-01-pesquisar-perfil
- **Agent:** pesquisador-perfil (Petra Perfil)
- **Input:** nome do alvo + título-com-lente
- **Output:** `output/perfil-{slug}.md`

---

## Context Loading

Carregar antes de executar:
- `data/linkedin-strategy.md` — Lente, bandeiras, mecânica de distribuição
- `data/formato-materia-colab.md` — Regras do formato (jornalismo, não entrevista)
- `agents/pesquisador-perfil.md` — Persona da Petra Perfil

---

## Instruções

### 1. Receber Input

Do checkpoint anterior (step-00):
- **Nome do alvo:** [nome completo]
- **Título-com-lente:** [título da matéria já formulado pelo gate]

### 2. Pesquisar a Pessoa

Usar `web_search` e `web_fetch` para:

#### Bio e Trajetória
- Cargo atual, empresa, tempo na posição
- Trajetória profissional resumida (3-5 marcos)
- Formação relevante (se pública)

#### Posts Recentes (últimos 6 meses)
- Identificar 3-5 posts mais relevantes no LinkedIn
- Extrair trechos literais (entre aspas) que revelem posicionamento
- Notar padrões: sobre o que mais fala, qual tese defende

#### Cases Públicos
- 1-3 cases que a pessoa documenta publicamente
- Resultados mencionados (números, métricas, transformações)
- Como ela enquadra esses cases (vocabulário, ângulo)

#### Rede e Audiência
- Tipo de audiência que comenta nos posts (cargos, setores)
- Quem compartilha/reposta
- Conexões relevantes visíveis

### 3. Identificar Posicionamento/Tese

A partir dos dados pesquisados:
- Qual é a tese principal que essa pessoa defende?
- Como ela se posiciona no mercado?
- Onde converge com a lente do Thiago ("Built, not prompted")?
- Onde diverge (se diverge)?

### 4. Marcar Lacunas

Se não encontrou informação suficiente sobre algum aspecto, marcar como:
`[dados insuficientes: motivo]`

---

## Output Format

```
# Dossiê — [Nome]

## Bio
- **Cargo:** [atual]
- **Empresa:** [nome]
- **Trajetória:** [3-5 marcos, 1 linha cada]

## Posicionamento
- **Tese principal:** [1-2 frases]
- **Convergência com lente Thiago:** [onde se conecta]
- **Divergência:** [onde não se conecta, se houver]

## Posts Recentes Relevantes

### Post 1 — [data]
**Trecho:** "[citação literal]"
**Tema:** [1 frase]
**Fonte:** [URL]

### Post 2 — [data]
...

## Cases Públicos

### Case 1: [nome/título]
- **Contexto:** [1-2 linhas]
- **Resultado:** [números/métricas]
- **Citação:** "[frase literal]"
- **Fonte:** [URL]

## Rede e Audiência
- **Tipo de audiência:** [perfil dos comentadores]
- **Conexões relevantes:** [nomes/empresas que interagem]

## Lacunas
- [lista de aspectos onde dados foram insuficientes]
```

---

## Veto Conditions

Rejeitar e refazer se:
1. ❌ Informações inventadas (não verificáveis)
2. ❌ Menos de 2 posts recentes encontrados
3. ❌ Bio incompleta (sem cargo ou empresa atual)
4. ❌ Posicionamento não identificado

---

## Quality Criteria

- [ ] Bio completa com cargo, empresa, trajetória
- [ ] 3-5 posts com trechos literais e fontes
- [ ] 1-2 cases documentados
- [ ] Posicionamento/tese identificado
- [ ] Convergência com lente do Thiago mapeada
- [ ] Lacunas marcadas explicitamente

---

## Próximo Passo

→ **step-02**: Bruno Briefing monta o briefing completo com base neste dossiê
