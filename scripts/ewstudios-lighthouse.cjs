const fs=require('node:fs');
const path=require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('.pw-browsers');
const {chromium}=require('playwright');
(async()=>{
 const {default:lighthouse}=await import('lighthouse');
 const root='E:/media/ewstudios-case-studies/lighthouse';
 fs.mkdirSync(root,{recursive:true});
 const results=[];
 for(const slug of ['ewstudios','taskpilot','pixe','translateplus','willify','natour']){
  const chrome=await chromium.launch({headless:true,args:['--remote-debugging-port=9223']});
  try{
   const {lhr}=await lighthouse(`http://127.0.0.1:4173/work/${slug}/`,{port:9223,output:'json',onlyCategories:['performance','accessibility','best-practices','seo']});
   fs.writeFileSync(`${root}/${slug}.json`,JSON.stringify(lhr));
   const row={slug,date:lhr.fetchTime,url:lhr.finalDisplayedUrl,profile:'Lighthouse mobile, simulated throttling, default theme, cold cache; gzip static export server',version:lhr.lighthouseVersion,scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,lhr.audits[k].numericValue])),failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,details:Array.isArray(a.details?.items)?a.details.items.slice(0,6):undefined}))};
   results.push(row);fs.writeFileSync('docs/ewstudios/lighthouse-results.json',JSON.stringify(results,null,2));console.log(slug,JSON.stringify(row.scores),JSON.stringify(row.metrics));
  }finally{await chrome.close();}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
