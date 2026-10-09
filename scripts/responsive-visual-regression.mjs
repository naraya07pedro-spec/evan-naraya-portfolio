import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';
import {serve} from './serve.mjs';
import {baselineRoot} from './baseline.mjs';
import {launch,viewports,states,settle,scene} from './browser-utils.mjs';
import {verifyHistoricalEvidence} from './historical-evidence.mjs';

// The historical 98 comparison source and runner stay immutable. This explicit
// source patch records the authorized responsive scope, not a regenerated image
// baseline. Future product changes must not silently refresh it to pass tests.
const reviewed='c841c02bac94ad957ef2112f43f6728aad5d1baa',reference='artifacts/responsive-reference',out='artifacts/responsive-visual';
const show=path=>execFileSync('git',['show',reviewed+':'+path],{maxBuffer:4*1024*1024});
await verifyHistoricalEvidence('.',reviewed);
const paths=execFileSync('git',['ls-tree','-r','--name-only',reviewed,'index.html','assets']).toString().trim().split('\n');
for(const path of paths){const target=reference+'/'+path;await mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await writeFile(target,show(path));}
execFileSync('git',['apply','--directory='+reference,'docs/responsive-scope.patch']);
for(const path of ['index.html','assets/css/portfolio.css','assets/js/portfolio.js'])assert.ok((await readFile(path)).equals(await readFile(reference+'/'+path)),'Product exceeds the recorded responsive change: '+path);
const original=await serve(await baselineRoot()),expected=await serve(reference),current=await serve('.');
await mkdir(out,{recursive:true});const results=[];
const compare=(a,b)=>{const x=PNG.sync.read(a),y=PNG.sync.read(b);assert.equal(x.width,y.width);assert.equal(x.height,y.height);const diff=new PNG({width:x.width,height:x.height});const changedPixels=pixelmatch(x.data,y.data,diff.data,x.width,x.height,{threshold:.1,includeAA:false});return{changedPixels,ratio:changedPixels/(x.width*x.height),diff};};
try{
 for(const engine of(process.env.QA_ENGINES||'chromium,firefox').split(',')){
  const browser=await launch(engine);try{
   for(const viewport of viewports){
    const a=await browser.newPage({viewport}),b=await browser.newPage({viewport}),c=await browser.newPage({viewport});
    await a.goto(original.url);await b.goto(expected.url);await c.goto(current.url);await Promise.all([settle(a),settle(b),settle(c)]);
    for(const[state,selector,p]of states){
     if(selector)await Promise.all([scene(a,selector,p),scene(b,selector,p),scene(c,selector,p)]);
     const stem=out+'/'+engine+'-'+viewport.width+'-'+state;
     const before=await a.screenshot({path:stem+'-historical.png',animations:'disabled'}),after=await c.screenshot({path:stem+'-after.png',animations:'disabled'});
     const approved=await b.screenshot({animations:'disabled'}),actual=compare(before,after),residual=compare(approved,after);
     results.push({engine,viewport,state,originalDiff:{changedPixels:actual.changedPixels,ratio:actual.ratio},unexpectedDiff:{changedPixels:residual.changedPixels,ratio:residual.ratio}});
     if(actual.changedPixels)await writeFile(stem+'-actual-diff.png',PNG.sync.write(actual.diff));
     if(residual.changedPixels)await writeFile(stem+'-unexpected-diff.png',PNG.sync.write(residual.diff));
     assert.ok(residual.ratio<=.0005,JSON.stringify(results.at(-1)));
    }
    await Promise.all([a.close(),b.close(),c.close()]);console.log(engine+' '+viewport.width+' scope regression passed; actual historical diffs recorded');
   }
  }finally{await browser.close();}
 }
}finally{
 await writeFile(out+'/results.json',JSON.stringify({reviewed,originalBaseline:'a4634a0e4161ca8667c873cc4f26c5c65041dca0',historicalEvidenceUnchanged:true,reference:'explicit source patch, not regenerated historical screenshots',results},null,2)+'\n');
 await Promise.all([original.close(),expected.close(),current.close()]);
}
console.log(JSON.stringify({comparisons:results.length,unexpectedMax:Math.max(...results.map(x=>x.unexpectedDiff.ratio)),actualHistoricalDiffMax:Math.max(...results.map(x=>x.originalDiff.ratio))}));
