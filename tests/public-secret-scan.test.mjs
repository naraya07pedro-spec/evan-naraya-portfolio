import {test} from 'node:test';import assert from 'node:assert/strict';import {credentialKinds} from '../scripts/scan-public-secrets.mjs';
test('credentials and signed URLs are rejected without printing their values',()=>{
 const cases=[['githubToken','gh'+'p_'+'a'.repeat(36)],['privateKey','-----BEGIN '+'PRIVATE KEY-----'],['providerKey','s'+'k-'+'a'.repeat(30)],['persistedSession','ops_'+'session='+'a'.repeat(40)],['signedStorageURL','https://example.blob.core.windows.net/evidence?sv=1&'+'sig='+'a'.repeat(40)]];
 for(const [kind,value]of cases)assert.deepEqual(credentialKinds(value),[kind]);assert.deepEqual(credentialKinds('Synthetic operator@example.test; public GitHub source link'),[]);
});
