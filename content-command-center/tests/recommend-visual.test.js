// recommend-visual.test.js — VISUAL-002
//
// Testes unitarios da funcao pura recommendVisual().
// Roda com: node tests/recommend-visual.test.js
// (Sem framework de teste — usa node:assert builtin para evitar dependencia.)

import assert from 'node:assert/strict';
import { recommendVisual, extractSignals, parseRecommendedVisual, stringifyRecommendation } from '../js/recommend-visual.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${err.message}`);
    failed++;
  }
}

console.log('\n📊 recommendVisual() — test suite\n');

// ── 1. Lista densa + Skills → Carrossel Notebook Raw ────────────────
test('Lista densa (5 etapas) + Skills em Producao → carrossel Notebook Raw', () => {
  const post = {
    framework: 'Lista',
    fonteTese: 'Skills em Produção',
    hookText: 'O processo que uso pra qualificar leads:',
    body: `1. Captura via formulário
2. Enriquecimento automático
3. Score de fit (0-100)
4. Roteamento para SDR
5. Acompanhamento via webhook

Cada etapa tem checkpoint humano antes da próxima.`
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'carrossel');
  assert.equal(rec.estilo, 'Notebook Raw');
  assert.match(rec.motivo, /etapas/);
});

// ── 2. Benchmark com 2+ números → Carrossel Data-Driven ─────────────
test('Benchmark Real com numeros comparativos → carrossel Data-Driven', () => {
  const post = {
    framework: 'Contraste',
    fonteTese: 'Benchmark Real',
    hookText: 'n8n vs Managed Agents: rodei os dois.',
    body: `n8n: 800ms latência média, R$ 200/mês.
Managed Agents: 350ms latência, R$ 450/mês.

De 800ms para 350ms é 56% mais rápido — vale o custo se SLA importa.`
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'carrossel');
  assert.equal(rec.estilo, 'Data-Driven');
});

// ── 3. Frase falsificavel curta → Capa Quote Card ───────────────────
test('Frase falsificavel ultra curta → capa Quote Card', () => {
  const post = {
    framework: 'Declaração+Defesa',
    fonteTese: 'Falha Documentada',
    hookText: 'Automação sem redesenho não é IA — é bagunça mais rápida.',
    body: 'Vi isso 3 vezes esse mês.'
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'capa');
  assert.equal(rec.estilo, 'Quote Card');
});

// ── 4. Storytelling + foto → Capa Pessoa+Texto ──────────────────────
test('Storytelling com foto contextual → capa Pessoa+Texto', () => {
  const post = {
    framework: 'Storytelling',
    fonteTese: 'Skills em Produção',
    hookText: 'Cliente novo, primeira reunião.',
    body: 'Cheguei e ele já tinha tentado 3 ferramentas. Nenhuma resolveu.',
    temFotoContextual: true
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'capa');
  assert.equal(rec.estilo, 'Pessoa + Texto');
});

// ── 5. 1 dado-hero → Capa Micro-Infografico ─────────────────────────
test('Post curto com 1 dado central → capa Micro-Infografico', () => {
  const post = {
    framework: 'Declaração+Defesa',
    fonteTese: 'Benchmark Real',
    hookText: '73% dos times comerciais perdem o lead na primeira semana.',
    body: 'Fonte: Gartner 2026.'
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'capa');
  assert.equal(rec.estilo, 'Micro-Infografico');
});

// ── 6. Reação curta com print → Capa Print de Autoridade ────────────
test('Reacao curta com print → capa Print de Autoridade', () => {
  const post = {
    framework: 'Declaração+Defesa',
    fonteTese: 'Falha Documentada',
    hookText: 'Sam Altman declarando que GPT-5 vai automatizar SDRs.',
    body: 'Quem nunca rodou um SDR humano não sabe o que está falando.',
    temPrint: true
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'capa');
  assert.equal(rec.estilo, 'Print de Autoridade');
});

// ── 7. Default → Capa Rascunho no Papel ─────────────────────────────
test('Post sem sinais fortes → capa Rascunho no Papel (default humanizado)', () => {
  const post = {
    framework: 'PAS',
    fonteTese: 'Process Diagnostic',
    hookText: 'Por que automação cai no esquecimento.',
    body: 'O problema é o processo. Quando o processo está claro, automação encaixa. Quando não está, vira bagunça automatizada.'
  };
  const rec = recommendVisual(post);
  assert.equal(rec.formato, 'capa');
  assert.equal(rec.estilo, 'Rascunho no Papel');
});

// ── 8. extractSignals — regex ───────────────────────────────────────
test('extractSignals detecta numeros e etapas corretamente', () => {
  const post = {
    body: `1. Primeiro passo
2. Segundo passo
3. Terceiro passo
Reduzi de 4h para 15min — economia de R$ 500/mês.`,
    hookText: ''
  };
  const sig = extractSignals(post);
  assert.equal(sig.tem_etapas, 3);
  assert.ok(sig.dados_quant >= 3); // 4h, 15min, R$500
  assert.ok(sig.dados_quant_comparativos >= 1); // "de 4h para 15min"
});

// ── 9. parseRecommendedVisual ───────────────────────────────────────
test('parseRecommendedVisual extrai formato + estilo + motivo', () => {
  const parsed = parseRecommendedVisual('carrossel/Notebook Raw (5 etapas + skills)');
  assert.equal(parsed.formato, 'carrossel');
  assert.equal(parsed.estilo, 'Notebook Raw');
  assert.equal(parsed.motivo, '5 etapas + skills');
  assert.equal(parsed.cardNum, 4);
});

// ── 10. stringifyRecommendation ─────────────────────────────────────
test('stringifyRecommendation produz formato esperado', () => {
  const str = stringifyRecommendation({
    formato: 'capa',
    estilo: 'Quote Card',
    motivo: 'frase falsificável'
  });
  assert.equal(str, 'capa/Quote Card (frase falsificável)');
});

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\n📊 ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
