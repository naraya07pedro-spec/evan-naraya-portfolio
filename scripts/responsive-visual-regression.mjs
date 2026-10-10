import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import {serve} from './serve.mjs';
import {baselineRoot} from './baseline.mjs';
import {launch,viewports,states,settle,scene} from './browser-utils.mjs';
import {verifyHistoricalEvidence} from './historical-evidence.mjs';
import {applyApprovedContactScope} from './contact-scope.mjs';
import {applyBusinessProofScope,businessProofScope} from './business-proof-scope.mjs';

// The historical 98 comparison source and runner stay immutable. This explicit
// source patch records the authorized responsive scope, not a regenerated image
// baseline. Future product changes must not silently refresh it to pass tests.
const reviewed='c841c02bac94ad957ef2112f43f6728aad5d1baa',reference='artifacts/responsive-reference',out='artifacts/responsive-visual';
const show=path=>execFileSync('git',['show',reviewed+':'+path],{maxBuffer:4*1024*1024});
await verifyHistoricalEvidence('.',reviewed);
const paths=execFileSync('git',['ls-tree','-r','--name-only',reviewed,'index.html','assets']).toString().trim().split('\n');
for(const path of paths){const target=reference+'/'+path;await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,show(path));}
const copyBeforeRoot='artifacts/business-proof-before';
for(const path of paths){const target=copyBeforeRoot+'/'+path;await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,execFileSync('git',['show',businessProofScope.reviewedHead+':'+path],{maxBuffer:4*1024*1024}));}
execFileSync('git',['apply','--directory='+reference,'docs/responsive-scope.patch']);
await writeFile(reference+'/index.html',applyApprovedContactScope(await readFile(reference+'/index.html','utf8')));
await writeFile(reference+'/index.html',applyBusinessProofScope(await readFile(reference+'/index.html','utf8')));
for(const path of ['index.html','assets/css/portfolio.css','assets/js/portfolio.js'])assert.ok((await readFile(path)).equals(await readFile(reference+'/'+path)),'Product exceeds the recorded responsive change: '+path);
const original=await serve(await baselineRoot()),expected=await serve(reference),current=await serve('.'),copyBefore=await serve(copyBeforeRoot);
await mkdir(out,{recursive:true});const results=[];
const copyGeometry=[];
const geometry=page=>page.evaluate(()=>{
 const rectOf=e=>{
  const r=e.getBoundingClientRect();let visible=r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;
  for(let a=e;a&&visible;a=a.parentElement){const s=getComputedStyle(a);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.05)visible=false;
   if(a!==e){const p=a.getBoundingClientRect();if(['hidden','clip'].includes(s.overflowX)&&(r.right<=p.left||r.left>=p.right))visible=false;if(['hidden','clip'].includes(s.overflowY)&&(r.bottom<=p.top||r.top>=p.bottom))visible=false;}
  }
  return{x:r.x,y:r.y,width:r.width,height:r.height,visible};
 };
 const rect=s=>rectOf(document.querySelector(s));
 const scenes=[...document.querySelectorAll('.scene')].map(e=>({selector:e.className,project:e.dataset.project||null,flow:e.hasAttribute('data-flow'),height:e.getBoundingClientRect().height,stageHeight:e.querySelector('.sticky-stage').getBoundingClientRect().height}));
 const caption=document.querySelector('.hero-caption'),paragraphs=[...document.querySelectorAll('.project-copy>p:not(.result)')];
 const lines=e=>Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight));
 const h=document.querySelector('#contact-heading'),walk=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);let node;const clippedHeading=[];
 while((node=walk.nextNode()))for(let i=0;i<node.length;i++){if(!node.textContent[i].trim())continue;const r=document.createRange();r.setStart(node,i);r.setEnd(node,i+1);const b=r.getBoundingClientRect();if(b.left<0||b.right>innerWidth+.5)clippedHeading.push(node.textContent[i]);}
 return{documentHeight:document.documentElement.scrollHeight,scenes,portrait:rect('.shared-person-img'),planet:rect('.planet'),name:rect('.intro-left'),role:rect('.intro-role'),captionLines:lines(caption),projectLines:paragraphs.map(lines),devices:[...document.querySelectorAll('.project-device')].map(rectOf),clippedHeading,overflow:document.documentElement.scrollWidth>innerWidth};
});
const closeRect=(a,b,label,tolerance=1)=>{assert.equal(b.visible,a.visible,label+' painted visibility changed');if(!a.visible)return;for(const key of ['x','y','width','height'])assert.ok(Math.abs(a[key]-b[key])<=tolerance,label+' '+key+' changed by '+(b[key]-a[key]));};
const compare=(a,b)=>{const x=PNG.sync.read(a),y=PNG.sync.read(b);assert.equal(x.width,y.width);assert.equal(x.height,y.height);const diff=new PNG({width:x.width,height:x.height});const changedPixels=pixelmatch(x.data,y.data,diff.data,x.width,x.height,{threshold:.1,includeAA:false});return{changedPixels,ratio:changedPixels/(x.width*x.height),diff};};
try{
 for(const engine of(process.env.QA_ENGINES||'chromium,firefox').split(',')){
  const browser=await launch(engine);try{
   for(const viewport of viewports){
    const a=await browser.newPage({viewport}),b=await browser.newPage({viewport}),c=await browser.newPage({viewport}),d=await browser.newPage({viewport});
    await a.goto(original.url);await b.goto(expected.url);await c.goto(current.url);await d.goto(copyBefore.url);await Promise.all([settle(a),settle(b),settle(c),settle(d)]);
    for(const[state,selector,p]of states){
     if(selector)await Promise.all([scene(a,selector,p),scene(b,selector,p),scene(c,selector,p),scene(d,selector,p)]);
     const stem=out+'/'+engine+'-'+viewport.width+'-'+state;
     const before=await a.screenshot({path:stem+'-historical.png',animations:'disabled'}),after=await c.screenshot({path:stem+'-after.png',animations:'disabled'});
     const approved=await b.screenshot({animations:'disabled'}),actual=compare(before,after),residual=compare(approved,after);
     results.push({engine,viewport,state,originalDiff:{changedPixels:actual.changedPixels,ratio:actual.ratio},unexpectedDiff:{changedPixels:residual.changedPixels,ratio:residual.ratio}});
     if(actual.changedPixels)await writeFile(stem+'-actual-diff.png',PNG.sync.write(actual.diff));
     if(residual.changedPixels)await writeFile(stem+'-unexpected-diff.png',PNG.sync.write(residual.diff));
     assert.ok(residual.ratio<=.0005,JSON.stringify(results.at(-1)));
     await d.screenshot({path:stem+'-v13-before.png',animations:'disabled'});
     const [beforeGeometry,afterGeometry]=await Promise.all([geometry(d),geometry(c)]);
     copyGeometry.push({engine,viewport,state,before:beforeGeometry,after:afterGeometry});
     assert.deepEqual(afterGeometry.scenes,beforeGeometry.scenes,'V13 changed scene/flow sizing at '+engine+' '+viewport.width+' '+state);
     assert.equal(afterGeometry.overflow,false);
     assert.deepEqual(afterGeometry.clippedHeading,[],'Contact heading clips after V13');
     // Copy may change glyph widths. Its caption must retain its line count;
     // the named cinematic geometry must not move. Flagship copy may reflow
     // by at most one line, documented separately from unexpected pixel diffs.
     assert.equal(afterGeometry.captionLines,beforeGeometry.captionLines,'Hero caption reflow');
     const slot=engine+' '+viewport.width+' '+state;
     closeRect(beforeGeometry.portrait,afterGeometry.portrait,'Portrait / '+slot);
     closeRect(beforeGeometry.planet,afterGeometry.planet,'Planet / '+slot);
     closeRect(beforeGeometry.name,afterGeometry.name,'Name / '+slot);
     closeRect(beforeGeometry.role,afterGeometry.role,'Role / '+slot);
     for(let i=0;i<2;i++){
      assert.ok(Math.abs(afterGeometry.projectLines[i]-beforeGeometry.projectLines[i])<=1,'Flagship paragraph reflow exceeds one line');
      const x=beforeGeometry.devices[i],y=afterGeometry.devices[i];
      assert.equal(y.visible,x.visible,'Project device painted visibility changed');
      if(!x.visible)continue;
      for(const key of ['x','width','height'])assert.ok(Math.abs(x[key]-y[key])<=1,'Project device geometry changed');
      assert.ok(Math.abs(x.y-y.y)<=24,'Project device moved beyond one copy line');
     }
    }
    await Promise.all([a.close(),b.close(),c.close(),d.close()]);console.log(engine+' '+viewport.width+' scope regression passed; actual historical diffs and V13 geometry recorded');
   }
  }finally{await browser.close();}
 }
}finally{
 await writeFile(out+'/results.json',JSON.stringify({reviewed,businessCopyReviewedHead:businessProofScope.reviewedHead,businessCopyAfterSha256:businessProofScope.afterSha256,originalBaseline:'a4634a0e4161ca8667c873cc4f26c5c65041dca0',historicalEvidenceUnchanged:true,reference:'explicit responsive patch + exact authorized V13 copy scope; not regenerated historical screenshots',results},null,2)+'\n');
 await writeFile(out+'/business-copy-geometry.json',JSON.stringify({scope:'Independent pre-V13/current painted geometry at seven widths and key normal-motion states; unchanged scene sizing and 1px hero/portrait/planet tolerance; <=1 flagship paragraph line of copy reflow allowed; off-screen coordinates and total normal-flow document height recorded, not mistaken for visible choreography',results:copyGeometry},null,2)+'\n');
 await Promise.all([original.close(),expected.close(),current.close(),copyBefore.close()]);
}
console.log(JSON.stringify({comparisons:results.length,unexpectedMax:Math.max(...results.map(x=>x.unexpectedDiff.ratio)),actualHistoricalDiffMax:Math.max(...results.map(x=>x.originalDiff.ratio))}));
