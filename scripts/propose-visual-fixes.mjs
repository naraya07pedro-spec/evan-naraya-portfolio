// Local proposal capture only. Never edits application assets or the baseline.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve} from './serve.mjs';
import {launch,viewports,settle,scene} from './browser-utils.mjs';
const out='artifacts/visual-proposals';
const proposal='@media(max-width:760px){.intro-role{top:32%}.shared-person{left:66%}}\n.device-top > b{color:#79768c}';
const protectedPaths=['index.html','assets/css/portfolio.css','assets/js/portfolio.js','assets/images/evan-naraya-portrait.webp'];
const hash=b=>createHash('sha256').update(b).digest('hex');
const hashes=Object.fromEntries(await Promise.all(protectedPaths.map(async p=>[p,hash(await readFile(p))])));
await mkdir(out,{recursive:true});
const server=await serve('.');let browser;
const results=[];
try{
 browser=await launch('chromium');
 for(const viewport of viewports){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  await page.goto(server.url);await settle(page);
  const geometry=()=>page.evaluate(()=>{
   const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};
   return{name:box('.intro-left'),role:box('.intro-role'),portrait:box('.shared-person-img'),documentWidth:document.documentElement.scrollWidth};
  });
  const before=await geometry();
  await page.screenshot({path:out+'/'+viewport.width+'-hero-before.png',animations:'disabled'});
  const style=await page.addStyleTag({content:proposal});await settle(page);
  const proposed=await geometry();
  await page.screenshot({path:out+'/'+viewport.width+'-hero-proposed.png',animations:'disabled'});
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const contrast=()=>page.evaluate(async()=>{
   const result=await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}});
   return result.violations.flatMap(v=>v.nodes).filter(n=>n.target.some(s=>s.includes('.device-top'))).map(n=>({target:n.target,checks:n.any.map(c=>({id:c.id,data:c.data,message:c.message}))}));
  });
  const projectResults=[];
  for(const project of ['1','2']){
   await style.evaluate(e=>{e.sheet.disabled=true;});
   await scene(page,'.project-scene[data-project="'+project+'"]',.5);
   const toolbar=page.locator('.project-scene[data-project="'+project+'"] .device-top');
   await toolbar.screenshot({path:out+'/'+viewport.width+'-project-'+project+'-before.png',animations:'disabled'});
   const contrastBefore=await contrast();
   await style.evaluate(e=>{e.sheet.disabled=false;});await settle(page);
   await toolbar.screenshot({path:out+'/'+viewport.width+'-project-'+project+'-proposed.png',animations:'disabled'});
   projectResults.push({project,contrastBefore,contrastProposed:await contrast()});
  }
  results.push({viewport,before,proposed,projectResults});
  await page.close();console.log(viewport.width+' unapproved proposal captured');
 }
 for(const path of protectedPaths)if(hash(await readFile(path))!==hashes[path])throw Error('Product asset changed '+path);
 await writeFile(out+'/report.json',JSON.stringify({status:'UNAPPROVED VISUAL PROPOSALS ONLY',capturedAt:new Date().toISOString(),browser:browser.version(),css:proposal,protectedAssetHashes:hashes,results},null,2)+'\n');
}finally{await browser?.close();await server.close();}
