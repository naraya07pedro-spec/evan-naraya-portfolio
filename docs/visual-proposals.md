# Visual proposals — approval required

**No proposal is implemented in the website.** Captures use real Chromium and temporary browser-injected CSS against the local checkout. No image synthesis, portrait replacement or baseline regeneration is used. Run `node scripts/propose-visual-fixes.mjs`; its images are saved in `artifacts/visual-proposals`. The separate Preview safety audit uploads these files for the exact PR head. Existing historical screenshots remain in `docs/qa`.

## Mobile portrait / text overlap

Reproduced at 320, 375 and 390px. The title sits at 40% viewport height over the face/hair. A vertical-only move clears the title but leaves small text/actions near the face at 320px. The smallest scoped correction prepared here uses two declarations:

```css
/* PROPOSAL ONLY — never imported by the application */
@media (max-width: 760px) {
  .intro-role { top: 32%; } /* existing 40% */
  .shared-person { left: 66%; } /* existing 56% */
}
```

| Phone width | Role movement | Portrait movement |
| --- | ---: | ---: |
| 320px | −64px | +32px |
| 375px | −64.97px | +37.5px |
| 390px | −67.52px | +39px |

Source photo bytes, dimensions, scale and aspect ratio stay unchanged. **The visible right-edge crop/composition would change**, so approval must cover both movements. Name, role content and typography stay intact; hero geometry from 768px upward is unchanged. Locally inspected target screenshots found no new name/title collision or document overflow. This is not a mathematical-minimum claim or a guarantee at every untested height.

Compare `320/375/390-hero-before.png` with `*-hero-proposed.png` in the same-head preview artifact. Raw captures preserve exact pixels. The current baseline issue is also visible in [historical mobile screenshot](qa/mobile-hero.webp). Local paired comparisons were inspected before the workspace connection failed; they were not committed or used to replace the baseline.

Owner decision: approve this exact mobile exception, request another placement, or explicitly keep the known overlap deferred. Before implementation review short/tall phone heights, reduced motion and scroll states. Do not silently regenerate the accepted baseline.

## Device toolbar contrast

Axe reproduced 4.33:1 for both 9px toolbar labels: `#767389` on opaque `#080910`. The target is 4.5:1. +1 and +2 equal-channel RGB increments stay below it; +3 is the smallest tested increment that reaches it.

```css
/* PROPOSAL ONLY — only the two toolbar labels */
.device-top > b { color: #79768c; }
```

Calculated sRGB contrast is **4.5256:1**. Temporary-rule axe checks found no remaining toolbar contrast failures across the seven target widths at both flagship states. This narrow fix does not certify overall WCAG 2.2 AA.

Compare `390-project-1-before.png` / `390-project-1-proposed.png`, and the project-2 equivalents, in the same-head artifact. The [historical diagram](qa/mobile-diagram.webp) retains the existing issue. `report.json` records CSS, geometry, source hashes and axe findings.

Owner decision: approve this exact label color, or retain the failure as a deferred risk without an AA-completion claim. Any implementation needs separate visual approval and regression evidence.

## Evidence retention

The application hashes are checked before/after capture. The original 98 source comparisons and all historical QA screenshots/JSON remain unchanged. New per-run raw PNGs and JSON are CI artifacts; retaining the small historical archive in Git avoids losing its only copy to artifact expiry. No historical evidence migration/deletion is authorized by this proposal workflow.
