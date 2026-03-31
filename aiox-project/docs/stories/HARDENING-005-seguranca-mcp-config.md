# HARDENING-005 — Segurança do MCP Config

**Status:** ⏳ Em validação  
**Prioridade:** 🔴 Alta  
**Estimativa:** 30 min  
**Agente:** @dev  

---

## Objetivo

Proteger credenciais sensíveis expostas em texto plano no `mcp_config.json` do Antigravity IDE. O n8n JWT tem acesso total à API do n8n (executar/criar/deletar workflows) e precisa ser isolado.

---

## Contexto & Análise de Risco

| # | Credencial | Localização | No Git? | Risco | Ação |
|---|---|---|---|---|---|
| 1 | **n8n API Key** (JWT) | `~/.gemini/antigravity/mcp_config.json` | ❌ | 🔴 Alto | Proteger via wrapper |
| 2 | **Tally Bearer Token** | `~/.gemini/antigravity/mcp_config.json` | ❌ | 🟢 Baixo | Manter inline |
| 3 | **Supabase Anon Key** | `content-command-center/js/config.js` | ✅ | 🟢 Baixo | Nenhuma (público por design) |

### Por que não usar `${ENV_VAR}` inline?
O Antigravity **NÃO suporta** expansão de variáveis de ambiente nativamente no `mcp_config.json`. Valores no bloco `env` são strings literais. A solução é um **wrapper script**.

### Por que a Supabase anon key não precisa de proteção?
A `anon key` do Supabase é **pública por design** — equivalente a uma chave de API frontend. A proteção real vem das RLS policies no servidor (configuradas na HARDENING-001).

---

## Tarefas

### Task 1: Criar arquivo de secrets
- [x] Criar `C:\Users\thiag\.gemini-secrets.env` com o conteúdo:

```env
# MCP Server Credentials — NÃO COMMITTAR
N8N_API_URL=https://thiagowinning-n8n-editor.tk4t3v.easypanel.host
N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyZGFkZjU0Mi1iMTM4LTQwMTUtYjVhMC04OGNiOGY1MmIwNzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNGM1MGVlNDMtNjRlYi00MmZlLWJlZDQtNzlmZGQ1MjhjZDJlIiwiaWF0IjoxNzc0NzIzNjEwfQ.-0EYSIZ8d0Sz2SjQbm-0rCNt8GDkt20zrpRmJAaqyxo
TALLY_API_KEY=tly-bubyYf3FB20Ej6roPe7WVaTc6mzqLsSJ
```

### Task 2: Restringir permissões do arquivo secrets
- [x] Executar no PowerShell (como admin NÃO necessário):

```powershell
$file = "C:\Users\thiag\.gemini-secrets.env"
$acl = Get-Acl $file
$acl.SetAccessRuleProtection($true, $false)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "$env:USERNAME", "FullControl", "Allow"
)
$acl.AddAccessRule($rule)
Set-Acl $file $acl
```

### Task 3: Criar wrapper script PowerShell
- [x] Criar diretório `C:\Users\thiag\.gemini\scripts\` se não existir
- [x] Criar `C:\Users\thiag\.gemini\scripts\mcp-n8n-wrapper.ps1`:

```powershell
# mcp-n8n-wrapper.ps1 — Carrega credenciais de .env e executa n8n-mcp
$envFile = Join-Path $env:USERPROFILE ".gemini-secrets.env"

if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '=' -and $_ -notmatch '^\s*#' } | ForEach-Object {
        $parts = $_ -split '=', 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
} else {
    Write-Error "FATAL: Secrets file not found at $envFile"
    exit 1
}

# Variáveis de configuração (não-secretas)
$env:MCP_MODE = "stdio"
$env:LOG_LEVEL = "error"
$env:DISABLE_CONSOLE_OUTPUT = "true"

# Executa o n8n-mcp server
npx n8n-mcp
```

### Task 4: Atualizar mcp_config.json  
- [x] Substituir conteúdo de `C:\Users\thiag\.gemini\antigravity\mcp_config.json` por:

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "powershell",
      "args": [
        "-ExecutionPolicy", "Bypass",
        "-File", "C:\\Users\\thiag\\.gemini\\scripts\\mcp-n8n-wrapper.ps1"
      ]
    },
    "tally": {
      "url": "https://api.tally.so/mcp",
      "headers": {
        "Authorization": "Bearer tly-bubyYf3FB20Ej6roPe7WVaTc6mzqLsSJ"
      }
    }
  }
}
```

> **Nota sobre o Tally:** O token permanece inline porque o servidor Tally usa transporte HTTP (não stdio). O Antigravity envia os headers diretamente — não passa por um processo filho onde poderíamos injetar env vars. Risco baixo pois o arquivo não está no Git.

### Task 5: Validação
- [ ] Reiniciar o Antigravity IDE completamente (fechar e abrir)
- [ ] Verificar que o n8n-mcp server conecta normalmente (sidebar do agente)
- [ ] Testar um comando MCP simples — ex: pedir ao agente "liste meus workflows do n8n"
- [ ] Verificar que o Tally continua respondendo
- [x] Confirmar que `mcp_config.json` NÃO contém mais o n8n JWT
- [x] Confirmar que `.gemini-secrets.env` NÃO é acessível por outros usuários do Windows

### Task 6 (Opcional): Documentar rotação
- [ ] Adicionar ao README do projeto um lembrete de rotação trimestral das chaves

---

## Critérios de Aceite

1. ✅ O `mcp_config.json` NÃO contém credenciais sensíveis (exceto Tally — aceito como limitação)  
2. ✅ As credenciais estão em `~/.gemini-secrets.env` com permissões restritas  
3. ✅ O n8n-mcp server funciona normalmente via wrapper script  
4. ✅ O Tally MCP continua funcionando  
5. ✅ Zero regressão funcional na IDE  

---

## Arquivos Criados/Modificados

| Arquivo | Ação |
|---|---|
| `C:\Users\thiag\.gemini-secrets.env` | [NEW] Secrets isolados |
| `C:\Users\thiag\.gemini\scripts\mcp-n8n-wrapper.ps1` | [NEW] Wrapper script |
| `C:\Users\thiag\.gemini\antigravity\mcp_config.json` | [MODIFY] Remover JWT |

---

## Notas para o Dev

- **NÃO mover** a Supabase anon key do `config.js` — ela é pública por design do Supabase
- **NÃO tentar** usar `${ENV_VAR}` no `mcp_config.json` — não é suportado pelo Antigravity
- Após modificar o `mcp_config.json`, é **obrigatório reiniciar a IDE** para as mudanças surtirem efeito
- Se o wrapper falhar, restaurar o `mcp_config.json` original (fazer backup antes)
