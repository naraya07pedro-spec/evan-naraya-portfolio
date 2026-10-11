import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {verifyHistoricalEvidence} from '../scripts/historical-evidence.mjs';

async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'portfolio-history-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  const originals=new Map([
    ['docs/baseline.json','SYNTHETIC accepted visual source'],
    ['scripts/visual-regression.mjs','SYNTHETIC historical runner'],
    ['assets/images/evan-naraya-portrait.webp','SYNTHETIC portrait'],
    ['docs/qa/accepted-evidence.json','SYNTHETIC historical QA'],
    ['docs/resume-release-approval.json',JSON.stringify({status:'pending'})]
  ]);
  for(const [path,bytes] of originals){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),bytes);}
  const git=args=>execFileSync('git',args,{cwd:root,stdio:'pipe'});
  git(['init']);git(['add','.']);git(['-c','user.name=Synthetic fixture','-c','user.email=fixture@example.invalid','commit','-m','Synthetic historical evidence']);
  return {root,originals,revision:git(['rev-parse','HEAD']).toString().trim()};
}

test('visual quality is independent of the pending or subsequently recorded consent declaration',async t=>{
  const {root,revision}=await fixture(t);
  await verifyHistoricalEvidence(root,revision);
  await writeFile(join(root,'docs/resume-release-approval.json'),JSON.stringify({status:'approved',approvalReference:'SYNTHETIC declaration only; not real consent'}));
  await verifyHistoricalEvidence(root,revision);
  await writeFile(join(root,'docs/resume-release-approval.json'),'not a consent manifest');
  await verifyHistoricalEvidence(root,revision);
  // Acceptance here grants no release authorization; the independent release
  // contract tests require explicit consent, exact bytes and external binding.
});

test('consent changes cannot conceal edits to the source baseline, runner, portrait or QA archive',async t=>{
  const {root,revision,originals}=await fixture(t);
  for(const [path,bytes] of originals){
    if(path==='docs/resume-release-approval.json')continue;
    await writeFile(join(root,path),bytes+' altered');
    await assert.rejects(()=>verifyHistoricalEvidence(root,revision),/Historical evidence bytes changed/);
    await writeFile(join(root,path),bytes);
  }
  await verifyHistoricalEvidence(root,revision);
});
