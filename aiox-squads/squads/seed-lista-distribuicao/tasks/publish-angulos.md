# Task: Publicar Ângulos no Thiago Marketing OS

> Step 05 do pipeline — Persiste pessoas e ângulos aprovados no banco da plataforma.
> Executado após step-04 (confirmação da lista).

---

## Metadata
- **Step:** step-05-publish-angulos
- **Agent:** pesquisador-alvos (Paulo Prospector)
- **Input:** `output/lista-distribuicao.md` (lista atualizada e confirmada)
- **Output:** `content-command-center/data/inbox-distribuicao.json` (atualizado)

---

## Context Loading

Carregar antes de executar:
- `output/lista-distribuicao.md` — Lista ativa com pessoas e ângulos (estado confirmado no step-04)

---

## Instruções

### 1. Identificar o que é novo

Ler `content-command-center/data/inbox-distribuicao.json` para saber o que já está pendente de import.

Ler `output/lista-distribuicao.md` para identificar:
- **Pessoas novas** (adicionadas nesta rodada — Modo 1) — precisam entrar no array `pessoas`
- **Ângulos novos** (status "🆕 Novo" de pessoa já existente — Modo 2, ou de pessoa nova) — precisam entrar no array `angulos`

Regra: **Não re-adicionar** itens que já estão no inbox pendente.

### 2. Formatar objetos

#### Pessoa nova (Modo 1 — candidato pesquisado)

```json
{
  "nome": "[nome completo]",
  "funcao": "[cargo/empresa]",
  "rede_relevante": "[a quem a rede dela alcança]",
  "expande_bolha": true,
  "observacao": "[notas de contexto ou interações — vazio se não houver]"
}
```

Campos:
- `expande_bolha`: `true` se a pessoa está fora da bolha Winning, `false` se é sócio/conexão interna
- `observacao`: campo livre, pode ficar vazio string

#### Ângulo novo (qualquer modo)

```json
{
  "pessoa_nome": "[nome — deve bater exatamente com o campo nome da pessoa]",
  "arquetipo": "[contra_o_consenso | tradutor_de_bastidor | pioneiro_silencioso | benchmark_vivo | misto | outro]",
  "titulo_pela_lente": "[título pela lente Built, not prompted]",
  "evidencias": ["evidência 1", "evidência 2"],
  "risco": "[descrição do risco editorial — vazio string se nenhum]",
  "origem": "[pesquisa_inicial | aprofundamento_com_input | aprofundamento_por_movimento_recente]",
  "expectativa_comentario": "[provavel | possivel | incerto]",
  "expectativa_repost": "[provavel | possivel | incerto]"
}
```

Mapeamento de origem:
- Modo 1 (pesquisa inicial) → `pesquisa_inicial`
- Modo 2 com direção do Thiago → `aprofundamento_com_input`
- Modo 2 por movimento recente (sem direção) → `aprofundamento_por_movimento_recente`

### 3. Atualizar inbox-distribuicao.json

Ler `content-command-center/data/inbox-distribuicao.json`.

Adicionar as novas pessoas ao array `pessoas` e os novos ângulos ao array `angulos`.

Salvar o arquivo atualizado.

### 4. Exibir relatório

```
📤 Publicando no Thiago Marketing OS

Arquivo: content-command-center/data/inbox-distribuicao.json

Pessoas adicionadas ao inbox: [N]
  [lista de nomes]

Ângulos adicionados ao inbox: [N]
  [lista: nome → arquétipo → título (abreviado)]

Próximo passo:
→ Abrir a plataforma e clicar "Importar ângulos aprovados"
→ Os [N] ângulos serão salvos no Supabase
```

---

## Veto Conditions

Rejeitar se:
1. ❌ `output/lista-distribuicao.md` não existe ou está vazio
2. ❌ Ângulo sem `pessoa_nome` definido
3. ❌ Arquétipo fora do enum permitido
4. ❌ `inbox-distribuicao.json` não pode ser lido ou escrito

---

## Quality Criteria

- [ ] Todas as pessoas novas estão em `pessoas[]` com campos completos
- [ ] Todos os ângulos com status "🆕 Novo" estão em `angulos[]`
- [ ] `pessoa_nome` de cada ângulo bate exatamente com o nome da pessoa
- [ ] Arquétipos usam o valor do enum (snake_case), não o label em português
- [ ] Itens já existentes no inbox não foram duplicados
- [ ] Relatório exibido com contagem correta

---

## Próximo Passo

→ Abrir `content-command-center/` no browser e clicar **"Importar ângulos aprovados"** na aba Pautas → Distribuição.
