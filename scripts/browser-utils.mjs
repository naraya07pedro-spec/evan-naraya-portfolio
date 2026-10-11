import {chromium,firefox} from 'playwright';
export const viewports=[{width:320,height:800},{width:375,height:812},{width:390,height:844},{width:768,height:1024},{width:1024,height:900},{width:1440,height:900},{width:1920,height:1080}];
export async function launch(engine='chromium'){
  const configured=process.env.BROWSER_USE_PROXY==='1'?(process.env.HTTPS_PROXY||process.env.HTTP_PROXY):null;
  const u=configured?new URL(configured):null;
  const proxy=u?{server:u.protocol+'//'+u.host,bypass:'127.0.0.1,localhost',username:decodeURIComponent(u.username),password:decodeURIComponent(u.password)}:undefined;
  const firefoxEnv=process.env.FIREFOX_QA_NO_NESTED_SANDBOX==='1'?{...process.env,MOZ_DISABLE_CONTENT_SANDBOX:'1'}:undefined;
  return engine==='firefox'?firefox.launch({headless:true,proxy,env:firefoxEnv,firefoxUserPrefs:proxy?{'security.enterprise_roots.enabled':true}:undefined}):chromium.launch({headless:true,proxy,executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox']});
}
export async function settle(page){
  await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
    await Promise.all(document.getAnimations().filter(a=>a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  });
}
export async function scene(page,selector,progress){
  await page.evaluate(({selector,progress})=>{
    const e=document.querySelector(selector),rect=e.getBoundingClientRect();
    scrollTo({top:scrollY+rect.top+Math.max(0,rect.height-innerHeight)*progress,behavior:'instant'});
  },{selector,progress});
  await settle(page);
}
export const states=[
  ['hero',null,0],['statement','.intro-scene',.66],
  ['planet-entry','.work-title',0],['planet-expanded','.work-title',.56],
  ['agent','.project-scene[data-project="1"]',.5],
  ['knowledge','.project-scene[data-project="2"]',.5],
  ['contact','#contact',0]
];
