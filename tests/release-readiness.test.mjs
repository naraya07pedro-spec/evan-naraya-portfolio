import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm, unlink, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {checkRelease, owner, requiredFilenames, publicSafeFields, originalFields, publicationTargets} from '../scripts/release-eligibility.mjs';

const sha = b => createHash('sha256').update(b).digest('hex');
// Synthetic byte fixtures exercise the gate. They are not CVs or career evidence.
async function fixture(t, variant = 'contact-redacted') {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-release-gate-'));
  t.after(() => rm(root, {recursive:true, force:true}));
  await mkdir(join(root,'docs'));
  await mkdir(join(root,'assets/resumes'),{recursive:true});
  const sources = [], candidates = [], files = [];
  for (const [i, filename] of requiredFilenames.entries()) {
    const path = 'assets/resumes/' + filename;
    const original = Buffer.from('%PDF-1.7\nsynthetic original fixture '+i+'\n%%EOF');
    const redacted = Buffer.from('%PDF-1.7\nsynthetic contact-only fixture '+i+'\n%%EOF');
    const bytes = variant === 'original' ? original : redacted;
    sources.push({path,filename,sha256:sha(original),bytes:original.length,pages:1,careerTextSha256:sha(Buffer.from('synthetic career text '+i))});
    candidates.push({sourceFilename:filename,sourceSha256:sha(original),sha256:sha(redacted),bytes:redacted.length,pages:1,
      careerTextSha256:sha(Buffer.from('synthetic career text '+i)),careerTextAndCoordinatesUnchanged:true,
      careerPixelsUnchangedAt144Dpi:true,identityStackPixelsUnchanged:true,allSixLinksPreserved:true,
      phoneAndEmailAbsentInDecodedObjects:true,embeddedFiles:0,retainedFields:publicSafeFields});
    files.push({path,sha256:sha(bytes),sourceSha256:sha(original),variant,
      publicFields:variant === 'original' ? originalFields : publicSafeFields});
    await writeFile(join(root,path),bytes);
  }
  const approval = {schemaVersion:1,status:'approved',approvedBy:owner,approvedAt:'2026-10-08T00:00:00Z',
    approvalReference:'TEST FIXTURE ONLY: synthetic consent',publicationTargets,files};
  await writeFile(join(root,'docs/resumes.json'),JSON.stringify(sources));
  await writeFile(join(root,'docs/resume-release-candidates.json'),JSON.stringify({schemaVersion:1,files:candidates}));
  await writeFile(join(root,'docs/resume-release-approval.json'),JSON.stringify(approval));
  await writeFile(join(root,'index.html'),requiredFilenames.map(n => '<a href="/assets/resumes/'+n+'" download="'+n+'">CV</a>').join('\n'));
  return root;
}
async function edit(root,path,mutate) {
  const value=JSON.parse(await readFile(join(root,path),'utf8'));
  mutate(value);
  await writeFile(join(root,path),JSON.stringify(value));
}
async function blocked(root,code) {
  const result=await checkRelease(root);
  assert.equal(result.eligible,false);
  assert.ok(result.errors.some(e=>e.code===code),JSON.stringify(result.errors));
}

test('reviewed contact-only bytes with exact recorded field consent are eligible',async t=>{
  const result=await checkRelease(await fixture(t));
  assert.equal(result.eligible,true);assert.deepEqual(result.errors,[]);
  assert.ok(result.assets.every(a=>a.variant==='contact-redacted'));
});
test('original bytes require the original personal field consent',async t=>{
  const root=await fixture(t,'original');assert.equal((await checkRelease(root)).eligible,true);
  await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].publicFields=publicSafeFields;});
  await blocked(root,'FIELD_CONSENT');
});
test('pending approval cannot release even authentic matching assets',async t=>{
  const root=await fixture(t,'original');
  await edit(root,'docs/resume-release-approval.json',a=>{a.status='pending';});
  await blocked(root,'OWNER_CONSENT');
});
test('owner identity, approval time and reference cannot be omitted',async t=>{
  for (const field of ['approvedBy','approvedAt','approvalReference']) {
    const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a[field]='';});
    await blocked(root,'OWNER_CONSENT');
  }
});
test('publication consent must name all three public destinations',async t=>{
  const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a.publicationTargets=publicationTargets.slice(0,2);});
  await blocked(root,'PUBLICATION_CONSENT');
});
test('missing resume fails closed',async t=>{
  const root=await fixture(t);await unlink(join(root,'assets/resumes',requiredFilenames[0]));
  await blocked(root,'MISSING_ASSET');
});
test('tampered bytes and reconstructed stand-ins are not eligible',async t=>{
  const root=await fixture(t);await writeFile(join(root,'assets/resumes',requiredFilenames[0]),'%PDF-1.7\nstand-in');
  await blocked(root,'ASSET_MISMATCH');
});
test('matching digest with inconsistent reviewed size fails',async t=>{
  const root=await fixture(t);await edit(root,'docs/resume-release-candidates.json',a=>{a.files[0].bytes++;});
  await blocked(root,'SIZE_MISMATCH');
});
test('derivative must point to its authentic source and verified unchanged career evidence',async t=>{
  for (const field of ['sourceSha256','careerTextSha256','careerPixelsUnchangedAt144Dpi','phoneAndEmailAbsentInDecodedObjects']) {
    const root=await fixture(t);await edit(root,'docs/resume-release-candidates.json',a=>{a.files[0][field]=null;});
    await blocked(root,'CANDIDATE_PROVENANCE');
  }
});
test('approval binds file hash and variant, not just a filename',async t=>{
  const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].sha256='0'.repeat(64);});
  await blocked(root,'FILE_CONSENT_MISMATCH');
});
test('duplicate or missing public-field categories fail',async t=>{
  const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].publicFields=[...publicSafeFields.slice(0,-1),publicSafeFields[0]];});
  await blocked(root,'FIELD_CONSENT');
});
test('approval cannot duplicate a family or substitute an arbitrary path',async t=>{
  for (const path of ['assets/resumes/'+requiredFilenames[1],'../private.pdf']) {
    const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].path=path;});
    await blocked(root,'APPROVAL_SET');
  }
});
test('missing or malformed consent JSON fails closed',async t=>{
  for (const content of [null,'{bad json']) {
    const root=await fixture(t);const path=join(root,'docs/resume-release-approval.json');
    if(content===null)await unlink(path);else await writeFile(path,content);
    await blocked(root,'INVALID_MANIFEST');
  }
});
test('symlinked resume or extra unapproved resume is refused',async t=>{
  const root=await fixture(t);const path=join(root,'assets/resumes',requiredFilenames[0]);
  await unlink(path);await symlink(join(root,'assets/resumes',requiredFilenames[1]),path);
  await blocked(root,'MISSING_ASSET');
  await writeFile(join(root,'assets/resumes/unapproved.pdf'),'%PDF-1.7\nextra');
  await blocked(root,'UNAPPROVED_ASSET');
});
test('download must name the exact release asset and browser filename',async t=>{
  const root=await fixture(t);await writeFile(join(root,'index.html'),'<a href="/outdated.pdf">CV</a>');
  await blocked(root,'DOWNLOAD_REFERENCE');
});
test('invalid or duplicated authentic source records fail',async t=>{
  const root=await fixture(t);await edit(root,'docs/resumes.json',a=>{a[0]=a[1];});
  await blocked(root,'SOURCE_SET');
});
