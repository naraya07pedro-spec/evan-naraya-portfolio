import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const resumes=JSON.parse(await readFile('docs/published-resumes.json','utf8'));
await mkdir('artifacts/pdf-validation',{recursive:true});
const results=[];
for(const engine of ['chromium','firefox'])for(const r of resumes){
 const path='artifacts/downloads/'+engine+'-'+r.filename;
 const bytes=await readFile(path);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);
 const info=execFileSync('pdfinfo',[path],{encoding:'utf8'});
 const pages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);
 assert.equal(pages,1);
 const prefix='artifacts/pdf-validation/'+engine+'-'+r.filename;
 execFileSync('pdftoppm',['-f','1','-singlefile','-r','36','-png',path,prefix],{stdio:'pipe'});
 const png=await readFile(prefix+'.png');
 assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 results.push({engine,filename:r.filename,sha256:r.sha256,bytes:bytes.length,pages,parsedAndRendered:true});
}
// PDF bytes, renderings and extracted metadata are deliberately NOT uploaded.
await mkdir('artifacts/hosted-release-safety',{recursive:true});
await writeFile('artifacts/hosted-release-safety/pdf-validation.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({browserDownloadsParsedAndRendered:results.length,allSha256Match:true,pdfBytesAndRenderingsExcludedFromArtifacts:true}));
