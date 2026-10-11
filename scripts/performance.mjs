import {mkdir,writeFile} from 'node:fs/promises';
import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {serve} from './serve.mjs';
import {baselineRoot} from './baseline.mjs';
const before=await serve(await baselineRoot()),after=await serve('.');
const browser=await launch({chromePath:process.env.BROWSER_EXECUTABLE,chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
await mkdir('artifacts/performance',{recursive:true});
const results=[];
try{
 for(const formFactor of ['mobile','desktop']){
  for(const [name,url] of [['before',before.url],['after',after.url]]){
   const options={port:browser.port,logLevel:'error',output:['json','html'],onlyCategories:['performance','accessibility','best-practices','seo'],formFactor,screenEmulation:formFactor==='mobile'?{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false}:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false}};
   const result=await lighthouse(url,options);
   await writeFile('artifacts/performance/'+formFactor+'-'+name+'.json',result.report[0]);
   await writeFile('artifacts/performance/'+formFactor+'-'+name+'.html',result.report[1]);
   const a=result.lhr.audits;
   const row={formFactor,name,lighthouseVersion:result.lhr.lighthouseVersion,conditions:result.lhr.configSettings,scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCPms:a['largest-contentful-paint'].numericValue,CLS:a['cumulative-layout-shift'].numericValue,TBTms:a['total-blocking-time'].numericValue,jsExecutionMs:a['bootup-time']?.numericValue,transferBytes:a['total-byte-weight'].numericValue,INP:'Not measurable by navigation Lighthouse; no field data or invented INP',warnings:result.lhr.runWarnings};
   results.push(row);console.log(name,formFactor,row.scores,'LCP',Math.round(row.LCPms),'CLS',row.CLS);
  }
 }
}finally{
 await writeFile('artifacts/performance/summary.json',JSON.stringify({scope:'Single-run controlled localhost comparison. Real visual animation remains enabled. Not field Core Web Vitals or public network timing.',results},null,2));
 await browser.kill();await before.close();await after.close();
}
