import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const tag='<script type="text/javascript">';
const begin=html.indexOf(tag);
const end=html.indexOf('</script>',begin+tag.length);
const snippet=begin>=0 && end>begin ? html.slice(begin+tag.length,end) : null;
assert.ok(snippet,'Clarity bootstrap snippet required');

function injectedOrigins(hostname){
 const inserted=[];
 const document={
  createElement:()=>({async:false,src:''}),
  getElementsByTagName:()=>[{parentNode:{insertBefore:el=>inserted.push(el.src)}}],
 };
 runInNewContext(snippet,{location:{hostname},window:{},document});
 return inserted;
}

test('local and loopback preview sessions do not contact external analytics',()=>{
 for(const hostname of ['localhost','127.0.0.1','::1','[::1]'])
  assert.deepEqual(injectedOrigins(hostname),[]);
});
test('production hostname still injects real analytics bootstrap',()=>{
 assert.deepEqual(injectedOrigins('evannaraya.com'),['https://www.clarity.ms/tag/z8qv8i57p5']);
});
