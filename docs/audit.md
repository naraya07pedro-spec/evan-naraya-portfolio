# Portfolio engineering audit — 8 October 2026

The later [PR #1 release-safety follow-up](release-safety.md) supersedes release eligibility and private-candidate status. This original audit and all historical screenshot/JSON evidence remain preserved.

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

Screenshots use `chromium-{width}-{state}` / `firefox-{width}-{state}` naming. The audit capture records the actual production URL; controlled visual regression separately renders the immutable Git baseline. [Desktop hero](qa/desktop-hero.webp), [mobile overlap](qa/mobile-hero.webp), [mobile diagram](qa/mobile-diagram.webp) and [violet transition](qa/violet-transition.webp) compare actual production with the hosted preview. Hosting review controls remain visible in these unmasked captures.

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

The final executed controlled comparison used Lighthouse 13.5.0 / Chromium 153.0.8010.0 against localhost, a fresh browser, the actual cinematic animation enabled, mobile 390×844 and desktop viewport 1440×900. Both used simulated mobile network/CPU settings: 150 ms RTT, 1,474.56 Kbps download and 4× CPU slowdown. The desktop column is a controlled desktop-viewport comparison under these same settings, not a standard desktop-preset benchmark. These are **single-run lab measurements**, not field data. [Recorded results](qa/performance.json).

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | --- | --- | --- | --- |
| Performance | 99 | 99 | 74 | 90 |
| Accessibility | 95 | 96 | 100 | 100 |
| Best practices / SEO | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| LCP | 1.606 s | 1.803 s | 1.617 s | 1.806 s |
| CLS | 0 | 0 | 0 | 0 |
| TBT | 0 ms | 0 ms | 309.5 ms | 29.24 ms |
| JavaScript execution | 15.42 ms | 16.48 ms | 19.35 ms | 16.58 ms |
| Initial transferred bytes | 190,749 | 145,895 | 190,749 | 145,895 |

LCP increased by roughly 0.2 seconds after separating resources, including the image preload, although it stayed below the 2.5-second lab target. This regression is not concealed. Do not treat a one-run score difference as a stable performance guarantee. Field INP was not measured; navigation Lighthouse TBT is not INP. Google's targets are LCP ≤2.5 s, CLS ≤0.1 and INP ≤200 ms at the 75th percentile of real visits ([official definitions](https://web.dev/articles/vitals)).

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

Production remains at the original published baseline. [Draft PR #1](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/1) and the [existing project's Deploy Preview](https://deploy-preview-1--evannaraya.netlify.app/) were created. Application commit `777f388ba5167f742cb8f9f56ac2f274e832ba13` passed GitHub Actions; Netlify deploy `6ac77a93cece04000834c8d9` reported ready with that exact commit and site ID. A final documentation/tooling commit also requires checks at its own head. See [release review](release-review.md) and [deployment and rollback](deployment.md).

**Recommendation:** review the working preview, but hold production release until the authentic-resume publication blocker is resolved and the owner explicitly approves the final commit. Deferred contrast and mobile overlap mean the portfolio cannot be described as fully WCAG AA or fully UX-remediated under the current visual lock.

## Publication blocker and safe branch

The initial Git push was rejected by automatic approval review: authentic PDF publication contains a phone number and personal contact data considered unauthorized egress to the public repository. No protected PDF-bearing commit was uploaded. A new safe history was prepared from the baseline, containing only the existing publicly deployed PDFs. Original-file provenance and local test evidence remain documented. Owner approval must explicitly cover both named original v3 files, their contact information, the public GitHub repository, and the Netlify preview/site before their publication can proceed. This is a privacy-publication approval, separate from production merge approval.
