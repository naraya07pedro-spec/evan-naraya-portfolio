import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {launch,viewports,states,settle,scene} from './browser-utils.mjs';
import {serve} from './serve.mjs';
const server=process.env.AUDIT_ROOT?await serve(process.env.AUDIT_ROOT):null;
const url=server?.url||process.env.AUDIT_URL||'https://evannaraya.netlify.app/';
const out=resolve(process.env.AUDIT_OUTPUT||'artifacts/production-baseline');
await mkdir(out,{recursive:true});
const reports=[];
for(const engine of (process.env.AUDIT_ENGINES||'chromium,firefox').split(',')){
 const browser=await launch(engine);
 for(const viewport of viewports){
  const context=await browser.newContext({viewport,deviceScaleFactor:1});
  const page=await context.newPage(),errors=[],failures=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.type()+': '+m.text());});
  page.on('requestfailed',r=>failures.push({url:r.url().split('?')[0],error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url().split('?')[0],status:r.status()});});
  await page.goto(url,{waitUntil:'networkidle'});await settle(page);
  for(const [name,selector,p] of states){
   if(selector)await scene(page,selector,p);
   await page.screenshot({path:out+'/'+engine+'-'+viewport.width+'-'+name+'.png',animations:'disabled'});
  }
  // Reveal ordinary sections before the full-page document capture. Sticky sections
  // remain scroll-state dependent; viewport captures above are the visual authority.
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await settle(page);
  await page.screenshot({path:out+'/'+engine+'-'+viewport.width+'-full.png',fullPage:true,animations:'disabled'});
  const layout=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,navDisplay:getComputedStyle(document.querySelector('nav')).display}));
  reports.push({engine,browserVersion:browser.version(),viewport,errors,failures,layout});
  await writeFile(out+'/capture.json',JSON.stringify({url,capturedAt:new Date().toISOString(),reports},null,2));
  console.log(engine+' '+viewport.width+' captured; errors '+errors.length);
  await context.close();
 }
 await browser.close();
}
await writeFile(out+'/capture.json',JSON.stringify({url,capturedAt:new Date().toISOString(),reports},null,2));
if(server)await server.close();
