const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('.pw-browsers');
const {chromium,webkit}=require('playwright');
const origin='http://127.0.0.1:4173';
(async()=>{
 const results=[];
 for(const [engine,launcher]of Object.entries({chromium,webkit})){
  const browser=await launcher.launch();
  try{
   for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();
    for(const slug of ['taskpilot','pixe','translateplus','willify','natour']){
     await page.goto(`${origin}/work/${slug}/`,{waitUntil:'networkidle'});
     const media=page.locator('.ew-media');
     await media.getByRole('button',{name:'Play silent walkthrough'}).click();
     let decoded=true;
     try{await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&!v.paused&&v.currentTime>0},{},{timeout:3000});}
     catch(error){if(engine!=='webkit')throw error;decoded=false;}
     assert.equal(await page.locator('video source').count(),2);
     assert.equal(await page.locator('video').evaluate(v=>v.muted),true);
     await media.getByRole('button',{name:'Pause',exact:true}).click();
     assert.equal(await page.locator('video').evaluate(v=>v.paused),true);
     const range=page.getByRole('slider',{name:'Reveal historical screen'});
     await range.focus();await range.press('End');assert.equal(await range.inputValue(),'100');
     await range.press('Home');assert.equal(await range.inputValue(),'0');
     await page.getByRole('button',{name:'Show both images'}).click();
     assert.equal(await page.locator('.ew-comparison-stacked figure').count(),2);
     await media.getByRole('button',{name:'Play silent walkthrough'}).click();
     await page.waitForFunction(()=>!document.querySelector('video').paused);
     await page.evaluate(()=>scrollTo({top:document.body.scrollHeight,behavior:'instant'}));
     await page.waitForFunction(()=>document.querySelector('video').paused);
     await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
     fs.mkdirSync('E:/media/ewstudios-case-studies/qa',{recursive:true});
     await page.screenshot({path:`E:/media/ewstudios-case-studies/qa/${engine}-${width}-${slug}.png`,fullPage:true});
     results.push({engine,width,slug,passed:true,mediaDecoding:decoded?'passed':'blocked: Windows WebKit cannot decode even standalone H.264 baseline MP4 (NotSupportedError)',checks:['both formats attached on intent','muted attribute','pause','keyboard range endpoints','stacked alternative','offscreen pause']});
    }
    await context.close();
   }
   const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
   const page=await context.newPage();await page.goto(`${origin}/case-studies/#ewstudios`,{waitUntil:'networkidle'});
   const tiles=page.locator('#ewstudios .ew-media');
   await tiles.nth(0).getByRole('button',{name:'Play silent walkthrough'}).click();
   await page.waitForFunction(()=>!document.querySelector('#ewstudios video').paused);
   await tiles.nth(1).getByRole('button',{name:'Play silent walkthrough'}).click();
   await page.waitForFunction(()=>{const vs=document.querySelectorAll('#ewstudios video');return vs[0].paused&&!vs[1].paused});
   results.push({engine,scope:'studio index',passed:true,checks:['only active tile plays']});
   await context.close();
   const motionContext=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
   const motionPage=await motionContext.newPage();
   const errors=[];motionPage.on('pageerror',error=>errors.push(error.message));
   for(const slug of ['ewstudios','taskpilot','pixe','translateplus','willify','natour']){
    await motionPage.goto(`${origin}/work/${slug}/`,{waitUntil:'networkidle'});
    await motionPage.locator('section[aria-labelledby="architecture-title"]').scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(()=>document.querySelector('canvas'));
    assert.deepEqual(errors,[]);
    assert.ok(await motionPage.locator('.ew-diagram-wide').isVisible());
    results.push({engine,slug,scope:'motion enabled',passed:true,checks:['Stage loads after scroll','diagram readable','no page errors']});
   }
   await motionContext.close();
  }finally{await browser.close();fs.writeFileSync('docs/ewstudios/interaction-results.json',JSON.stringify(results,null,2));}
 }
 console.log(`${results.length} interaction scenarios passed`);
})().catch(e=>{console.error(e);process.exitCode=1});
