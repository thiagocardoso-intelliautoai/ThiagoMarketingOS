import { readFileSync } from 'fs';
import { lint } from '@google/design.md/linter';

const content = readFileSync('../aiox-squads/data/design-system.md', 'utf8');
const report = lint(content);

console.log(JSON.stringify({
  summary: report.summary,
  findings: report.findings,
  sections: report.sections
}, null, 2));
