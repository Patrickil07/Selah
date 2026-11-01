(() => {
const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- saved state (this device only) ---------- */
const KEY = 'selahKids.v1';
let S = {done:{}, rate:0.92, size:28, auto:1, voice:''};
try { Object.assign(S, JSON.parse(localStorage.getItem(KEY)||'{}')); } catch(e){}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} };
const applySize = () => document.documentElement.style.setProperty('--read', S.size+'px');
applySize();

/* ---------- screens ---------- */
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id===id));
  stopSpeech();
  if(id==='home') renderHome();
  if(id==='book') renderBook();
  if(id==='grown') renderGrown();
}
['home1','home2','home3'].forEach(b => $(b).onclick = () => { history.replaceState(null,'',location.pathname); show('home'); });
$('toBook').onclick = () => show('book');

/* ---------- story art helpers ---------- */
function sceneSVG(sc, label){
  return `<svg viewBox="0 0 400 260" role="img" aria-label="${label||''}" preserveAspectRatio="xMidYMid slice">${ART.scene(sc)}</svg>`;
}
function stickerInner(st){
  return `<rect x="-50" y="-50" width="500" height="400" fill="${st.bg}"/>` + st.items.map(i => ART.scene({bg:'__none', items:[i]}).replace(/^<defs>.*?<\/defs><rect[^>]*\/>/,'')).join('');
}
function stickerSVG(st, label){
  return `<svg viewBox="70 10 260 260" role="img" aria-label="${label||''}">${stickerInner(st)}</svg>`;
}

/* ---------- home: the story path ---------- */
function nextIndex(){ const i = STORIES.findIndex(s => !S.done[s.id]); return i; }
function renderHome(){
  const n = STORIES.length, gap = 156, top = 120;
  const doneCount = STORIES.filter(s => S.done[s.id]).length;
  $('count').textContent = `${doneCount} / ${n}`;
  const nx = nextIndex();
  const pos = []; let y = top;
  STORIES.forEach((s,i) => {
    if(i>0 && s.testament !== STORIES[i-1].testament) y += 110;
    pos.push([i%2 ? 280 : 120, y + 60]); y += gap;
  });
  const H = y + 40;
  let d = `M${pos[0][0]},${pos[0][1]}`;
  for(let i=1;i<n;i++){ const [x0,y0]=pos[i-1], [x1,y1]=pos[i]; d += ` C${x0},${(y0+y1)/2} ${x1},${(y0+y1)/2} ${x1},${y1}`; }
  let g = '';
  // soft hills along the sides
  for(let k=0;k<n;k+=2){ const yy = pos[k][1]; g += `<ellipse cx="${k%4?420:-20}" cy="${yy+40}" rx="110" ry="60" fill="#BFE0B0"/>`; }
  g += `<path d="${d}" stroke="#F3DDAE" stroke-width="34" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#E7C98C" stroke-width="4" stroke-dasharray="2 14" fill="none" stroke-linecap="round"/>`;
  const parts = [['old','Old Testament stories'],['new','New Testament stories']];
  parts.forEach(([t,label]) => { const i = STORIES.findIndex(s=>s.testament===t); g += `<text class="part" x="200" y="${pos[i][1]-128}" text-anchor="middle" font-size="15" fill="#5C6788">${label.toUpperCase()}</text>`; });
  STORIES.forEach((s,i) => {
    const [x,yy] = pos[i], done = !!S.done[s.id], isNext = i===nx;
    g += `<g class="stop" role="listitem" tabindex="0" aria-label="${s.title}${done?', sticker earned':''}" data-i="${i}" transform="translate(${x},${yy})">
      <g class="ring"><circle r="60" fill="${done?'#FFC94A':'#FFFFFF'}"/><clipPath id="cp${i}"><circle r="52"/></clipPath>
      <g clip-path="url(#cp${i})"><svg x="-52" y="-52" width="104" height="104" viewBox="70 10 260 260">${stickerInner(s.sticker)}</svg></g></g>
      <rect x="-80" y="68" width="160" height="34" rx="17" fill="#FFFBF2"/>
      <text y="91" text-anchor="middle" font-size="16" fill="#2B3550">${s.title}</text>
      ${done?`<g transform="translate(44,-44)"><circle r="17" fill="#FF7A6B" stroke="#fff" stroke-width="3"/><path d="M-7,0 L-2,5 L8,-6" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`:''}
      ${isNext?`<g class="next-flag"><path d="M-30,-100 h60 a8,8 0 0 1 8,8 v14 a8,8 0 0 1 -8,8 h-22 l-8,9 l-8,-9 h-22 a8,8 0 0 1 -8,-8 v-14 a8,8 0 0 1 8,-8z" fill="#FF7A6B"/><text y="-80" text-anchor="middle" font-size="15" fill="#fff">${doneCount?'Next!':'Start here'}</text></g>`:''}
    </g>`;
  });
  const svg = $('path');
  svg.setAttribute('viewBox', `0 0 400 ${H}`);
  svg.innerHTML = g;
  svg.querySelectorAll('.stop').forEach(el => {
    const go = () => openStory(+el.dataset.i, 0);
    el.addEventListener('click', go);
    el.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
  });
}

/* ---------- reader ---------- */
let cur = null, page = 0, playing = false, qi = 0, qWrong = 0;
const stage = $('stage');
function openStory(i, p){
  cur = STORIES[i]; page = p||0; playing = false; setPlaying(false);
  show('reader'); // show() stops speech
  $('rtitle').firstChild.textContent = cur.title;
  $('rref').textContent = cur.ref;
  history.replaceState(null,'','#story-'+cur.id);
  renderPage();
}
function wordsHTML(t){
  let out = '', i = 0;
  t.split(/(\s+)/).forEach(part => { if(/^\s+$/.test(part)||!part){ out += part; } else { out += `<span class="w" data-c="${i}">${part}</span>`; } i += part.length; });
  return out;
}
function renderDots(){
  const total = cur.pages.length + 2; // pages, verse, quiz
  $('dots').innerHTML = Array.from({length: total}, (_,k) => `<i class="${k===Math.min(page,total-1)?'on':k<page?'done':''}"></i>`).join('');
}
function renderPage(){
  stopSpeech(false);
  const n = cur.pages.length;
  renderDots();
  $('prev').disabled = page===0;
  $('controls').style.display = page > n ? 'none' : 'flex';
  $('next').disabled = false;
  if(page < n){
    const pg = cur.pages[page];
    stage.innerHTML = `<div class="pic ${page===0?'hinting':''}" id="pic">${sceneSVG(pg.s, 'Picture for page '+(page+1))}</div>
      <p class="words" id="words">${wordsHTML(pg.t)}</p>${page===0?'<p class="hint">Tap the things in the picture!</p>':''}`;
    $('readLabel').textContent = playing ? 'Stop' : 'Read to me';
    if(playing) readCurrent();
  } else if(page === n){
    stage.innerHTML = `<div class="card"><div class="eyebrow">Memory verse</div>
      <p class="verse words" id="words">${wordsHTML(cur.verse.t)}</p>
      <div class="ref">${cur.verse.r}</div><div class="src">World English Bible</div>
      <div class="row"><button class="pill" id="quizGo">Quiz time!</button></div></div>`;
    $('readLabel').textContent = 'Say it with me';
    $('quizGo').onclick = () => { page++; renderPage(); };
    if(playing){ setPlaying(false); setTimeout(() => readCurrent(true), 400); }
  } else if(page === n+1){
    qi = 0; renderQuiz();
  } else {
    renderReward();
  }
}
function readCurrent(slow){
  const el = $('words'); if(!el) return;
  const spans = [...el.querySelectorAll('.w')];
  const txt = page < cur.pages.length ? cur.pages[page].t : cur.verse.t;
  speak(txt, {
    rate: slow ? S.rate*0.85 : S.rate,
    onword: ci => { let hit = spans[0]; for(const s of spans){ if(+s.dataset.c <= ci) hit = s; else break; } spans.forEach(s => s.classList.toggle('hl', s===hit)); },
    onend: () => {
      spans.forEach(s => s.classList.remove('hl'));
      if(playing && S.auto && page < cur.pages.length){ setTimeout(() => { if(playing){ page++; renderPage(); } }, 900); }
      else if(page < cur.pages.length) setPlaying(false);
    }
  });
}
function setPlaying(on){
  playing = on;
  $('readBtn').classList.toggle('playing', on);
  if(page < (cur?cur.pages.length:0) || !cur) $('readLabel').textContent = on ? 'Stop' : 'Read to me';
}
$('readBtn').onclick = () => {
  if(page >= cur.pages.length){ readCurrent(true); return; }
  if(playing){ setPlaying(false); stopSpeech(); return; }
  setPlaying(true); readCurrent();
};
$('next').onclick = () => { setPlaying(playing && S.auto); page++; renderPage(); };
$('prev').onclick = () => { if(page>0){ page--; renderPage(); } };
document.addEventListener('keydown', e => {
  if(!$('reader').classList.contains('on') || page > cur.pages.length) return;
  if(e.key==='ArrowRight') $('next').click();
  if(e.key==='ArrowLeft') $('prev').click();
});

/* tapping things in the picture */
stage.addEventListener('click', e => {
  const t = e.target.closest('.tap'); if(!t) return;
  boing(t, t.dataset.say, e.clientX, e.clientY);
});
stage.addEventListener('keydown', e => {
  const t = e.target.closest && e.target.closest('.tap'); if(!t || (e.key!=='Enter' && e.key!==' ')) return;
  e.preventDefault(); const r = t.getBoundingClientRect(); boing(t, t.dataset.say, r.left+r.width/2, r.top);
});
function boing(t, say, x, y){
  t.classList.remove('boing'); void t.getBBox(); t.classList.add('boing');
  const p = document.createElement('div'); p.className='pop'; p.textContent = say; p.style.left = x+'px'; p.style.top = y+'px';
  document.body.appendChild(p); setTimeout(() => p.remove(), 1900);
  if(!playing) speak(say, {rate: S.rate});
}

/* ---------- quiz ---------- */
function shuffle(a){ const b = a.map((v,i)=>[v,i]); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }
const STAR = on => `<svg viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.7 1.5 7L12 17.5 5.7 21l1.5-7L2 9.3l7-.8z" fill="${on?'#FFC94A':'#EFE7D3'}" stroke="${on?'#D9A441':'#E0D6BE'}" stroke-width="1.5"/></svg>`;
function renderQuiz(){
  const q = cur.quiz[qi];
  const opts = shuffle(q.a);
  stage.innerHTML = `<div class="card"><div class="qstars">${cur.quiz.map((_,k)=>STAR(k<qi)).join('')}</div>
    <div class="eyebrow">Question ${qi+1} of ${cur.quiz.length}</div>
    <p class="qtext">${q.q}</p>
    <div class="opts">${opts.map(([t,i]) => `<button class="opt" data-i="${i}">${t}</button>`).join('')}</div>
    <button class="pill alt" id="hearQ"><span>Hear it again</span></button></div>`;
  const readQ = () => speak(q.q + ' ' + opts.map(o=>o[0]).join('? ') + '?', {rate:S.rate});
  $('hearQ').onclick = readQ;
  stage.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if(+b.dataset.i === q.c){
      b.classList.add('right'); stage.querySelectorAll('.opt').forEach(x => x.disabled = true);
      speak(['Yes!','That’s right!','Great job!'][qi%3], {rate:S.rate}); confetti(40);
      setTimeout(() => { qi++; if(qi < cur.quiz.length) renderQuiz(); else { page++; renderPage(); } }, 1300);
    } else {
      b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      speak('Try again!', {rate:S.rate});
    }
  });
  setTimeout(readQ, 250);
}

/* ---------- reward ---------- */
function renderReward(){
  const first = !S.done[cur.id];
  S.done[cur.id] = true; save();
  const i = STORIES.indexOf(cur), nxt = STORIES[i+1];
  stage.innerHTML = `<div class="card"><div class="eyebrow">${first?'New sticker!':'You did it again!'}</div>
    <div class="sticker">${stickerSVG(cur.sticker, cur.title+' sticker')}</div>
    <p class="qtext">You finished “${cur.title}”!</p>
    <div class="row"><button class="pill alt" id="seeBook">My sticker book</button>${nxt?`<button class="pill" id="goNext">Next story</button>`:`<button class="pill" id="goHome">Back to the path</button>`}</div></div>`;
  $('dots').innerHTML = '';
  confetti(160);
  speak(`Hooray! You finished ${cur.title}. Here is your sticker!`, {rate:S.rate});
  $('seeBook').onclick = () => show('book');
  if(nxt) $('goNext').onclick = () => openStory(i+1, 0); else $('goHome').onclick = () => show('home');
}

/* ---------- sticker book ---------- */
function renderBook(){
  const c = STORIES.filter(s=>S.done[s.id]).length;
  $('bookSub').textContent = c ? `${c} of ${STORIES.length} stickers. Finish a story to earn the next one.` : 'Finish a story to earn your first sticker.';
  $('grid').innerHTML = STORIES.map((s,i) => S.done[s.id]
    ? `<button class="slot" data-i="${i}"><div class="disc">${stickerSVG(s.sticker, s.title+' sticker')}</div>${s.title}</button>`
    : `<button class="slot empty" data-i="${i}"><div class="disc">?</div>${s.title}</button>`).join('');
  $('grid').querySelectorAll('.slot').forEach(b => b.onclick = () => openStory(+b.dataset.i, 0));
}

/* ---------- grown-ups corner (press and hold to open) ---------- */
$('toGrown').onclick = () => { $('lock').classList.add('on'); $('holdBtn').focus(); };
$('lockCancel').onclick = () => $('lock').classList.remove('on');
(() => {
  const btn = $('holdBtn'), arc = $('holdArc'), L = 339.3; let t0 = 0, raf = 0;
  const tick = now => { const p = Math.min(1,(now-t0)/2000); arc.style.strokeDashoffset = L*(1-p); if(p>=1){ end(); $('lock').classList.remove('on'); show('grown'); } else raf = requestAnimationFrame(tick); };
  const start = e => { e.preventDefault(); if(raf) return; t0 = performance.now(); raf = requestAnimationFrame(tick); };
  const end = () => { cancelAnimationFrame(raf); raf = 0; arc.style.strokeDashoffset = L; };
  btn.addEventListener('pointerdown', start); ['pointerup','pointerleave','pointercancel'].forEach(ev => btn.addEventListener(ev, end));
  btn.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && !e.repeat) start(e); });
  btn.addEventListener('keyup', end);
})();
function seg(id, key, num){
  const el = $(id);
  el.querySelectorAll('button').forEach(b => { b.classList.toggle('on', String(S[key])===b.dataset.v); b.onclick = () => { S[key] = num ? +b.dataset.v : b.dataset.v; save(); applySize(); seg(id,key,num); }; });
}
function renderGrown(){
  seg('segRate','rate',1); seg('segSize','size',1); seg('segAuto','auto',1);
  fillVoices();
  $('talk').innerHTML = STORIES.map(s => `<details><summary>${s.title} <span style="font-weight:400;color:#5C6788">· ${s.ref}</span></summary><ul>${s.talk.map(t=>`<li>${t}</li>`).join('')}</ul></details>`).join('');
  const c = STORIES.filter(s=>S.done[s.id]).length;
  $('progText').textContent = `${c} of ${STORIES.length} stories finished on this device.`;
}
let armed = false;
$('reset').onclick = () => {
  if(!armed){ armed = true; $('reset').textContent = 'Tap again to clear all stickers'; setTimeout(() => { armed = false; $('reset').textContent = 'Start over and clear all stickers'; }, 3000); return; }
  S.done = {}; save(); armed = false; $('reset').textContent = 'Stickers cleared'; renderGrown();
};

/* ---------- read-aloud ---------- */
const synth = window.speechSynthesis;
let voices = [], fakeTimer = 0, utterId = 0;
function pickVoices(){
  if(!synth) return;
  voices = synth.getVoices().filter(v => /^en/i.test(v.lang));
  const rank = v => (/natural|neural|online/i.test(v.name)?0:/google us|samantha|aria|jenny|ava|allison/i.test(v.name)?1:/en-us/i.test(v.lang)?2:3);
  voices.sort((a,b) => rank(a)-rank(b));
}
if(synth){ pickVoices(); synth.onvoiceschanged = () => { pickVoices(); if($('grown').classList.contains('on')) fillVoices(); }; }
function fillVoices(){
  const sel = $('voice');
  if(!voices.length){ sel.innerHTML = '<option>No device voices found</option>'; sel.disabled = true; return; }
  sel.disabled = false;
  sel.innerHTML = voices.map(v => `<option value="${v.name}" ${v.name===S.voice?'selected':''}>${v.name}</option>`).join('');
  sel.onchange = () => { S.voice = sel.value; save(); speak('Hello! I will read the stories to you.', {rate:S.rate}); };
}
function stopSpeech(){
  utterId++; clearInterval(fakeTimer);
  if(synth) synth.cancel();
  document.querySelectorAll('.w.hl').forEach(s => s.classList.remove('hl'));
}
function estimate(text, rate, onword, onend, id){
  // Steps through the words at reading pace when the device gives no word timing.
  const marks = []; let i = 0; text.split(/(\s+)/).forEach(p => { if(p.trim()) marks.push([i, p]); i += p.length; });
  let k = 0, wait = 0; clearInterval(fakeTimer);
  fakeTimer = setInterval(() => {
    if(id !== utterId){ clearInterval(fakeTimer); return; }
    if(wait > 0){ wait -= 50; return; }
    if(k >= marks.length){ clearInterval(fakeTimer); return; }
    onword && onword(marks[k][0]);
    const w = marks[k][1]; wait = (180 + w.length*55 + (/[.,!?:;”]$/.test(w)?260:0)) / rate;
    k++;
  }, 50);
}
function speak(text, {rate=0.92, onword, onend}={}){
  stopSpeech();
  const id = utterId;
  const clean = text.replace(/[“”]/g,'"');
  if(!synth){ estimate(text, rate, onword, null, id); const ms = text.split(/\s+/).length*420/rate; setTimeout(() => { if(id===utterId) onend && onend(); }, ms); return; }
  const u = new SpeechSynthesisUtterance(clean);
  const v = voices.find(v => v.name===S.voice) || voices[0];
  if(v){ u.voice = v; u.lang = v.lang; }
  u.rate = rate; u.pitch = 1.08;
  let gotBoundary = false;
  u.onboundary = e => { if(id!==utterId) return; if(e.name==='word' || e.name===undefined){ gotBoundary = true; clearInterval(fakeTimer); onword && onword(e.charIndex); } };
  u.onstart = () => { setTimeout(() => { if(!gotBoundary && id===utterId) estimate(text, rate, onword, null, id); }, 450); };
  u.onend = () => { if(id!==utterId) return; clearInterval(fakeTimer); onend && onend(); };
  u.onerror = () => { if(id!==utterId) return; clearInterval(fakeTimer); };
  synth.speak(u);
}

/* ---------- confetti ---------- */
const cv = $('confetti'), cx = cv.getContext('2d'); let bits = [], cAnim = 0;
function confetti(n){
  if(reduce) return;
  cv.width = innerWidth; cv.height = innerHeight;
  const cols = ['#FFC94A','#FF7A6B','#7CC47F','#4CC9F0','#B57BE8'];
  for(let i=0;i<n;i++) bits.push({x:innerWidth/2+(Math.random()-.5)*200, y:innerHeight*.45, vx:(Math.random()-.5)*14, vy:-Math.random()*14-4, r:Math.random()*6+4, c:cols[i%5], a:Math.random()*6, life:0});
  if(!cAnim) cAnim = requestAnimationFrame(step);
}
function step(){
  cx.clearRect(0,0,cv.width,cv.height);
  bits.forEach(b => { b.vy += .45; b.x += b.vx; b.y += b.vy; b.a += .2; b.life++; cx.save(); cx.translate(b.x,b.y); cx.rotate(b.a); cx.fillStyle=b.c; cx.fillRect(-b.r/2,-b.r/4,b.r,b.r/2); cx.restore(); });
  bits = bits.filter(b => b.y < cv.height+20 && b.life < 240);
  cAnim = bits.length ? requestAnimationFrame(step) : 0;
  if(!bits.length) cx.clearRect(0,0,cv.width,cv.height);
}

/* ---------- start ---------- */
const m = location.hash.match(/^#story-([a-z]+)$/);
const si = m ? STORIES.findIndex(s => s.id===m[1]) : -1;
if(si >= 0) openStory(si, 0); else renderHome();
})();
