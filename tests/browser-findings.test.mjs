import {test} from 'node:test';
import assert from 'node:assert/strict';
import {knownPlatformWarning,classifyCapture} from '../scripts/browser-findings.mjs';
const clipboard='warning: [JavaScript Warning: "Feature Policy: Skipping unsupported feature name “clipboard-write”." {file: "https://deploy-preview-1--evannaraya.netlify.app/.netlify/scripts/cdp" line: 1}]';
const framing='warning: [JavaScript Warning: "Content-Security-Policy: Ignoring ‘x-frame-options’ because of ‘frame-ancestors’ directive."]';
test('observed hosting messages remain visible and are scoped to Firefox',()=>{
 const result=classifyCapture({engine:'firefox',viewport:{width:390},errors:[clipboard,clipboard,clipboard,framing],failures:[]});
 assert.equal(result.knownBrowserHostingWarnings.length,4);
 assert.deepEqual(result.unexpectedConsoleFindings,[]);
 assert.equal(knownPlatformWarning('chromium',clipboard),false);
 assert.equal(knownPlatformWarning('chromium',framing),false);
});
test('application errors, novel warnings and untrusted origins cannot be exempted',()=>{
 for(const error of ['error: ReferenceError: missing is not defined','warning: new application warning',
  clipboard.replace('evannaraya.netlify.app','example.com'),clipboard.replace('/.netlify/scripts/cdp','/assets/js/portfolio.js'),
  framing.replace('warning:','error:')]){
  const result=classifyCapture({engine:'firefox',viewport:{width:390},errors:[error],failures:[]});
  assert.equal(result.knownBrowserHostingWarnings.length,0);assert.equal(result.unexpectedConsoleFindings.length,1);
 }
});
test('known browser warnings never hide a failed network request',()=>{
 const failure={url:'https://deploy-preview-1--evannaraya.netlify.app/assets/js/portfolio.js',status:404};
 const result=classifyCapture({engine:'firefox',viewport:{width:390},errors:[clipboard],failures:[failure]});
 assert.deepEqual(result.networkFailures,[failure]);
});
