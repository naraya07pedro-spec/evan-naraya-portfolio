import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Quality preserves visual evidence. Publication consent belongs exclusively
// to release eligibility; freezing its pending bytes would prevent a real
// owner decision from passing otherwise unchanged quality checks.
export async function verifyHistoricalEvidence(root='.',reviewed='c841c02bac94ad957ef2112f43f6728aad5d1baa') {
  const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:4*1024*1024});
  const archive=git(['ls-tree','-r','--name-only',reviewed,'docs/qa']).toString().trim().split('\n').filter(Boolean);
  const paths=['docs/baseline.json','scripts/visual-regression.mjs','assets/images/evan-naraya-portrait.webp',...archive];
  for(const path of paths)
    assert.ok((await readFile(resolve(root,path))).equals(git(['show',reviewed+':'+path])),'Historical evidence bytes changed: '+path);
  return paths;
}
