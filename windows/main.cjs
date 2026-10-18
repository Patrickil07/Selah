// Selah for Windows: the same app as on phones (www/, built by scripts/build-web.mjs) in a desktop window.
// Pages load from app://selah/ rather than file://, so fetch() of the Bible data works as on the web.
const {app,BrowserWindow,protocol,net,shell,Menu}=require('electron');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

const WWW=path.join(__dirname,'www');
protocol.registerSchemesAsPrivileged([{scheme:'app',privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);
if(!app.requestSingleInstanceLock())app.quit();

function open(){
  const win=new BrowserWindow({width:1280,height:860,minWidth:360,minHeight:520,backgroundColor:'#eef1f5',title:'Selah',
    icon:path.join(__dirname,'icon.png'),autoHideMenuBar:true,webPreferences:{contextIsolation:true,sandbox:true}});
  win.loadURL('app://selah/index.html');
  // Links to other sites (calendar reminders, sources) open in the browser
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/.test(url))shell.openExternal(url);return {action:'deny'};});
  win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('app://')){e.preventDefault();if(/^https?:/.test(url))shell.openExternal(url);}});
  return win;
}

app.on('second-instance',()=>{const w=BrowserWindow.getAllWindows()[0];if(w){if(w.isMinimized())w.restore();w.focus();}});
app.whenReady().then(()=>{
  Menu.setApplicationMenu(null);
  protocol.handle('app',req=>{
    const rel=decodeURIComponent(new URL(req.url).pathname).replace(/^\/+/,'')||'index.html';
    const file=path.normalize(path.join(WWW,rel));
    if(!file.startsWith(WWW))return new Response('Not found',{status:404});
    return net.fetch(pathToFileURL(file).toString());
  });
  open();
});
app.on('window-all-closed',()=>app.quit());
