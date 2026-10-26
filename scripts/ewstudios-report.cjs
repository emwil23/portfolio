const fs=require('node:fs');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const sharp=require('sharp');
(async()=>{
 const browsers=JSON.parse(fs.readFileSync('docs/ewstudios/browser-results.json'));
 const interactions=JSON.parse(fs.readFileSync('docs/ewstudios/interaction-results.json'));
 const lighthouse=JSON.parse(fs.readFileSync('docs/ewstudios/lighthouse-results.json'));
 const captures=JSON.parse(fs.readFileSync('public/evidence/ewstudios-captures.json'));
 const coldHome=JSON.parse(fs.readFileSync('docs/ewstudios/home-cold-results.json'));
 assert.deepEqual(coldHome.appMediaRequests,[]);
 assert.deepEqual(coldHome.studyPrefetchRequests,[]);
 assert.equal(coldHome.glimpseRequested,true);
 assert.equal(browsers.failures.length,0);
 assert.equal(browsers.browsers.length,48);
 assert.equal(browsers.axe.length,12);
 assert.ok(browsers.axe.every(row=>row.violations.length===0));
 assert.equal(interactions.length,34);
 assert.ok(interactions.every(row=>row.passed));
 assert.equal(lighthouse.length,6);
 assert.ok(lighthouse.every(row=>Object.values(row.scores).every(score=>score>=95)));
 assert.equal(captures.length,5);
 const media=[];
 for(const slug of ['ewstudios','taskpilot','pixe','translateplus','willify','natour']){
  const og=await sharp(`public/assets/ewstudios/${slug}-og.webp`).metadata();
  assert.equal(og.width,1200);assert.equal(og.height,630);
  if(slug==='ewstudios')continue;
  for(const ext of ['mp4','webm']){
   const file=`public/assets/ewstudios/${slug}.${ext}`;
   const probe=JSON.parse(execFileSync('ffprobe',['-v','quiet','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
   assert.ok(probe.streams.every(stream=>stream.codec_type==='video'),'No audio stream');
   assert.equal(probe.streams[0].codec_name,ext==='mp4'?'h264':'vp9');
   assert.equal(probe.streams[0].width,1200);assert.equal(probe.streams[0].height,750);
   assert.ok(Number(probe.format.duration)<=7);
   media.push({slug,format:ext,codec:probe.streams[0].codec_name,durationSeconds:Number(probe.format.duration),bytes:fs.statSync(file).size,audioStreams:0});
  }
 }
 const report={date:new Date().toISOString(),scope:'Exported portfolio, separate from app README reports',commands:['npx tsc --noEmit','npm run build','node scripts/ewstudios-serve.cjs','node scripts/ewstudios-checks.cjs','node scripts/ewstudios-interactions.cjs','node scripts/ewstudios-lighthouse.cjs','node scripts/ewstudios-report.cjs'],lighthouse:lighthouse.map(({failedAudits,...row})=>row),browsers:{date:browsers.date,cases:browsers.browsers.length,passed:browsers.browsers.filter(row=>row.passed).length,engines:['chromium','webkit'],viewports:[{width:1440,height:900},{width:390,height:844}],themes:['light','dark'],reducedMotion:'reduce',failures:browsers.failures},axe:browsers.axe,interactions,home:browsers.home,liveApps:browsers.liveApps,media,limitations:[...browsers.limitations,'Windows WebKit playback blocked: standalone baseline H.264 probe returned NotSupportedError; page, source attachment, controls and Stage checks ran.','Authenticated AI capture workflows were unavailable; see capture manifest.','Historical views are labelled compatibility reconstructions of 2021 source; original CRA/node-sass toolchain builds were not reproduced.','App README quality results were not rerun; media permissions were not independently audited.']};
 report.coldHome=coldHome;
 fs.writeFileSync('public/evidence/ewstudios-checks.json',JSON.stringify(report,null,2));
 console.log('Evidence verified: 48 page cases, 12 clean axe audits, 34 interaction scenarios, 6 Lighthouse reports >=95, 10 silent encodes.');
})().catch(error=>{console.error(error);process.exitCode=1});
