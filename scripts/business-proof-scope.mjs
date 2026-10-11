import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

export const businessProofScope=JSON.parse(await readFile(new URL('../docs/business-proof-scope.json',import.meta.url),'utf8'));
const hash=text=>createHash('sha256').update(text).digest('hex');

// V13 explicitly authorizes this reviewed content/link delta. It does not
// authorize changing CSS, choreography, portrait, resume bytes or old evidence.
// Require the entire before and after source, not a broad text/pixel exclusion.
export function applyBusinessProofScope(html){
 assert.equal(hash(html),businessProofScope.beforeSha256,'V13 input is not the reviewed complete HTML');
 for(const edit of businessProofScope.edits){
  assert.equal(html.split(edit.before).length-1,edit.occurrences,'V13 intervention count differs');
  html=html.replaceAll(edit.before,edit.after);
 }
 assert.equal(hash(html),businessProofScope.afterSha256,'V13 output differs from the reviewed complete HTML');
 return html;
}
