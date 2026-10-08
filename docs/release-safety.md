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

The new check is only a mandatory merge gate after GitHub requires it on
`main`. The current integration returned HTTP 403 for branch-protection reads;
no supported admin-write capability is available, and the browser was signed
out. Existing main protection therefore remains **unverified**, not configured
or claimed by this audit.

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
| VERIFIED GAP / high | Release check was absent from CI; required main-check enforcement cannot be verified with current admin access | Separate failing check added; owner admin enforcement still required |
| REPRODUCED ISSUE / medium | Phone hero role/text intersects portrait/face | Proposal only; visual approval or explicit acceptance of this deferred issue needed |
| VERIFIED DEFECT / medium | Both small device toolbar labels are 4.33:1, below 4.5:1 | Proposal only; no WCAG AA completion claim |
| OPTIONAL ENHANCEMENT | Mobile navigation exposure and quicker proof navigation | No implementation under the visual lock |
| OPTIONAL ENHANCEMENT | Moving the small historical QA archive out of Git | Preserve history unless migration is explicitly approved |
| UNVERIFIED | Field INP, recruiter conversion, external social account ownership/deliverability | No achieved result or endorsement claimed |

The separate [visual proposals](visual-proposals.md) show minimal scoped options.
Measured application performance remains the earlier lab evidence: this
follow-up changes tooling/docs only and does not claim new performance scores.
