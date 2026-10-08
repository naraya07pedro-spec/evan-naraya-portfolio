# Release-safety follow-up — PR #1

This audit continues the existing draft PR. Production, page HTML, CSS, scroll
JavaScript, portrait and publicly deployed PDF bytes remain unchanged from the
reviewed PR head `99ad25727f18ba492968d05fd66986b9f2bb109c`. The immutable visual
baseline remains production commit `a4634a0e4161ca8667c873cc4f26c5c65041dca0` and
the same 98 comparisons. No visual proposal is imported by the application.

## Independent quality and release checks

`Portfolio quality` / `verify` runs structure, release-gate contract tests,
Chromium/Firefox interactions and the unchanged 98 screenshot comparisons.
Contract tests use synthetic byte fixtures; they neither publish nor need CVs.

`Release readiness` / `release-eligibility` independently runs
`npm run verify:release`. It fails closed for missing/invalid manifests,
unrecognized or absent PDF bytes, size/hash/source mismatches, duplicate or
unsafe paths, incorrect download references and missing owner consent covering
the exact files, field categories and publication destinations. Authentic
originals and the verified contact-only derivatives are separately recognized.
Approval remains **pending** in `resume-release-approval.json`. Passing quality
does not imply release eligibility, and passing eligibility does not authorize
a production merge.

The approval record is a human attestation, not cryptographic authentication of
owner intent. An owner must review changes to the gate, provenance and consent
records. Never populate approval fields from an assumed or fabricated decision.

### Mandatory merge enforcement: admin configuration blocker

The new check becomes a mandatory merge gate only after GitHub requires it on `main`. A follow-up ordinary branch read **verified `protected: false`, `protection.enabled: false`, enforcement `off` and empty required-check lists**. The repository ruleset list was empty. Main still points to the original production commit. This is a verified missing release control, rather than an unknown setting.

The separate admin branch-protection endpoint returned HTTP 403. No supported admin-write capability is available, and the browser is signed out. This audit has not configured main enforcement.

The owner/admin must inspect existing rules without weakening them, then:

1. Require a pull request for `main`.
2. Require the exact GitHub Actions contexts `verify` and `release-eligibility`.
3. Require checks against an up-to-date candidate; preserve existing required checks.
4. Apply enforcement to administrators and remove any merge bypass that could
   ignore the release check. Do not enable auto-merge.
5. Verify that the failing `release-eligibility` check prevents a ready PR from
   merging. Keep PR #1 draft; do not attempt a merge as a test.

Workflows also handle `merge_group`; neither check has a path filter,
`continue-on-error` nor a draft-PR skip condition. An absent check must not be
treated as passing. See GitHub's [protected-branch documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

## Resume provenance and exact decision

Both authentic v3 files were inspected from the owner's approved sources:

| Source filename | Bytes | Pages | SHA-256 |
| --- | ---: | ---: | --- |
| Evan_Naraya_CV_Automation_Integration_2026_v3.pdf | 109,481 | 1 | `cf5be0f03273fd2edb5424103b3720c57bdc8a53061951ac732b8989a7d56ead` |
| Evan_Naraya_CV_Backend_Integration_Python_2026_v3.pdf | 108,838 | 1 | `78bf0dc5bf3baa80257f32639a2d6c3990fa6eb6e781ffddd1739afc0b53eef0` |

Two **private review candidates** remove only the personal phone and personal
email from the contact row. No career text was re-typeset, shortened or changed.
Their identity/stack and career regions render identically at 144 dpi, career
text/word coordinates match, one-page geometry and all six links are preserved.
Two independent text extractors and decoded PDF object/stream inspection found
no remaining phone/email values. The originals remain intact. The original
Content Credentials attachment was removed from the edited derivative because
it describes the original bytes, rather than the derivative.

| Private candidate filename | Bytes | SHA-256 |
| --- | ---: | --- |
| Evan_Naraya_CV_Automation_Integration_2026_v3_public_safe_candidate.pdf | 182,806 | `05e3dd176f2d3285ff9072d90545ef5e06d4a5dad484bf509351e346f9c88187` |
| Evan_Naraya_CV_Backend_Integration_Python_2026_v3_public_safe_candidate.pdf | 182,198 | `9d520f4c8b79303305eb6bcbd85610968ba7215a37415ce3bb8ca1c760e60b48` |

Candidate bytes are delivered privately for owner review; they are **not in this
public Git repository, Actions artifacts or Netlify deploy**. Public metadata
in `resume-release-candidates.json` records hashes and field categories only.
The candidate is larger because the new contact row embeds a complete copy of
the same typeface; the untouched career region keeps its original font subsets.

Required owner decision: select these exact contact-redacted candidates or
the exact originals, and approve each file's SHA-256 and fields for the public
GitHub repository, Netlify Deploy Preview and eventual production site. Public
site publication of a file is distinct from approval to merge production.

- Candidate fields retained: name, role, city/country/timezone, GitHub profile,
  LinkedIn profile, website. Personal phone and personal email are removed.
- Original fields additionally include personal phone and personal email;
  their actual values are deliberately absent from public audit documentation.

After explicit approval only, put the selected exact bytes at the two existing
`assets/resumes/*v3.pdf` paths. Record the selected variant, source hash, file
hash, field categories, destination categories, owner, date and consent
reference in `resume-release-approval.json`. Update `published-resumes.json`
to the approved asset hashes so quality tests verify the selected downloads.
Run quality, release eligibility and browser PDF opening/download checks again
on the new head before a production decision.

Current public downloads remain the old 4,073/3,953-byte reconstructed files.
Their downloads can work while their v3 career-evidence integrity remains a
**verified high-severity release defect**. A filename alone is not proof of an
authentic CV. The release check must remain red until replacement and consent.

## QA retention decision

The existing `docs/qa` archive contains 13 tracked files totaling **556,489
bytes**. Keep this small curated historical record, including screenshot and
JSON provenance, immutable in Git. No historical evidence was deleted or
rewritten during this follow-up.

Full per-run screenshots, diffs and JSON belong in CI artifacts, not recurring
Git commits. Current CI retention is 14 days; moving the only historical copy
to expiring artifacts would lose durable evidence. Quality uploads now use an
explicit allowlist of visual PNGs, comparison JSON and accessibility JSON.
They exclude PDF download bytes and private candidate material. Release CI
uploads only its public result JSON.

Optional owner decision: approve any future migration/deletion only after a
durable archival destination and retention policy are verified. Migration is
not needed to resolve the current release blockers. New proposal screenshots
are a separately labeled review record, not a replacement baseline.

## Defects versus optional enhancements

| Classification | Remaining issue | Release consequence |
| --- | --- | --- |
| VERIFIED DEFECT / high | Public v3 filenames still serve reconstructed PDFs; approved bytes/field consent missing | Release eligibility fails |
| VERIFIED DEFECT / high | Main protection disabled, required checks empty and no repository rulesets | Separate failing release check added; owner admin enforcement still required |
| REPRODUCED ISSUE / medium | Phone hero role/text intersects portrait/face | Proposal only; visual approval or explicit acceptance of this deferred issue needed |
| VERIFIED DEFECT / medium | Both small device toolbar labels are 4.33:1, below 4.5:1 | Proposal only; no WCAG AA completion claim |
| OPTIONAL ENHANCEMENT | Mobile navigation exposure and quicker proof navigation | No implementation under the visual lock |
| OPTIONAL ENHANCEMENT | Moving the small historical QA archive out of Git | Preserve history unless migration is explicitly approved |
| UNVERIFIED | Field INP, recruiter conversion, external social account ownership/deliverability | No achieved result or endorsement claimed |

The separate [visual proposals](visual-proposals.md) show minimal scoped options.
Measured application performance remains the earlier lab evidence: this
follow-up changes tooling/docs only and does not claim new performance scores.

## Executed follow-up and final verification

Implementation commit `0b0234d76b941ee6d87608152ee3c8beef3f44b6` passed quality CI (PR run 37788330385). Its independent release check (37788330341) failed for the expected consent/asset blockers and uploaded only result JSON. Netlify preview deploy `6ac7a0f73a7a2800080499db` reported ready for this exact commit and existing site, context deploy-preview.

Local checks completed: 22 structure/gate tests, 16 Chromium/Firefox browser checks and all 98 unchanged source comparisons passed. The executed local comparison had 196 changed pixels total: 28 in the top-left 6×6 area of Chromium 1440px captures across seven states; 91 comparisons were exact. Maximum ratio 0.00216% stayed below the **unchanged** 0.05% tolerance. This result is disclosed rather than claiming zero pixels changed. Product HTML/CSS/scroll JS/portrait/download bytes stayed identical to the reviewed application head.

All 29 unique HTTPS destinations in the page, README/evidence map and preserved PDF links were requested with TLS validation: 28 returned 200; LinkedIn returned 999. Its availability/ownership remains unverified. HTTP 200 does not prove social identity or email deliverability. No message was sent.

The local browser test cleanup now closes its servers even if a browser cannot launch. An initial attempt found the ephemeral Firefox installation absent; after official installation the complete two-engine suite executed successfully. CI uses its normal browser installation.

Two candidates were saved privately for owner review, with exact-byte hashes verified after saving. Their bytes are never workflow inputs. Local proposal screenshots were generated and inspected before the workspace/cloud browser connection went offline. No historical QA files were deleted or overwritten.

A separate `Preview safety audit` workflow continues independent work on GitHub's runner. It checks deployed asset hashes, hosted Chromium/Firefox interactions and all 7 widths × 7 viewport states, downloads both current public PDFs in both engines, parses/renders them with Poppler, and creates labeled-by-filename proposal captures against the local checkout. Only page/proposal PNGs and public JSON are uploaded; PDF bytes, extracted metadata and PDF renderings are excluded. PDF parsing/rendering is not a claim of native browser PDF-viewer inspection.

Future per-run QA/proposal captures use 30-day CI artifacts rather than recurring Git commits. The existing 13-file / 556,489-byte historical archive stays in Git. There is no deletion or migration of that historical evidence. Proposed CSS is never imported by the application; the original 98-case source regression remains separate from hosted captures.

The final head's CI, preview deploy ID and artifact links are recorded in [draft PR #1](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/1) after execution. A committed report cannot contain its own later CI result. Workspace reconnection is needed for any further local screenshot review; no successful final Cloud Browser session is claimed during the outage.

## Verified Firefox warnings

The first hosted audits failed the summary's original zero-console assumption.
The captured data showed exactly four warnings per Firefox viewport: three
unsupported `clipboard-write` Feature Policy messages from Netlify's injected
`/.netlify/scripts/cdp`, and one CSP/X-Frame-Options precedence notice. No
application page error or network failure was observed; hosted E2E and PDF
download/render checks passed.

Current and baseline X-Frame-Options are SAMEORIGIN; the upgrade's enforced
`frame-ancestors 'self'` retains that restriction. [W3C CSP](https://www.w3.org/TR/CSP/#frame-ancestors-and-frame-options)
specifies precedence over X-Frame-Options. Headers are preserved, not removed
to suppress diagnostics. The audit verifies the actual deployed policies.

The corrected summary classifies only these exact Firefox messages. Raw
warnings remain in artifacts/logs and their count is reported. Any other
console warning/error, application-source message, wrong-origin message or
network failure remains a failing finding. Three regression tests cover these
boundaries. This is documented browser/hosting behavior, not a hidden claim of
zero console warnings. Instagram also returned 429 on one hosted link run;
LinkedIn returned 999, so social availability remains unverified rather than
being declared a broken project link.

Original PDF metadata did not expose a creation timestamp in the inspected
metadata fields. The provenance manifest now uses the v3 filename and exact
source SHA as its authoritative revision, rather than asserting a creation
date. This changes no CV bytes, career content or source hash.
