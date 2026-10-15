// Builds www/ (what Capacitor ships) from web/ (the same page as the Selah prototype).
// Everything is bundled locally so the app works offline: Bible text, audio, fonts and Three.js.
import {rmSync,mkdirSync,cpSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,join,basename} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const www=join(root,'www'),nm=join(root,'node_modules');
rmSync(www,{recursive:true,force:true});
cpSync(join(root,'web'),www,{recursive:true});
cpSync(join(root,'native/native.js'),join(www,'native.js'));
cpSync(join(root,'native/native.css'),join(www,'native.css'));
mkdirSync(join(www,'vendor'),{recursive:true});
cpSync(join(nm,'three/build/three.min.js'),join(www,'vendor/three.min.js'));

// Fonts: the same families the prototype loads from Google Fonts, from @fontsource
const FONTS={'gloock':[400],'figtree':[400,500,600,700],'jetbrains-mono':[400,500],'source-serif-4':[400,600],'noto-serif-hebrew':[400,600],'noto-serif':[400,600]};
mkdirSync(join(www,'fonts'),{recursive:true});
let css='';
for(const [pkg,weights] of Object.entries(FONTS)){
  for(const w of weights){
    const f=join(nm,'@fontsource',pkg,`${w}.css`);
    if(!existsSync(f))throw new Error(`Missing font file ${f}`);
    css+=readFileSync(f,'utf8').replace(/url\(\.\/files\/([^)]+)\)/g,(m,file)=>{
      cpSync(join(nm,'@fontsource',pkg,'files',file),join(www,'fonts',basename(file)));
      return `url(${basename(file)})`;
    })+'\n';
  }
}
writeFileSync(join(www,'fonts/fonts.css'),css);

// Page: wrap the prototype fragment in a full document and point it at the local copies
let page=readFileSync(join(www,'index.html'),'utf8');
const gfonts=/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/;
if(!gfonts.test(page))throw new Error('Google Fonts link not found in web/index.html');
page=page.replace(gfonts,'<link rel="stylesheet" href="fonts/fonts.css"><link rel="stylesheet" href="native.css">');
writeFileSync(join(www,'index.html'),`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0c1220" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#eef1f5" media="(prefers-color-scheme: light)">
<script src="native.js"></script>
</head><body>
${page}
</body></html>
`);
console.log('Built www/');
