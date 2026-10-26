// Compatibility renders of archived source; never deploy or call its obsolete services.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const toolRoot = process.env.PATH.split(path.delimiter).map(dir=>path.resolve(dir,'..')).find(dir=>fs.existsSync(path.join(dir,'esbuild','package.json'))&&fs.existsSync(path.join(dir,'sass','package.json')));
if(!toolRoot) throw new Error('Run: npm exec --cache .npm-cache --yes --package esbuild --package sass -- node scripts/ewstudios-history.cjs');
const esbuild = require(path.join(toolRoot,'esbuild'));
const sass = require(path.join(toolRoot,'sass'));
const root = 'E:/media/ewstudios-case-studies/history';
const definitions = [['taskpilot','taskmanager'],['pixe','pixe'],['translateplus','TranslateApp'],['willify','Willify'],['natour','natour']];
(async () => {
  const manifest = [];
  for (const [slug, repo] of definitions) {
    const origin = slug==='natour' ? 'D:/Code/AIPro/AIPro/ew-apps/natour' : `D:/Code/_review/${repo}`;
    const git = (...args) => execFileSync('git', ['-c',`safe.directory=${origin}`,'-C',origin,...args], {encoding:'utf8'}).trim();
    const revision = slug==='natour' ? '2be11cce40eda5940241a55dc26c5ff64c4dfa08' : git('rev-parse','HEAD');
    const dir = `${root}/${slug}${slug==='natour'?'-2021':''}`;
    fs.mkdirSync(dir,{recursive:true});
    git('archive',revision,`--output=${dir}/source.tar`);
    execFileSync('tar',['-xf','source.tar'],{cwd:dir});
    const changes = ['React 18 compatibility runtime and esbuild/Dart Sass replace unsupported CRA 4/node-sass 6 tooling; source layout and styles retained. No production backend.'];
    if (slug === 'willify') {
      fs.writeFileSync(`${dir}/src/index.js`, `import './Components/sass/main.scss'; import React from 'react'; import ReactDOM from 'react-dom'; import Login from './Components/Login'; ReactDOM.render(<Login/>,document.getElementById('root'));`);
      changes.push('Login component only; dead Spotify server not connected.');
    }
    if(slug==='natour'){
      fs.writeFileSync(`${dir}/src/index.js`, `import React from 'react'; import ReactDOM from 'react-dom'; import Header from './Components/Header'; ReactDOM.render(<Header/>,document.getElementById('root'));`);
      changes.push('Original 2021 Header component only. Sass image paths repaired to the archived src/img directory.');
    }
    await esbuild.build({entryPoints:[`${dir}/src/index.js`],outdir:`${dir}/dist`,bundle:true,loader:{'.js':'jsx','.jpg':'file','.png':'file','.svg':'file','.mp4':'file','.woff':'file','.woff2':'file','.ttf':'file','.eot':'file'},nodePaths:[path.resolve('node_modules')],logLevel:'silent',plugins:[
      {name:'historical-scss',setup(build){build.onLoad({filter:/\.scss$/},args=>({contents:sass.compile(args.path,{silenceDeprecations:['import','global-builtin','color-functions','legacy-js-api'],logger:sass.Logger.silent}).css.replaceAll('../../../img/','../../img/'),loader:'css',resolveDir:path.dirname(args.path)}));}},
      {name:'retired-services',setup(build){
        build.onLoad({filter:/api[\\/]unsplash\.js$/},()=>({contents:'export default {get: async () => ({data:{results:[]}})}',loader:'js'}));
        build.onLoad({filter:/icon-light\.svg$/},args=>({contents:`import React from 'react'; export const ReactComponent = props => React.createElement('img',{...props,src:${JSON.stringify('data:image/svg+xml;base64,'+fs.readFileSync(args.path).toString('base64'))},alt:'Willify'});`,loader:'js'}));
      }}
    ]});
    if(slug==='pixe') changes.push('Unsplash client replaced with an empty offline response; no exposed key, invented search results or developer portrait in capture.');
    const css = fs.existsSync(`${dir}/dist/index.css`) ? '<link rel="stylesheet" href="index.css">' : '';
    const semantic = slug==='translateplus' ? '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">' : '';
    fs.writeFileSync(`${dir}/dist/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Historical ${slug} source compatibility render</title>${css}${semantic}<div id="root"></div><script src="index.js"></script></html>`);
    manifest.push({slug,repo:origin,revision,renderDirectory:dir,commitDate:git('show','-s','--format=%cI',revision),method:'git archive selected revision; esbuild JSX bundle; Sass compile',changes,viewport:{width:1440,height:900},limitation:'Compatibility render, not an original-toolchain build.'});
    console.log(slug,revision);
  }
  fs.writeFileSync(`${root}/manifest.json`,JSON.stringify(manifest,null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1});
