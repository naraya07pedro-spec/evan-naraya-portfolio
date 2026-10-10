import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
export const baseline=JSON.parse(await readFile(new URL('../docs/baseline.json',import.meta.url),'utf8'));
export async function baselineRoot(){
 const root=new URL('../artifacts/baseline-source/',import.meta.url);
 await mkdir(root,{recursive:true});
 const html=execFileSync('git',['show',baseline.commit+':index.html'],{maxBuffer:2*1024*1024});
 await writeFile(new URL('index.html',root),html);
 return root.pathname;
}
