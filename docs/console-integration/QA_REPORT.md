# QA report

Status: **PASS for inspected implementation commit `0449b1065564502e1f0a53a60aea33e9333990fb`; owner production approval remains separate.** All three actual workflows succeeded. [Machine-readable inspection receipt](CI_VERIFICATION.json) binds run/job IDs, source/checkout commits, counts, artifact metadata and actual log excerpts.

Executed on 13 October 2026: `npm run verify` passed 51 tests with zero skips/failures. Known-pattern scanning found no credential match. Before the workspace reset, Chromium E2E passed 9 tests/subtests; responsive QA passed 280 states across 20 width/height pairs and both motion preferences. Nine-viewport Console QA passed 27 protected comparisons, 18 new frames, two axe scans and actual H.264 playback, with maximum registered residual 0.03866%. Selected authentic captures survived in Git; complete transient local reports did not. Final CI supplies inspectable current-source reports.

Local standard Playwright download returned invalid ZIPs. Earlier local Chromium used the Console's installed browser distribution. Local Firefox execution is not claimed. Actions installs/runs standard Chromium and Firefox.

## Corrections and scope

The inherited V13 content test rejected PR #2's intended positioning. A narrow inverse manifest now verifies main → positioning → Console and rejects unrelated changes. Historical baselines were not regenerated. Browser selectors retain the original Agent target.

QA stalled waiting for an offscreen lazy image; the helper was corrected. Axe found new label/footer contrast and caption-link issues; scoped fixes passed affected checks. Screenshot width/title size were corrected after actual desktop overlap was seen. Runtime animations and approved CV bytes remained unchanged.

Before is exact PR #2 `a82ec7c268dc0d909c3cd3f64222bbd66bd3cae6`. Protected source comparison covers full hero and old architecture devices within each engine. Only decorative page-progress is hidden in both comparison captures. Raster registration permits at most one pixel for fractional scroll offsets, separately bound by device geometry; the existing 0.05% residual tolerance remains. Original screenshots are retained. New Console captures show the current actual local/hosted page. Netlify controls remain visible in hosted frames, which are not confused with local golden comparisons.

## CI and hosted execution

Quality runs contracts, two-engine interactions and Console QA at nine viewports, 98 business captures, 560 responsive states, dependency/known-secret checks, original-source/current Lighthouse and FULL/PATCH packaging. Hosted safety verifies deployed public asset hashes/links, downloaded PDF integrity/parsing, interactions, responsive captures and real demo playback. Actual results must be inspected; workflow YAML alone is not proof.

Console review independently redownloaded both final CI artifacts: archive digests, 59 source and 16 selected Git PNG fingerprints match. Reports confirm 58 system checks, 10 browser cases per environment, 10 Docker smoke outcomes and zero failures/skips/flakes. The preserved original recording matches its Docker ZIP bytes. FFprobe/actual frames/playback were inspected; no generated video is used.

Lighthouse is controlled lab evidence, not field INP or recruiter conversion. No physical-device, Safari, accessibility certification, live LLM evaluation, customer traffic or ROI claim. Main refs and Netlify production are checked separately. Supplemental backup upload remains quota-blocked; primary proof remains in Git. Owner approval is required for merge/release; CVs and LinkedIn were not replaced/modified.


## Inspected implementation runs

- [Quality 38363444897](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/actions/runs/38363444897): 51 contracts, 16 browser tests/subtests, 54 protected comparisons, 36 Console frames, four axe scans, two real demo playbacks, 98 business captures, and three passing responsive test groups. Zero failures/skips. Maximum registered visual residual 0.03866%, within 0.05%.
- [Hosted safety 38363444812](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/actions/runs/38363444812): 16 browser tests/subtests, the same Console metrics, 14 hosted viewport runs/98 states/14 full-page captures, 560 responsive states, four downloaded PDFs parsed/rendered and zero unexpected console/network findings. Twenty-eight narrowly classified existing Firefox hosting warnings remain recorded; they were not hidden or described as zero warnings.
- [Release eligibility 38363445045](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/actions/runs/38363445045): passed for unchanged approved CV assets and consent.

Netlify deploy `6acddedd4cad2bdcce7b0a93` is ready for exact head `0449b106…` in deploy-preview context. Direct GET inspection matched CSS, runtime JS, dashboard, both video formats and both approved PDFs byte for byte. Hosted HTML differs only by a 221-character insertion loading Netlify's relative CDP script; source markup is not replaced. Production deploy remains `6acb913bc3af350008ff9df4` at main `3d7e1c47…`.

The initial combined artifacts are approximately 466/472 MB. Preview artifact download timed out twice, so the workflows now also publish compact reports, two actual frames and source packages separately. Final compact artifact collection/package validation and the latest-head rerun are recorded in the PR after inspection. Large ZIP hashes in the receipt are GitHub-reported metadata, not a claim of independent full-download verification.
