import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';import pixelmatch from 'pixelmatch';
import {serve} from './serve.mjs';import {launch,viewports,settle,scene} from './browser-utils.mjs';
import {consoleScope,sha256} from './console-integration-scope.mjs';
const out=process.env.CONSOLE_QA_OUTPUT||'artifacts/console-integration';await mkdir(out,{recursive:true});
const reference=await mkdtemp(join(tmpdir(),'portfolio-pr2-reference-'));
for(const path of ['index.html','assets/css/portfolio.css','assets/js/portfolio.js','assets/images/evan-naraya-portrait.webp']){
 const target=join(reference,path);await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,execFileSync('git',['show',consoleScope.reviewedPrHead+':'+path],{maxBuffer:8*1024*1024}));
}
const old=await serve(reference),current=await serve('.'),results=[],comparisons=[],accessibility=[];
const compare=(a,b)=>{
 const x=PNG.sync.read(a),y=PNG.sync.read(b);assert.ok(Math.abs(x.width-y.width)<=1&&Math.abs(x.height-y.height)<=1,'Capture dimensions changed beyond 1px');
 const crop=(p,left,top,w,h)=>{const bytes=Buffer.alloc(w*h*4);for(let r=0;r<h;r++)p.data.copy(bytes,r*w*4,((top+r)*p.width+left)*4,((top+r)*p.width+left+w)*4);return bytes;};
 const candidates=[];for(const dx of [-1,0,1])for(const dy of [-1,0,1]){
  const ax=Math.max(0,dx),ay=Math.max(0,dy),bx=Math.max(0,-dx),by=Math.max(0,-dy),w=Math.min(x.width-ax,y.width-bx),h=Math.min(x.height-ay,y.height-by);
  const changedPixels=pixelmatch(crop(x,ax,ay,w,h),crop(y,bx,by,w,h),null,w,h,{threshold:.1,includeAA:false});candidates.push({changedPixels,ratio:changedPixels/(w*h),registration:{dx,dy},comparedPixels:w*h});
 }
 candidates.sort((a,b)=>a.ratio-b.ratio||Math.abs(a.registration.dx)+Math.abs(a.registration.dy)-Math.abs(b.registration.dx)-Math.abs(b.registration.dy));return {...candidates[0],raw:candidates.find(c=>c.registration.dx===0&&c.registration.dy===0)};
};
const engines=(process.env.QA_ENGINES||'chromium,firefox').split(',');
const sizes=[...viewports,{width:360,height:800},{width:1366,height:768}].sort((a,b)=>a.width-b.width);
try{
 for(const engine of engines){const browser=await launch(engine);try{
  for(const viewport of sizes){
   const before=await browser.newPage({viewport}),after=await browser.newPage({viewport}),errors=[];after.on('pageerror',e=>errors.push(e.message));
   // Protected source comparison always uses this exact checkout. Netlify's
   // injected hosting controls are retained in the separate hosted Console frames.
   await before.goto(old.url);await after.goto(current.url);await settle(before);await settle(after);
   // Document height changes intentionally; only this decoration is hidden in both comparison captures.
   for(const p of [before,after])await p.addStyleTag({content:'.page-progress{visibility:hidden!important}'});
   for(const [state,selector]of [['hero',null],['agent','.project-scene[data-project="1"]'],['knowledge','.project-scene[data-project="2"]']]){
    if(selector){await scene(before,selector,.5);await scene(after,selector,.5);const a=await before.locator(selector+' .project-device').boundingBox(),b=await after.locator(selector+' .project-device').boundingBox();for(const key of ['x','y','width','height'])assert.ok(Math.abs(a[key]-b[key])<=1,'Protected device geometry: '+state+' '+key);}
    const stem=out+'/'+engine+'-'+viewport.width+'-'+state;
    const a=selector?await before.locator(selector+' .project-device').screenshot({path:stem+'-before.png',animations:'disabled'}):await before.screenshot({path:stem+'-before.png',animations:'disabled'});
    const b=selector?await after.locator(selector+' .project-device').screenshot({path:stem+'-after.png',animations:'disabled'}):await after.screenshot({path:stem+'-after.png',animations:'disabled'});
    const diff=compare(a,b);comparisons.push({engine,viewport,state,before:stem+'-before.png',after:stem+'-after.png',...diff});assert.ok(diff.ratio<=.0005,'Protected visual regression: '+JSON.stringify(comparisons.at(-1)));
   }
   for(const motion of ['no-preference','reduce']){
    await after.emulateMedia({reducedMotion:motion});await after.goto(process.env.PREVIEW_URL||current.url);await settle(after);await scene(after,'#operations-console',.5);
    // Lazy loading starts asynchronously after scroll, especially in Firefox.
    // Decode the real image before measuring it; restore the intended scene
    // position so evidence and protected geometry retain their original scope.
    const image=after.locator('#operations-console img');await image.scrollIntoViewIfNeeded();
    await after.waitForFunction(()=>{const i=document.querySelector('#operations-console img');return i.complete&&i.naturalWidth>0;},null,{timeout:15000});
    await image.evaluate(i=>i.decode());await scene(after,'#operations-console',.5);
    if(motion==='reduce'||await after.locator('#operations-console').evaluate(e=>e.hasAttribute('data-flow')))await scene(after,'#operations-console',0);
    const geometry=await after.locator('#operations-console').evaluate(e=>{
     const r=x=>{const b=x.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,top:b.top,bottom:b.bottom};};const clipped=[];
     for(const el of e.querySelectorAll('h2,p,a')){const b=el.getBoundingClientRect();if(b.width&&(b.left<-.5||b.right>innerWidth+.5))clipped.push(el.textContent.trim());}
     const heading=e.querySelector('h2'),range=document.createRange();range.selectNodeContents(heading);const ink=range.getBoundingClientRect(),copy=e.querySelector('.project-copy').getBoundingClientRect(),capture=e.querySelector('.console-capture').getBoundingClientRect(),stacked=getComputedStyle(e.querySelector('.project-stage')).gridTemplateColumns.split(' ').length===1;
     return {documentWidth:document.documentElement.scrollWidth,flow:e.hasAttribute('data-flow'),copy:r(e.querySelector('.project-copy')),capture:r(e.querySelector('.console-capture')),headingInkRight:ink.right,headingBoxRight:heading.getBoundingClientRect().right,copyCaptureOverlap:!stacked&&copy.right>capture.left+1,imageLoaded:e.querySelector('img').naturalWidth,clipped};
    });
    assert.ok(geometry.documentWidth<=viewport.width+1);assert.deepEqual(geometry.clipped,[]);assert.equal(geometry.imageLoaded,1440);assert.ok(geometry.headingInkRight<=geometry.headingBoxRight+1);assert.equal(geometry.copyCaptureOverlap,false);assert.ok(geometry.copy.height>100&&geometry.capture.width>200);
    const path=out+'/'+engine+'-'+viewport.width+'-console-'+motion+'.png';await after.screenshot({path,animations:'disabled'});results.push({engine,viewport,motion,state:'console',geometry,screenshot:path});
    await after.locator('#operations-console .console-image-link').focus();await settle(after);assert.ok(await after.locator('#operations-console .console-image-link').evaluate(e=>e.matches(':focus')));
    await after.locator('#operations-console .project-link').focus();await settle(after);assert.ok(Number(await after.locator('#operations-console .project-copy').evaluate(e=>getComputedStyle(e).opacity))>.5);
    for(const id of ['work','skills','contact']){await after.locator('nav a[href="#'+id+'"]').focus();await after.keyboard.press('Enter');await after.waitForFunction(id=>location.hash==='#'+id,id);}
   }
   if([390,1440].includes(viewport.width)){
    await after.emulateMedia({reducedMotion:'reduce'});await scene(after,'#operations-console',0);await settle(after);await after.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
    const violations=await after.evaluate(async()=>{const scan=await axe.run(document.querySelector('#operations-console'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return scan.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));});accessibility.push({engine,width:viewport.width,violations});assert.deepEqual(violations,[]);
   }
   assert.deepEqual(errors,[]);await before.close();await after.close();
  }
  const media=await browser.newPage();await media.goto(process.env.PREVIEW_URL||current.url);const provenance=JSON.parse(await readFile('docs/console-integration/provenance.json','utf8'));
  for(const asset of [provenance.dashboard,provenance.video,{path:provenance.video.originalPublicPath,sha256:provenance.video.sourceSHA256}]){const response=await media.request.get(new URL('/'+asset.path,process.env.PREVIEW_URL||current.url).href);assert.equal(response.status(),200);assert.equal(sha256(await response.body()),asset.sha256);}
  await media.goto(new URL('/'+provenance.video.path,process.env.PREVIEW_URL||current.url).href);await media.waitForFunction(()=>document.querySelector('video')?.readyState>=1);
  const playback=await media.evaluate(async()=>{const v=document.querySelector('video');v.muted=true;await v.play();await new Promise(r=>setTimeout(r,200));v.pause();return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,currentTime:v.currentTime};});assert.ok(Math.abs(playback.duration-15.56)<.05&&playback.currentTime>0);assert.equal(playback.width,1440);assert.equal(playback.height,1000);results.push({engine,state:'authentic-demo-playback',playback});await media.close();
 }finally{await browser.close();}}
 assert.equal(comparisons.length,engines.length*sizes.length*3);console.log(JSON.stringify({engines,comparisons:comparisons.length,maxUnexpectedPixelRatio:Math.max(...comparisons.map(x=>x.ratio)),consoleFrames:results.filter(x=>x.state==='console').length,axeScans:accessibility.length,videoPlaybackEngines:results.filter(x=>x.playback).length}));
}finally{
 await writeFile(out+'/results.json',JSON.stringify({checkedAt:new Date().toISOString(),beforeCommit:consoleScope.reviewedPrHead,expectedHead:process.env.EXPECTED_HEAD||null,hostedURL:process.env.PREVIEW_URL||null,scope:'Exact PR #2/current comparison: hero and protected diagrams, only page-progress decoration hidden in both; <=1px registration for fractional scroll offsets; new Console captures identified separately',comparisons,results,accessibility},null,2)+'\n');await old.close();await current.close();await rm(reference,{recursive:true,force:true});
}
