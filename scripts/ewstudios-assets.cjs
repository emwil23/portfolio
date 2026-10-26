const fs=require('node:fs');
const path=require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('.pw-browsers');
const {chromium}=require('playwright');
const sharp=require('sharp');
const root='E:/media/ewstudios-case-studies';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
(async()=>{
  const browser=await chromium.launch();
  const manifest=JSON.parse(fs.readFileSync(`${root}/history/manifest.json`));
  try{
    for(const row of manifest){
      const page=await browser.newPage({viewport:{width:1440,height:900}});
      await page.goto(`file:///${row.renderDirectory || `${root}/history/${row.slug}`}/dist/index.html`,{waitUntil:'networkidle'});
      await page.addStyleTag({content:'.dev--icon{visibility:hidden!important}'});
      if(row.slug==='pixe')row.changes.push('Developer portrait hidden to keep owner imagery exclusive to platform study.');
      await page.screenshot({path:`${root}/masters/${row.slug}-before.png`});
      await sharp(`${root}/masters/${row.slug}-before.png`).resize(1200).webp({quality:82}).toFile(`${root}/masters/${row.slug}-before.webp`);
      fs.copyFileSync(`${root}/masters/${row.slug}-before.webp`,`public/assets/ewstudios/${row.slug}-before.webp`);
      row.captureDate=new Date().toISOString();row.file=`${row.slug}-before.webp`;
      await page.close();
    }
  }finally{await browser.close();}
  fs.writeFileSync(`${root}/history/manifest.json`,JSON.stringify(manifest,null,2));
  fs.writeFileSync('docs/ewstudios/history-manifest.json',JSON.stringify(manifest,null,2));
  const definitions=[['ewstudios','EWSTUDIOS','Five AI products.','One $7 server.','#2BD98B'],['taskpilot','TaskPilot','Your day,','co-piloted.','#FF6B3D'],['pixe','Pixe','A light table for','creative direction.','#D4FF3A'],['translateplus','Translate+','Say it like','you mean it.','#FFB43A'],['willify','Willify','A vibe is only','the beginning.','#B19AFF'],['natour','Natour','A plan with its feet','on the ground.','#FF8A5C']];
  for(const[slug,name,line1,line2,color]of definitions){
    // Original vector editorial art; avoids reusing third-party music/photo artwork for promotion.
    const labels=['TaskPilot','Pixe','Translate+','Willify','Natour'];
    const motif=slug==='ewstudios'?labels.map((label,i)=>`<rect x="800" y="${95+i*82}" width="300" height="56" rx="12" fill="#222225" stroke="${color}"/><text x="825" y="${132+i*82}" font-size="23">${label}</text>`).join(''):`<circle cx="960" cy="300" r="160" fill="none" stroke="${color}" stroke-width="2"/><path d="M810 300H1110M960 150V450" stroke="${color}" stroke-width="2"/><text x="960" y="320" text-anchor="middle" font-size="48">${escape(name)}</text>`;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#141416"/><g fill="#F5F5F4" font-family="Arial,sans-serif"><text x="64" y="86" fill="${color}" font-size="22" letter-spacing="3">EWSTUDIOS / ${escape(name.toUpperCase())}</text><text x="64" y="240" font-size="56" font-weight="700">${escape(line1)}</text><text x="64" y="308" font-size="56" font-weight="700">${escape(line2)}</text><path d="M64 365H720" stroke="${color}" stroke-width="3"/><text x="64" y="415" fill="#B8B8BC" font-size="22">Product decisions, with the evidence.</text><text x="64" y="548" font-size="20">EMMANUEL WILSON / emmanuelwilson.tech</text>${motif}${slug==='ewstudios'?'<text x="64" y="458" fill="#B8B8BC" font-size="18">$7/month Heroku Basic · free tiers elsewhere</text>':''}</g></svg>`;
    fs.writeFileSync(`${root}/masters/${slug}-og.svg`,svg);
    await sharp(Buffer.from(svg)).webp({quality:90}).toFile(`${root}/masters/${slug}-og.webp`);
    fs.copyFileSync(`${root}/masters/${slug}-og.webp`,`public/assets/ewstudios/${slug}-og.webp`);
  }
  await sharp(`${root}/masters/ewstudios-og.webp`).resize(900).webp({quality:82}).toFile(`${root}/masters/ewstudios-glimpse.webp`);
  fs.copyFileSync(`${root}/masters/ewstudios-glimpse.webp`,'public/assets/glimpse/ewstudios.webp');
})().catch(e=>{console.error(e);process.exitCode=1});
