import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base = process.env.PREVIEW_URL;
assert.ok(base && /^https:\/\/deploy-preview-\d+--evannaraya\.netlify\.app\/$/.test(base),'Existing site preview URL required');
const hash = b => createHash('sha256').update(b).digest('hex');
const out = 'artifacts/hosted-release-safety';
await mkdir(out,{recursive:true});
const html = await readFile('index.html','utf8');
const paths = [...new Set([...html.matchAll(/(?:href|src)="(\/assets\/[^"]+)"/g)].map(m=>m[1]))];
const publicAssets = [], unavailablePrivateCandidates = [];
for (const path of paths) {
  const expected = await readFile('.'+path);
  let result;
  // Only retries public readiness/transport failures. No browser protection or
  // authentication is bypassed. Ordinary local quality does not need network.
  for (let attempt=0;attempt<5;attempt++) {
    try {
      const response=await fetch(new URL(path,base),{signal:AbortSignal.timeout(15000)});
      const bytes=Buffer.from(await response.arrayBuffer());
      result={path,status:response.status,expectedSha256:hash(expected),sha256:hash(bytes),bytes:bytes.length};
      if(response.ok && result.sha256===result.expectedSha256)break;
    } catch(e) {result={path,error:e.message};}
    if(attempt<4)await new Promise(r=>setTimeout(r,4000));
  }
  publicAssets.push(result);
}
const response=await fetch(base,{signal:AbortSignal.timeout(20000)});
const hostedHtml=await response.text();
const index={status:response.status,repositorySha256:hash(Buffer.from(html)),hostedSha256:hash(Buffer.from(hostedHtml)),xRobotsTag:response.headers.get('x-robots-tag')};
for (const path of paths) assert.ok(hostedHtml.includes('"/'+path.slice(1)+'"'),'Preview page missing asset reference '+path);
for (const name of ['Evan_Naraya_CV_Automation_Integration_2026_v3','Evan_Naraya_CV_Backend_Integration_Python_2026_v3']) {
  const path='/assets/resumes/'+name+'_public_safe_candidate.pdf';
  const r=await fetch(new URL(path,base),{signal:AbortSignal.timeout(15000)});
  unavailablePrivateCandidates.push({path,status:r.status});
}
const sources=[html,await readFile('README.md','utf8'),await readFile('docs/evidence-map.md','utf8')];
const urls=[...new Set(sources.flatMap(s=>[...s.matchAll(/(?:href|src)="(https:\/\/[^"]+)"|\]\((https:\/\/[^)]+)\)/g)].map(m=>m[1]||m[2])))].sort();
const links=[];
for (const url of urls) {
  try {const r=await fetch(url,{signal:AbortSignal.timeout(20000)});links.push({url,status:r.status,finalUrl:r.url});await r.body?.cancel();}
  catch(e){links.push({url,error:e.message});}
}
const result={checkedAt:new Date().toISOString(),expectedHead:process.env.EXPECTED_HEAD,base,index,publicAssets,unavailablePrivateCandidates,links,limits:['HTML hash includes Netlify-injected hosting UI','HTTP 200 does not verify social identity or email deliverability','No email/message sent; private review PDF bytes are not CI inputs']};
await writeFile(out+'/public-assets.json',JSON.stringify(result,null,2)+'\n');
assert.equal(index.status,200);
assert.ok(/noindex/i.test(index.xRobotsTag||''),'Preview noindex header absent');
assert.ok(publicAssets.every(a=>a.status===200&&a.sha256===a.expectedSha256),'Deployed public assets differ or are unavailable');
assert.ok(unavailablePrivateCandidates.every(a=>a.status===404),'Private candidate filename unexpectedly public');
assert.ok(!links.some(l=>[404,410].includes(l.status)),'Confirmed missing public link');
console.log(JSON.stringify({publicAssetsMatch:publicAssets.length,privateCandidatePathsReturn404:unavailablePrivateCandidates.length,linksRequested:links.length,non200:links.filter(l=>l.status!==200),previewNoindex:true}));
