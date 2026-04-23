# copilot/ — contexto estratégico pra o co-piloto da transição v1 → v2

Esta pasta é **temporária**. Existe pra o Claude co-piloto operar no Antigravity com contexto completo durante a transição da v1 pra v2 do Thiago Marketing OS. Quando a Etapa 3 terminar (átomos estratégicos migrados pro banco, sessão "Estratégia" funcionando), a pasta é arquivada.

---

## Quem lê isto

Você é o Claude co-piloto no Antigravity. Você tem acesso ao código real do projeto Thiago Marketing OS (na raiz do repo, fora desta pasta). **Leia tanto o contexto estratégico daqui quanto o código real antes de propor qualquer coisa** — propostas que ignorem o banco atual, o fluxo de squads ou a integração Antigravity↔plataforma vão falhar.

---

## Ordem de leitura

1. **`handoff.md`** — contexto completo da conversa anterior, diagnóstico da v1, escopo acordado da v2, decisões descartadas, etapas de execução. Este é o documento mestre — leia inteiro antes de qualquer outra coisa.

2. **`estrategia/01-fundacao.md`** — ICP, lente proprietária ("Built, not prompted"), bandeiras, 4 fontes recorrentes de tese.

3. **`estrategia/02-conteudo.md`** — 4 regras de qualidade, 5 níveis de relacionamento, signature visual.

4. **`estrategia/03-alcance.md`** — camada de alcance via meme/evento de massa, régua da tese sobrevivendo sem o meme.

5. **`estrategia/04-distribuicao.md`** — camada de distribuição via matéria-colab, critério do título pela lente, lista inicial de alvos.

6. **`estrategia/05-lacuna-de-posicionamento.md`** — posicionamento único do Thiago, concorrentes mapeados, LACUNA ENCONTRADA.

7. **`referencias/`** — material auxiliar (exemplo Tallis Gomes de lacuna, outros exemplos que o Thiago anexar).

---

## Arquitetura estratégica — átomos, não documentos

**Decisão arquitetural crítica:** a estratégia no banco da plataforma NÃO é armazenada como documentos narrativos. É decomposta em **átomos estratégicos** — unidades atômicas, campos tipados, editáveis individualmente na UI da sessão "Estratégia" da plataforma.

Os 5 `.md` em `estrategia/` são fonte de **inicialização** do sistema, não fonte permanente. A Etapa 0 decompõe esses docs em átomos (salvos em `copilot/atomos/`), e a Etapa 3 migra os átomos pra banco.

**Camada única:** não há "documentos narrativos + átomos" em paralelo. Átomos são a fonte de verdade. Se alguém pedir doc narrativo, é gerado a partir dos átomos sob demanda.

Leia a seção 4 do `handoff.md` pra entender a lista de átomos previstos e a tabela de squad × átomos consumidos.

---

## Primeiro passo concreto

1. Cumprimenta o Thiago e confirma que leu: handoff inteiro + os 5 docs estratégicos + deu uma passada no código real do projeto
2. **Começa pela Etapa 0 — decomposição em átomos.** É pré-requisito de tudo.
3. Pergunta:
   - **Decompor todos os átomos de uma vez e revisar em bloco, ou decompor doc por doc e revisar em 5 rodadas menores?**
   - **Qual formato pros arquivos em `copilot/atomos/` (JSON, YAML, markdown estruturado)?**
4. Espera resposta antes de começar qualquer decomposição

---

## Regras de convivência

- Se o Thiago disser que algo é overengineering, é. Ele corta sem cerimônia e costuma ter razão. Proponha o mínimo necessário.
- Marque o que você sabe com certeza, o que você supõe, e o que você não sabe. Não invente contexto técnico sobre o código sem olhar o código.
- Mudança em squad → Antigravity. Mudança em UI/banco/fluxo da plataforma → código do projeto. Não misture.
- Quando for configurar squad na Etapa 1 ou 2, **puxe apenas os átomos listados na tabela de "Squad × átomos consumidos"** (seção 4 do handoff). Não jogue doc inteiro no prompt do squad.
