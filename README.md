# Evan Naraya engineering portfolio

Source for [evannaraya.netlify.app](https://evannaraya.netlify.app/), Evan Naraya's existing cinematic portfolio for Automation, Integration, Python/FastAPI Backend and AI Implementation roles.

The original portrait, near-black/violet palette, typography, sticky storytelling and violet circular transition remain intact. This upgrade separates static assets, handles keyboard/reduced-motion edge cases, stops idle pointer animation work and adds reproducible quality gates. Exact approved resume PDFs are prepared and tested locally; their public upload awaits explicit privacy approval. There is no frontend framework, application backend or production npm dependency.

## Inspect the engineering work

| Reference | Review entry point |
| --- | --- |
| Bounded Agent Runtime | [Source](https://github.com/naraya07pedro-spec/agent-runtime-python) · [archived v2 evidence](https://github.com/naraya07pedro-spec/agent-runtime-python/tree/main/evidence/v2) |
| Knowledge Workflow Runtime | [Source and run instructions](https://github.com/naraya07pedro-spec/varevant.com/tree/main/examples/agentic-systems-lab/knowledge-runtime) · [verification](https://github.com/naraya07pedro-spec/varevant.com/blob/main/examples/agentic-systems-lab/knowledge-runtime/docs/verification.md) |
| Production Integration Reference | [Source, tests and limitations](https://github.com/naraya07pedro-spec/production-integration-reference) |
| VAREVANT n8n engineering | [Historical source and incident evidence](https://github.com/naraya07pedro-spec/varevant.com/tree/main/n8n) |

The [evidence map](docs/evidence-map.md) connects failure scenarios to implementation, tests, exact revisions and operational consequences. Public references are separate from self-reported private client scope. Project test totals are not website test totals or claims of commercial deployment.

## Run locally

Node.js 22 or later is needed for development tooling. The deployed page needs only a static web server.

```bash
npm ci --ignore-scripts
npx playwright install --with-deps chromium firefox
npm run dev
```

Open the URL printed by the server. All page assets and both resumes are local; no paid API, private credential or external font is required.

## Verify

```bash
npm run verify       # structure, anchors, assets, resume/portrait hashes, JS syntax
npm run test:e2e     # Chromium + Firefox interactions, downloads, motion, axe regressions
npm run test:visual  # immutable baseline vs current source at 7 widths
npm run audit:performance
npm run verify:release # approved exact bytes + file/field consent; currently blocked
```

`npm test` runs the three quality gates. GitHub Actions runs these checks on PRs and the upgrade branch, then uploads public screenshots and accessibility/comparison JSON. PDF bytes are excluded. Release eligibility runs independently. Visual comparison covers 320, 375, 390, 768, 1024, 1440 and 1920 px at the hero, statement, planet entry/expansion, both flagships and contact. Results are compared within each browser engine.

Optional QA settings: `BROWSER_EXECUTABLE` selects an installed Chromium executable. `BROWSER_USE_PROXY=1` uses the environment's existing proxy for live-site audits while retaining certificate verification. `FIREFOX_QA_NO_NESTED_SANDBOX=1` is only for QA inside an already isolated container where Firefox cannot create a nested user namespace; normal local/CI tests leave it unset.

Capture a hosted page with `AUDIT_URL=https://deploy-preview-1--evannaraya.netlify.app/ AUDIT_ENGINES=chromium node scripts/capture.mjs`. `AUDIT_WIDTHS=1440,1920` selects only those widths; use a separate `AUDIT_OUTPUT` for partial runs. Hosting traffic that prevents network-idle is explicitly recorded; application fonts and images still finish decoding before screenshots.

## Source, release and limits

- [Architecture and visual system](docs/architecture.md)
- [Audit and release recommendation](docs/audit.md)
- [Owner release review, actual preview screenshots and measurements](docs/release-review.md)
- [Proposed original PDF sizes and SHA-256](docs/resumes.json)
- [Deploy Preview and rollback](docs/deployment.md)

Netlify stays on the existing `evannaraya` project, production branch `main`, root publish directory and no compilation command. Changes are reviewed through a PR and preview. Explicit owner approval is required before a production merge.

Visual issues requiring approval remain documented. Accessibility gates prevent new violations; they do not certify WCAG 2.2 AA. Performance results are measured lab runs, not field INP or recruiter conversion data. No testimonials, outcomes, private client source, new tenure or work authorization were invented.

## Current release blockers

Both public v3 downloads still contain the baseline's reconstructed PDFs. Authentic originals and two contact-only candidates were inspected privately; career evidence, coordinates, pixels and six links were preserved. The candidates remain private until the owner approves their exact hashes and public field categories.

The independent `Release readiness` / `release-eligibility` check fails for missing consent and asset mismatches. Quality `verify` remains independent. Ordinary branch metadata confirms `main` protection is disabled, required checks are empty and no repository rulesets exist. The owner/admin must require both checks without administrator bypass; current integration access cannot apply that setting.

[Release-safety audit and exact candidate hashes](docs/release-safety.md) · [Unapproved visual proposals](docs/visual-proposals.md).

The separate `Preview safety audit` workflow verifies deployed asset bytes, hosted Chromium/Firefox interactions, all target viewport states and downloaded PDF parsing/rendering. It also captures unapproved CSS proposals against the local checkout. Its artifacts exclude PDF bytes/renderings and private material. The original 98-case source regression and historical QA archive remain unchanged.

Production merge still needs a separate explicit owner decision after the blockers are resolved. No auto-merge is enabled.
