// Selah Kids illustration kit: every picture is drawn from these shapes.
// Each function draws at local origin, ground at y=0, and returns SVG markup.
const ART = (() => {
  const SKIN = ['#C98E62','#B97A50','#8D5A3B','#D9A47A'];
  let seed = 1;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const BG = {
    day:    ['#8FD0F5','#D9F1FF'],
    morning:['#9FD8F2','#FFF3D6'],
    dawn:   ['#F7A8B8','#FFE0A3'],
    dusk:   ['#5B6BB5','#F7B58A'],
    night:  ['#14204A','#34477D'],
    dark:   ['#0C1026','#1D2450'],
    storm:  ['#56627A','#8A96AA'],
    desert: ['#F6D9A0','#FBEBCB'],
    tent:   ['#E9C9A0','#F5E3C8'],
    palace: ['#E6D3F2','#F7EEFC'],
    den:    ['#3B2E2A','#5A463E'],
    under:  ['#1E6F9F','#0E3E63']
  };
  function bg(name){
    const [a,b] = BG[name] || BG.day;
    let s = `<defs><linearGradient id="bgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="260" fill="url(#bgG)"/>`;
    if(name==='tent') s += `<path d="M0,40 L200,0 L400,40 L400,260 L0,260Z" fill="#E2B987" opacity=".5"/><path d="M200,0 L200,260" stroke="#C79A63" stroke-width="3"/><rect y="236" width="400" height="24" fill="#B98A57"/>`;
    if(name==='palace') s += `${[40,140,260,360].map(x=>`<rect x="${x-10}" y="40" width="20" height="200" fill="#FFFFFF" opacity=".75"/><rect x="${x-14}" y="34" width="28" height="8" fill="#D8C6E6"/>`).join('')}<rect y="236" width="400" height="24" fill="#C9B2DD"/><path d="M0,236 L400,236" stroke="#B095C9" stroke-width="2"/>`;
    if(name==='den') s += `<path d="M0,0 L400,0 L400,260 L0,260Z M60,260 Q60,40 200,40 Q340,40 340,260Z" fill="#2A201C" fill-rule="evenodd"/><ellipse cx="200" cy="250" rx="180" ry="18" fill="#6B5547"/><circle cx="200" cy="20" r="16" fill="#FFF3C4" opacity=".7"/>`;
    if(name==='desert') s += `<path d="M0,200 Q100,180 200,195 T400,190 L400,260 L0,260Z" fill="#E8C27A"/><path d="M0,230 Q120,210 260,228 T400,222 L400,260 L0,260Z" fill="#DDB066"/>`;
    if(name==='under') s += `<path d="M0,240 Q100,225 200,240 T400,236 L400,260 L0,260Z" fill="#C9A86A"/><path d="M40,240 q-8,-30 4,-60 M48,240 q10,-24 -2,-48 M350,238 q-10,-40 6,-70" stroke="#3FA36B" stroke-width="5" fill="none" stroke-linecap="round" class="sway"/>`;
    return s;
  }

  const P = {};
  P.hills = o => {
    const c=o.c||'#7CC47F', y=o.low?215:190;
    return `<path d="M0,${y} Q90,${y-35} 190,${y+5} T400,${y-10} L400,260 L0,260Z" fill="${shade(c,-12)}"/><path d="M0,${y+25} Q120,${y} 240,${y+28} T400,${y+18} L400,260 L0,260Z" fill="${c}"/>`;
  };
  P.ground = o => o.narrow
    ? `<path d="M-60,0 L60,0 L40,-60 L-40,-60Z" fill="#D9B77C"/><path d="M-50,0 L50,0 L36,-50 L-36,-50Z" fill="#E6C892"/>`
    : `<rect x="-200" y="-30" width="400" height="30" fill="#C7A36A"/><rect x="-200" y="-30" width="400" height="5" fill="#B48F57"/>`;
  P.beach = () => `<path d="M140,260 Q190,170 400,180 L400,260Z" fill="#F1D79B"/><path d="M160,260 Q205,190 400,198" stroke="#E5C27A" stroke-width="3" fill="none"/>`;
  P.sea = o => {
    let x0=0,x1=400; if(o.left) x1=230; if(o.right) x0=150;
    const amp = o.rough?14:6, c1=o.rough?'#3C6E91':'#4FA3D1', c2=o.rough?'#2E5A78':'#3B8BBE';
    let w1='', w2='';
    for(let x=x0-40;x<=x1+40;x+=40){ w1+=` Q${x+10},${-amp} ${x+20},0 T${x+40},0`; }
    for(let x=x0-40;x<=x1+40;x+=50){ w2+=` Q${x+12},${-amp*0.8} ${x+25},0 T${x+50},0`; }
    return `<g class="${o.rough?'wave-rough':'wave'}"><path d="M${x0-40},0${w1} L${x1+40},${260} L${x0-40},${260}Z" fill="${c1}"/></g><g class="wave2" transform="translate(0,22)"><path d="M${x0-40},0${w2} L${x1+40},${240} L${x0-40},${240}Z" fill="${c2}"/></g>`;
  };
  P.sun = () => {
    let r=''; for(let i=0;i<12;i++){ const a=i*30*Math.PI/180; r+=`<line x1="${Math.cos(a)*30}" y1="${Math.sin(a)*30}" x2="${Math.cos(a)*42}" y2="${Math.sin(a)*42}"/>`; }
    return `<g class="spin"><g stroke="#FFC94A" stroke-width="5" stroke-linecap="round">${r}</g></g><circle r="24" fill="#FFD95A"/><circle r="24" fill="url(#sunG)"/><circle cx="-8" cy="-3" r="2.4" fill="#7A4B12"/><circle cx="8" cy="-3" r="2.4" fill="#7A4B12"/><path d="M-8,6 Q0,13 8,6" stroke="#7A4B12" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  };
  P.moon = () => `<path d="M10,-26 A26,26 0 1,0 10,26 A20,20 0 1,1 10,-26Z" fill="#FFF3C4"/><circle cx="-8" cy="-2" r="2" fill="#B8A86A"/><path d="M-12,8 Q-7,11 -3,8" stroke="#B8A86A" stroke-width="1.8" fill="none"/>`;
  P.stars = () => { seed=7; let s=''; for(let i=0;i<34;i++){ const x=rnd()*400, y=rnd()*150, r=0.8+rnd()*1.8; s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#FFF8D6" class="tw" style="animation-delay:${(rnd()*3).toFixed(2)}s"/>`; } return s; };
  P.clouds = o => { const f=o.dark?'#6B7690':'#FFFFFF', op=o.dark?1:.9; const c=(x,y,k)=>`<g transform="translate(${x},${y}) scale(${k})" opacity="${op}"><ellipse cx="0" cy="0" rx="34" ry="14" fill="${f}"/><circle cx="-12" cy="-8" r="14" fill="${f}"/><circle cx="10" cy="-12" r="17" fill="${f}"/></g>`;
    return `<g class="drift">${c(70,50,1)}${c(250,35,1.2)}${o.dark?c(160,30,1.4)+c(360,55,1.1):c(360,70,0.8)}</g>`; };
  P.rain = () => { seed=3; let s=''; for(let i=0;i<60;i++){ const x=rnd()*420, y=rnd()*260; s+=`<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x-6).toFixed(0)}" y2="${(y+16).toFixed(0)}"/>`; } return `<g class="rain" stroke="#CFE3F2" stroke-width="2" stroke-linecap="round" opacity=".8">${s}</g>`; };
  P.lightning = () => `<path class="flash" d="M0,0 L-14,34 L-2,34 L-12,66 L16,24 L4,24 L12,0Z" fill="#FFE45C"/>`;
  P.rainbow = () => ['#FF6B6B','#FF9F43','#FFD93D','#6BCB77','#4D96FF','#9B72CF'].map((c,i)=>`<path d="M${-150+i*12},0 A${150-i*12},${150-i*12} 0 0,1 ${150-i*12},0" stroke="${c}" stroke-width="12" fill="none"/>`).join('');
  P.glow = () => `<circle r="110" fill="url(#glowG)"/><circle r="34" fill="#FFF8DD"/><g class="spin" stroke="#FFF1B0" stroke-width="4" stroke-linecap="round">${Array.from({length:16},(_,i)=>{const a=i*22.5*Math.PI/180;return `<line x1="${Math.cos(a)*46}" y1="${Math.sin(a)*46}" x2="${Math.cos(a)*(i%2?62:80)}" y2="${Math.sin(a)*(i%2?62:80)}"/>`}).join('')}</g>`;
  P.birds = () => `<g class="drift" stroke="#2B3550" stroke-width="2.5" fill="none" stroke-linecap="round">${[[60,60],[90,45],[300,50],[330,70],[200,30]].map(([x,y])=>`<path d="M${x-9},${y} Q${x-4},${y-6} ${x},${y} Q${x+4},${y-6} ${x+9},${y}"/>`).join('')}</g>`;
  P.tree = o => o.big
    ? `<path d="M-8,0 L-6,-60 Q-30,-70 -40,-80 M6,-60 L8,0 M0,-58 Q20,-70 34,-74" stroke="#7A5232" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="-8" y="-64" width="16" height="64" fill="#7A5232"/><g class="sway"><circle cx="-34" cy="-86" r="26" fill="#5E9C4E"/><circle cx="30" cy="-84" r="28" fill="#6BAE5A"/><circle cx="0" cy="-104" r="30" fill="#77B865"/><circle cx="-12" cy="-80" r="22" fill="#6BAE5A"/></g>`
    : `<rect x="-5" y="-40" width="10" height="40" rx="3" fill="#7A5232"/><g class="sway"><circle cx="0" cy="-56" r="24" fill="#5E9C4E"/><circle cx="-14" cy="-44" r="16" fill="#6BAE5A"/><circle cx="14" cy="-46" r="17" fill="#6BAE5A"/><circle cx="7" cy="-62" r="4" fill="#FF7A6B"/><circle cx="-9" cy="-52" r="4" fill="#FF7A6B"/></g>`;
  P.palm = () => `<path d="M0,0 Q-6,-40 6,-80" stroke="#9A6B3E" stroke-width="9" fill="none" stroke-linecap="round"/><g class="sway" fill="#4E9A5A" transform="translate(6,-80)"><path d="M0,0 Q-30,-14 -46,8 Q-26,-4 0,0Z"/><path d="M0,0 Q30,-16 48,6 Q26,-4 0,0Z"/><path d="M0,0 Q-10,-30 -32,-34 Q-12,-18 0,0Z"/><path d="M0,0 Q14,-30 34,-30 Q14,-16 0,0Z"/></g>`;
  P.flower = o => `<path d="M0,0 Q-2,-12 0,-22" stroke="#4E9A5A" stroke-width="3" fill="none"/><ellipse cx="-6" cy="-8" rx="5" ry="2.5" fill="#4E9A5A" transform="rotate(-30 -6 -8)"/><g transform="translate(0,-26)">${[0,72,144,216,288].map(a=>`<circle cx="${Math.cos(a*Math.PI/180)*6}" cy="${Math.sin(a*Math.PI/180)*6}" r="5" fill="${o.c||'#FF7A6B'}"/>`).join('')}<circle r="4" fill="#FFD95A"/></g>`;
  P.bush = o => `<circle cx="-18" cy="-14" r="16" fill="#4E8A4E"/><circle cx="16" cy="-14" r="17" fill="#4E8A4E"/><circle cx="0" cy="-24" r="18" fill="#5E9C5A"/>${o.thorn?`<g stroke="#2F5A2F" stroke-width="2" stroke-linecap="round">${[[-30,-20,-38,-26],[-20,-34,-24,-42],[2,-40,4,-48],[24,-30,32,-36],[32,-12,40,-14],[-34,-6,-42,-4]].map(a=>`<line x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}"/>`).join('')}</g>`:''}`;
  P.rocks = () => `<path d="M-50,0 L-36,-34 L-10,-44 L14,-30 L40,-50 L60,-20 L66,0Z" fill="#A79B8B"/><path d="M-36,-34 L-10,-44 L-14,-20Z M14,-30 L40,-50 L36,-24Z" fill="#BDB2A3"/>`;
  P.stream = () => `<path d="M0,250 Q90,232 180,248 T400,238 L400,260 L0,260Z" fill="#6FB6E0"/><path d="M30,252 q20,-6 40,0 M220,250 q20,-6 40,0" stroke="#D6EEFA" stroke-width="2" fill="none"/>`;
  P.stones = () => [[-24,0],[-8,-2],[8,0],[24,-1],[0,-10]].map(([x,y])=>`<ellipse cx="${x}" cy="${y-5}" rx="7" ry="5" fill="#9A9A9A"/><ellipse cx="${x-2}" cy="${y-7}" rx="2.5" ry="1.4" fill="#D5D5D5"/>`).join('');
  P.wind = () => `<g class="drift" stroke="#E6F4FF" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"><path d="M-80,-30 q30,-14 60,0 t60,0"/><path d="M-60,0 q30,-14 60,0 t60,0 q14,-10 6,-20"/><path d="M-90,30 q30,-14 60,0 t60,0"/></g>`;
  P.note = () => `<g class="float" fill="#2B3550"><ellipse cx="0" cy="0" rx="6" ry="4.5" transform="rotate(-20)"/><rect x="4.5" y="-24" width="2.5" height="24"/><path d="M7,-24 q10,4 10,14 q-4,-8 -10,-8Z"/></g>`;
  P.zzz = () => `<g class="float" font-family="Fredoka, sans-serif" font-weight="700" fill="#FFF3C4"><text x="0" y="0" font-size="18">z</text><text x="12" y="-14" font-size="24">z</text><text x="28" y="-32" font-size="30">Z</text></g>`;
  P.question = () => `<g class="float"><circle r="22" fill="#FFFFFF"/><text y="10" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="30" font-weight="700" fill="#FF7A6B">?</text></g>`;
  P.splash = () => `<g fill="#D6EEFA">${[[-24,-30],[-10,-44],[6,-48],[22,-36],[30,-20],[-32,-14]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="8" transform="rotate(${x} ${x} ${y})"/>`).join('')}</g><ellipse cx="0" cy="0" rx="34" ry="7" fill="#FFFFFF" opacity=".8"/><g transform="translate(0,-60) rotate(180)">${person({robe:'#4C9A8A',hair:'#3A2A1E',beard:1,arms:'up',mood:'wow'})}</g>`;
  P.bubbles = () => { seed=11; let s=''; for(let i=0;i<14;i++){ s+=`<circle cx="${(rnd()*400).toFixed(0)}" cy="${(rnd()*240).toFixed(0)}" r="${(2+rnd()*5).toFixed(1)}" fill="none" stroke="#BFE6FF" stroke-width="1.5" class="float" style="animation-delay:${(rnd()*2).toFixed(1)}s"/>`; } return s; };
  P.pyramid = () => `<path d="M-60,0 L0,-70 L60,0Z" fill="#E2B76A"/><path d="M0,-70 L60,0 L18,0Z" fill="#C99A4E"/>`;
  P.city = () => `<rect x="-90" y="-30" width="180" height="30" fill="#D9B98A"/>${[[-80,-60,30],[-46,-80,34],[-8,-66,28],[24,-90,34],[60,-58,28]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${-y}" fill="#E8CFA2"/><rect x="${x+w/2-4}" y="${y+12}" width="8" height="10" rx="4" fill="#8A6A44"/>`).join('')}<path d="M-42,-80 a12,12 0 0,1 26,0Z M28,-90 a13,13 0 0,1 26,0Z" fill="#7FB3D5"/><path d="M-90,-30 ${Array.from({length:10},(_,i)=>`h9 v-6 h9 v6`).join(' ')}" fill="none" stroke="#C4A374" stroke-width="3"/>`;
  P.house = o => `<rect x="-36" y="-50" width="72" height="50" fill="#EED9B4"/><rect x="-40" y="-56" width="80" height="8" fill="#D6BB8E"/><rect x="-10" y="-30" width="20" height="30" rx="10" fill="#8A6A44"/>${o.win?`<rect x="-24" y="-46" width="48" height="16" fill="#3B2E2A"/>`:`<rect x="16" y="-42" width="12" height="12" fill="#6E8BB0"/>`}`;
  P.stable = () => `<rect x="-80" y="-70" width="160" height="70" fill="#9A6B3E"/><rect x="-72" y="-62" width="144" height="62" fill="#6A4628"/><path d="M-96,-66 L0,-104 L96,-66" stroke="#7A5232" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="M-72,0 L72,0 L72,-10 Q0,-18 -72,-10Z" fill="#E8C66A"/><circle cx="0" cy="-40" r="44" fill="url(#glowG)" opacity=".6"/>`;
  P.manger = o => `<path d="M-26,-26 L26,-26 L18,-6 L-18,-6Z" fill="#B98A57"/><path d="M-18,-6 L-24,0 M18,-6 L24,0" stroke="#8A6238" stroke-width="4"/><path d="M-26,-26 Q-18,-34 -10,-28 Q0,-36 10,-28 Q18,-34 26,-26" fill="#F2D27A"/>${o.baby?`<ellipse cx="0" cy="-32" rx="14" ry="7" fill="#F6F1E6"/><circle cx="-12" cy="-34" r="6" fill="#C98E62"/><path d="M-14,-35 q1,1.5 2,0 M-11,-35 q1,1.5 2,0" stroke="#3A2A1E" stroke-width="1" fill="none"/><circle cx="0" cy="-30" r="26" fill="url(#glowG)" opacity=".5"/>`:''}`;
  P.star = () => `<circle r="40" fill="url(#glowG)"/><path class="tw" d="M0,-24 L6,-8 L23,-7 L9,4 L14,21 L0,11 L-14,21 L-9,4 L-23,-7 L-6,-8Z" fill="#FFE07A"/><line x1="0" y1="20" x2="0" y2="120" stroke="#FFF1B0" stroke-width="2" opacity=".5"/>`;
  P.tomb = o => `<path d="M-90,0 Q-90,-80 -10,-86 Q70,-90 90,-30 L90,0Z" fill="#A79B8B"/><path d="M-60,0 Q-60,-50 -10,-54 Q36,-54 40,0Z" fill="#B8AD9E"/><circle cx="-10" cy="-22" r="22" fill="#2F2A26"/>${o.open?`<circle cx="62" cy="-22" r="24" fill="#8F8577"/><circle cx="62" cy="-22" r="16" fill="none" stroke="#7A7064" stroke-width="2"/>`:`<circle cx="-4" cy="-22" r="25" fill="#8F8577"/><circle cx="-4" cy="-22" r="17" fill="none" stroke="#7A7064" stroke-width="2"/>`}`;
  P.basket = () => `<path d="M-22,-20 L22,-20 L16,0 L-16,0Z" fill="#B98A57"/><path d="M-20,-14 L20,-14 M-18,-7 L18,-7" stroke="#8A6238" stroke-width="2"/><ellipse cx="-10" cy="-22" rx="9" ry="6" fill="#E8B96A"/><ellipse cx="6" cy="-24" rx="9" ry="6" fill="#F0C47A"/><g transform="translate(16,-24) rotate(-25)"><ellipse rx="8" ry="3.5" fill="#8FB3C9"/><path d="M7,0 l5,-4 v8Z" fill="#8FB3C9"/></g>`;
  P.coins = () => `<g class="float">${[[-14,0],[0,-8],[14,2],[6,12]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#FFD95A" stroke="#D9A441" stroke-width="2"/>`).join('')}</g>`;
  P.crowd = () => { const cols=['#E27D60','#85C1A9','#E8A87C','#C38D9E','#6E8BB0','#D9A441','#8DA05E']; let s=''; for(let i=0;i<7;i++){ s+=`<g transform="translate(${-60+i*20},${i%2?4:0}) scale(.7)">${person({robe:cols[i],hair:i%3?'#3A2A1E':'#2B1B12',long:i%2,beard:i%3===0,skin:SKIN[i%4]})}</g>`; } return s; };
  P.army = () => { let s=''; for(let i=0;i<8;i++){ s+=`<g transform="translate(${i*14},${(i%2)*4})"><rect x="-4" y="-18" width="8" height="18" fill="#6B6F7A"/><circle cy="-22" r="4.5" fill="#8A8F99"/><line x1="6" y1="0" x2="6" y2="-34" stroke="#55585F" stroke-width="1.5"/></g>`; } return `<ellipse cx="50" cy="-6" rx="70" ry="14" fill="#E9CFA0" opacity=".8"/>`+s; };
  P.waterwall = o => { const d=o.right?-1:1; return `<g transform="scale(${d},1)"><path d="M-80,0 L-80,-240 L40,-240 Q60,-200 46,-160 Q64,-120 48,-80 Q62,-40 54,0Z" fill="#4FA3D1" opacity=".92"/><path d="M40,-240 Q60,-200 46,-160 Q64,-120 48,-80 Q62,-40 54,0" stroke="#BFE6FF" stroke-width="5" fill="none"/><g transform="translate(-10,-130)">${P.fish({c:'#FF9F43'})}</g><g transform="translate(-40,-60) scale(.8)">${P.fish({c:'#FFD95A'})}</g></g>`; };
  P.fish = o => `<g transform="scale(${o.flip?-1:1},1)"><ellipse cx="0" cy="-8" rx="14" ry="8" fill="${o.c||'#FF9F43'}"/><path d="M12,-8 L24,-16 L24,0Z" fill="${o.c||'#FF9F43'}"/><circle cx="-7" cy="-10" r="2" fill="#2B3550"/></g>`;
  P.bigfish = o => `<g class="bob"><path d="M70,-10 L120,-50 L112,0 L120,40Z" fill="#4C6C93"/><ellipse cx="0" cy="0" rx="90" ry="48" fill="#5E7FA8"/><path d="M-90,6 Q0,60 86,10 Q0,44 -90,6Z" fill="#B9CDE3"/><circle cx="-56" cy="-16" r="8" fill="#FFFFFF"/><circle cx="-58" cy="-16" r="4" fill="#1D2440"/><path d="M-88,8 Q-74,16 -60,10" stroke="#2E4766" stroke-width="3" fill="none" stroke-linecap="round"/>${o.jonah?`<ellipse cx="10" cy="-2" rx="34" ry="26" fill="#2E4766"/><g transform="translate(10,20) scale(.6)">${person({robe:'#4C9A8A',hair:'#3A2A1E',beard:1,arms:'pray'})}</g>`:''}</g>`;
  P.ark = o => o.frame
    ? `<g stroke="#8B5A2B" stroke-width="6" stroke-linecap="round" fill="none"><path d="M-90,-30 L90,-30 L70,0 L-70,0Z"/><path d="M-60,-30 L-50,0 M-20,-30 L-16,0 M20,-30 L16,0 M60,-30 L50,0"/></g><path d="M-90,-30 L-10,-30 L-14,-14 L-80,-14Z" fill="#A0703E"/>`
    : `<g class="${o.bob?'bob':''}"><path d="M-95,-32 L95,-32 L72,0 L-72,0Z" fill="#8B5A2B"/><path d="M-90,-22 L90,-22 M-80,-11 L80,-11" stroke="#6E4520" stroke-width="2"/><rect x="-50" y="-62" width="100" height="30" fill="#A0703E"/><path d="M-58,-62 L0,-82 L58,-62Z" fill="#7A4B22"/><g fill="#3B2615">${[-34,-12,10,32].map(x=>`<rect x="${x-5}" y="-54" width="10" height="10" rx="2"/>`).join('')}</g><circle cx="-34" cy="-49" r="3.5" fill="#E8A94B"/><circle cx="10" cy="-49" r="3.5" fill="#9A9A9A"/></g>`;
  P.boat = o => {
    let crew='';
    if(o.crew){ const m=o.scared?'wow':(o.wow?'wow':'');
      crew += `<g transform="translate(-30,-16) scale(.55)">${person({robe:'#6E8BB0',hair:'#3A2A1E',beard:1,mood:m,arms:o.scared?'up':'down'})}</g><g transform="translate(-8,-16) scale(.55)">${person({robe:'#8DA05E',hair:'#5A3A22',beard:1,mood:m,arms:o.scared?'up':'down'})}</g>`; }
    if(o.crew && !o.sleeper && !o.scared && !o.wow) crew += `<g transform="translate(20,-16) scale(.55)">${person({robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1})}</g>`;
    if(o.sleeper) crew += `<g transform="translate(34,-24) scale(.5) rotate(-90)">${person({robe:'#F4F1EA',sash:'#C0392B',hair:'#3A2A1E',beard:1,sleep:1})}</g>`;
    return `<g class="${o.rock?'rock':'bob'}">${o.sail?`<line x1="0" y1="-18" x2="0" y2="-86" stroke="#6E4520" stroke-width="4"/><path d="M2,-84 Q34,-56 2,-26Z" fill="#F6F1E6"/>`:''}${crew}<path d="M-52,-18 L52,-18 L38,0 L-38,0Z" fill="#9A6B3E"/><path d="M-48,-12 L48,-12" stroke="#7A5232" stroke-width="2"/></g>`;
  };
  P.flock = o => { seed=5; let s=''; const pts=[[150,214],[200,206],[250,212],[300,204],[340,216],[180,232],[230,236],[280,230],[330,240],[130,240]]; for(let i=0;i<(o.n||9);i++){ const [x,y]=pts[i]; s+=`<g class="tap" data-say="Baa!" transform="translate(${x},${y}) scale(${0.55+rnd()*0.15})">${P.sheep({flip:rnd()>.5})}</g>`; } return s; };
  P.sheep = o => `<g transform="scale(${o.flip?-1:1},1)"><rect x="-10" y="-8" width="4" height="8" fill="#3A3A3A"/><rect x="6" y="-8" width="4" height="8" fill="#3A3A3A"/>${[[-12,-18],[0,-22],[12,-18],[-6,-12],[8,-12],[0,-16]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#FFFFFF" stroke="#E6E2DA" stroke-width="1"/>`).join('')}<ellipse cx="20" cy="-20" rx="7" ry="8.5" fill="#3A3A3A"/><ellipse cx="14" cy="-24" rx="4" ry="2" fill="#3A3A3A"/><circle cx="22" cy="-22" r="1.6" fill="#FFF"/></g>`;
  P.lion = o => `<g transform="scale(${o.flip?-1:1},1)"><path d="M-22,-16 Q-36,-26 -32,-34" stroke="#C98A3A" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="-32" cy="-35" r="4" fill="#8A4E1A"/><rect x="-16" y="-10" width="6" height="10" fill="#E8A94B"/><rect x="8" y="-10" width="6" height="10" fill="#E8A94B"/><ellipse cx="0" cy="-16" rx="22" ry="11" fill="#E8A94B"/><g class="${o.sleep?'':'mane'}"><circle cx="20" cy="-26" r="15" fill="#B5651D"/></g><circle cx="21" cy="-25" r="10" fill="#F0B95C"/>${o.sleep?`<path d="M15,-27 q2.5,2 5,0 M22,-27 q2.5,2 5,0" stroke="#3A2A1E" stroke-width="1.6" fill="none"/><text x="34" y="-38" font-family="Fredoka, sans-serif" font-weight="700" font-size="12" fill="#FFF3C4" class="float">z</text>`:`<circle cx="17" cy="-28" r="1.8" fill="#3A2A1E"/><circle cx="25" cy="-28" r="1.8" fill="#3A2A1E"/>`}<ellipse cx="21" cy="-22" rx="3" ry="2" fill="#7A3E1A"/></g>`;
  P.elephant = () => `<rect x="-18" y="-16" width="9" height="16" fill="#8E9AAB"/><rect x="8" y="-16" width="9" height="16" fill="#8E9AAB"/><ellipse cx="0" cy="-24" rx="24" ry="16" fill="#9AA6B8"/><circle cx="24" cy="-30" r="12" fill="#9AA6B8"/><ellipse cx="16" cy="-30" rx="8" ry="11" fill="#8592A6"/><path d="M33,-28 Q40,-14 34,-4" stroke="#9AA6B8" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="27" cy="-33" r="1.8" fill="#2B3550"/>`;
  P.giraffe = () => `<rect x="-12" y="-24" width="4" height="24" fill="#E8B94B"/><rect x="8" y="-24" width="4" height="24" fill="#E8B94B"/><ellipse cx="0" cy="-28" rx="16" ry="9" fill="#F2C75C"/><path d="M8,-30 L18,-66 L24,-64 L16,-28Z" fill="#F2C75C"/><ellipse cx="24" cy="-68" rx="9" ry="5" fill="#F2C75C"/><line x1="20" y1="-72" x2="19" y2="-78" stroke="#8A5A2B" stroke-width="2"/><circle cx="25" cy="-70" r="1.6" fill="#2B3550"/>${[[-6,-30],[4,-26],[14,-48],[-10,-24]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#B8742E"/>`).join('')}`;
  P.donkey = () => `<rect x="-14" y="-16" width="5" height="16" fill="#8A7F75"/><rect x="8" y="-16" width="5" height="16" fill="#8A7F75"/><ellipse cx="0" cy="-22" rx="18" ry="10" fill="#9C9188"/><path d="M12,-26 L22,-42 L30,-38 L20,-22Z" fill="#9C9188"/><ellipse cx="28" cy="-40" rx="8" ry="6" fill="#9C9188"/><path d="M22,-46 L20,-58 L26,-48Z M27,-46 L28,-58 L31,-46Z" fill="#8A7F75"/><circle cx="28" cy="-42" r="1.6" fill="#2B3550"/>`;
  P.dove = o => `<g class="float"><ellipse cx="0" cy="0" rx="14" ry="8" fill="#FFFFFF"/><circle cx="12" cy="-5" r="6" fill="#FFFFFF"/><path d="M17,-5 l6,1.5 l-6,1.5Z" fill="#FF9F43"/><circle cx="13" cy="-6" r="1.2" fill="#2B3550"/><path class="flap" d="M-4,-4 Q-12,-26 6,-22 Q4,-12 -4,-4Z" fill="#EEF2F7"/><path d="M-14,0 l-10,-4 l2,8Z" fill="#FFFFFF"/>${o.leaf?`<path d="M23,-2 q8,-6 14,2 q-8,6 -14,-2Z" fill="#4E9A5A"/>`:''}</g>`;

  function shade(hex,amt){ const n=parseInt(hex.slice(1),16); let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt; r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b)); return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0'); }

  function person(o){
    o = o||{};
    if(o.angel){ o = Object.assign({robe:'#FFFFFF',hair:'#F2C94C',glow:1,wings:1,skin:'#E8B98A'},o); }
    const robe=o.robe||'#5B8DEF', skin=o.skin||'#C98E62', hair=o.hair||'#3A2A1E', dk=shade(robe,-30);
    let s='';
    if(o.glow) s+=`<circle cx="0" cy="-34" r="54" fill="url(#glowG)"/>`;
    if(o.wings) s+=`<g class="flap-slow"><path d="M-6,-34 C-46,-66 -52,-20 -14,-12Z" fill="#FFFFFF" opacity=".95" stroke="#E2E8F0"/><path d="M6,-34 C46,-66 52,-20 14,-12Z" fill="#FFFFFF" opacity=".95" stroke="#E2E8F0"/></g>`;
    if(o.staff) s+=`<path d="M18,0 L18,-62 Q18,-72 10,-70" stroke="#7A5232" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const A = {down:[-14,-12,14,-12], up:[-20,-60,20,-60], out:[-28,-34,28,-34], pray:[-2,-30,2,-30]}[o.arms||(o.staff?'staff':'down')] || [-14,-12,17,-30];
    const legs = o.run ? `<path d="M-6,-4 L-14,0 M6,-4 L14,-2" stroke="${skin}" stroke-width="4" stroke-linecap="round"/>` : '';
    s+=legs;
    s+=`<path d="M-13,0 Q-12,-20 -8,-34 Q0,-38 8,-34 Q12,-20 13,0Z" fill="${robe}"/>`;
    if(o.sash) s+=`<path d="M-9,-33 L10,-6" stroke="${o.sash}" stroke-width="5"/>`;
    else s+=`<path d="M-10,-18 L10,-18" stroke="${dk}" stroke-width="2.5"/>`;
    if(o.helmet) s+=`<path d="M-11,-30 L11,-30 L12,-12 L-12,-12Z" fill="#B0B5BF" opacity=".9"/>`;
    s+=`<g stroke="${robe}" stroke-width="6" stroke-linecap="round"><line x1="-8" y1="-31" x2="${A[0]}" y2="${A[1]}"/><line x1="8" y1="-31" x2="${A[2]}" y2="${A[3]}"/></g><circle cx="${A[0]}" cy="${A[1]}" r="3.2" fill="${skin}"/><circle cx="${A[2]}" cy="${A[3]}" r="3.2" fill="${skin}"/>`;
    if(o.long && !o.scarf) s+=`<path d="M-11,-48 Q-14,-34 -9,-30 L9,-30 Q14,-34 11,-48Z" fill="${hair}"/>`;
    if(o.scarf) s+=`<path d="M-13,-44 Q-14,-60 0,-60 Q14,-60 13,-44 L12,-30 L-12,-30Z" fill="${o.scarf}"/>`;
    s+=`<circle cx="0" cy="-45" r="10" fill="${skin}"/>`;
    if(!o.scarf) s+=`<path d="M-10,-45 Q-11,-58 0,-57 Q11,-58 10,-45 Q7,-52 0,-52 Q-7,-52 -10,-45Z" fill="${hair}"/>`;
    if(o.beard) s+=`<path d="M-9,-44 Q-8,-32 0,-31 Q8,-32 9,-44 Q6,-38 0,-38 Q-6,-38 -9,-44Z" fill="${hair}"/>`;
    if(o.sleep) s+=`<path d="M-5,-46 q1.5,1.5 3,0 M2,-46 q1.5,1.5 3,0" stroke="#2B1B12" stroke-width="1.3" fill="none"/>`;
    else s+=`<circle cx="-3.5" cy="-46" r="1.4" fill="#2B1B12"/><circle cx="3.5" cy="-46" r="1.4" fill="#2B1B12"/>`;
    const m=o.mood;
    if(!o.beard || m){
      if(m==='wow') s+=`<ellipse cx="0" cy="${o.beard?-37:-40}" rx="2" ry="2.6" fill="#7A2E2E"/>`;
      else if(m==='sad') s+=`<path d="M-3,${o.beard?-36:-39} Q0,${o.beard?-38.5:-41.5} 3,${o.beard?-36:-39}" stroke="#7A2E2E" stroke-width="1.4" fill="none"/>`;
      else if(m==='mad') s+=`<path d="M-6,-50 L-2,-48 M6,-50 L2,-48" stroke="#2B1B12" stroke-width="1.5"/><path d="M-3,${o.beard?-37:-40} L3,${o.beard?-37:-40}" stroke="#7A2E2E" stroke-width="1.4"/>`;
      else s+=`<path d="M-3,-41 Q0,-38.5 3,-41" stroke="#7A2E2E" stroke-width="1.4" fill="none"/>`;
    } else s+=`<path d="M-3,-38 Q0,-36 3,-38" stroke="#7A2E2E" stroke-width="1.3" fill="none"/>`;
    if(o.crown) s+=`<path d="M-9,-54 L-9,-64 L-4,-58 L0,-66 L4,-58 L9,-64 L9,-54Z" fill="#FFD95A" stroke="#D9A441"/>`;
    if(o.helmet) s+=`<path d="M-11,-48 Q-11,-60 0,-60 Q11,-60 11,-48Z" fill="#B0B5BF"/><path d="M0,-60 L0,-66" stroke="#C0392B" stroke-width="4"/>`;
    if(o.angel) s+=`<ellipse cx="0" cy="-62" rx="8" ry="2.5" fill="none" stroke="#FFD95A" stroke-width="2"/>`;
    if(o.hold){ const hx=A[2], hy=A[3];
      const H={ hammer:`<g transform="translate(${hx},${hy}) rotate(-20)"><rect x="-1.5" y="-14" width="3" height="16" fill="#7A5232"/><rect x="-6" y="-18" width="12" height="6" fill="#7A7F88"/></g>`,
        tambourine:`<circle cx="${hx+4}" cy="${hy-4}" r="8" fill="#F2D27A" stroke="#C4973D" stroke-width="2"/>`,
        sling:`<path d="M${hx},${hy} q10,-14 22,-4" stroke="#7A5232" stroke-width="2" fill="none"/><circle cx="${hx+22}" cy="${hy-4}" r="3.5" fill="#9A9A9A"/>`,
        coins:`<path d="M${hx-6},${hy} q6,-12 12,0 q2,10 -6,10 q-8,0 -6,-10Z" fill="#C9A15A"/><circle cx="${hx}" cy="${hy-4}" r="3" fill="#FFD95A"/>`,
        basket:`<g transform="translate(${hx+4},${hy+8}) scale(.55)">${P.basket({})}</g>`,
        bread:`<ellipse cx="${hx}" cy="${hy-4}" rx="8" ry="5" fill="#E8B96A"/><ellipse cx="${-hx}" cy="${hy-4}" rx="8" ry="5" fill="#F0C47A"/>`}[o.hold]||'';
      s+=H; }
    if(o.carry) s = `<g transform="translate(0,-48) scale(.62)">${P.sheep({})}</g>` + s.replace(/<line x1="-8" y1="-31" x2="[^"]*" y2="[^"]*"\/><line x1="8" y1="-31" x2="[^"]*" y2="[^"]*"\/>/, `<line x1="-8" y1="-31" x2="-12" y2="-52"/><line x1="8" y1="-31" x2="12" y2="-52"/>`);
    if(o.kid) s = `<g transform="translate(0,0) scale(.82)">${s}</g>`;
    if(o.run) s = `<g class="hop">${s}</g>`;
    return s;
  }
  P.person = person;

  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <radialGradient id="glowG"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".95"/><stop offset=".5" stop-color="#FFE48A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE48A" stop-opacity="0"/></radialGradient>
    <radialGradient id="sunG" cx=".35" cy=".35"><stop offset="0" stop-color="#FFF2A8"/><stop offset="1" stop-color="#FFC94A" stop-opacity="0"/></radialGradient>
  </defs></svg>`;

  const FULL = new Set(['hills','sea','stars','clouds','rain','birds','stream','beach','bubbles','flock']);
  function item([k,x,y,sc,o]){
    o=o||{}; const f=P[k]; if(!f) return '';
    const body=f(o);
    const tap = o.say ? ` class="tap" tabindex="0" role="button" aria-label="${o.say.replace(/"/g,'&quot;')}" data-say="${o.say.replace(/"/g,'&quot;')}"` : '';
    if(FULL.has(k)) return `<g${k==='sea'?` transform="translate(0,${y})"`:''}><g${tap}>${body}</g></g>`;
    const rot = o.rot?` rotate(${o.rot})`:'';
    return `<g transform="translate(${x},${y}) scale(${sc||1})${rot}"><g${tap}>${body}</g></g>`;
  }
  function scene(sc){ return bg(sc.bg) + sc.items.map(item).join(''); }
  return {scene, DEFS, person};
})();
