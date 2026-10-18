// Launches the packaged Windows app and checks that the Bible loads (used by CI).
import {_electron} from 'playwright';
const exe=process.argv[2];
const app=await _electron.launch({executablePath:exe});
const win=await app.firstWindow();
const errors=[];win.on('pageerror',e=>errors.push(e.message));
await win.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});
await win.waitForTimeout(2000);
await win.screenshot({path:'dist/smoke.png'});
const books=await win.evaluate(()=>document.querySelectorAll('.book').length);
console.log('books shown:',books,'errors:',errors);
await app.close();
if(books!==66||errors.length)process.exit(1);
