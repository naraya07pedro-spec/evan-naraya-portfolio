# Authentic portfolio captures

Captured in Chromium on 13 October 2026. Before is PR #2 `a82ec7c268dc0d909c3cd3f64222bbd66bd3cae6`; after uses the HTML/CSS in [scope.json](../../console-integration/scope.json). [Manifest](manifest.json) binds these preserved image bytes. No UI/frames were generated.

| View | Before | After |
| --- | --- | --- |
| Desktop hero, 1440 × 900 | [Before](desktop-hero-before.png) | [After](desktop-hero-after.png) |
| Mobile hero, 390 × 844 | [Before](mobile-hero-before.png) | [After](mobile-hero-after.png) |
| New desktop Console | Intentional addition | [Normal](desktop-console-after.png), [reduced motion](desktop-console-reduced-motion.png) |
| New mobile Console | Intentional addition | [Stacked frame](mobile-console-after.png) |

Hero comparisons hide only page-progress decoration in both pages. New Console frames retain actual composition. Mobile image/caption continues below the viewport in normal flow; the image link opens full size. Wider current comparisons and old diagrams are CI artifacts from the [runner](../../../scripts/console-integration-qa.mjs).

[Console application gallery](https://github.com/naraya07pedro-spec/fullstack-ai-operations-console/tree/654ce3b762f45a126ff844604daf0d830e54bf21/docs/screenshots) independently demonstrates configuration/history/approval/failure/recovery/rejection.
