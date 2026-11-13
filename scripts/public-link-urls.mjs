// Validate only actual static HTTP destinations, not preconnect origins or JS string fragments.
export function publicLinkUrls(html, markdownDocuments=[]) {
  const urls=new Set();
  // Keep opening <script> tags (and their src= attributes), but exclude inline JS.
  const noInlineScripts=html.replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2');
  for(const match of noInlineScripts.matchAll(/<([a-z][\w:-]*)\b([^>]*)>/gi)) {
    const tag=match[1].toLowerCase(), attributes=match[2];
    if(!['a','link','script','img','iframe','source'].includes(tag))continue;
    const rel=attributes.match(/\brel="([^"]*)"/i)?.[1]?.toLowerCase().split(/\s+/) || [];
    if(tag==='link' && (rel.includes('preconnect')||rel.includes('dns-prefetch')))continue;
    for(const attribute of attributes.matchAll(/\b(?:href|src)="(https:\/\/[^"]+)"/gi))
      urls.add(attribute[1]);
  }
  for(const markdown of markdownDocuments)
    for(const match of markdown.matchAll(/\]\((https:\/\/[^)]+)\)/g))
      urls.add(match[1]);
  return [...urls].sort();
}
