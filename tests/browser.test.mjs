import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from '../scripts/serve.mjs';
import {baselineRoot} from '../scripts/baseline.mjs';
import {launch,settle,scene} from '../scripts/browser-utils.mjs';
const resumes=JSON.parse(await readFile('docs/published-resumes.json','utf8'));

for(const engine of ['chromium','firefox']){
 test(engine+' interactions, downloads, motion and accessibility',{timeout:120000},async t=>{
  const server=await serve('.'),before=await serve(await baselineRoot()),browser=await launch(engine);
  const url=process.env.PREVIEW_URL||server.url;
  try{
   const page=await browser.newPage({viewport:{width:1440,height:900}});
   const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>requests.push(r.url()));
   await page.goto(url);await settle(page);
   await t.test('keyboard skip link and main CTA',async()=>{
    await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to work');
    const box=await page.locator(':focus').boundingBox();assert.ok(box.y>=0&&box.y<75);
    await page.keyboard.press('Enter');await page.waitForFunction(()=>location.hash==='#work');
    await page.locator('.monogram').click();await page.waitForFunction(()=>scrollY<2);
    await page.locator('.hero-actions a[href="#work"]').click();
    await page.waitForFunction(()=>location.hash==='#work');
   });
   await t.test('both published baseline PDF downloads retain the deployed bytes',async()=>{
    await mkdir('artifacts/downloads',{recursive:true});
    for(const r of resumes){
     await scene(page,'#contact',0);
     const promise=page.waitForEvent('download');
     await page.locator('a[download="'+r.filename+'"]').last().click();
     const download=await promise;assert.equal(download.suggestedFilename(),r.filename);
     const path='artifacts/downloads/'+engine+'-'+r.filename;await download.saveAs(path);
     const bytes=await readFile(path);assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);
    }
   });
   await t.test('keyboard reaches diagrams and reveals otherwise faded scene links',async()=>{
    await page.goto(url);await settle(page);
    await page.locator('.statement-link').focus();await settle(page);
    assert.ok(Number(await page.locator('.intro-statement').evaluate(e=>getComputedStyle(e).opacity))>.5);
    await page.locator('.project-link').first().focus();await settle(page);
    assert.ok(Number(await page.locator('.project-copy').first().evaluate(e=>getComputedStyle(e).opacity))>.5);
    assert.equal(await page.locator('.device-body').first().getAttribute('tabindex'),'0');
    await page.locator('.device-body').first().focus();assert.ok(await page.locator('.device-body').first().evaluate(e=>e.matches(':focus')));
   });
   await t.test('reduced motion and live preference changes keep links usable',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await settle(page);
    assert.equal(await page.locator('.cursor-glow').evaluate(e=>getComputedStyle(e).display),'none');
    assert.equal(await page.locator('.intro-statement').evaluate(e=>getComputedStyle(e).pointerEvents),'auto');
    await page.locator('.statement-link').click();await page.waitForFunction(()=>location.hash==='#work');
    await page.emulateMedia({reducedMotion:'no-preference'});await settle(page);
    await page.emulateMedia({reducedMotion:'reduce'});await settle(page);
    assert.equal(await page.locator('.cursor-glow').evaluate(e=>getComputedStyle(e).display),'none');
   });
   await t.test('mobile touch CTA, scrollable details and reflow',async()=>{
    const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
    const mobile=await context.newPage();await mobile.goto(url);await settle(mobile);
    // Existing mobile nav is intentionally unchanged. The hero CTA is the current path.
    assert.equal(await mobile.locator('nav').evaluate(e=>getComputedStyle(e).display),'none');
    await mobile.locator('.hero-actions a[href="#work"]').tap();
    await mobile.waitForFunction(()=>location.hash==='#work');
    await scene(mobile,'.project-scene[data-project="1"]',.5);
    assert.ok(await mobile.locator('.device-body').first().isVisible());
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await context.close();
   });
   await t.test('axe reports no new violations against immutable baseline',async()=>{
    const results=[];
    for(const width of [390,1440]){
     await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'no-preference'});
     const base=await browser.newPage({viewport:{width,height:900}});
     await page.goto(url);await base.goto(before.url);await settle(page);await settle(base);
     for(const p of [page,base])await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
     for(const [name,selector] of [['hero',null],['agent','.project-scene[data-project="1"]'],['contact','#contact']]){
      if(selector){await scene(page,selector,selector==='#contact'?0:.5);await scene(base,selector,selector==='#contact'?0:.5);}
      const scan=async p=>p.evaluate(async()=>{const a=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return a.violations.flatMap(v=>v.nodes.map(n=>({id:v.id,impact:v.impact,target:n.target.join(' ')})));});
      const old=await scan(base),now=await scan(page);
      const keys=new Set(old.map(x=>x.id+'|'+x.target));
      const added=now.filter(x=>!keys.has(x.id+'|'+x.target));
      results.push({engine,width,state:name,before:old,after:now,added});assert.deepEqual(added,[]);
      assert.ok(!now.some(x=>x.id==='scrollable-region-focusable'));
     }
     await base.close();
    }
    await mkdir('artifacts/accessibility',{recursive:true});await writeFile('artifacts/accessibility/'+engine+'.json',JSON.stringify(results,null,2));
   });
   assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
   await page.close();
  }finally{await browser.close();await server.close();await before.close();}
 });
}
test('idle pointer follower stops frame scheduling',{timeout:20000},async()=>{
 const server=await serve('.'),browser=await launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.addInitScript(()=>{window.qaFrames=0;const raf=window.requestAnimationFrame;window.requestAnimationFrame=f=>raf.call(window,t=>{window.qaFrames++;f(t);});});
  await page.goto(server.url);await settle(page);
  const before=await page.evaluate(()=>window.qaFrames);await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>window.qaFrames),before);
  await page.mouse.move(300,300);await page.waitForTimeout(1500);
  const after=await page.evaluate(()=>window.qaFrames);await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>window.qaFrames),after);
 }finally{await browser.close();await server.close();}
});
test('no JavaScript fallback leaves supporting content readable',{timeout:20000},async()=>{
 const server=await serve('.'),browser=await launch();
 try{const page=await browser.newPage({javaScriptEnabled:false});await page.goto(server.url);
 assert.equal(await page.locator('.contact .reveal').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.ok(await page.locator('.resume-links a').first().isVisible());
 }finally{await browser.close();await server.close();}
});
