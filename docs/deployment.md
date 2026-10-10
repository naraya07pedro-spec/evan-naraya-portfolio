# Release and rollback

Existing Netlify project: `evannaraya`; site ID `8d6b74f1-81c1-46e4-9a10-c3cda7c18bbe`; production branch `main`; publish directory `.`; no compilation command. The package contains development tooling only. Netlify uses NODE_ENV=production so browser/audit development dependencies are not installed during the static deployment.

Production baseline: commit `a4634a0e4161ca8667c873cc4f26c5c65041dca0`, published ready deploy `6ac76d9a8f678c5c17a6cf53`. Both were rechecked through their respective services, and the live page was opened.

## Required release sequence

1. Keep changes on `chore/portfolio-engineering-upgrade-20261008`.
2. Resolve exact resume-file/field consent and require `verify` plus `release-eligibility` on protected `main` without administrator bypass. Run `npm test` and `npm run verify:release`; both must pass for the final candidate. Review visual and accessibility artifacts, including deferred baseline defects.
3. Open a PR to main and verify GitHub Actions against its exact head commit.
4. Inspect the existing project's Netlify Deploy Preview, verify deployed source/asset hashes, test both PDF downloads and all important links.
5. Obtain explicit owner approval for that exact PR/commit and any accepted deferred risks.
6. Merge only after approval. Confirm Netlify's production commit_ref and ready/published state; then reopen the actual production page.

No auto-merge or publication is enabled by this upgrade. A successful Git push is not deployment verification.

## Rollback

The baseline commit is retained in Git and pinned in `docs/baseline.json`. The baseline Netlify deploy permalink is https://6ac76d9a8f678c5c17a6cf53--evannaraya.netlify.app/.

With owner authorization, restore that retained deploy in Netlify as an immediate rollback. Then revert the approved merge commit on main through a reviewed PR so Git and production converge; avoid force-pushing history. For a squash merge, revert that single commit. For a merge commit, use `git revert -m 1 <approved-merge-sha>`. Recheck both PDFs and the cinematic scroll state after rollback.

## Headers and indexing

Existing security headers remain. Added protections restrict base URL changes, embedded object execution, framing and form submission, and deny unused camera/microphone/location/payment capabilities. CSP deliberately does not impose untested script/style restrictions on Netlify's injected badge. It is a limited policy, not a claim of complete XSS protection. No tracking or report collection endpoint was introduced.

Robots and sitemap identify the one production page. Canonical remains production on previews. Netlify normally adds preview noindex headers; verify the actual response before release.

Root publication makes public repository documentation potentially reachable, depending on deploy tooling. It contains only public audit information. `.netlifyignore` is supplied for CLI packaging; do not assume every Git build path honors it. The preview audit must confirm that no dependency/artifact directory is exposed.

## Current release blockers

See [release safety](release-safety.md) for exact reviewed original/candidate hashes and consent requirements. The public PDFs remain reconstructed stand-ins until the owner approves selected exact files and fields. The release check is deliberately failing.

Read-only branch metadata confirms `main` protection is disabled, required checks are empty and rulesets absent. Admin protection access returned 403; the browser is signed out. Configure both `verify` and `release-eligibility` as required checks without bypass. A failing workflow alone does not block an unprotected merge.

The separate preview audit is network-dependent verification, not part of deterministic local quality or an authorization to merge. It uses the existing site's Deploy Preview and checks exact public asset bytes. Inspect final CI and Netlify provenance against the same head; do not infer deployment from a push. No private candidate bytes enter Git, Netlify or CI.
