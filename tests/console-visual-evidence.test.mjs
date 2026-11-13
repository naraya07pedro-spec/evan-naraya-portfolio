import {test} from 'node:test';
import assert from 'node:assert/strict';
import {summarizeProtectedVisualComparisons,PROTECTED_VISUAL_MAX_RATIO} from '../scripts/console-visual-evidence.mjs';

const capture=(ratio,state='hero')=>({
  engine:'chromium',viewport:{width:320,height:800},state,ratio,
  comparedPixels:256000,changedPixels:Math.round(ratio*256000),
  registration:{dx:0,dy:0},before:'before.png',after:'after.png',
});

test('diagnostics collect all failed visuals and preserve strict visual threshold',()=>{
 const r=summarizeProtectedVisualComparisons([
  capture(PROTECTED_VISUAL_MAX_RATIO,'hero'),
  capture(0.1338125,'agent'),
  capture(0.08,'knowledge'),
 ],3);
 assert.equal(r.complete,true);
 assert.equal(r.observedCount,3);
 assert.equal(r.failedCount,2);
 assert.equal(r.allowedChangedRatio,0.0005);
 assert.equal(r.maxObservedRatio,0.1338125);
 assert.deepEqual(r.failures.map(x=>x.state),['agent','knowledge']);
 assert.equal(r.failures[0].ratio,0.1338125);
});
test('truncated capture report cannot claim a complete matrix',()=>{
 const r=summarizeProtectedVisualComparisons([capture(0.1338125)],54);
 assert.equal(r.complete,false);
 assert.equal(r.expectedCount,54);
 assert.equal(r.failedCount,1);
});
test('empty or invalid matrix cannot be marked complete',()=>{
 assert.throws(()=>summarizeProtectedVisualComparisons(null,54),TypeError);
 assert.throws(()=>summarizeProtectedVisualComparisons([],0),TypeError);
 assert.equal(summarizeProtectedVisualComparisons([],54).complete,false);
 assert.equal(summarizeProtectedVisualComparisons([capture(Number.NaN)],1).failedCount,1);
});
