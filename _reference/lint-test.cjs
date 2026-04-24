const { readFileSync } = require('fs');
const { resolve } = require('path');

async function main() {
  // Dynamic import for ESM module
  const { lint } = await import('@google/design.md/linter');
  
  const filePath = resolve(process.argv[2] || 'aiox-squads/data/design-system.md');
  const content = readFileSync(filePath, 'utf-8');
  const report = lint(content);
  
  console.log(JSON.stringify({
    findings: report.findings,
    summary: report.summary,
    sections: report.sections
  }, null, 2));
  
  process.exit(report.summary.errors > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(err.message);
  process.exit(2);
});
