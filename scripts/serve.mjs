import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, sep, extname} from 'node:path';
import {fileURLToPath} from 'node:url';

const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
export async function serve(root, port=0) {
  root=resolve(root);
  const server=createServer(async(req,res)=>{
    try {
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(root+sep)||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(403);res.end();return;}
      if(!(await stat(file)).isFile()) throw new Error('not a file');
      res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
      res.end(await readFile(file));
    } catch {res.writeHead(404);res.end('Not found');}
  });
  await new Promise(r=>server.listen(port,'127.0.0.1',r));
  return {url:'http://127.0.0.1:'+server.address().port,close:()=>new Promise(r=>server.close(r))};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const server=await serve(process.argv[2]||'.',Number(process.env.PORT||4173));
  console.log('Portfolio: '+server.url);
}
