// Exact messages reproduced on the public Netlify preview, not a blanket
// warning exemption. Raw findings remain in capture.json and CI logs.
export function knownPlatformWarning(engine,message){
 if(engine!=='firefox')return false;
 if(message==='warning: [JavaScript Warning: "Content-Security-Policy: Ignoring ‘x-frame-options’ because of ‘frame-ancestors’ directive."]')return true;
 return /^warning: \[JavaScript Warning: "Feature Policy: Skipping unsupported feature name “clipboard-write”\." \{file: "https:\/\/deploy-preview-\d+--evannaraya\.netlify\.app\/\.netlify\/scripts\/cdp" line: 1\}\]$/.test(message);
}
export function classifyCapture(report){
 return{
  engine:report.engine,viewport:report.viewport,
  knownBrowserHostingWarnings:report.errors.filter(m=>knownPlatformWarning(report.engine,m)),
  unexpectedConsoleFindings:report.errors.filter(m=>!knownPlatformWarning(report.engine,m)),
  networkFailures:report.failures
 };
}
