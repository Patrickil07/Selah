// Copies the built app (../www) and the icon next to main.cjs. The Store identity from Partner Center
// is in package.json; STORE_* variables can override it (see README: Microsoft Store).
import {cpSync,rmSync,existsSync,readFileSync,writeFileSync} from 'node:fs';
const www=new URL('../www',import.meta.url),here=new URL('./',import.meta.url);
if(!existsSync(www))throw new Error('Run "npm run build" in the repo root first');
rmSync(new URL('www',here),{recursive:true,force:true});
cpSync(www,new URL('www',here),{recursive:true});
cpSync(new URL('../assets/icon-only.png',import.meta.url),new URL('icon.png',here));
const pkg=JSON.parse(readFileSync(new URL('package.json',here)));
const {STORE_IDENTITY_NAME:identityName,STORE_PUBLISHER:publisher,STORE_PUBLISHER_NAME:publisherDisplayName}=process.env;
if(identityName&&publisher){Object.assign(pkg.build.appx,{identityName,publisher,publisherDisplayName});writeFileSync(new URL('package.json',here),JSON.stringify(pkg,null,2)+'\n');}
else console.log("Using the Store identity in package.json.");
