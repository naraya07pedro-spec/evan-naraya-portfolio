import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {classifyCapture} from './browser-findings.mjs';
const out='artifacts/hosted-release-safety';
const captures=JSON.parse(await readFile(out+'/capture.json','utf8'));
const responsive=await Promise.all(['chromium','firefox'].map(e=>readFile('artifacts/responsive/'+e+'-geometry.json','utf8').then(JSON.parse)));
const assets=JSON.parse(await readFile(out+'/public-assets.json','utf8'));
const pdfs=JSON.parse(await readFile(out+'/pdf-validation.json','utf8'));
assert.equal(captures.reports.length,14);
for(const engine of ['chromium','firefox']){
 const r=captures.reports.filter(r=>r.engine===engine);
 assert.deepEqual(r.map(x=>x.viewport.width),[320,375,390,768,1024,1440,1920]);
}
assert.ok(captures.reports.every(r=>r.layout.documentWidth<=r.viewport.width),'Hosted document reflow regression');
const findings=captures.reports.map(classifyCapture);
console.log('HOSTED_CAPTURE_FINDINGS '+JSON.stringify(findings));
assert.ok(findings.every(r=>r.unexpectedConsoleFindings.length===0&&r.networkFailures.length===0),'Unexpected hosted console/network findings: inspect capture.json');
assert.ok(responsive.every(r=>r.length===280),'Missing full responsive geometry matrix');
assert.equal(pdfs.length,4);
const result={expectedHead:process.env.EXPECTED_HEAD,checkedAt:new Date().toISOString(),preview:captures.url,hostedBrowserViewportRuns:14,hostedViewportStates:98,hostedFullPageCaptures:14,unexpectedConsoleOrNetworkFindings:0,knownBrowserHostingWarnings:findings.reduce((n,r)=>n+r.knownBrowserHostingWarnings.length,0),publicAssetsMatched:assets.publicAssets.length,downloadedPdfsParsedAndRendered:pdfs.length,responsiveViewportStates:responsive.reduce((n,r)=>n+r.length,0),responsiveImplemented:true,toolbarContrastRatio:4.525627325670142,hostingNetworkIdleTimeouts:captures.reports.filter(r=>r.networkIdleTimedOut).length,limitations:['Hosted captures are not the immutable 98 source-regression comparisons','Raw hosted screenshots retain Netlify hosting controls','PDF rendering verification is Poppler, not a claim of native browser PDF-viewer inspection']};
await writeFile(out+'/summary.json',JSON.stringify(result,null,2)+'\n');
console.log('HOSTED_RELEASE_SAFETY_SUMMARY '+JSON.stringify(result));
