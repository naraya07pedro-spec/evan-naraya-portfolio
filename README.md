# Evan Naraya engineering portfolio

Source for [evannaraya.netlify.app](https://evannaraya.netlify.app/), Evan Naraya's existing cinematic portfolio for Automation, Integration, Python/FastAPI Backend and AI Implementation roles.

The original portrait, near-black/violet palette, typography, sticky storytelling and violet circular transition remain intact. This upgrade separates static assets, prepares the exact approved resume PDFs locally; their public upload is awaiting explicit privacy approval, handles keyboard/reduced-motion edge cases, stops idle pointer animation work and adds reproducible quality gates. There is no frontend framework, application backend or production npm dependency.

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
```

`npm test` runs the three quality gates. GitHub Actions runs these checks on PRs and the upgrade branch, then uploads screenshots, accessibility results and PDF verification artifacts. Visual comparison covers 320, 375, 390, 768, 1024, 1440 and 1920 px at the hero, statement, planet entry/expansion, both flagships and contact. Results are compared within each browser engine.

Optional QA settings: `BROWSER_EXECUTABLE` selects an installed Chromium executable. `BROWSER_USE_PROXY=1` uses the environment's existing proxy for live-site audits while retaining certificate verification. `FIREFOX_QA_NO_NESTED_SANDBOX=1` is only for QA inside an already isolated container where Firefox cannot create a nested user namespace; normal local/CI tests leave it unset.

## Source, release and limits

- [Architecture and visual system](docs/architecture.md)
- [Audit and release recommendation](docs/audit.md)
- [Proposed original PDF sizes and SHA-256](docs/resumes.json)
- [Deploy Preview and rollback](docs/deployment.md)

Netlify stays on the existing `evannaraya` project, production branch `main`, root publish directory and no compilation command. Changes are reviewed through a PR and preview. Explicit owner approval is required before a production merge.

Visual issues requiring approval remain documented. Accessibility gates prevent new violations; they do not certify WCAG 2.2 AA. Performance results are measured lab runs, not field INP or recruiter conversion data. No testimonials, outcomes, private client source, new tenure or work authorization were invented.

## Current release blocker

Automatic approval review rejected GitHub publication of the authentic original resumes because they include a phone number and personal contact information whose public egress it considered unauthorized. This public branch contains only the already-public reconstructed PDFs from the production baseline. These are not represented as the authentic approved originals. The original v3 files were inspected and their proposed downloads passed locally; publication is pending explicit owner approval. No private PDF bytes or new contact data are in this branch history.

Run `npm run verify:release` before any production decision. It currently fails because the public PDFs do not match the approved originals in `docs/resumes.json`. General website CI passing does not resolve this blocker.
