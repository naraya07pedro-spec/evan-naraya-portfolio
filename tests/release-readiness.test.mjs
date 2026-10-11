import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, readFile, rm, unlink, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {PDFDocument,PDFName,PDFString} from 'pdf-lib';
import {resumeLinks,portfolioWebsite,inspectPdf} from '../scripts/pdf-contract.mjs';
async function fakePdf(marker,links=resumeLinks){
 const doc=await PDFDocument.create(),page=doc.addPage([612,792]);
 page.drawText('SYNTHETIC TEST '+marker,{x:20,y:750,size:12});
 page.node.set(PDFName.of('Annots'),doc.context.obj(links.map((url,i)=>doc.context.register(doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[20,700-i*30,220,720-i*30],A:{S:'URI',URI:PDFString.of(url)}})))));
 return Buffer.from(await doc.save({useObjectStreams:false}));
}
import {checkRelease as checkReleaseContract, owner, requiredFilenames, publicSafeFields, originalFields, publicationTargets} from '../scripts/release-eligibility.mjs';

const sha = b => createHash('sha256').update(b).digest('hex');
// Existing synthetic scenarios simulate a matching external repository setting.
// No fixture represents authentic owner consent. Binding failures use the
// production contract directly so edits cannot automatically refresh approval.
async function checkRelease(root,options={}) {
  const approvalManifestSha256=sha(await readFile(join(root,'docs/resume-release-approval.json')).catch(()=>Buffer.alloc(0)));
  return checkReleaseContract(root,{approvalManifestSha256,...options});
}
// Synthetic byte fixtures exercise the gate. They are not CVs or career evidence.
async function fixture(t, variant = 'contact-redacted') {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-release-gate-'));
  t.after(() => rm(root, {recursive:true, force:true}));
  await mkdir(join(root,'docs'));
  await mkdir(join(root,'assets/resumes'),{recursive:true});
  const sources = [], candidates = [], revisions=[], files = [];
  for (const [i, filename] of requiredFilenames.entries()) {
    const path = 'assets/resumes/' + filename;
    const original = await fakePdf('original '+i);
    const redacted = await fakePdf('redacted '+i);
    const revised=await fakePdf('revision '+i,[...resumeLinks,portfolioWebsite]);
    const bytes = variant === 'original' ? original : variant==='verified-revision'?revised:redacted;
    sources.push({path,filename,sha256:sha(original),bytes:original.length,pages:1,careerTextSha256:sha(Buffer.from('synthetic career text '+i))});
    candidates.push({sourceFilename:filename,sourceSha256:sha(original),sha256:sha(redacted),bytes:redacted.length,pages:1,
      careerTextSha256:sha(Buffer.from('synthetic career text '+i)),careerTextAndCoordinatesUnchanged:true,
      careerPixelsUnchangedAt144Dpi:true,identityStackPixelsUnchanged:true,allSixLinksPreserved:true,
      phoneAndEmailAbsentInDecodedObjects:true,embeddedFiles:0,retainedFields:publicSafeFields});
    revisions.push({sourceFilename:filename,sourceSha256:sha(original),releasePath:path,sha256:sha(revised),bytes:revised.length,reviewedSourceSha256:sha(Buffer.from('revised source '+i)),careerTextSha256:sha(Buffer.from('revised career '+i)),pages:1,embeddedFiles:0,contactOnlyRedactionVerified:true,materialClaimsVerifiedAgainstSources:true,comparisonReference:'docs/test.md',retainedFields:publicSafeFields,personalPortfolioWebsite:portfolioWebsite});
    files.push({path,sha256:sha(bytes),sourceSha256:sha(original),reviewedSourceSha256:revisions.at(-1).reviewedSourceSha256,variant,
      publicFields:variant === 'original' ? originalFields : publicSafeFields});
    await writeFile(join(root,path),bytes);
  }
  const approval = {schemaVersion:1,status:'approved',approvedBy:owner,approvedAt:'2026-10-08T00:00:00Z',
    approvalReference:'TEST FIXTURE ONLY: synthetic consent',publicationTargets,files};
  await writeFile(join(root,'docs/resumes.json'),JSON.stringify(sources));
  await writeFile(join(root,'docs/resume-release-candidates.json'),JSON.stringify({schemaVersion:1,files:candidates}));
  await writeFile(join(root,'docs/resume-release-approval.json'),JSON.stringify(approval));
  await writeFile(join(root,'docs/resume-revised-candidates.json'),JSON.stringify({schemaVersion:1,files:revisions}));
  await writeFile(join(root,'index.html'),requiredFilenames.map(n => '<a href="/assets/resumes/'+n+'" download="'+n+'">CV</a>').join('\n')+resumeLinks.map(u=>'<a href="'+u+'">Public reference</a>').join('\n'));
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
test('impossible calendar dates and future approval timestamps are refused',async t=>{
 for(const approvedAt of ['2026-02-31T00:00:00Z','2030-01-01T00:00:00Z']){
  const root=await fixture(t);await edit(root,'docs/resume-release-approval.json',a=>{a.approvedAt=approvedAt;});
  const result=await checkRelease(root,{now:()=>new Date('2026-10-09T12:00:00Z')});
  assert.equal(result.eligible,false);assert.ok(result.errors.some(e=>e.code==='OWNER_CONSENT'));
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


test('missing public profile/project links fail closed',async t=>{
 const root=await fixture(t);const path=join(root,'index.html');
 await writeFile(path,(await readFile(path,'utf8')).replace('href="'+resumeLinks[1]+'"','href="https://example.invalid"'));
 await blocked(root,'REQUIRED_LINK');
});
test('matching consent cannot approve corrupt or linkless PDF bytes',async t=>{
 for(const bytes of [Buffer.from('%PDF-1.7\ncorrupt'),await fakePdf('no annotations',[])]){
  const root=await fixture(t),path='assets/resumes/'+requiredFilenames[0];await writeFile(join(root,path),bytes);
  await edit(root,'docs/resume-release-candidates.json',a=>{a.files[0].sha256=sha(bytes);a.files[0].bytes=bytes.length;});
  await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].sha256=sha(bytes);});
  await blocked(root,'PDF_CONTRACT');
 }
});
test('release transport fails closed on missing, denied or unavailable destinations',async t=>{
 const root=await fixture(t);assert.equal((await checkRelease(root,{linkProbe:async()=>200})).eligible,true);
 for(const status of [0,301,302,304,307,308,403,404,410,429,503,999,NaN,undefined]){
  const r=await checkRelease(root,{linkProbe:async()=>status});assert.equal(r.eligible,false);assert.ok(r.errors.some(e=>e.code==='LINK_UNVERIFIED'));
 }
});

test('an approved JSON declaration alone is not release authorization',async t=>{
 const root=await fixture(t);
 const result=await checkReleaseContract(root);
 assert.equal(result.eligible,false);
 assert.ok(result.errors.some(e=>e.code==='CONSENT_BINDING'));
 assert.equal(result.consent.externalBindingMatches,false);
 assert.equal(result.consent.humanAuthorizationProven,false);
});
test('missing, invalid or mismatched external manifest bindings fail closed',async t=>{
 const root=await fixture(t);
 for(const approvalManifestSha256 of ['',null,'0'.repeat(64),'not-a-digest']){
  const result=await checkReleaseContract(root,{approvalManifestSha256});
  assert.equal(result.eligible,false);assert.ok(result.errors.some(e=>e.code==='CONSENT_BINDING'));
 }
});
test('any unreviewed manifest-byte edit invalidates the previous binding',async t=>{
 const root=await fixture(t),path=join(root,'docs/resume-release-approval.json');
 const approvalManifestSha256=sha(await readFile(path));
 assert.equal((await checkReleaseContract(root,{approvalManifestSha256})).eligible,true);
 await edit(root,'docs/resume-release-approval.json',a=>{a.approvalReference+=' unreviewed edit';});
 const result=await checkReleaseContract(root,{approvalManifestSha256});
 assert.equal(result.eligible,false);assert.ok(result.errors.some(e=>e.code==='CONSENT_BINDING'));
 // Whitespace also changes exact reviewed bytes; there is no canonicalization
 // that would hide a changed approval file from the external binding.
 await writeFile(path,(await readFile(path,'utf8'))+'\n');
 assert.equal((await checkReleaseContract(root,{approvalManifestSha256})).eligible,false);
});

test('evidence-reviewed revisions require exact revised-source consent',async t=>{
 const root=await fixture(t,'verified-revision');assert.equal((await checkRelease(root)).eligible,true);
 await edit(root,'docs/resume-release-approval.json',a=>{delete a.files[0].reviewedSourceSha256;});
 await blocked(root,'REVISION_CONSENT');
});
test('final revised PDFs require a clickable personal portfolio website',async()=>{
 const missing=await fakePdf('site missing');
 await assert.rejects(()=>inspectPdf(missing,{requirePortfolio:true}),/Missing personal portfolio hyperlink/);
 const bytes=await fakePdf('site present',[...resumeLinks,portfolioWebsite]);
 assert.equal((await inspectPdf(bytes,{requirePortfolio:true})).pages,1);
});
test('revision evidence flags or authentic source inconsistencies fail closed',async t=>{
 for(const field of ['sourceSha256','reviewedSourceSha256','careerTextSha256','materialClaimsVerifiedAgainstSources','retainedFields']){
  const root=await fixture(t);await edit(root,'docs/resume-revised-candidates.json',r=>{r.files[0][field]=null;});await blocked(root,'REVISION_PROVENANCE');
 }
});

test('access-wall verification needs recent exact owner evidence and cannot excuse a 404',async t=>{
 const root=await fixture(t),url=resumeLinks[1],now=()=>new Date('2026-10-08T01:00:00Z');
 const linkProbe=async u=>u===url?999:200;
 assert.equal((await checkRelease(root,{linkProbe,now})).eligible,false);
 await edit(root,'docs/resume-release-approval.json',a=>{a.linkVerifications=[{url,checkedBy:owner,checkedAt:'2026-10-08T00:30:00Z',reference:'SYNTHETIC owner browser evidence',result:'verified_in_browser'}];});
 assert.equal((await checkRelease(root,{linkProbe,now})).eligible,true);
 assert.equal((await checkRelease(root,{linkProbe:async u=>u===url?404:200,now})).eligible,false);
 assert.equal((await checkRelease(root,{linkProbe,now:()=>new Date('2026-10-10T01:00:00Z')})).eligible,false);
});

test('authorized Work browser evidence records its actual actor and never implies human consent',async t=>{
 const root=await fixture(t),url=resumeLinks[1],now=()=>new Date('2026-10-08T01:00:00Z');
 const linkProbe=async u=>u===url?999:200;
 await edit(root,'docs/resume-release-approval.json',a=>{a.linkVerifications=[{url,checkedBy:'work_browser_operator',checkedAt:'2026-10-08T00:30:00Z',reference:'SYNTHETIC Work browser evidence',result:'verified_in_browser'}];});
 const result=await checkRelease(root,{linkProbe,now});
 assert.equal(result.eligible,true);assert.equal(result.consent.humanAuthorizationProven,false);
 assert.equal(result.links.find(r=>r.url===url).verification.checkedBy,'work_browser_operator');
 for(const status of [404,410,503])assert.equal((await checkRelease(root,{linkProbe:async u=>u===url?status:200,now})).eligible,false);
 assert.equal((await checkRelease(root,{linkProbe,now:()=>new Date('2026-10-10T01:00:00Z')})).eligible,false);
 await edit(root,'docs/resume-release-approval.json',a=>{a.linkVerifications[0].checkedBy='unverified_actor';});
 assert.equal((await checkRelease(root,{linkProbe,now})).eligible,false);
 await edit(root,'docs/resume-release-approval.json',a=>{a.linkVerifications[0].checkedBy='work_browser_operator';a.linkVerifications[0].reference=' ';});
 assert.equal((await checkRelease(root,{linkProbe,now})).eligible,false);
});

test('embedded and automatic-action PDFs are rejected even with matching manifest hashes',async t=>{
 for(const mode of ['attachment','action','missing-link']){
  const root=await fixture(t),path='assets/resumes/'+requiredFilenames[0];
  const doc=await PDFDocument.load(await readFile(join(root,path)));
  if(mode==='attachment')await doc.attach(Buffer.from('SYNTHETIC confidential bytes'),'hidden.txt');
  if(mode==='action')doc.catalog.set(PDFName.of('OpenAction'),doc.context.obj({S:'JavaScript',JS:PDFString.of('void(0)')}));
  if(mode==='missing-link')doc.getPages()[0].node.delete(PDFName.of('Annots'));
  const bytes=Buffer.from(await doc.save({useObjectStreams:false}));await writeFile(join(root,path),bytes);
  await edit(root,'docs/resume-release-candidates.json',a=>{a.files[0].sha256=sha(bytes);a.files[0].bytes=bytes.length;});
  await edit(root,'docs/resume-release-approval.json',a=>{a.files[0].sha256=sha(bytes);});await blocked(root,'PDF_CONTRACT');
 }
});
