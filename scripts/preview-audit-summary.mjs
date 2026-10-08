import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='artifacts/hosted-release-safety';
const captures=JSON.parse(await readFile(out+'/capture.json','utf8'));
const proposals=JSON.parse(await readFile('artifacts/visual-proposals/report.json','utf8'));
const assets=JSON.parse(await readFile(out+'/public-assets.json','utf8'));
const pdfs=JSON.parse(await readFile(out+'/pdf-validation.json','utf8'));
assert.equal(captures.reports.length,14);
for(const engine of ['chromium','firefox']){
 const r=captures.reports.filter(r=>r.engine===engine);
 assert.deepEqual(r.map(x=>x.viewport.width),[320,375,390,768,1024,1440,1920]);
}
assert.ok(captures.reports.every(r=>r.layout.documentWidth<=r.viewport.width),'Hosted document reflow regression');
console.log('HOSTED_CAPTURE_FINDINGS '+JSON.stringify(captures.reports.filter(r=>r.errors.length||r.failures.length).map(r=>({engine:r.engine,viewport:r.viewport,errors:r.errors,failures:r.failures}))));
assert.ok(captures.reports.every(r=>r.errors.length===0&&r.failures.length===0),'Hosted console/network findings: inspect capture.json');
assert.equal(proposals.results.length,7);
assert.ok(proposals.results.every(r=>r.projectResults.every(p=>p.contrastProposed.length===0)),'Proposal toolbar contrast still fails');
assert.ok(proposals.results.filter(r=>r.viewport.width>=768).every(r=>JSON.stringify(r.before)===JSON.stringify(r.proposed)),'Desktop hero proposal unexpectedly changed');
assert.equal(pdfs.length,4);
const result={expectedHead:process.env.EXPECTED_HEAD,checkedAt:new Date().toISOString(),preview:captures.url,hostedBrowserViewportRuns:14,hostedViewportStates:98,hostedFullPageCaptures:14,consoleOrNetworkFindings:0,publicAssetsMatched:assets.publicAssets.length,downloadedPdfsParsedAndRendered:pdfs.length,proposalsCaptured:7,proposalsImplemented:false,toolbarContrastViolationsWithProposal:0,hostingNetworkIdleTimeouts:captures.reports.filter(r=>r.networkIdleTimedOut).length,limitations:['Hosted captures are not the immutable 98 source-regression comparisons','Raw hosted screenshots retain Netlify hosting controls','Proposals need owner visual approval','PDF rendering verification is Poppler, not a claim of native browser PDF-viewer inspection']};
await writeFile(out+'/summary.json',JSON.stringify(result,null,2)+'\n');
console.log('HOSTED_RELEASE_SAFETY_SUMMARY '+JSON.stringify(result));
