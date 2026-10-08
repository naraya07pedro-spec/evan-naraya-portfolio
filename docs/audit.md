# Portfolio engineering audit — 8 October 2026

## Baseline and scope

Production source was re-read from Git at `a4634a0e4161ca8667c873cc4f26c5c65041dca0`. Netlify reported deploy `6ac76d9a8f678c5c17a6cf53` ready and published with the same commit_ref. The production website was opened in the real Cloud Browser, and the live HTML was fetched with TLS validation. Hosting injects an additional Netlify HUD script/comment; it is not repository code.

A recoverable Git/source archive was preserved before product editing. Regular-motion content order, hero composition, typography, colors, spacing, portrait bytes, project diagrams and all interpolation thresholds remain unchanged. No production merge or publication has occurred.

## Findings and corrections

| Classification / severity | Finding and root cause | Location and affected view | Correction / verification |
| --- | --- | --- | --- |
| VERIFIED DEFECT / high | Embedded PDF files were reconstructed lightweight files using approved v3 filenames, not the original approved PDFs. Automation was 4,073 bytes; backend 3,953 bytes. Extracted text omitted the original phone/contact links and used different bullet rendering. | Baseline index.html download links; all widths | Exact original PDFs prepared locally as separate assets: 109,481 and 108,838 bytes. Public upload was blocked by automatic approval review; the safe branch retains existing public PDFs until explicit privacy approval. SHA-256 checks, text/page/metadata review, rendered-page inspection and Chromium/Firefox download tests verify them. |
| REPRODUCED ISSUE / medium | Reduced-motion statement link inherits pointer-events:none because the media rule restores opacity but not interaction. | Baseline .intro-statement / scroll script; desktop and mobile reduced motion | Accessibility-only media rule restores interaction. Browser clicks and live media changes pass. |
| VERIFIED DEFECT / medium | Architecture content overflows on mobile but the scrollable container cannot receive keyboard focus. Axe reports scrollable-region-focusable. | .device-body; 390 px, both diagrams | Named regions with tabindex and inset focus outline. Axe regression checks confirm this violation is removed. |
| REPRODUCED ISSUE / medium | Keyboard can focus a link inside an opacity-zero sticky scene. | .intro-statement, .project-copy; all scene layouts | Focus-triggered scroll brings the existing scene to its readable state. Pointer and ordinary scroll choreography are unchanged. Chromium/Firefox focus tests pass. |
| IMPROVEMENT OPPORTUNITY / medium | Pointer-follow RAF runs continuously at rest. | Original cursor follow loop; fine-pointer desktop | Original easing retained; RAF sleeps at convergence and pauses with media/visibility state. Idle-frame tests pass. |
| IMPROVEMENT OPPORTUNITY / medium | Inline portrait/PDF/CSS/script increase initial document size and prevent independent caching. | Original 190,539-byte index.html; all widths | Original assets extracted without recompression. Current HTML is roughly 16 KB; CSS/JS/photo are independent resources, PDFs are download-only. Image preload preserves early discovery. |
| IMPROVEMENT OPPORTUNITY / medium | Metric evidence links float with main. | Four proof links and proof note | Metric links pin the inspected archive/verification-document revisions. Source/test/CI/limitations map records the exact tested project revisions. |
| VERIFIED DEFECT / medium, deferred | Device-top labels have 4.33:1 contrast where 4.5:1 is required for this small text. | .device-top > b; mobile, visible project states | Changing text colors violates the visual lock. Record and request a separate owner-approved color adjustment. No AA compliance claim. |
| REPRODUCED ISSUE / medium, deferred | Mobile role text intersects the portrait/face area. | .intro-role and .shared-person; 390 px hero screenshot, also review 320/375 | Existing production layout is preserved. Recommend a separately approved placement adjustment; do not redesign silently. |
| IMPROVEMENT OPPORTUNITY / medium, deferred | Main navigation is hidden below 760 px; View work and the resume button remain available. | Original @media max-width:760px | Mobile touch CTA passes. A visible mobile navigation treatment requires owner approval. |
| IMPROVEMENT OPPORTUNITY / low, deferred | Long cinematic travel and small diagram metadata slow a quick visual scan. | Intro 258vh desktop / 225vh mobile; work title 198vh / 178vh | Existing 30-second hero role/stack/GitHub/resume are visible. A new quick-proof path or typography change requires approval. |
| UNVERIFIED | Field INP, actual recruiter conversion, legal eligibility outside Indonesia, live client outcomes and commercial scale. | Portfolio claims | No new claims added. No real recruiter participants were invented. |

Screenshots use `chromium-{width}-{state}` / `firefox-{width}-{state}` naming. The audit capture records the actual production URL; controlled visual regression separately renders the immutable Git baseline. Relevant evidence includes 390-hero, 390-agent, 1440-hero and 1440-planet-expanded.

## Engineering and quality gates

- Dedicated branch: `chore/portfolio-engineering-upgrade-20261008`.
- Local complete-proposal commits: `8d11aa0` and `74b151e` (not published). The safe public branch starts again from the verified production baseline and excludes those private PDF-bearing commits.
- Structure checks: 6 passed.
- Browser checks: 16 passed, 0 failed/skipped, across Chromium and Firefox, including both original PDF hashes in the complete local proposal. Safe public CI verifies the unchanged baseline PDF hashes; the separate original-resume release gate remains blocked.
- Screenshot states: 98 comparisons (2 engines × 7 widths × 7 states), **0 changed pixels** in the executed comparison.
- Full-page images are also retained. Full-page sticky rendering is not a substitute for the seven meaningful viewport states.
- Axe: no new violations against baseline; unfocusable scroll regions removed. Existing contrast failures remain deferred.
- No runtime errors or missing local assets were observed in the executed browser gates.
- npm audit reported zero vulnerabilities in the installed dependency tree at audit time.

The initial Firefox attempt could launch but crashed content processes because the test container forbids nested user-namespace mappings. Rerun inside the already isolated QA container succeeded with the documented opt-in environment setting. CI does not set this override. Direct live-site Firefox initially encountered the runtime proxy's CA trust mismatch; controlled Firefox source regression remains separate from live Chromium audit. Certificate verification was never disabled.

## Performance

The first executed controlled comparison used Lighthouse 13.5.0 against localhost, a fresh browser, the actual cinematic animation enabled, mobile 390×844 with Lighthouse mobile simulation and desktop 1440×900. These are **single-run lab measurements**, not field data.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | --- | --- | --- | --- |
| Performance | 99 | 99 | 75 | 90 |
| Accessibility | 95 | 96 | 100 | 100 |
| Best practices / SEO | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| LCP | 1.614 s | 1.803 s | 1.596 s | 1.728 s |
| CLS | 0 | 0 | 0 | 0 |
| TBT | 0 ms | 0 ms | 290.5 ms | 0.69 ms |
| JavaScript execution | 17.70 ms | 14.12 ms | 15.60 ms | 10.28 ms |
| Initial transferred bytes | 190,749 | 145,795 | 190,749 | 145,795 |

LCP increased in this run after separating resources, although it stayed below the 2.5-second target. Image preload was then added and the final measurement is recorded in the completed release report. Do not treat a one-run score difference as a stable performance guarantee. Field INP was not measured; navigation Lighthouse TBT is not INP. Google's targets are LCP ≤2.5 s, CLS ≤0.1 and INP ≤200 ms at the 75th percentile of real visits ([official definitions](https://web.dev/articles/vitals)).

Blur, grain, sticky geometry and the preserved transition remain visual rendering costs. They were not removed to inflate scores.

## Recruiter review

This is an expert walkthrough, not a user study.

| Review task | Result |
| --- | --- |
| Identify role within 30 seconds | Name, specialization, stack, Indonesia/UTC+7, GitHub and resume are in the existing hero/navigation. No animation wait is needed to reveal the role after the short entry. |
| Find a suitable project within 60 seconds | View work leads to the existing work title. Two flagships have problem/decision/implementation summaries and source links. Long scroll travel remains a documented constraint. |
| Inspect source/tests within 90 seconds | Flagship source links lead to recruiter-oriented repository READMEs. This repository's evidence map provides direct revision-pinned source, architecture, executable tests, CI and limitations. |
| Download current resumes | Both approved originals passed browser download/hash tests locally. Public preview still serves the existing reconstructed PDFs while publication approval is pending. |
| Contact Evan | Existing business email, LinkedIn and GitHub destinations remain unchanged and are checked separately in the preview audit. |
| Separate references from clients | Existing visible note and private self-reported client scope remain. Lexical/extractive knowledge limits are present in accessible descriptions and the evidence map. No MAXY completion claim added. |

## Deployment and release recommendation

Production remains at the original published baseline. GitHub Actions and the existing Netlify project's PR preview must be confirmed at the final head before approval. See [deployment and rollback](deployment.md).

**Recommendation:** prepare the PR preview for owner review. This preserves the requested visual identity and fixes nonvisual defects. Do not merge or publish without explicit owner approval. Deferred contrast and mobile overlap mean the portfolio cannot be described as fully WCAG AA or fully UX-remediated under the current visual lock.

## Publication blocker and safe branch

The initial Git push was rejected by automatic approval review: authentic PDF publication contains a phone number and personal contact data considered unauthorized egress to the public repository. No protected PDF-bearing commit was uploaded. A new safe history was prepared from the baseline, containing only the existing publicly deployed PDFs. Original-file provenance and local test evidence remain documented. Owner approval must explicitly cover both named original v3 files, their contact information, the public GitHub repository, and the Netlify preview/site before their publication can proceed. This is a privacy-publication approval, separate from production merge approval.
