import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const approved=JSON.parse(await readFile('docs/resumes.json','utf8'));
let blocked=false;
for(const r of approved){
 const bytes=await readFile(r.path);
 const same=createHash('sha256').update(bytes).digest('hex')===r.sha256;
 console.log(r.filename+': '+(same?'approved original matches':'BLOCKED — approved original public upload awaits explicit privacy approval'));
 if(!same)blocked=true;
}
if(blocked)process.exitCode=1;
