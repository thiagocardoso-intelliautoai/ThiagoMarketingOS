# Story ASSETS-003 — Atualizar Scripts de Geração (generate-cover-pro + render-cover)

**🏷️ ID:** `ASSETS-003`
**📐 Estimativa:** 1.5h
**🔗 Depende de:** ASSETS-001, ASSETS-002
**🔗 Bloqueia:** Stories 005
**👤 Assignee:** Dev (Backend)
**🏷️ Labels:** `scripts`, `refactor`, `backward-compat`
**📊 Status:** `[x]` Ready for Review

---

## Descrição

> Como **agente designer**, eu quero que os scripts de geração e renderização aceitem URLs do Supabase diretamente, para que as capas sejam produzidas a partir de fotos armazenadas na nuvem sem necessidade de download manual prévio.

## Contexto Técnico

- **Review #1 aplicado:** Em vez de um CLI intermediário (`fetch-source-photo-cli.js`), o `generate-cover-pro.js` agora aceita `--image-url` diretamente
- **Review #3 aplicado:** O `render-cover.js` precisa de detecção explícita de URLs remotas no HTML para evitar crash ENOENT
- Ambos os scripts mantêm backward compatibility com paths locais

---

## Sub-tarefas

- [x] **3.1** Modificar `generate-cover-pro.js` — adicionar flag `--image-url`

**Mudanças no `parseArgs()`:**
```javascript
case '--image-url':
case '-u':
  parsed.imageUrl = args[++i];
  break;
```

**Nova função `fetchImageFromUrl(url)`:**
```javascript
async function fetchImageFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  const mimeType = getMimeType(ext) || 'image/jpeg';
  return { buffer, mimeType };
}
```

**No `main()`:** Se `args.imageUrl` está presente, usar `fetchImageFromUrl()` em vez de `resolveImagePath()`. Converter buffer para base64 para envio à API Gemini.

**Backward compat:** Se `--image` (path local) for passado, funciona exatamente como antes.

```bash
# Novo: URL direta do Supabase
node scripts/generate-cover-pro.js --image-url "https://...supabase.co/.../paper-01.jpg" --slug test --prompt "..."

# Legado: path local (inalterado)
node scripts/generate-cover-pro.js --image assets/papers/paper-01.jpg --slug test --prompt "..."
```

- [x] **3.2** Modificar `render-cover.js` — detecção de URLs remotas no `copyAssetsTocover()`

**Mudança na função `copyAssetsTocover(coverDir)`:**
```javascript
function copyAssetsTocover(coverDir) {
  const htmlPath = path.join(coverDir, 'cover.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const usesRemotePhotos = html.includes('supabase.co/storage');
  
  if (usesRemotePhotos) {
    console.log('   ☁️ Template usa URLs remotas — skip copy de fotos');
    // Ainda copia profile-photo.png se não é URL remota no HTML
    if (!html.includes('supabase.co/storage/v1/object/public/content-assets/source-photos/profile')) {
      const profileSrc = path.join(ASSETS_DIR, 'profile-photo.png');
      const profileDest = path.join(coverDir, 'profile-photo.png');
      if (fs.existsSync(profileSrc)) {
        fs.copyFileSync(profileSrc, profileDest);
        console.log('   📷 Asset copiado: profile-photo.png (local fallback)');
      }
    }
    return;
  }
  
  // Comportamento atual: copia assets locais (código existente inalterado)
  // ...
}
```

**Nota:** Puppeteer com `networkidle0` já resolve `https://` imgs automaticamente — não precisa de `--allow-file-access-from-files`.

- [x] **3.3** Validar — testar com URL Supabase (pós ASSETS-002 migração)
- [x] **3.4** Validar — testar com path local (regressão zero)

---

## Acceptance Criteria

- [x] `generate-cover-pro.js --image-url "https://..." --slug test --prompt "test"` gera PNG com sucesso
- [x] `generate-cover-pro.js --image assets/papers/paper-01.jpg --slug test2 --prompt "test"` continua funcionando
- [x] `render-cover.js test` com HTML usando URL Supabase renderiza PNG sem crash
- [x] `render-cover.js test2` com HTML usando paths locais continua funcionando
- [x] Nenhuma imagem quebrada detectada pelo validador de imagens do render-cover.js

## Definition of Done

✅ Flag `--image-url` funcional no generate-cover-pro.js
✅ Detecção de URLs remotas no render-cover.js evita ENOENT
✅ Zero regressão nos fluxos existentes com paths locais

## File List

- `[x]` `aiox-squads/squads/capas-linkedin/scripts/generate-cover-pro.js` — nova flag `--image-url`
- `[x]` `aiox-squads/squads/capas-linkedin/scripts/render-cover.js` — detecção URL remota
