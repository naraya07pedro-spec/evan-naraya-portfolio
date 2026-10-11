import {test} from 'node:test';
import assert from 'node:assert/strict';
import {applyApprovedContactScope} from '../scripts/contact-scope.mjs';

const original='<main data-proof="unchanged"><a href="mailto:evan@varevant.com">Email me ↗</a></main><footer><a href="mailto:evan@varevant.com">Email</a></footer>';
const approved='<main data-proof="unchanged"><a href="mailto:evannarayahp@gmail.com">Email me ↗</a></main><footer><a href="mailto:evannarayahp@gmail.com">Email</a></footer>';

test('the approved correction preserves every byte outside the two mailto values',()=>{
  assert.equal(applyApprovedContactScope(original),approved);
});

test('missing or extra contact attributes require a new scope decision',()=>{
  for(const source of [original.replace('href="mailto:evan@varevant.com"',''),original+'<a href="mailto:evan@varevant.com">Extra</a>']){
    assert.throws(()=>applyApprovedContactScope(source),/exactly two mailto attributes/);
  }
});

test('unexpected email addresses and alternative attribute forms are rejected',()=>{
  for(const source of [original.replace('evan@varevant.com','unapproved@example.invalid'),original.replace('href="mailto:evan@varevant.com"',"href='mailto:evan@varevant.com'")]){
    assert.throws(()=>applyApprovedContactScope(source),/differ from the approved correction/);
  }
});

test('the expected bytes still reject unrelated product changes and future contact edits',()=>{
  const expected=applyApprovedContactScope(original);
  assert.notEqual(expected,approved.replace('data-proof="unchanged"','data-proof="unsupported claim"'));
  assert.notEqual(expected,approved.replace('evannarayahp@gmail.com','another@example.invalid'));
});
