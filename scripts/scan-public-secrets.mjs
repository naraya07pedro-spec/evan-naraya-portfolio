import {execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export function credentialKinds(text){
 const rules={githubToken:/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/,privateKey:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,providerKey:/\bsk-[A-Za-z0-9_-]{20,}\b/,persistedSession:/ops_session=[A-Za-z0-9]{20,}/,signedStorageURL:/https:\/\/[^\s"<>]+(?:blob\.core\.windows\.net|amazonaws\.com)[^\s"<>]*(?:[?&](?:sig|X-Amz-Signature)=)[^\s"<>]+/i};return Object.entries(rules).filter(([,p])=>p.test(text)).map(([name])=>name);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const files=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z']).toString().split('\0').filter(Boolean))],findings=[];let scanned=0;
 for(const path of files){if(!/\.(?:html|css|js|mjs|json|md|txt|ya?ml|toml|patch)$/.test(path)||path==='package-lock.json')continue;scanned++;for(const kind of credentialKinds(await readFile(path,'utf8')))findings.push({path,kind});}
 await mkdir('artifacts',{recursive:true});const result={checkedAt:new Date().toISOString(),scannedTextFiles:scanned,findings,scope:'Known patterns in current tracked/unignored text; no binary, entropy or history claim'};await writeFile('artifacts/public-secret-scan.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));if(findings.length)process.exitCode=1;
}
