import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {applyBusinessProofScope,businessProofScope} from '../scripts/business-proof-scope.mjs';
import {restorePortfolioMain} from '../scripts/console-integration-scope.mjs';
const show=path=>execFileSync('git',['show',businessProofScope.reviewedHead+':'+path],{maxBuffer:4*1024*1024});

test('V13 is an exact content delta against its actual reviewed Git source',async()=>{
 const before=show('index.html').toString();
 const current=restorePortfolioMain(await readFile('index.html','utf8'));
 const start=current.indexOf('<section class="biz-examples-intro');
 const end=current.indexOf('<section class="project-scene scene" data-project="1"',start);
 assert.ok(start>0&&end>start,'Business scenes must precede the original technical projects');
 const injected=current.slice(start,end);
 assert.equal((injected.match(/class="project-scene biz-scene scene"/g)||[]).length,3);
 for(const label of ['Auto Lead Follow-Up','Auto Document Processing','Internal AI Assistant','Auto Data Sync','Auto Reporting','Autopilot Tasks'])
  assert.ok(injected.includes(label),'Missing business illustration: '+label);
 const normalized=(current.slice(0,start)+current.slice(end))
  .replaceAll('Evan_Naraya_Automation_Integration_Engineer.pdf','Evan_Naraya_CV_Automation_Integration_2026_v3.pdf')
  .replaceAll('Evan_Naraya_Backend_Integration_Engineer.pdf','Evan_Naraya_CV_Backend_Integration_Python_2026_v3.pdf')
  .replace('Download Automation and Integration CV (PDF)','Download current Automation and Integration CV draft (PDF)')
  .replace('>CV ↓','>CV draft ↓')
  .replace('>Automation CV ↓','>Automation CV draft ↓')
  .replace('>Backend CV ↓','>Backend CV draft ↓');
 assert.equal(normalized,applyBusinessProofScope(before),'V13 baseline outside separately approved CV link changes must stay byte-identical');
 const css=await readFile('assets/css/portfolio.css','utf8');
 assert.ok(css.startsWith(show('assets/css/portfolio.css').toString()),'Original cinematic CSS must remain byte-identical');
 assert.ok(css.includes('/* Business demonstrations use the same sticky'),'Business animation contract missing');
 for(const path of ['assets/js/portfolio.js','assets/images/evan-naraya-portrait.webp','docs/responsive-scope.patch'])
  assert.ok((await readFile(path)).equals(show(path)),'Protected V13 input changed: '+path);
});

test('unrelated markup, contact substitutions, missing edits and repeated application fail closed',()=>{
 const before=show('index.html').toString();
 for(const source of [before.replace('<body>','<body class="redesign">'),before.replace('evannarayahp@gmail.com','other@example.test'),before.replace('>View work ↗','>View something ↗'),applyBusinessProofScope(before)])
  assert.throws(()=>applyBusinessProofScope(source),/V13 input/);
});
