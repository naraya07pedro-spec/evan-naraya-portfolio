# Console portfolio evidence

Reviewed 13 October 2026. [Console PR #1](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/pull/1) remains unmerged at `654ce3b762f45a126ff844604daf0d830e54bf21`. Independently inspected [CI run 38337575725](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/actions/runs/38337575725) passed both native and Docker jobs. No material Console application defect was found; no features were added.

| Claim | Exact proof |
| --- | --- |
| Working frontend/API/database/worker and deterministic HTTP integration | [Reviewed source](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21), [architecture](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/docs/ARCHITECTURE.md), [API](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/docs/API.md) |
| 58 system checks; zero failures/skips | Unmodified downloaded [native report](reports/native-system.json), [named system tests](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/tests/integration/system.test.ts) |
| 10 browser cases in each environment; zero skips/flakes | [Native browser report](reports/native-browser.json), [Docker browser report](reports/docker-browser.json), [test source](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/tests/e2e/console.spec.ts) |
| 10 actual Docker HTTP smoke outcomes | [Smoke report](reports/docker-smoke.json), [compiled-runtime checks](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/scripts/container-smoke.mjs) |
| Authentication/owner checks, duplicate admission, retries/timeouts, worker loss/recovery and approval rejection | Named outcomes in the reports and [Console evidence index](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/docs/EVIDENCE.md) |
| Scoped coverage and zero reported Console dependency vulnerabilities | [Coverage](reports/coverage-summary.json), [advisory response](reports/dependency-audit.json); frontend/process launchers excluded from coverage |
| Authentic dashboard/configuration/history/approval/failure/recovery/rejection | [Unchanged dashboard](../../assets/projects/operations-console/dashboard.png), [desktop/mobile gallery](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21/docs/screenshots), original walkthrough below |
| Important recording retained before CI expiration | [Original Docker WebM](../../assets/projects/operations-console/workflow-demo-original.webm), [browser-compatible MP4](../../assets/projects/operations-console/workflow-demo.mp4), [provenance and hashes](provenance.json) |
| Artifact/source identity independently checked | [Archive inspection](archive-inspection.json): 59 source and 16 selected Git PNG fingerprints matched |
| Bounded portfolio changes; portrait, motion, old projects, CVs, consent and historical evidence preserved | [Exact inverse edit scope](scope.json), [contracts](../../tests/console-integration.test.mjs), [legacy content check](../../tests/business-proof.test.mjs) |
| Authentic portfolio before/after and current browser behavior | [Selected captures](../screenshots/console-integration/README.md), [comparison runner](../../scripts/console-integration-qa.mjs), [browser tests](../../tests/browser.test.mjs), [responsive tests](../../tests/responsive.test.mjs), [actual QA results](QA_REPORT.md) |
| Recruiter presentation without invented experience or customers | [Case study](CASE_STUDY.md), [prepared LinkedIn copy](LINKEDIN_COPY.md), sandbox disclosure in [page](../../index.html) |

CI checked out review merge `3c20bc4f6d45bdc75b1c4a33189e3d06e237f2c1`, distinct from the PR source head. Inventory SHA256: `64902bbd414e6d98f2fb6c70706fcbd4a8bae72db6ce1ed4a511047f9b8112ee`.

[Native artifact 11785830003](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/actions/runs/38337575725/artifacts/11785830003) ZIP SHA256 `539b1cc061738c8ff5c0098cfaa480adfba35132614ac46f4d57c0943186af22`, expires 27 October 2026 02:37:59 UTC. [Docker artifact 11785064841](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/actions/runs/38337575725/artifacts/11785064841) ZIP SHA256 `b0bd8d542eba1056b931969963ed1d6add90afc67ee07f4fa760c6b336046783`, expires 27 October 02:37:53 UTC. Both downloaded digests matched; selected reports are copied unchanged.

The Docker clip is 15.56 seconds, 1440 × 1000, VP9 at 25 fps. Its H.264 CRF18/yuv420p/faststart derivative preserves duration, dimensions, frame rate and speed. FFprobe, extracted frames and browser playback were inspected. Native desktop is a distinct 12.44-second recording. Fixture records are synthetic saved executions, not customer usage.

Raw browser traces/storage, login request bodies, signed download URLs, container logs and bulky HTML reports were excluded from public preservation. Visual inspection and known-pattern checks found no exposed credentials in selected evidence; this is not universal secret detection. Asset/report hashes bind exact preserved bytes.

A supplemental 12,280,118-byte, 48-file private backup upload was rejected because file-storage quota was full. The important original demo, dashboard, reports and selected portfolio captures are retained in Git independently of that backup and CI expiration. Earlier Console CI_VERIFICATION.json describes implementation run 38336697920; its durations/captures are not substituted for the final-head run inspected here.

The AI provider is deterministic, not a live production LLM. Ownership is per user, self-approval is allowed, and sandbox deduplication is process-local. No customer deployment, universal exactly-once delivery, ROI, traffic or live LLM quality is claimed. [Known limitations](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/blob/654ce3b762f45a126ff844604daf0d830e54bf21/docs/KNOWN_LIMITATIONS.md). No merge or production deployment was initiated.


## Portfolio implementation CI

[Verified receipt](CI_VERIFICATION.json) links exact successful quality, hosted and release runs for implementation head `0449b1065564502e1f0a53a60aea33e9333990fb`. It preserves actual log excerpts and explicitly separates metadata-reported large ZIP digests from independent digest checks. The subsequent change adds compact evidence packaging and this receipt; application HTML/CSS/JS remain identical. Latest-head checks and final artifact inspection are linked in [draft PR #2](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/2).
