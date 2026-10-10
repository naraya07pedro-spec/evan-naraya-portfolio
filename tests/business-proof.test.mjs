import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {applyBusinessProofScope,businessProofScope} from '../scripts/business-proof-scope.mjs';
const show=path=>execFileSync('git',['show',businessProofScope.reviewedHead+':'+path],{maxBuffer:4*1024*1024});

test('V13 is an exact content delta against its actual reviewed Git source',async()=>{
 const before=show('index.html').toString();
 assert.equal(applyBusinessProofScope(before),await readFile('index.html','utf8'));
 for(const path of ['assets/css/portfolio.css','assets/js/portfolio.js','assets/images/evan-naraya-portrait.webp','docs/responsive-scope.patch','docs/resume-release-approval.json'])
  assert.ok((await readFile(path)).equals(show(path)),'Protected V13 input changed: '+path);
});

test('unrelated markup, contact substitutions, missing edits and repeated application fail closed',()=>{
 const before=show('index.html').toString();
 for(const source of [before.replace('<body>','<body class="redesign">'),before.replace('evannarayahp@gmail.com','other@example.test'),before.replace('>View work ↗','>View something ↗'),applyBusinessProofScope(before)])
  assert.throws(()=>applyBusinessProofScope(source),/V13 input/);
});
