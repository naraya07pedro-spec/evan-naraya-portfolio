import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {consoleScope,restoreReviewedPR,restorePortfolioMain,sha256} from '../scripts/console-integration-scope.mjs';
const show=path=>execFileSync('git',['show',consoleScope.reviewedPrHead+':'+path],{maxBuffer:8*1024*1024});
const html=await readFile('index.html','utf8');
const provenance=JSON.parse(await readFile('docs/console-integration/provenance.json','utf8'));
test('Console integration restores exact PR #2 and main, rejecting unrelated edits',()=>{
 assert.equal(restoreReviewedPR(html),show('index.html').toString());
 assert.equal(restorePortfolioMain(html),execFileSync('git',['show',consoleScope.reviewedMain+':index.html'],{maxBuffer:8*1024*1024}).toString());
 for(const changed of [html.replace('<body>','<body class="redesign">'),html.replace('evannarayahp@gmail.com','other@example.test'),html.replace('Deterministic HTTP sandbox','Production AI platform')])assert.throws(()=>restorePortfolioMain(changed),/Unreviewed Console HTML/);
});
test('portrait, animations, historical evidence, approved CVs and consent retain bytes',async()=>{
 const paths=['assets/js/portfolio.js','assets/images/evan-naraya-portrait.webp','docs/responsive-scope.patch','docs/resume-release-approval.json','docs/published-resumes.json','assets/resumes/Evan_Naraya_Automation_Integration_Engineer.pdf','assets/resumes/Evan_Naraya_Backend_Integration_Engineer.pdf','scripts/responsive-visual-regression.mjs','docs/baseline.json','scripts/visual-regression.mjs',...execFileSync('git',['ls-tree','-r','--name-only',consoleScope.reviewedPrHead,'docs/qa']).toString().trim().split('\n').filter(Boolean)];
 for(const path of paths)assert.ok((await readFile(path)).equals(show(path)),'Protected input changed: '+path);
 const before=show('assets/css/portfolio.css').toString(),after=await readFile('assets/css/portfolio.css','utf8');assert.ok(after.startsWith(before));assert.equal(sha256(before),consoleScope.baseCSSSHA256);assert.equal(sha256(after.slice(before.length)),consoleScope.appendedCSSSHA256);
});
test('authentic media and reports preserve inspected artifact identity',async()=>{
 const png=await readFile(provenance.dashboard.path),mp4=await readFile(provenance.video.path);
 assert.equal(sha256(png),provenance.dashboard.sha256);assert.equal(sha256(mp4),provenance.video.sha256);assert.ok(png.length<300000&&mp4.length<2000000);assert.equal(mp4.subarray(4,8).toString(),'ftyp');
 assert.equal(sha256(await readFile(provenance.video.originalPublicPath)),provenance.video.sourceSHA256);
 for(const r of provenance.preservedReports)assert.equal(sha256(await readFile(r.path)),r.sha256);
 assert.equal(provenance.reviewedSourceCommit,'654ce3b762f45a126ff844604daf0d830e54bf21');assert.match(provenance.ciRun,/38337575725$/);
 assert.deepEqual([provenance.verification.systemTests,provenance.verification.nativeBrowserCases,provenance.verification.containerBrowserCases,provenance.verification.containerSmokeChecks],[58,10,10,10]);
});
test('prominent project discloses sandbox scope and links immutable proof',()=>{
 const start=html.indexOf('<section class="project-scene console-scene'),end=html.indexOf('<section class="biz-examples-intro',start),section=html.slice(start,end);assert.ok(start>html.indexOf('id="work"')&&end>start);
 assert.ok(section.includes('no live production LLM or customer deployment'));for(const name of ['Next.js','React','TypeScript','Fastify','PostgreSQL','Prisma','Docker'])assert.ok(section.includes(name));
 for(const path of ['ARCHITECTURE.md','EVIDENCE.md','PORTFOLIO_CASE_STUDY.md'])assert.ok(section.includes('/blob/'+provenance.reviewedSourceCommit+'/docs/'+path));
 assert.ok(!/<video|autoplay|<iframe/.test(section));assert.equal((html.match(/class="project-scene biz-scene scene"/g)||[]).length,3);assert.ok(html.includes('Bounded Agent Runtime')&&html.includes('Knowledge Workflow Runtime'));
});
