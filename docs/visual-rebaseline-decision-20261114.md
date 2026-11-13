# Portfolio visual rebaseline decision: evidence, not automatic approval

**Observed 14 November 2026 (WIB); source artifact captured 13 November 2026.** Status: **BLOCKED: requires explicit owner review and approved new baseline**. This note documents the current review evidence; it does not approve design changes, the PDF release, or publication.

## What actually failed

- Exact PR head: `d4acae62bfc50e20663648f32b1b58393c1c2681` from [PR #22](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/22).
- [Preview safety CI run 43429028565](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/actions/runs/43429028565) failed inside `npm run test:console`, after `test:e2e` passed. [Artifact 14038289394](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/actions/runs/43429028565/artifacts/14038289394) contains actual compared screenshots and `console-integration/results.json`.
- The frozen comparison source is historical PR #2 at `a82ec7c268dc0d909c3cd3f64222bbd66bd3cae6`. At Chromium **320 × 800 hero**, `34256 / 256000 = 13.38125%` changed pixels, 0-pixel registration. This exceeds the unchanged protected maximum **0.05%**.
- Baseline screenshot SHA-256 `081a99014f1f283087288c7fbd7eb7afdf5598cace806d17dd10b7de0d84c167`; preview screenshot SHA-256 `d03f68d279e254b983370f73f73457aacc2e3ca8d87a0431c3684e86fe3977af`. Both are 320 × 800 actual browser captures.
- Inspection indicates a **substantive layout/content revision**: navigation and hero CTA labels differ, role description is expanded, the heading occupies more height, and the portrait shifts/resizes. This is not evidence of a single-pixel renderer malfunction. It also does **not** prove that every change was approved or accessible.

## Diagnostic improvement in this PR

The old `scripts/console-integration-qa.mjs` stopped at the **first** above-threshold screenshot mismatch, leaving most of the planned cross-engine matrix unexecuted. It now:

1. Keeps comparison to the historical immutable reference, the exact `0.0005` maximum ratio, and the existing geometry limit of **1 px**.
2. Collects all obtainable protected screenshots, structural geometry differences and an actual pixel-difference heatmap for each failing same-size comparison.
3. Writes `visualSummary.expectedCount`, `observedCount`, `complete`, `failedCount`, and per-capture evidence into `results.json` even on failure. Partial runs cannot be reported as fully verified.
4. **Fails the same job** if the matrix is incomplete, any protected geometry differs beyond its existing tolerance, or a protected visual ratio exceeds the original limit. This is **not** a baseline update or security exception.
5. Includes unit tests verifying threshold boundary, multiple failures, and incomplete evidence.

The GitHub Actions workflow already uploads `artifacts/console-integration/*.png` and `results.json` using `if: always()`. The new diagnostics extend those artifacts without weakening the required job.

## Owner decision gate: what is still required

- Review representative **before/after/heatmap** pairs across both browser engines and all tested widths, including hero and protected Agent/Knowledge project devices.
- Explicitly decide which layout and interactions are intentional changes and which must be fixed. Rebaseline **only approved states**, using immutable source/screenshot hashes and preserving negative cases/thresholds for future changes.
- Review actual PDF bytes and consent independently. [Resume approval ledger](resume-release-approval.json) binds **specific** asset SHA-256 values. Existing [published-resumes.json](published-resumes.json) and current asset set are not identical to that ledger. PDF inspection, matching file names or general consent to publish career data do **not** replace exact-byte authorization.
- Re-run **Quality, Preview safety and Release readiness** on the **same final head** after the approved baseline and approved CV assets are present. Record run IDs and all relevant job conclusions.

## Stop rules

No automatic rebaseline from whatever happens to deploy. No arbitrary screenshot masking, removal of protected comparisons, downgrading severity, revisioning owner approval on the assistant's authority, or publication of unapproved candidate PDFs. A passing dependency/secret scan is not release eligibility. Default remains **NO MERGE / NO PRODUCTION RELEASE** until separate checks and owner approval are satisfied.

The documented visual finding is a controlled CI observation, not a measurement of user experience, accessibility certification, or evidence that the newer design is preferable.
