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

## 🛡️ Reliability Engineering & Automated Verification

Repositori ini menerapkan standar *fail-closed integrity check* menggunakan Node.js test runner bawaan untuk memastikan setiap rilis dan manifes CV terverifikasi secara kriptografis (SHA256).

### 🚀 1. Live Automated Test Execution

Visualisasi nyata eksekusi test suite secara otomatis di lingkungan lokal.

<p align="center">
  <img src="assets/demo.gif" alt="Live Automated Test Execution Demo" width="100%">
</p>

---

### 🧪 2. Test Suite Verification Proof (10/10 Pass)

Hasil verifikasi 10 test suite utama yang mencakup audit rilis, integritas manifes, dan publikasi aset.

```bash
node --test
```

```
# tests 10
# pass  10
# fail  0
# duration_ms ~367–577ms
```

| Suite | Cakupan verifikasi |
| --- | --- |
| `release-readiness` | Audit kesiapan rilis CV terhadap manifes baseline |
| `structure` | Integritas struktur konten dan berkas portfolio |
| `business-proof` | Validasi klaim bisnis terhadap bukti yang terdokumentasi |
| `historical-evidence` | Audit keberadaan bukti historis yang diawetkan |
| `console-integration` | Konsistensi integrasi Console dengan sumber terverifikasi |
| `contact-scope` | Pembatasan data kontak terhadap cakupan publikasi |
| `browser-findings` | Verifikasi temuan QA browser telah ditindaklanjuti |
| `public-secret-scan` | Pemindaian rahasia yang terekspos secara publik |
| `browser` | Kontrak perilaku browser / e2e |
| `responsive` | Kontrak viewport responsif |

<p align="center">
  <img src="assets/terminal-pass.png" alt="Test Suite Verification Proof — node --test pass 10, fail 0" width="100%">
</p>

---

### 🔐 3. Git Sync Verification (Fail-Closed Integrity Flow)

Verifikasi end-to-end bahwa status lokal identik dengan `origin/main` sebelum test dieksekusi. Setiap divergensi state Git akan gagal lebih dulu (fail-closed) daripada menghasilkan build tidak terverifikasi.

<p align="center">
  <img src="assets/git-sync-verification.png" alt="Git Sync Verification — git reset --hard origin/main hingga node --test" width="100%">
</p>

---

### 🧬 4. Integrity Architecture (SHA256 Release Manifest)

Manifes rilis CV diikat secara kriptografis: setiap PDF CV terverifikasi terhadap SHA256 yang terekam di `docs/published-resumes.json` dan dikunci ke baseline rilis `docs/resume-release-baseline-20261014.json`. Integritas berkas lokal (bytes, hash) harus cocok dengan manifes sebelum CV dianggap valid untuk publikasi.

<p align="center">
  <img src="assets/integrity-architecture.png" alt="Integrity Architecture — published-resumes.json dan resume-release-baseline manifest" width="100%">
</p>

---

## Aset verifikasi

| Aset | Lokasi | Fungsi |
| --- | --- | --- |
| Live test demo | `assets/demo.gif` | Rekaman eksekusi `node --test` live hingga passing |
| Terminal pass proof | `assets/terminal-pass.png` | Hasil eksekusi `node --test` — pass 10, fail 0 |
| Git sync verification | `assets/git-sync-verification.png` | Alur `git reset --hard origin/main` → `node --test` |
| Integrity architecture | `assets/integrity-architecture.png` | Split-view manifes SHA256 CV dan baseline rilis |

---

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

PR #1 merged on 11 October 2026. This continues draft [PR #2](https://github.com/naraya07pedro-spec/evan-naraya-portfolio/pull/2), preserving Backend & Integration positioning, dark-violet design, portrait, animations, navigation and existing projects. [Deploy Preview #2](https://deploy-preview-2--evannaraya.netlify.app/) uses the existing Netlify Git integration; readiness is separately inspected.

Both approved CVs/consent and the external release binding are unchanged. `verify:release` checks approved bytes/transport; it grants no production approval. Owner approval is required for merging or production release. LinkedIn copy is prepared only.

The original Docker WebM and exact selected reports are preserved in Git with hashes, independently of CI expiration. A supplemental 12.28 MB private backup upload was blocked by full storage quota. Headless tests do not establish physical-device/Safari coverage or accessibility certification. Lighthouse is a lab measurement; secret scans detect specified patterns rather than every possible secret.

Earlier documents are historical: [site architecture](docs/architecture.md), [prior evidence map](docs/evidence-map.md), [business V13](docs/business-proof-v13-20261010.md), [approved CV consent](docs/resume-release-approval.json).
