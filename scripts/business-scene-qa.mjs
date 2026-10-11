// Current business-scene visual capture and responsive geometry audit.
// Historical 98-image regression and its archived runner are preserved separately.
// This intentionally does NOT claim pixel equality to a page before new sections existed.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {serve} from './serve.mjs';
import {launch,viewports,settle,scene} from './browser-utils.mjs';
const out='artifacts/business-scene-qa';
await mkdir(out,{recursive:true});
const server=await serve('.');
const states=[
 ['hero',null,0],
 ['lead','.biz-scene[data-project="business-1"]',.5],
 ['documents','.biz-scene[data-project="business-2"]',.5],
 ['assistant','.biz-scene[data-project="business-3"]',.5],
 ['agent','.project-scene[data-project="1"]',.5],
 ['knowledge','.project-scene[data-project="2"]',.5],
 ['contact','#contact',0]
];
const observations=[];
try{
 for(const engine of (process.env.QA_ENGINES||'chromium,firefox').split(',')){
  const browser=await launch(engine);
  try{
   for(const viewport of viewports){
    const page=await browser.newPage({viewport,deviceScaleFactor:1});
    try{
     const errors=[];page.on('pageerror',e=>errors.push(e.message));
     await page.goto(server.url);await settle(page);
     assert.equal(await page.locator('.biz-scene').count(),3);
     assert.equal(await page.locator('.project-scene[data-project="1"]').count(),1);
     assert.equal(await page.locator('.project-scene[data-project="2"]').count(),1);
     for(const [state,selector,progress] of states){
      if(selector)await scene(page,selector,progress);
      else await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await settle(page);
      const metric=await page.evaluate(selector=>{
       const target=selector?document.querySelector(selector):document.querySelector('.intro-scene');
       const stage=target?.querySelector('.sticky-stage');
       const r=e=>{if(!e)return null;const a=e.getBoundingClientRect();return{x:a.x,y:a.y,width:a.width,height:a.height};};
       return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,
         target:r(target),stage:r(stage),heading:r(target?.querySelector('h1,h2,h3')),
         preview:r(target?.querySelector('.biz-preview,.project-device')),title:target?.querySelector('h1,h2,h3')?.textContent?.trim()||null};
      },selector);
      assert.ok(metric.target&&metric.target.height>0,engine+' '+viewport.width+' '+state+' missing scene');
      assert.ok(metric.documentWidth<=viewport.width+2,engine+' '+viewport.width+' '+state+' horizontal page overflow '+metric.documentWidth);
      if(state==='lead'||state==='documents'||state==='assistant'){
       assert.ok(metric.heading&&metric.heading.width>0,'Business heading missing: '+state);
       assert.ok(metric.preview&&metric.preview.width>100,'Business interface missing: '+state);
      }
      const stem=out+'/'+engine+'-'+viewport.width+'-'+state;
      await page.screenshot({path:stem+'.png',animations:'disabled'});
      observations.push({engine,width:viewport.width,state,...metric,screenshot:stem+'.png'});
     }
     assert.deepEqual(errors,[],'Browser JS exceptions: '+engine+' '+viewport.width);
     await page.close();
    }catch(e){await page.close();throw e;}
   }
  }finally{await browser.close();}
 }
}finally{await server.close();await writeFile(out+'/results.json',JSON.stringify({scope:'98 fresh view-state screenshots, not replacements for archived historical 98 comparisons',screenshots:observations.length,observations},null,2)+'\n');}
assert.equal(observations.length,98);
console.log('Business-scene QA: 98 screenshots across Chromium and Firefox at seven widths; all viewport geometry checks passed');
