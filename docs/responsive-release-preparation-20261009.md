# Authorized release preparation — 9 October 2026

The failed blanket `top:32%` mobile proposal is replaced by a content-sized hero column: the name and role flow with a 16px gap. The portrait reserves space below measured text, including the maximum original animation scale. When a short viewport cannot contain a readable portrait and the text, the intro uses normal document flow. Reduced motion presents text and portrait sequentially. Work, Skills and Contact remain directly accessible in the mobile header.

Tablet portrait size and placement come from the measured gap between name and role columns. On wide desktop, the role column clears the original portrait's right edge; the portrait, type scale, dark-violet composition and circular transition remain. Project frames switch from sticky to document flow only when their measured copy, diagram and padding cannot fit the viewport. This prevents important content being clipped while keeping the existing choreography where it fits. No project or marketing text was changed.

Toolbar label foreground is `#79768c` against `#080910`: relative-luminance contrast **4.525627:1**. Relevant axe checks compare against the immutable source baseline; this is not a comprehensive WCAG AA certification.

## Evidence and regression scope

`docs/baseline.json`, `scripts/visual-regression.mjs` and the existing `docs/qa` archive retain their bytes. The accepted source remains a4634a0e4161ca8667c873cc4f26c5c65041dca0 and its historical 98 comparisons remain historical evidence. The old `test:visual` command is available to inspect that historical comparison; intentionally changed current rendering does not claim to pass an unchanged zero-layout-difference expectation.

`test:visual:responsive` separately records all original→current pixel diffs and verifies current rendering against reviewed c841c02 plus the explicit `responsive-scope.patch`. This source patch is not a regenerated screenshot baseline and must not be silently refreshed for later changes. The same 0.05% raster tolerance applies. Local Chromium's 49 slots have 32 nonzero actual historical comparisons, max 34.901953%, and max residual 0.034799% against the scoped reference. Differences include the authorized mobile reflow, tablet/wide role clearance, short project flow and toolbar color. CI executes both browsers' 98 slots; final results belong to the PR head's Actions artifacts.

The responsive suite covers 20 width/height pairs: 320×480/800, 360×640/900, 375×667/812, 390×667/844, 430×600/932, 600×600/800, 760×600/900, 768×600/1024, 1024×600/900, 1440×600/900. Both normal and reduced motion cover entry animation plus hero, exit, statement, circular transition, both flagship projects and contact. Assertions check name/role clearance, portrait/text geometry including opaque portrait pixels on desktop, overflow, frame clipping, navigation and media-preference changes. Screenshots and JSON stay in CI artifacts; no new bulk QA output or private resume data is tracked.

Local results before push: 32 structural/contract/classifier tests pass; 9 Chromium interaction tests pass; the 40-configuration responsive matrix passes, followed by the updated tablet/desktop opaque-pixel checks; 49 scoped visual comparisons pass. Local Firefox installation was unavailable, so cross-engine acceptance requires the actual final-head CI outcomes.

## PDF and publication boundary

The new [`resume-revised-candidates.json`](resume-revised-candidates.json) records exact private candidates and their authentic/revised sources. See [selection and owner consent](resume-candidate-review-20261009.md). It does not replace or approve the release assets. The existing approval manifest stays byte-for-byte pending.

Quality (`verify`) remains independent from `release-eligibility`. Release checks require exact owner/file/field/destination consent, consistent original and revised provenance, exact approved bytes and sizes, one unencrypted valid PDF page, safe clickable profile/project links, no associated/embedded data or automatic actions, correct download paths, no unexpected resume-directory entries, and verified required destinations. Tests use synthetic real PDFs and injected transport, never private CVs. A referenced recent owner browser check may establish an access-walled URL; it cannot excuse 404/410, missing links or other failures. No manual verification is fabricated.

The current 4,073/3,953-byte public PDFs remain reconstructed stand-ins without clickable PDF links. They are a verified production blocker pending owner-approved replacement; their ordinary download/render checks remain separate from release eligibility. The older private candidates' catalog `/AF` attachment was missed by the earlier name-tree-only review. New final candidates remove it and pass object-level checks. Historical records were not silently rewritten.

## Main protection and exact admin action

Current GitHub branch response: `protected:false`; repository rulesets: `[]`. The protection endpoint returns **403 Resource not accessible by integration**. Enforcement was not activated and no protected write was retried.

An administrator must open Settings → Branches, add a rule targeting **main**, require a PR with at least one approving review, require GitHub Actions checks **verify** and **release-eligibility**, require the branch to be up to date, and enable **Do not allow bypassing the above settings** / enforcement for administrators. Leave force pushes and branch deletion disabled and bypass actors empty. An equivalent Active ruleset may target main with the same requirements and empty bypass list. Confirm the saved rule with administrator access.

PR #1 remains draft. No merge, production deployment, domain change, new site or private resume publication is authorized. Owner approval of the exact recommended PDFs/public fields/destinations and administrator enforcement remain genuine gates. After actual consent, install the approved bytes into the two compatible v3 download paths, update published-asset metadata, rerun release/preview checks and seek separate production approval.
