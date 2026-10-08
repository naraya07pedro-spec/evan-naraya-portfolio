import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const html=await readFile('index.html','utf8');
const resumes=JSON.parse(await readFile('docs/published-resumes.json','utf8'));
const baseline=JSON.parse(await readFile('docs/baseline.json','utf8'));
test('semantic page, canonical identity and discoverability',()=>{
 assert.match(html,/<html lang="en"/);assert.match(html,/<main id="top"/);
 assert.equal([...html.matchAll(/<h1\b/g)].length,1);
 for(const id of ['work','skills','contact','agent-heading','knowledge-heading'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.includes('rel="canonical" href="https://evannaraya.netlify.app/"'));
 assert.match(html,/<meta name="description" content="[^"]{50,}"/);
 assert.match(html,/<meta property="og:image"/);
 const person=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(person['@type'],'Person');assert.equal(person.name,'Evan Naraya Hokky Pradygta');
});
test('internal anchors resolve; IDs do not collide',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
 for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),'Missing anchor '+m[1]);
});
test('public source destinations and claim limits remain present',()=>{
 for(const path of ['agent-runtime-python','examples/agentic-systems-lab/knowledge-runtime','production-integration-reference','varevant.com/tree/main/n8n','bimmca-intelligence'])assert.ok(html.includes(path));
 assert.ok(html.includes('v2 archive'));assert.ok(html.includes('preserved v2'));
 assert.ok(html.includes('lexical embeddings and extractive answers'));
 assert.ok(html.includes('Private engagements; scope descriptions are self-reported.'));
 assert.ok(!html.includes('MAXY'));
});
test('local referenced assets exist; outbound links are safe',async()=>{
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];
  if(href.startsWith('/'))assert.ok((await stat('.'+href)).isFile(),'Missing '+href);
 }
 for(const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert.match(m[0],/rel="noopener noreferrer"/);
 assert.ok(!html.includes('data:application/pdf'));assert.ok(!html.includes('data:image/webp'));
});
test('published baseline resume and portrait bytes cannot silently change',async()=>{
 const downloads=[...html.matchAll(/download="([^"]+)"/g)].map(m=>m[1]);assert.equal(downloads.length,3);
 for(const r of resumes){
  const b=await readFile(r.path);assert.equal(b.length,r.bytes);assert.equal(b.subarray(0,5).toString(),'%PDF-');
  assert.equal(createHash('sha256').update(b).digest('hex'),r.sha256);
  assert.ok(downloads.includes(r.filename));assert.ok(html.includes('href="/'+r.path+'"'));
 }
 assert.equal(createHash('sha256').update(await readFile('assets/images/evan-naraya-portrait.webp')).digest('hex'),baseline.portraitSha256);
});
test('all production JavaScript parses without runtime dependencies',()=>{
 execFileSync(process.execPath,['--check','assets/js/portfolio.js']);
 assert.equal([...html.matchAll(/<script src=/g)].length,1);
});
