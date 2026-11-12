import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicLinkUrls} from '../scripts/public-link-urls.mjs';

test('does not treat preconnect roots or inline JS fragments as broken public links', () => {
 const html='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
   '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">'+
   '<script>let t={};t.src="https://www.clarity.ms/tag/"+id;</script>'+
   '<script src="https://cdn.example.net/real.js"></script>'+
   '<a href="https://example.org/recruiter">Portfolio</a>';
 assert.deepEqual(publicLinkUrls(html),[
   'https://cdn.example.net/real.js',
   'https://example.org/recruiter',
   'https://fonts.googleapis.com/css2?family=Inter'
 ]);
});
test('keeps dead user-facing and markdown links eligible for HTTP 404 checks', () => {
 const html='<a href="https://example.org/missing">Missing</a><link rel="canonical" href="https://example.org/">';
 const urls=publicLinkUrls(html,['[old demo](https://example.org/missing)', '[details](https://example.org/details)']);
 assert.deepEqual(urls,['https://example.org/','https://example.org/details','https://example.org/missing']);
});
test('recognizes preconnect even when rel is not first and preserves actual scripts',()=>{
 const urls=publicLinkUrls('<link href="https://fonts.gstatic.com" crossorigin rel="preconnect"><script src="https://cdn.example.org/runtime.js"></script>');
 assert.deepEqual(urls,['https://cdn.example.org/runtime.js']);
});
