# Final private resume selection — 9 October 2026

Publication approval remains pending. No private resume bytes, contact values or resume renderings are committed, deployed or uploaded as CI artifacts.

## Exact inspected files

| File | Bytes | SHA-256 | Public eligibility |
| --- | ---: | --- | --- |
| `Evan_Naraya_Automation_Integration_Engineer (1).pdf` | 73,023 | `4c884f195eb5a2999eaa894da8161b1b7eb24d06600b2411296202cd498db5c8` | Unapproved revised content; private phone/email and embedded Content Credentials remain |
| `Evan_Naraya_Backend_Integration_Engineer (1).pdf` | 72,934 | `9314233eea0cd8a6228fbdab8e95d49522746a31b0a2113583aed20d60e8a4c5` | Unapproved revised content; private phone/email and embedded Content Credentials remain |
| `Evan_Naraya_CV_Automation_Integration_2026_v3.pdf` | 109,481 | `cf5be0f03273fd2edb5424103b3720c57bdc8a53061951ac732b8989a7d56ead` | Authentic source, but personal field publication consent pending |
| `Evan_Naraya_CV_Backend_Integration_Python_2026_v3.pdf` | 108,838 | `78bf0dc5bf3baa80257f32639a2d6c3990fa6eb6e781ffddd1739afc0b53eef0` | Authentic source, but personal field publication consent pending |
| `Evan_Naraya_CV_Automation_Integration_2026_v3_public_safe_candidate.pdf` | 182,806 | `05e3dd176f2d3285ff9072d90545ef5e06d4a5dad484bf509351e346f9c88187` | Contact-only derivative; still awaiting exact owner consent |
| `Evan_Naraya_CV_Backend_Integration_Python_2026_v3_public_safe_candidate.pdf` | 182,198 | `9d520f4c8b79303305eb6bcbd85610968ba7215a37415ce3bb8ca1c760e60b48` | Contact-only derivative; still awaiting exact owner consent |

All six files parse, render as one US-Letter page, are unencrypted, and have nonempty link rectangles contained in the page. PyMuPDF does not report a repaired document. Pypdf emits a non-zero-indexed-xref compatibility warning on originals/revisions; it is not a rendering or unreadable-PDF failure. No JavaScript, launch action or automatic open action was found. Latest revisions have nine link annotations (including a clickable email and duplicate GitHub destination); originals and existing public-safe candidates have six each. Historical public-safe candidates have zero **name-tree entries**, but the new object-level check finds an associated Content Credentials file through catalog `/AF`; they are not safe final publication choices. The previous name-tree-only inspection missed this. originals and latest revisions have one Content Credentials attachment each.

Original v3 contact values remain visible in extracted text. The two public-safe candidates contain neither the personal phone nor email in extracted text or decoded objects. Their career text, below the contact row and excluding the relocated redacted contact footer, matches the respective authentic source after whitespace normalization. The earlier coordinate/pixel-preservation records remain in `resume-release-candidates.json`; no new resume derivative was substituted.

## Career evidence comparison

The latest revisions are editorially condensed and reorder/rephrase the original material. They preserve the same name, target roles, Indonesia/UTC+7 location, VAREVANT 2026–present experience, PT Geget Gigit scope, EZUmrah six-workflow scope and four public engineering references. They add no seniority, older employment date, traffic, uptime or revenue metric. The client scope and employment chronology remain self-reported; public repository source cannot establish customer acceptance or employer verification.

They are **not text-identical contact-only v3 derivatives**. For example, the revised Automation runtime paragraph omits original fencing/reconciliation/observability/evaluation details; retrieval descriptions shorten document extraction and durable-handoff details. Revised Backend n8n copy omits the 60-Code-node count. These are editorial omissions, not newly verified defects, but selecting them would change the career evidence presented to a recruiter. No content was silently restored, removed or rewritten in this preparation.

Public numeric claims were cross-checked against actual records: archived Bounded Agent Runtime `evidence/v2/test-counts.json` reports 261 passed; `coverage-totals.json` reports 90.00999000999% combined coverage at source `833a4eff040bea8b952e84d9b5207c2335c036c2`. Knowledge verification at source `0ccf6f89dc9e00665c5c68fd3527493ff20a4275` records 134 tests, 91.6440% combined coverage and 12/12 synthetic retrieval regressions, with the lexical/extractive limitation retained. Historical n8n source provenance records 117 nodes/60 Code nodes. See the revision-pinned [evidence map](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/blob/c841c02bac94ad957ef2112f43f6728aad5d1baa/docs/evidence-map.md); none of these project suites was rerun during this website preparation.


## Final recommendation after the authorized preparation

Select the two **latest revised public-safe candidates** recorded in `resume-revised-candidates.json`, using variant `verified-revision`. The latest one-column layout has clearer section hierarchy and more concise recruiter-facing descriptions. Public proof, the authentic v3 career facts and client scope agree; no tenure, education, revenue or customer scale was added. Client work and employment chronology remain self-reported, not independently verified customer/employer claims. Automation keeps its revised career text exactly. Backend additionally restores the independently verified 60 Code nodes, alongside its historical 117-node count. Both retain 261/90.01%, 134/91.64% and 12/12 figures and the synthetic/lexical/extractive qualifications.

Phone/email are removed from the public contact row and link actions. Catalog `/AF`, embedded-file name trees, metadata and the provenance attachment are removed, with garbage collection; object-level inspection confirms no embedded/active data. Both are one-page, unencrypted, un-repaired, text-extractable, ATS-readable documents. Nine nonempty on-page link annotations point to seven unique HTTPS destinations including GitHub, LinkedIn and the website. The latest rendered pages were visually inspected. No private PDF or rendering is a repository/CI artifact.

- `Evan_Naraya_Automation_Integration_Engineer_public_safe_candidate.pdf`: 36129 bytes; SHA-256 `6a858d7da1ffdeb71f12ce48aac95a76133577f7991f8491f216bcfe8ddc30a4`.
- `Evan_Naraya_Backend_Integration_Engineer_public_safe_candidate.pdf`: 36130 bytes; SHA-256 `9597c8c3d39c7c057f0732e1e4d466e0c95918bc83e02ee20ece3c5596efc40e`.

Owner consent must approve these **exact final filenames and hashes**, exposed `name`, `role`, `location_timezone`, `github_profile`, `linkedin_profile`, `website`, with personal phone/email excluded, for the public GitHub repository, Netlify Deploy Preview and eventual production site. Reference both inspected revised-source hashes and authentic v3 source hashes in the approval record. Keep the two existing `assets/resumes/*_v3.pdf` paths and download names: install the chosen approved bytes into those compatible paths only after consent. Publication and production merge remain separate decisions; the approval manifest is still byte-for-byte pending.

The release command also probes required destinations. A LinkedIn access wall is not treated as a broken URL, but it **does not pass without evidence**: if HTTP 403/429/999 persists, the owner must actually open that exact profile and record a recent `linkVerifications` entry (URL, owner, UTC check time, verified_in_browser result, reference to the real confirmation). A 404/410 or other failure cannot be excused by that record. No such verification has been invented or added.

Follow-up: authorized Work legitimately confirmed the public LinkedIn profile in the Cloud Browser at `2026-10-09T16:53:04.673Z`, with actual actor `work_browser_operator` and private screenshot evidence. This supersedes the owner-only link task above. The gate now also accepts a referenced, recent Work browser observation, records its actual actor, and still rejects broken URLs, unknown actors, missing references and observations older than 24 hours. This is link evidence only; it is not an owner publication decision. No approval manifest fields were changed.

## Current recommendation: personal portfolio website correction

The two preceding 36,129/36,130-byte candidates were recovered from the privately saved ZIP and their exact hashes verified again. Their website field and two website annotations still pointed to `varevant.com`. The requested personal portfolio website is `https://evannaraya.netlify.app/`. The original candidates remain preserved; they were not overwritten or publicly installed.

Two new private derivatives correct only the contact/footer website text and its two clickable annotations. The full career region `[0,104,612,741]` retains identical text and identical rendered pixels at 144 DPI against the preceding candidates. No career claim, client description, date, metric or qualification changed. Each remains one unencrypted, unrepaired page with nine on-page annotations, seven unique public destinations, no personal phone/email in visible text/annotations/decoded objects and no embedded/associated data or active actions. The complete new rendered pages were visually inspected. Source v3/revised hashes still match the reviewed provenance. The manifest now defines its career-text extraction method explicitly and retains preceding records under `previousRecommendations`.

| Current private candidate | Bytes | SHA-256 |
| --- | ---: | --- |
| `Evan_Naraya_Automation_Integration_Engineer_portfolio_public_safe_candidate.pdf` | 37,931 | `1e17024c6d69d39ebd723c20eed08eb72e556e74fd5957c93ae17c5abeee60c5` |
| `Evan_Naraya_Backend_Integration_Engineer_portfolio_public_safe_candidate.pdf` | 37,955 | `cdef50caa510c9a422c983871c15f5a19eaeb7db89bdf6b41ec8466a082433c2` |

The owner receives one private approval package with these exact PDFs, full-page PNGs, extracted text, complete contact-free career comparisons against authentic v3, source hashes, field values, publication destinations and the compatible v3 download paths. It contains no authentic source PDF bytes or private contact values. Public proposed fields are Evan Naraya Hokky Pradygta, the respective engineering role, Magelang Indonesia UTC+7, GitHub `naraya07pedro-spec`, LinkedIn `evannaraya` and the personal portfolio URL. Phone/email remain excluded. Consent is still pending; no new PDF bytes/renderings are in GitHub or CI artifacts.

An `approvedBy` value or reference string is a recorded declaration, not independent proof that a human approved publication. The separate Actions variable `RESUME_APPROVAL_MANIFEST_SHA256` must bind the exact approval-manifest bytes after an actual owner decision. Missing/mismatched binding fails closed, and any subsequent manifest edit requires the setting to be updated only after reviewing that edit. This is an integrity binding outside the PR tree, **not a signature or cryptographic proof of consent**. Authorized settings/workflow editors can change it; protected-main review and the operator's explicit human-authorization boundary remain necessary. The setting is intentionally not created or populated while consent is pending.
