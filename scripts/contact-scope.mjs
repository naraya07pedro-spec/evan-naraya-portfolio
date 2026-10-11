import assert from 'node:assert/strict';

// This is the exact contact correction already recorded in ab30c4f. It changes
// only the two reviewed mailto attributes; it cannot authorize future copy,
// layout or contact changes. The caller still compares all product bytes.
export function applyApprovedContactScope(html) {
  const original='href="mailto:evan@varevant.com"';
  const approved='href="mailto:evannarayahp@gmail.com"';
  const mailtoAttributes=html.match(/\bhref\s*=\s*["']mailto:[^"']*["']/gi)||[];
  assert.equal(mailtoAttributes.length,2,'Reviewed source must contain exactly two mailto attributes');
  assert.ok(mailtoAttributes.every(value=>value===original),'Reviewed contact attributes differ from the approved correction');
  return html.replaceAll(original,approved);
}
