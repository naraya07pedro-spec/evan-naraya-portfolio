# Evan Naraya engineering portfolio

Source for [evannaraya.com](https://evannaraya.com/). The existing cinematic portfolio presents backend, API integration, full-stack and AI implementation work through inspectable source and verification. The website stays static HTML/CSS/JavaScript; Next.js/Fastify describe the featured Console application.

| Project | Demonstrated work | Proof |
| --- | --- | --- |
| Full-Stack AI Operations Console | UI/API/database/worker, approvals, retries and recovery with deterministic HTTP triage | [Reviewed source](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21) · [preserved proof](docs/console-integration/EVIDENCE.md) |
| Bounded Agent Runtime | Bounded tool use, approval and uncertainty reconciliation | [Source](https://github.com/naraya07pedro-spec/agent-runtime-python) · [v2 archive](https://github.com/naraya07pedro-spec/agent-runtime-python/tree/f292f3cdb5d6daf5650e495898dbe8f8a710ea75/evidence/v2) |
| Knowledge Workflow Runtime | File processing, current citations and review | [Source/verification](https://github.com/naraya07pedro-spec/varevant.com/tree/829711f66a3b65f7d8e819a6c3144b7f2d044a57/examples/agentic-systems-lab/knowledge-runtime) |
| Production Integration Reference | Signed intake, duplicates and API handoff | [Source](https://github.com/naraya07pedro-spec/production-integration-reference) |
| VAREVANT n8n engineering | Historical routing, suppression and recovery | [Workflow code](https://github.com/naraya07pedro-spec/varevant.com/tree/main/n8n) |

Console triage uses a deterministic sandbox, without a live production LLM. Client work (EZUmrah, PT Geget Gigit) is described as stated by the owner; client systems are private.

## Page structure (2026-11-08)

Recruiter-first order: hero, test-evidence strip, client work, flagship systems (Operations Console, Agent Runtime, Knowledge Runtime), more work (RepoPilot, Production Integration Reference, VAREVANT n8n, VARYN), stack, contact. The business-illustration scenes and the "AI can assist" section were removed. On phones (<=760px) the pinned scroll choreography, portal zoom and scroll reveals are switched off so content reads top to bottom. Inter loads from Google Fonts so phones with custom system fonts render the intended typeface. The published CV is `assets/resumes/Evan_Naraya_Backend_Integration_Engineer.pdf` (see `docs/published-resumes.json`).

## Run and verify

Node.js 22 or later:

```bash
npm ci --ignore-scripts
npx playwright install --with-deps chromium firefox
npm run dev
npm run verify
npm run test:e2e
npm run test:responsive
npm run test:visual:responsive
npm run test:console
npm run audit:performance
npm audit --audit-level=moderate
node scripts/scan-public-secrets.mjs
```

`npm test` runs current contracts/browser/visual suites. Console comparison pins PR #2's original source at nine viewports in Chromium/Firefox. Historical source and runners stay unchanged. Protected comparisons use exact local source; separate hosted frames retain Netlify controls and verify actual preview behavior/assets.

`BROWSER_EXECUTABLE` selects Chromium; `QA_ENGINES=chromium` limits local coverage and is not Firefox proof. Hosted checks use `PREVIEW_URL` and expected head. Actions checks both engines, asset hashes, links, PDF downloads, performance and review packaging. Bulky fresh captures/FULL/PATCH archives are CI artifacts.

## Review and release

[Evidence](docs/console-integration/EVIDENCE.md) · [case study](docs/console-integration/CASE_STUDY.md) · [implementation](docs/console-integration/IMPLEMENTATION_REPORT.md) · [QA](docs/console-integration/QA_REPORT.md) · [LinkedIn draft](docs/console-integration/LINKEDIN_COPY.md).

PR #1 merged on 11 October 2026. This continues draft [PR #2](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/2), preserving Backend & Integration positioning, dark-violet design, portrait, animations, navigation and existing projects. [Deploy Preview #2](https://deploy-preview-2--evannaraya.com/) uses the existing Netlify Git integration; readiness is separately inspected.

The 2026-11-08 restructure replaced the published CV with the current Backend & Integration CV. `verify:release` checks approved bytes/transport; it grants no production approval. Owner approval is required for merging or production release. LinkedIn copy is prepared only.

The original Docker WebM and exact selected reports are preserved in Git with hashes, independently of CI expiration. A supplemental 12.28 MB private backup upload was blocked by full storage quota. Headless tests do not establish physical-device/Safari coverage or accessibility certification. Lighthouse is a lab measurement; secret scans detect specified patterns rather than every possible secret.

Earlier documents are historical: [site architecture](docs/architecture.md), [prior evidence map](docs/evidence-map.md), [business V13](docs/business-proof-v13-20261010.md), [approved CV consent](docs/resume-release-approval.json).
