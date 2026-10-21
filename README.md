# Evan Naraya engineering portfolio

Source for [evannaraya.netlify.app](https://evannaraya.netlify.app/). The existing cinematic portfolio presents backend, API integration, full-stack and AI implementation work through inspectable source and verification. The website stays static HTML/CSS/JavaScript; Next.js/Fastify describe the featured Console application.

| Project | Demonstrated work | Proof |
| --- | --- | --- |
| Full-Stack AI Operations Console | UI/API/database/worker, approvals, retries and recovery with deterministic HTTP triage | [Reviewed source](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21) · [preserved proof](docs/console-integration/EVIDENCE.md) |
| Bounded Agent Runtime | Bounded tool use, approval and uncertainty reconciliation | [Source](https://github.com/naraya07pedro-spec/agent-runtime-python) · [v2 archive](https://github.com/naraya07pedro-spec/agent-runtime-python/tree/f292f3cdb5d6daf5650e495898dbe8f8a710ea75/evidence/v2) |
| Knowledge Workflow Runtime | File processing, current citations and review | [Source/verification](https://github.com/naraya07pedro-spec/varevant.com/tree/829711f66a3b65f7d8e819a6c3144b7f2d044a57/examples/agentic-systems-lab/knowledge-runtime) |
| Production Integration Reference | Signed intake, duplicates and API handoff | [Source](https://github.com/naraya07pedro-spec/production-integration-reference) |
| VAREVANT n8n engineering | Historical routing, suppression and recovery | [Workflow code](https://github.com/naraya07pedro-spec/varevant.com/tree/main/n8n) |

Console triage uses a deterministic sandbox, without a live production LLM. Business illustrations remain conceptual. Private engagement scope stays self-reported; no new tenure, customer outcomes, ROI or traffic is inferred.

---

## 🛡️ Reliability Engineering & Automated Verification

This repository relies on a fail-closed integrity architecture, leveraging Node.js native test runner to guarantee system reliability and cryptographic manifest integrity (SHA256).

### 🚀 1. Live Automated Test Execution
Real-time execution recording of the unit test suite running in a local environment.

<p align="center">
  <img src="assets/images/demo.gif" alt="Automated Test Suite Demo" width="100%">
</p>

---

### 🧪 2. Test Suite Verification Proof (10/10 Pass)
Automated verification across 10 core test suites covering release audits, manifest integrity, and asset publication.

```powershell
node --test
