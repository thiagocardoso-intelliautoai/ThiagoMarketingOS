# Story HARDENING-004 — Git Strategy + CI Básico

**🏷️ ID:** `HARDENING-004`
**📐 Estimativa:** 1h
**🔗 Depende de:** HARDENING-001, HARDENING-003
**🔗 Bloqueia:** Nenhuma
**👤 Assignee:** Dev
**🏷️ Labels:** `devops`, `CI`, `git`, `quality-gates`
**📊 Status:** `[ ]` To Do
**📋 Origem:** Auditoria Arquitetural (Aria, 2026-03-30)
**🚨 Prioridade:** Melhoria — estrutura para qualidade contínua

---

## Descrição

> Como **dono do projeto**, eu quero uma estratégia de branches Git e um CI mínimo no GitHub Actions, para que eu tenha histórico organizado por features e validação automática de que nada quebrou antes de merge.

## Contexto Técnico

| Situação atual | Problema |
|--|--|
| 1 commit monolítico | Impossível rastrear quando algo foi introduzido |
| Branch `main` única sem proteção | Qualquer push vai direto para produção |
| Zero CI/CD | constitution.md define quality gates mas nenhum está implementado |
| package-lock.json no .gitignore | Builds não-determinísticos |

**Princípio da Constitution:** "*MUST: npm run lint passa sem erros*" — mas lint não existe.

---

## Sub-tarefas

### 4.1 — Configurar ESLint mínimo para o CCC

- [ ] **4.1.1** Criar `content-command-center/.eslintrc.json`:

```json
{
  "env": {
    "browser": true,
    "es2022": true
  },
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "no-console": "off",
    "semi": ["warn", "always"],
    "no-debugger": "error"
  }
}
```

- [ ] **4.1.2** Adicionar ESLint ao `package.json` da raiz:

```json
{
  "devDependencies": {
    "eslint": "^9.0.0"
  },
  "scripts": {
    "lint": "eslint content-command-center/js/ --ext .js",
    "lint:fix": "eslint content-command-center/js/ --ext .js --fix"
  }
}
```

- [ ] **4.1.3** Rodar `npm run lint` e corrigir erros críticos (se houver). Warnings podem ficar.

---

### 4.2 — Criar GitHub Actions CI

- [ ] **4.2.1** Criar `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  validate-sql:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate SQL syntax
        run: |
          # Check that migration files exist and are non-empty
          for f in aiox-project/supabase/migrations/*.sql; do
            echo "✅ Validating: $f"
            if [ ! -s "$f" ]; then
              echo "❌ Empty migration file: $f"
              exit 1
            fi
            # Basic syntax check: must start with comment or CREATE/ALTER/DROP
            head -1 "$f" | grep -qE '^(--|CREATE|ALTER|DROP|DO)' || {
              echo "⚠️ Unexpected first line in $f"
            }
          done
          echo "✅ All migrations valid"

  check-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for exposed secrets
        run: |
          # Check no .env files are tracked
          if git ls-files --cached | grep -q '\.env$'; then
            echo "❌ .env file is tracked in git!"
            exit 1
          fi
          echo "✅ No .env files tracked"

          # Check supabase.js doesn't have hardcoded keys (post HARDENING-001)
          if grep -q 'eyJ' content-command-center/js/supabase.js 2>/dev/null; then
            echo "⚠️ Warning: supabase.js may contain hardcoded keys"
          fi
          echo "✅ Secret check passed"
```

---

### 4.3 — Remover `package-lock.json` do .gitignore

- [ ] **4.3.1** Em `.gitignore` da raiz, **remover** a linha:

```
package-lock.json
```

> **Justificativa:** O lockfile garante builds determinísticos. Sem ele, cada `npm install` pode gerar versões diferentes.

- [ ] **4.3.2** Adicionar o `package-lock.json` da raiz ao tracking:

```powershell
git add package-lock.json
```

---

### 4.4 — Configurar branch strategy mínima

- [ ] **4.4.1** Criar branch `dev` a partir de `main`:

```powershell
git checkout -b dev
git push -u origin dev
```

- [ ] **4.4.2** Documentar a estratégia no README (adicionar seção):

```markdown
## 🌿 Git Strategy

- `main` — branch estável (protegida)
- `dev` — branch de desenvolvimento ativo
- Feature branches: `feat/STORY-ID-descricao` (ex: `feat/HARDENING-001-seguranca`)
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- PRs: de feature branch → `dev` → `main`
```

> **Nota:** Não configurar branch protection no GitHub agora — isso é tarefa do @devops. Apenas criar a branch e documentar a convenção.

---

### 4.5 — Commit e push

- [ ] **4.5.1** Commit:

```powershell
git add -A
git commit -m "chore: add ESLint, GitHub Actions CI, git strategy [HARDENING-004]"
```

---

## Acceptance Criteria

- [ ] `npm run lint` roda sem erros críticos
- [ ] `.github/workflows/ci.yml` existe e é válido
- [ ] CI roda 3 jobs: lint, validate-sql, check-secrets
- [ ] `package-lock.json` tracked no git
- [ ] Branch `dev` criada
- [ ] README documenta Git strategy

## Definition of Done

✅ ESLint configurado e passando
✅ GitHub Actions CI operacional
✅ Branch strategy documentada e implementada
✅ Lock file versionado para builds determinísticos

## Riscos Técnicos

| Risco | Probabilidade | Mitigação |
|--|--|--|
| ESLint com muitos erros no render.js | Alta | Executar após HARDENING-002 (refactor) para menos ruído. Se executar antes, configurar como `warn` apenas |
| CI fail no primeiro push | Média | Jobs usam `continue-on-error: false` por padrão — fixar erros antes de push |
| `npm ci` falha sem lock file | Média | Gerar lock file com `npm install` antes de adicionar CI |

## File List

- `[ ]` `content-command-center/.eslintrc.json` — **NOVO** — config ESLint
- `[ ]` `package.json` — adiciona eslint devDep + script lint
- `[ ]` `.github/workflows/ci.yml` — **NOVO** — GitHub Actions CI
- `[ ]` `.gitignore` — remove `package-lock.json` da exclusão
- `[ ]` `README.md` — adiciona seção Git Strategy

## Ordem de Execução Recomendada

```
HARDENING-001 (Segurança)      ← PRIMEIRO — crítico
      │
      ├── HARDENING-002 (Refactor render.js + CSS)     ← paralelo
      │
      └── HARDENING-003 (Deps + README + Cleanup)      ← paralelo
                │
                └── HARDENING-004 (Git + CI)            ← por último
```

> **HARDENING-002 e 003 podem rodar em paralelo** (tocam arquivos diferentes).
> **HARDENING-004 deve rodar por último** porque o lint beneficia do render.js já refatorado.
