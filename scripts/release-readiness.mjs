import {mkdir, writeFile} from 'node:fs/promises';
import {checkRelease} from './release-eligibility.mjs';

const result = await checkRelease();
await mkdir('artifacts/release-readiness', {recursive:true});
await writeFile('artifacts/release-readiness/result.json', JSON.stringify(result, null, 2) + '\n');
for (const asset of result.assets) console.log(asset.path + ': ' + (asset.variant || 'unapproved bytes'));
for (const error of result.errors) console.error('BLOCKED [' + error.code + '] ' + error.message);
console.log(result.eligible ? 'Release eligibility passed; production merge still requires owner authorization.' : 'Production release is NOT eligible. Quality CI is a separate check.');
if (!result.eligible) process.exitCode = 1;
