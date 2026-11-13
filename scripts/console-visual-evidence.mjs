export const PROTECTED_VISUAL_MAX_RATIO = 0.0005;

// Diagnostic evidence is not approval: over-threshold captures still fail CI.
// A truncated run is explicitly marked incomplete.
export function summarizeProtectedVisualComparisons(comparisons, expectedCount) {
  if (!Array.isArray(comparisons) || !Number.isInteger(expectedCount) || expectedCount <= 0)
    throw new TypeError('Expected comparisons and a positive count');
  const comparable = comparisons.filter(item => Number.isFinite(item.ratio) && !item.dimensionsMismatch);
  const failures = comparisons.filter(item =>
    !Number.isFinite(item.ratio) || item.dimensionsMismatch || item.ratio > PROTECTED_VISUAL_MAX_RATIO);
  return {
    expectedCount,
    observedCount: comparisons.length,
    complete: comparisons.length === expectedCount && comparable.length === expectedCount,
    comparableCount: comparable.length,
    dimensionMismatchCount: comparisons.length - comparable.length,
    allowedChangedRatio: PROTECTED_VISUAL_MAX_RATIO,
    maxObservedRatio: comparable.length ? Math.max(...comparable.map(item => item.ratio)) : null,
    failedCount: failures.length,
    failures: failures.map(item => ({
      engine: item.engine, viewport: item.viewport, state: item.state,
      changedPixels: item.changedPixels, comparedPixels: item.comparedPixels,
      ratio: item.ratio, registration: item.registration, dimensionsMismatch: item.dimensionsMismatch || null,
      before: item.before, after: item.after, heatmap: item.heatmap || null,
    })),
  };
}
