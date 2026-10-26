const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('.pw-browsers');
const {chromium} = require('playwright');
const sharp = require('sharp');
const root = 'E:/media/ewstudios-case-studies';
const slugs = process.argv[2] ? [process.argv[2]] : ['taskpilot','pixe','translateplus','willify','natour'];
const pause = page => page.waitForTimeout(850); // Recorded pacing, not a latency measurement.
(async()=>{
  fs.mkdirSync(`${root}/recordings`,{recursive:true});
  const browser = await chromium.launch({headless:true});
  const manifest=fs.existsSync(`${root}/capture-manifest.json`) ? JSON.parse(fs.readFileSync(`${root}/capture-manifest.json`)) : [];
  try {
    for(const slug of slugs){
      const context=await browser.newContext({viewport:{width:1440,height:900},colorScheme:'dark',recordVideo:{dir:`${root}/recordings`,size:{width:1440,height:900}}});
      const page=await context.newPage();
      const recordStarted=Date.now();
      const row={slug,date:new Date().toISOString(),url:`https://${slug}.ewstudios.workers.dev/app`,actions:[],limitations:[]};
      try{
        await page.goto(row.url,{waitUntil:'networkidle',timeout:30000});
        if(slug==='taskpilot'){
          await page.getByRole('button',{name:'Skip',exact:true}).click();
          for(const title of ['Review portfolio today 5pm p1 ~30m','Export project backup today 6pm ~15m']){
            await page.getByRole('button',{name:/New task/}).click();
            await page.getByPlaceholder('Call mom tomorrow at 5pm p1 #Family ~30m').fill(title);
            await pause(page);await page.getByRole('button',{name:'Add task',exact:true}).click();
          }
          await page.getByRole('link',{name:'Board',exact:true}).first().click();await pause(page);
          row.actions.push('Local quick add twice; open Board. Demo task text entered through UI.');
          row.limitations.push('No signed-in AI calendar planning recorded.');
        }else if(slug==='pixe'){
          await page.getByRole('button',{name:'Try an example',exact:true}).click();
          await page.waitForTimeout(13000);
          row.actions.push('Open built-in example board; real source search/build state.');
          row.limitations.push('No authenticated AI brief; source availability is whatever the live service returned.');
        }else if(slug==='translateplus'){
          await page.getByRole('checkbox',{name:'Type in Hinglish'}).check();
          await page.getByPlaceholder('Type or paste text…').fill('kya haal hai');await pause(page);
          row.actions.push('Enable rule-based Hinglish and type kya haal hai.');
          row.limitations.push('Headless Chromium has no downloaded Translator model; no on-device translation result or AI tone result claimed.');
        }else if(slug==='willify'){
          await page.getByRole('link',{name:'Search',exact:true}).click();
          await page.getByPlaceholder('A song, an album, an artist').fill('Tycho');
          await page.waitForTimeout(6500);
          const play=page.getByRole('button',{name:/Play /}).first();
          if(await play.count()){await play.click();await pause(page);}
          row.actions.push('Search live catalogue for Tycho; user-triggered preview if available. Final encode strips every audio stream.');
          row.limitations.push('No signed-in AI DJ flow.');
        }else{
          await page.getByText('Or plan it yourself, without AI',{exact:true}).click();
          await page.getByPlaceholder('Lisbon',{exact:true}).fill('Lisbon');
          await page.getByRole('button',{name:'Start an empty trip'}).click();await page.waitForTimeout(6500);
          row.actions.push('Create an empty Lisbon trip through live place lookup.');
          row.limitations.push('No authenticated AI plan streaming; no fabricated checked stops.');
        }
        await pause(page);
      }catch(error){row.limitations.push(error.message.split('\n')[0]);}
      // Keep required source credits in the captured frame, without inventing product state.
      if(slug==='willify'){
        const credit=page.getByText('Previews courtesy of iTunes',{exact:false}).first();
        const badge=page.locator('a[href*="music.apple.com"] img').first();
        row.credits={itunes:await credit.count(),badge:await badge.count()};
        if(!row.credits.itunes || !row.credits.badge) row.limitations.push('Clip withheld: required live Apple credit/badge was not present.');
      }
      if(slug==='natour') await page.locator('.maplibregl-ctrl-attrib').scrollIntoViewIfNeeded();
      row.sourceLinks = await page.locator('a[href^="https://"]').evaluateAll(links => links.map(a=>({label:a.textContent?.trim() || a.getAttribute('aria-label'),url:a.href})).filter(a=>/unsplash|openverse|creativecommons|music.apple|openstreetmap|openfreemap|openmaptiles|wikivoyage|nasa/.test(a.url)));
      const clipStart=(Date.now()-recordStarted)/1000;
      if(slug==='taskpilot'){
        await page.getByRole('link',{name:'Calendar',exact:true}).first().click();await page.waitForTimeout(1800);
        await page.getByRole('link',{name:'Board',exact:true}).first().click();
        row.actions.push('Excerpt switches Calendar to Board.');
      }else if(slug==='pixe'){
        const print=page.locator('[data-item-id]').first();await print.focus();await page.waitForTimeout(1000);await print.press('ArrowRight');await page.waitForTimeout(1000);await print.press('ArrowLeft');
        row.actions.push('Excerpt selects a real print and moves it with the keyboard, then restores it.');
      }else if(slug==='translateplus'){
        const input=page.getByPlaceholder('Type or paste text…');await input.fill('namaste');await page.waitForTimeout(1800);await input.fill('kya haal hai');
        row.actions.push('Excerpt types two real rule-based Hinglish examples.');
      }else if(slug==='willify'){
        await page.getByRole('button',{name:/Pause/}).first().click();await page.waitForTimeout(1500);
        await page.getByRole('button',{name:/Play /}).first().click();
        row.actions.push('Excerpt pauses and resumes the preview; badge/credit remain visible.');
      }else{
        await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.waitForTimeout(1500);
        await page.getByRole('button',{name:'Zoom out',exact:true}).click();
        row.actions.push('Excerpt zooms the live map with its real attribution visible.');
      }
      await page.waitForTimeout(3500);
      await page.screenshot({path:`${root}/masters/${slug}-product.png`});
      await context.storageState({path:`${root}/masters/${slug}-state.json`,indexedDB:true});
      const video=page.video();
      await context.close();
      const raw=await video.path();
      const safe = slug!=='willify' || (row.credits.itunes && row.credits.badge);
      if(safe){
        for(const [ext,args] of [['mp4',['-c:v','libx264','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart']],['webm',['-c:v','libvpx-vp9','-crf','36','-b:v','0']]]){
          execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(clipStart),'-i',raw,'-t','6','-an','-vf','fps=24,scale=1200:-2',...args,`${root}/recordings/${slug}.${ext}`]);
          fs.copyFileSync(`${root}/recordings/${slug}.${ext}`,`public/assets/ewstudios/${slug}.${ext}`);
        }
      }
      await sharp(`${root}/masters/${slug}-product.png`).resize(1200).webp({quality:82}).toFile(`${root}/masters/${slug}.webp`);
      fs.copyFileSync(`${root}/masters/${slug}.webp`,`public/assets/ewstudios/${slug}.webp`);
      const phone=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,colorScheme:'dark',storageState:`${root}/masters/${slug}-state.json`});
      try{
        const screen=await phone.newPage();await screen.goto(page.url(),{waitUntil:'networkidle',timeout:30000});
        await screen.screenshot({path:`${root}/masters/${slug}-phone.png`});
        await sharp(`${root}/masters/${slug}-phone.png`).webp({quality:82}).toFile(`${root}/masters/${slug}-phone.webp`);
        fs.copyFileSync(`${root}/masters/${slug}-phone.webp`,`public/assets/ewstudios/${slug}-phone.webp`);
      }finally{await phone.close();}
      row.recording=safe;
      const previous=manifest.findIndex(entry=>entry.slug===slug);
      if(previous>=0) manifest[previous]=row; else manifest.push(row);
      console.log(slug,JSON.stringify(row));
    }
  }finally{await browser.close();fs.writeFileSync(`${root}/capture-manifest.json`,JSON.stringify(manifest,null,2));}
})().catch(error=>{console.error(error);process.exitCode=1});
