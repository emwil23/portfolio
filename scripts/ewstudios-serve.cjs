// Serve the export with compression and byte ranges, as on the production host.
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const zlib=require('node:zlib');
const root=path.resolve('out');
const mime={'.html':'text/html','.txt':'text/plain','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.webm':'video/webm','.json':'application/json','.woff2':'font/woff2','.woff':'font/woff'};
http.createServer((request,response)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));}catch{response.writeHead(400).end();return;}
 if(!file.startsWith(root+path.sep)&&file!==root){response.writeHead(403).end();return;}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const data=fs.readFileSync(file),ext=path.extname(file);
  response.setHeader('Content-Type',mime[ext]||'application/octet-stream');
  response.setHeader('Cache-Control',ext==='.html'?'no-cache':'public, max-age=600');
  response.setHeader('Accept-Ranges','bytes');
  const range=/^bytes=(\d+)-(\d*)$/.exec(request.headers.range||'');
  if(range){
   const start=Number(range[1]),end=range[2]?Number(range[2]):data.length-1;
   if(start>end||end>=data.length){response.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();return;}
   response.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});response.end(data.subarray(start,end+1));return;
  }
  if(/\b(gzip)\b/.test(request.headers['accept-encoding']||'')&&/\.(html|txt|css|js|json|svg)$/.test(file)){
   response.setHeader('Content-Encoding','gzip');response.setHeader('Vary','Accept-Encoding');response.end(zlib.gzipSync(data));
  }else response.end(data);
 }catch{response.writeHead(404).end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Static export: http://127.0.0.1:4173'));
