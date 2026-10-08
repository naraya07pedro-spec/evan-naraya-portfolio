import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import {serve} from './serve.mjs';
import {baselineRoot} from './baseline.mjs';
import {launch,viewports,states,settle,scene} from './browser-utils.mjs';
const before=await serve(await baselineRoot()),after=await serve('.');
await mkdir('artifacts/visual',{recursive:true});
const results=[];
try{
 for(const engine of ['chromium','firefox']){
  const browser=await launch(engine);
  try{
   for(const viewport of viewports){
    const a=await browser.newPage({viewport,deviceScaleFactor:1}),b=await browser.newPage({viewport,deviceScaleFactor:1});
    await a.goto(before.url);await b.goto(process.env.PREVIEW_URL||after.url);await settle(a);await settle(b);
    for(const [name,selector,p] of states){
     if(selector){await scene(a,selector,p);await scene(b,selector,p);}
     const stem='artifacts/visual/'+engine+'-'+viewport.width+'-'+name;
     const ab=await a.screenshot({path:stem+'-before.png',animations:'disabled'});
     const bb=await b.screenshot({path:stem+'-after.png',animations:'disabled'});
     const ap=PNG.sync.read(ab),bp=PNG.sync.read(bb);
     assert.equal(bp.width,ap.width);assert.equal(bp.height,ap.height);
     const diff=new PNG({width:ap.width,height:ap.height});
     const changed=pixelmatch(ap.data,bp.data,diff.data,ap.width,ap.height,{threshold:.1,includeAA:false});
     const ratio=changed/(ap.width*ap.height);
     const result={engine,viewport,state:name,changedPixels:changed,ratio};results.push(result);
     if(changed)await writeFile(stem+'-diff.png',PNG.sync.write(diff));
     // Same browser/process and source baseline: zero structural/layout changes
     // expected. Allow only 0.05% for rasterization jitter, never a redesign.
     assert.ok(ratio<=.0005,JSON.stringify(result));
    }
    await a.screenshot({path:'artifacts/visual/'+engine+'-'+viewport.width+'-full-before.png',fullPage:true,animations:'disabled'});
    await b.screenshot({path:'artifacts/visual/'+engine+'-'+viewport.width+'-full-after.png',fullPage:true,animations:'disabled'});
    await a.close();await b.close();console.log(engine+' '+viewport.width+' visual states pass');
   }
  } finally{await browser.close();}
 }
} finally{
 await writeFile('artifacts/visual/results.json',JSON.stringify(results,null,2));
 await before.close();await after.close();
}
