import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {serve} from '../scripts/serve.mjs';
import {launch,settle,scene} from '../scripts/browser-utils.mjs';

export const sizes=[[320,480],[320,800],[360,640],[360,900],[375,667],[375,812],[390,667],[390,844],[430,600],[430,932],[600,600],[600,800],[760,600],[760,900],[768,600],[768,1024],[1024,600],[1024,900],[1440,600],[1440,900]];
const ratio=(fg,bg)=>{const L=h=>{const c=h.match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};return(L(fg)+.05)/(L(bg)+.05);};

test('toolbar normal-text contrast is at least 4.5:1',()=>assert.ok(ratio('79768c','080910')>=4.5));
for(const engine of (process.env.QA_ENGINES||'chromium,firefox').split(',')){
 test(engine+' responsive geometry, motion and usable content',{timeout:600000},async()=>{
  const server=await serve('.'),browser=await launch(engine),report=[];await mkdir('artifacts/responsive',{recursive:true});
  try{
   for(const [width,height] of sizes.filter(s=>!process.env.QA_WIDTHS||process.env.QA_WIDTHS.split(',').includes(String(s[0]))))for(const reducedMotion of ['no-preference','reduce']){
    const page=await browser.newPage({viewport:{width,height},reducedMotion});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.PREVIEW_URL||server.url);
    const entry=await page.evaluate(()=>{const n=document.querySelector('.intro-left').getBoundingClientRect(),r=document.querySelector('.intro-role').getBoundingClientRect();return {nameBottom:n.bottom,roleTop:r.top};});
    if(width<=760)assert.ok(entry.roleTop>=entry.nameBottom+15);
    await page.screenshot({path:`artifacts/responsive/${engine}-${width}x${height}-${reducedMotion}-entry.png`});await settle(page);
    // Both initial CSS reveal animations and settled layout must reserve space.
    const initial=await page.evaluate(()=>{
     const rect=s=>document.querySelector(s).getBoundingClientRect().toJSON();
     return {name:rect('.intro-left'),role:rect('.intro-role'),flow:document.querySelector('.intro-scene').hasAttribute('data-flow')};
    });
    if(width<=760)assert.ok(initial.role.y>=initial.name.bottom+15,JSON.stringify({width,height,initial}));
    for(const [name,selector,progress] of [['hero',null,0],['intro-exit','.intro-scene',.3],['statement','.intro-scene',.66],['planet','.work-title',.56],['agent','.project-scene[data-project="1"]',.5],['knowledge','.project-scene[data-project="2"]',.5],['contact','#contact',0]]){
     if(selector)await scene(page,selector,progress);
     if(name==='statement'&&(reducedMotion==='reduce'||initial.flow))await page.locator('.intro-statement').scrollIntoViewIfNeeded();
     const geometry=await page.evaluate(()=>{
      const rect=e=>e.getBoundingClientRect().toJSON();const isVisible=e=>getComputedStyle(e).opacity>.05;
      const texts=[...document.querySelectorAll('.intro-left,.intro-role,.intro-statement')].filter(isVisible);
      const photo=rect(document.querySelector('.shared-person-img'));
      const mobile=innerWidth<=760;
      const image=document.querySelector('.shared-person-img');
      if(!window.__portraitAlpha){const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);window.__portraitAlpha=ctx.getImageData(0,0,c.width,c.height).data;}
      const ink=[];
      if(!mobile)for(const element of texts){const walk=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;
       while((node=walk.nextNode()))for(let i=0;i<node.length;i++){if(!node.textContent[i].trim())continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);const r=range.getBoundingClientRect();
        for(const [x,y] of [[r.x+r.width*.5,r.y+r.height*.5],[r.x+r.width*.2,r.y+r.height*.65],[r.x+r.width*.8,r.y+r.height*.65]]){
         if(x<photo.left||x>=photo.right||y<photo.top||y>=photo.bottom||y<0||y>=innerHeight)continue;
         const ix=Math.floor((x-photo.left)/photo.width*image.naturalWidth),iy=Math.floor((y-photo.top)/photo.height*image.naturalHeight);
         if(window.__portraitAlpha[(iy*image.naturalWidth+ix)*4+3]>128){ink.push(element.className);break;}
        }
       }
      }

      return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,
       texts:texts.map(e=>({class:e.className,...rect(e)})),photo,
       // Mobile normal frames reserve the entire readable text above the photo.
       collisions:mobile?texts.filter(e=>{const r=rect(e);return r.right>photo.left&&r.left<photo.right&&r.bottom>photo.top+1&&r.top<photo.bottom;}).map(e=>e.className):[],
       clipped:[...document.querySelectorAll('.intro-role,.intro-statement,.project-copy,.project-device')].filter(isVisible).filter(e=>{
        const r=rect(e),stage=e.closest('.sticky-stage');if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)return false;if(!stage||getComputedStyle(stage).overflow!=='hidden')return false;
        const s=rect(stage);return r.top<s.top-1||r.bottom>s.bottom+1||r.left<s.left-1||r.right>s.right+1;
       }).map(e=>e.className),
       ink:[...new Set(ink)],toolbarColor:getComputedStyle(document.querySelector('.device-top b')).color};
     });
     assert.ok(geometry.documentWidth<=width,'Overflow '+JSON.stringify({width,height,name,geometry}));
     // During the hero exit, text deliberately slides out while fading. Once
     // its opacity falls below .5 it is not a readable resting state.
     if(['hero','statement'].includes(name))assert.deepEqual([...geometry.collisions,...geometry.ink],[],'Portrait/text collision '+JSON.stringify({width,height,name,geometry}));
     if(['hero','statement','agent','knowledge'].includes(name))assert.deepEqual(geometry.clipped,[],'Frame clips content '+JSON.stringify({width,height,name,geometry}));
     assert.equal(geometry.toolbarColor,'rgb(121, 118, 140)');
     await page.screenshot({path:`artifacts/responsive/${engine}-${width}x${height}-${reducedMotion}-${name}.png`,animations:'disabled'});
     report.push({engine,viewport:{width,height},reducedMotion,state:name,geometry});
    }
    // Exercise links and regions, including sticky-to-flow and live media changes.
    await page.goto(process.env.PREVIEW_URL||server.url);await settle(page);
    for(const id of ['work','skills','contact']){
     await page.locator('nav a[href="#'+id+'"]').focus();await page.keyboard.press('Enter');await page.waitForFunction(id=>location.hash==='#'+id,id);
    }
    await page.emulateMedia({reducedMotion:reducedMotion==='reduce'?'no-preference':'reduce'});await settle(page);
    await page.locator('.statement-link').focus();assert.ok(await page.locator('.statement-link').isVisible());
    assert.deepEqual(errors,[]);await page.close();
   }
  }finally{await writeFile(`artifacts/responsive/${engine}-geometry.json`,JSON.stringify(report,null,2)+'\n');await browser.close();await server.close();}
 });
}
