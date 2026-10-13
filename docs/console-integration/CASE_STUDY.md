# Full-Stack AI Operations Console

An operator needs more than a successful API response: the workflow version, approval decision, attempts and eventual outcome. I built a console connecting these controls across a browser, API, database and worker.

The Next.js/React interface configures versioned workflows, submits executions, approves or rejects requests, inspects saved history and recovers failures. Fastify validates requests and enforces sessions, roles and ownership. PostgreSQL/Prisma stores immutable execution snapshots and coordinates a standalone worker through leases and conditional commits.

Approval precedes outbound HTTP. Duplicate admissions retain one run identity; bounded retries/deadlines handle transport failures. Recovery preserves the run and attempt history. A real worker-kill test verifies lease recovery; stale ownership cannot commit. Deterministic triage and synthetic tickets make these controls reproducible without private data or a paid live LLM.

The inspected [CI run](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/actions/runs/38337575725) passed 58/58 system checks and 10/10 desktop/mobile browser cases. A separate Docker job passed 10/10 HTTP smoke checks and another 10/10 browser cases against compiled services and native PostgreSQL. Reports, authentic recordings and provenance are retained in the [evidence index](EVIDENCE.md).

This demonstrates full-stack implementation, API integration, durable workflow state and failure-path verification. It does not establish live LLM quality, customer outcomes or production traffic. The sandbox cache is process-local, ownership is per user, and self-approval is allowed. Production identity administration, monitoring, backups, hosting and live-provider evaluation remain future work.

Stack: Next.js, React, TypeScript, Fastify, PostgreSQL, Prisma, Docker Compose, Vitest and Playwright. [Source and documentation](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21).
