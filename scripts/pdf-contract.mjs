import {PDFDocument,PDFDict,PDFArray,PDFName,PDFString,PDFHexString} from 'pdf-lib';

export const resumeLinks = [
 'https://github.com/naraya07pedro-spec',
 'https://www.linkedin.com/in/evannaraya',
 'https://github.com/naraya07pedro-spec/agent-runtime-python',
 'https://github.com/naraya07pedro-spec/production-integration-reference',
 'https://github.com/naraya07pedro-spec/varevant.com/tree/main/examples/agentic-systems-lab/knowledge-runtime',
 'https://github.com/naraya07pedro-spec/varevant.com/tree/main/n8n'
];
// Parsing and annotations are independent of hash consent. No PDF bytes or
// extracted personal fields enter reports or CI artifacts.
export async function inspectPdf(bytes){
 const doc=await PDFDocument.load(bytes,{throwOnInvalidObject:true,updateMetadata:false});
 if(doc.isEncrypted||doc.getPageCount()!==1)throw Error('Expected one unencrypted page');
 for(const [,object] of doc.context.enumerateIndirectObjects()){
  const dict=object instanceof PDFDict?object:object?.dict instanceof PDFDict?object.dict:null;
  if(!dict)continue;
  for(const [key,value] of dict.entries()){
   if(['/JS','/JavaScript','/OpenAction','/AA','/EmbeddedFiles','/EF','/AF'].includes(key.toString())&&value.toString()!=='null'||
      key.toString()==='/Type'&&value.toString()==='/EmbeddedFile'||
      key.toString()==='/S'&&['/JavaScript','/Launch'].includes(value.toString()))throw Error('Active or embedded PDF data');
  }
 }
 const page=doc.getPages()[0],{width,height}=page.getSize(),links=[];
 const annotations=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);
 for(let i=0;i<(annotations?.size()||0);i++){
  const a=annotations.lookup(i,PDFDict);
  if(a.get(PDFName.of('Subtype'))?.toString()!=='/Link')continue;
  const action=a.lookupMaybe(PDFName.of('A'),PDFDict),uri=action?.lookup(PDFName.of('URI'));
  if(!(uri instanceof PDFString||uri instanceof PDFHexString))throw Error('Link lacks a URI');
  const rect=a.lookup(PDFName.of('Rect'),PDFArray).asArray().map(x=>Number(x.toString()));
  if(rect.length!==4||rect.some(x=>!Number.isFinite(x))||rect[0]<0||rect[1]<0||rect[2]>width||rect[3]>height||rect[2]<=rect[0]||rect[3]<=rect[1])throw Error('Invalid link hit rectangle');
  const url=uri.decodeText();if(![...resumeLinks,'https://varevant.com'].includes(url))throw Error('Unexpected resume destination');links.push(url);
 }
 if(resumeLinks.some(url=>!links.includes(url)))throw Error('Missing required clickable profile/project link');
 return {pages:1,clickableRequiredLinks:resumeLinks.length};
}

export async function probeReleaseLink(url){
 try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});await r.body?.cancel();return r.status;}
 catch{return 0;}
}
