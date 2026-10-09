import {readFile, lstat, realpath, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {inspectPdf,resumeLinks} from './pdf-contract.mjs';

export const owner = 'naraya07pedro-spec';
export const requiredFilenames = [
  'Evan_Naraya_CV_Automation_Integration_2026_v3.pdf',
  'Evan_Naraya_CV_Backend_Integration_Python_2026_v3.pdf'
];
export const publicSafeFields = ['name','role','location_timezone','github_profile','linkedin_profile','website'];
export const originalFields = [...publicSafeFields,'personal_phone','personal_email'];
export const publicationTargets = ['public_github_repository','netlify_deploy_preview','netlify_production_site'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const validHash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const sameFields = (actual, expected) => Array.isArray(actual) &&
  actual.length === expected.length && new Set(actual).size === actual.length &&
  expected.every(field => actual.includes(field));
const validDate = value => typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) && Number.isFinite(Date.parse(value));

// Verifies recorded consent and exact reviewed bytes, not a person's intent.
// Owner review and protected-main required checks enforce that human decision.
export async function checkRelease(root = '.', {linkProbe,now=()=>new Date()} = {}) {
  const errors = [], assets = [];
  const block = (code, message) => errors.push({code, message});
  root = await realpath(resolve(root));
  async function json(path) {
    try { return JSON.parse(await readFile(resolve(root, path), 'utf8')); }
    catch { block('INVALID_MANIFEST', path + ' is missing or invalid JSON'); return null; }
  }
  const originals = await json('docs/resumes.json');
  const candidates = await json('docs/resume-release-candidates.json');
  const revisions = await json('docs/resume-revised-candidates.json');
  const approval = await json('docs/resume-release-approval.json');
  let html = '';
  try { html = await readFile(resolve(root, 'index.html'), 'utf8'); }
  catch { block('MISSING_PAGE', 'index.html is missing'); }
  if (!Array.isArray(originals) || originals.length !== requiredFilenames.length ||
      new Set(originals.map(r => r?.filename)).size !== requiredFilenames.length ||
      originals.some(r => !r || !requiredFilenames.includes(r.filename)))
    block('SOURCE_SET', 'Exactly the two authentic v3 source records are required');
  if (candidates?.schemaVersion !== 1 || !Array.isArray(candidates.files) ||
      candidates.files.length !== requiredFilenames.length ||
      new Set(candidates.files.map(r => r?.sourceFilename)).size !== requiredFilenames.length ||
      candidates.files.some(r => !r || !requiredFilenames.includes(r.sourceFilename)))
    block('CANDIDATE_SET', 'Exactly the two reviewed contact-redacted candidate records are required');
  if(revisions?.schemaVersion!==1||!Array.isArray(revisions.files)||revisions.files.length!==requiredFilenames.length||
     new Set(revisions.files.map(r=>r?.sourceFilename)).size!==requiredFilenames.length||
     revisions.files.some(r=>!requiredFilenames.includes(r?.sourceFilename)))block('REVISION_SET','Exactly two evidence-reviewed revised candidate records are required');
  if (approval?.schemaVersion !== 1 || approval.status !== 'approved' ||
      approval.approvedBy !== owner || !validDate(approval.approvedAt) ||
      typeof approval.approvalReference !== 'string' || !approval.approvalReference.trim())
    block('OWNER_CONSENT', 'Exact files and public field categories await recorded owner approval');
  if (!sameFields(approval?.publicationTargets, publicationTargets))
    block('PUBLICATION_CONSENT', 'Approval must cover the public repository, preview and eventual production site; merging still needs separate approval');
  const approvedFiles = Array.isArray(approval?.files) ? approval.files : [];
  if (approvedFiles.length !== requiredFilenames.length ||
      new Set(approvedFiles.map(r => r?.path)).size !== requiredFilenames.length ||
      approvedFiles.some(r => !r || !requiredFilenames.some(name => r.path === 'assets/resumes/' + name)))
    block('APPROVAL_SET', 'Owner approval must name each required release path exactly once');
  try {
    const entries = await readdir(resolve(root, 'assets/resumes'));
    if (entries.some(name => !requiredFilenames.includes(name)))
      block('UNAPPROVED_ASSET', 'Resume directory contains an asset outside the two approved release paths');
  } catch { block('MISSING_DIRECTORY', 'Resume asset directory is missing'); }

  for (const filename of requiredFilenames) {
    const path = 'assets/resumes/' + filename;
    const source = Array.isArray(originals) ? originals.find(r => r?.filename === filename) : null;
    const candidate = Array.isArray(candidates?.files) ? candidates.files.find(r => r?.sourceFilename === filename) : null;
    const revision = Array.isArray(revisions?.files) ? revisions.files.find(r=>r?.sourceFilename===filename) : null;
    const consent = approvedFiles.find(r => r?.path === path);
    if (!source || source.path !== path || !validHash(source.sha256) ||
        !Number.isSafeInteger(source.bytes) || source.bytes < 1 || source.pages !== 1 || !validHash(source.careerTextSha256))
      block('SOURCE_PROVENANCE', filename + ': authentic source provenance is invalid');
    if (!candidate || candidate.sourceSha256 !== source?.sha256 ||
        !validHash(candidate.sha256) || !validHash(candidate.careerTextSha256) || candidate.careerTextSha256 !== source?.careerTextSha256 ||
        !Number.isSafeInteger(candidate.bytes) || candidate.bytes < 1 || candidate.pages !== 1 ||
        candidate.careerTextAndCoordinatesUnchanged !== true || candidate.careerPixelsUnchangedAt144Dpi !== true ||
        candidate.identityStackPixelsUnchanged !== true || candidate.allSixLinksPreserved !== true ||
        candidate.phoneAndEmailAbsentInDecodedObjects !== true || candidate.embeddedFiles !== 0 ||
        !sameFields(candidate.retainedFields, publicSafeFields))
      block('CANDIDATE_PROVENANCE', filename + ': contact-only derivative verification is invalid');
    if(!revision||revision.releasePath!==path||revision.sourceSha256!==source?.sha256||
       !validHash(revision.sha256)||!validHash(revision.reviewedSourceSha256)||!validHash(revision.careerTextSha256)||
       !Number.isSafeInteger(revision.bytes)||revision.bytes<1||revision.pages!==1||revision.embeddedFiles!==0||
       revision.contactOnlyRedactionVerified!==true||revision.materialClaimsVerifiedAgainstSources!==true||
       typeof revision.comparisonReference!=='string'||!revision.comparisonReference.startsWith('docs/')||
       !sameFields(revision.retainedFields,publicSafeFields))block('REVISION_PROVENANCE',filename+': revised evidence/public-field provenance is invalid');
    let bytes;
    try {
      const absolute = resolve(root, path);
      const info = await lstat(absolute);
      if (!info.isFile() || info.isSymbolicLink() || await realpath(absolute) !== absolute) throw new Error('unsafe path');
      bytes = await readFile(absolute);
    } catch { block('MISSING_ASSET', filename + ': missing, non-regular or symlinked release asset'); continue; }
    const sha256 = digest(bytes);
    const variant = sha256 === source?.sha256 ? 'original' : sha256 === candidate?.sha256 ? 'contact-redacted' : sha256===revision?.sha256?'verified-revision':null;
    assets.push({path, bytes: bytes.length, sha256, variant});
    if (bytes.subarray(0,5).toString() !== '%PDF-') block('NOT_PDF', filename + ': invalid PDF signature');
    try {Object.assign(assets.at(-1),await inspectPdf(bytes));}
    catch {block('PDF_CONTRACT',filename + ': invalid PDF, active/embedded data, or missing/unsafe clickable profile/project links');}
    if (!variant) block('ASSET_MISMATCH', filename + ': bytes are neither authentic original nor verified contact-only candidate');
    const expected = variant === 'original' ? source : variant==='verified-revision'?revision:candidate;
    if (variant && bytes.length !== expected.bytes) block('SIZE_MISMATCH', filename + ': reviewed file size differs');
    if (!consent || consent.sha256 !== sha256 || consent.sourceSha256 !== source?.sha256 || consent.variant !== variant)
      block('FILE_CONSENT_MISMATCH', filename + ': approval does not bind these exact bytes and authentic source');
    if(variant==='verified-revision'&&consent?.reviewedSourceSha256!==revision.reviewedSourceSha256)
      block('REVISION_CONSENT',filename+': approval must also identify the inspected revised source');
    if (variant && !sameFields(consent?.publicFields, variant === 'original' ? originalFields : publicSafeFields))
      block('FIELD_CONSENT', filename + ': public field consent is missing, duplicated or differs from the selected file');
    const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]);
    if (!anchors.some(tag => tag.includes('href="/' + path + '"') && tag.includes('download="' + filename + '"')))
      block('DOWNLOAD_REFERENCE', filename + ': download link does not identify the reviewed release asset');
  }
  for(const url of resumeLinks){
    if(!html.includes('href="'+url+'"'))block('REQUIRED_LINK', 'Required public profile/project destination is missing from the page: '+url);
  }
  const links=[];
  // Unit tests inject transport. Production release checks use actual requests.
  // No network/private fixture dependency in ordinary deterministic quality.
  if(linkProbe&&errors.length===0){
    for(const url of [...resumeLinks,'https://varevant.com']){
      const status=await linkProbe(url);links.push({url,status});
      const manual=approval?.linkVerifications?.find(r=>r?.url===url);
      const age=now().getTime()-Date.parse(manual?.checkedAt);
      // An access wall is not a 404. Require recent, referenced OWNER evidence
      // of a real browser check; never infer that evidence or exempt broken URLs.
      const attested=[403,429,999].includes(status)&&manual?.checkedBy===owner&&validDate(manual?.checkedAt)&&
        age>=0&&age<=24*60*60*1000&&manual?.result==='verified_in_browser'&&
        typeof manual?.reference==='string'&&manual.reference.trim().length>0;
      if(attested)links.at(-1).verification='recorded owner browser verification';
      else if(status<200||status>=400)block('LINK_UNVERIFIED','Required destination did not verify successfully ('+status+'): '+url);
    }
  }
  return {eligible: errors.length === 0, owner, assets, links, errors};
}
