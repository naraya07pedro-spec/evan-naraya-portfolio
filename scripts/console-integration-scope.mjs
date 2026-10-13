import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
export const consoleScope=JSON.parse(readFileSync(new URL('../docs/console-integration/scope.json',import.meta.url),'utf8'));
export const sha256=value=>createHash('sha256').update(value).digest('hex');
function undo(source,edits){
 for(const edit of [...edits].reverse()){
  assert.equal(source.split(edit.after).length-1,edit.occurrences,'Unexpected reviewed replacement count');
  source=source.replaceAll(edit.after,edit.before);
 }
 return source;
}
export function restoreReviewedPR(source){
 assert.equal(sha256(source),consoleScope.integratedHTMLSHA256,'Unreviewed Console HTML change');
 const before=undo(source,consoleScope.consoleEdits);
 assert.equal(sha256(before),consoleScope.prHTMLSHA256,'Console changes exceed the reviewed PR scope');return before;
}
export function restorePortfolioMain(source){
 const main=undo(restoreReviewedPR(source),consoleScope.positioningEdits);
 assert.equal(sha256(main),consoleScope.mainHTMLSHA256,'Positioning changes exceed reviewed PR #2');return main;
}
