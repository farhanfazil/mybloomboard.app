/* eslint-disable */
// Generated from the approved mockup. Runs the page's animations inside `root`
// and returns a cleanup that stops every timer, observer and listener.
import { ICONS } from "./icons";
export function run(root) {
  const timers = new Set(), intervals = new Set(), observers = [], offs = [];
  const setTimeout = (f, ms) => { const id = window.setTimeout(() => { timers.delete(id); f(); }, ms); timers.add(id); return id; };
  const clearTimeout = (id) => { window.clearTimeout(id); timers.delete(id); };
  const setInterval = (f, ms) => { const id = window.setInterval(f, ms); intervals.add(id); return id; };
  const clearInterval = (id) => { window.clearInterval(id); intervals.delete(id); };
  const addEventListener = (t, f, o) => { window.addEventListener(t, f, o); offs.push(() => window.removeEventListener(t, f, o)); };
  const docOn = (t, f, o) => { document.addEventListener(t, f, o); offs.push(() => document.removeEventListener(t, f, o)); };
  const IntersectionObserver = function (cb, o) { const io = new window.IntersectionObserver(cb, o); observers.push(io); return io; };
  const icons = () => root.querySelectorAll("i[data-lucide]").forEach((i) => {
    const svg = ICONS[i.getAttribute("data-lucide")]; if (!svg) return;
    const t = document.createElement("span"); t.innerHTML = svg; const el = t.firstChild;
    if (i.getAttribute("class")) el.setAttribute("class", el.getAttribute("class") + " " + i.getAttribute("class"));
    if (i.getAttribute("style")) el.setAttribute("style", i.getAttribute("style"));
    i.replaceWith(el);
  });
  const lucide = { createIcons: icons };
  const F=k=>`/office/face-${k}.jpg`;
  const ppl={sam:F('sam'),maya:F('maya'),daniel:F('daniel'),nora:F('nora'),ethan:F('ethan'),chloe:F('chloe'),leo:F('leo'),priya:F('priya')};
  {


const world=document.getElementById('world');
const tile=(x,y,w,h,name,role,img,sig,sigCls,icon,dot,extra='')=>`
  <div class="abs pt ${extra}" id="pt-${name.split(' ')[0].toLowerCase()}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
    <div class="row"><span class="pav" style="background-image:url(${img});--sd:${dot}"></span><div><div class="pn">${name}</div><div class="pr">${role}</div></div></div>
    <div class="sig ${sigCls}"><i data-lucide="${icon}"></i>${sig}</div>
  </div>`;
world.innerHTML=`
  <div class="abs" style="left:40px;top:28px"><div class="hdr-title">Team Space</div><div class="hdr-sub" id="hsub">7 in the office · 2 talking · 1 in focus</div></div>
  <div class="abs search" style="left:1010px;top:34px;width:220px"><i data-lucide="search"></i>Find a person or room</div>

  <div class="abs hood" style="left:40px;top:96px;width:640px;height:384px"><span class="hood-t">Design</span></div>
  <div class="abs room live" id="droom" style="left:58px;top:134px;width:604px;height:132px">
    <div class="room-t"><i data-lucide="pen-tool"></i>Design room<span class="livepill"><i></i>LIVE · <span id="lt">12:04</span></span><span class="lock"><i data-lucide="lock"></i>Locked · knock to come in</span></div>
    <div class="cluster" id="cluster"><span class="cav talk" id="cv-maya" style="background-image:url(${ppl.maya})"></span><span class="cav" style="background-image:url(${ppl.daniel})"></span><span class="room-sub" id="rsub">Maya is talking</span></div>
    <div class="acts" id="acts"><span class="act"><i data-lucide="message-circle"></i>Message</span><span class="act pr" id="kbtn"><i data-lucide="hand"></i>Knock</span></div>
    <div class="knock" id="knock"><span id="k1">Knock knock</span></div>
  </div>
  ${tile(58,284,192,96,'Nora Ali','Designer',ppl.nora,'Working on Acme banners','','pencil','#22c55e')}
  ${tile(264,284,192,96,'Chloe Park','Illustrator',ppl.chloe,'Back at 2:30','amber','clock','#fbbf24')}
  ${tile(470,284,192,96,'Leo Hart','Motion designer',ppl.leo,'On leave · back Oct 6','violet','sun','#a78bfa','dim')}
  <div class="abs" style="left:58px;top:396px;width:604px;font-size:12px;color:var(--dim)">Maya Chen and Daniel Park are in the Design room.</div>

  <div class="abs hood" style="left:700px;top:96px;width:530px;height:384px"><span class="hood-t">Product</span></div>
  <div class="abs room" style="left:718px;top:134px;width:494px;height:132px">
    <div class="room-t"><i data-lucide="box"></i>Product room</div>
    <div class="cluster"><span class="room-sub q" style="margin-left:0">Nobody here. Walk in any time.</span></div>
  </div>
  ${tile(718,284,158,96,'Sam Rivera','You · Designer',ppl.sam,'Homepage hero','','pencil','#22c55e')}
  ${tile(886,284,158,96,'Ethan Cole','Engineer',ppl.ethan,'Mobile App V2','','code','#22c55e')}
  ${tile(1054,284,158,96,'Priya Nair','Engineer',ppl.priya,'In focus · 32 min','violet','moon','#a78bfa')}

  <div class="abs space" style="left:40px;top:504px;width:380px;height:108px"><div class="s1"><i data-lucide="coffee"></i>Lounge</div><div class="s2">Audio only. Drop in for a chat.</div></div>
  <div class="abs space" style="left:440px;top:504px;width:380px;height:108px"><div class="s1"><i data-lucide="users"></i>All hands</div><div class="s2">Next: Friday 10:00</div></div>
  <div class="abs space" style="left:840px;top:504px;width:390px;height:108px"><div class="s1"><i data-lucide="moon"></i>Focus zone</div><div class="s2">Priya, 32 min left. Knocks wait until she is out.</div></div>

  <div class="abs now" style="left:1250px;top:96px;width:210px;height:516px">
    <h4>Now</h4>
    <div class="row" style="display:flex;gap:10px;align-items:center"><span class="pav" style="background-image:url(${ppl.sam});--sd:#22c55e"></span><div><div class="pn">You</div><div class="pr">Available</div></div></div>
    <span class="chipb">Back in 30</span><span class="chipb">Focus 45 min</span>
    <h4 style="margin-top:22px">Today</h4>
    <div class="feed" id="feed">
      <div class="fi"><span class="a" style="background-image:url(${ppl.ethan})"></span>Ethan waved at you</div>
      <div class="fi"><span class="a" style="background-image:url(${ppl.nora})"></span>Nora joined the Lounge</div>
    </div>
  </div>

  <div class="dock" id="dock" style="left:362px;top:20px">
    <div class="lbl">On Maya's screen</div>
    <div class="who"><span class="a" style="background-image:url(${ppl.sam})"></span><div><b>Sam Rivera</b> is knocking</div></div>
    <div class="bt"><span class="act pr" id="letin">Let in</span><span class="act">Not now</span></div>
  </div>
  <div class="toast" id="toast" style="left:250px;top:84px"><span class="a" style="background-image:url(${ppl.maya})"></span>Maya let you in</div>
  <span class="flyer" id="flyer" style="background-image:url(${ppl.sam})"></span>
  <div class="cursor" id="cursor"><svg viewBox="0 0 24 24"><path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg><span class="clk"></span></div>
`;
lucide.createIcons();

/* ── camera ── */
const film=document.getElementById('film');
let cam={x:0,y:0,w:1500,h:680}, scale=1;
function frame(x,y,w,h,snap){
  cam={x,y,w,h};
  const W=film.clientWidth,H=film.clientHeight;
  scale=Math.min(W/w,H/h);
  const tx=W/2-(x+w/2)*scale, ty=H/2-(y+h/2)*scale;
  world.classList.toggle('snap',!!snap);
  world.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;
  placeCursor(cur.x,cur.y,true);
}
addEventListener('resize',()=>frame(cam.x,cam.y,cam.w,cam.h,true));

/* ── cursor ── */
const cursor=document.getElementById('cursor'); let cur={x:1180,y:430};
function placeCursor(x,y,instant){
  cur={x,y};
  if(instant){cursor.style.transition='none'} else cursor.style.transition='';
  cursor.style.transform=`translate(${x}px,${y}px) scale(${1/scale})`;
  if(instant){cursor.offsetWidth; cursor.style.transition=''}
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function click(){cursor.classList.remove('click');cursor.offsetWidth;cursor.classList.add('click');await sleep(250)}

/* ── captions + progress ── */
const SHOTS=[['See who\'s around.',4200],['What everyone is working on, at a glance.',4200],['Knock, don\'t interrupt.',5200],['They let you in.',3800],['Walk in and talk. No links.',4600]];
const steps=document.getElementById('steps');
steps.innerHTML=SHOTS.map(()=>'<i></i>').join('');
function shot(i){
  const c=document.getElementById('capt');
  c.style.opacity=0; setTimeout(()=>{c.textContent=SHOTS[i][0];c.style.opacity=1},250);
  document.getElementById('capk').textContent=String(i+1).padStart(2,'0');
  [...steps.children].forEach((s,k)=>{s.className=k<i?'done':k===i?'on':'';s.style.setProperty('--d',SHOTS[i][1]+'ms')});
}

/* ── live timer ── */
let secs=12*60+4; setInterval(()=>{secs++;document.getElementById('lt').textContent=`${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`},1000);

/* ── the film ── */
const $=id=>document.getElementById(id);
function reset(){
  ['acts','knock','dock','toast'].forEach(i=>$(i).classList.remove('on'));
  $('cluster').querySelectorAll('.extra').forEach(e=>e.remove());
  $('rsub').textContent='Maya is talking'; $('hsub').textContent='7 in the office · 2 talking · 1 in focus';
  const f=$('flyer'); f.style.transition='none'; f.style.opacity=0; f.offsetWidth; f.style.transition='';
  $('pt-sam').style.opacity=1;
}
let run=0;
async function play(){
  const me=++run; const alive=()=>me===run;
  reset();
  // 1. wide
  shot(0); frame(0,0,1500,680,true); placeCursor(1180,440,true);
  await sleep(SHOTS[0][1]); if(!alive())return;
  // 2. pan across the Design neighbourhood: statuses
  shot(1); frame(40,250,640,160);
  await sleep(1700); if(!alive())return;
  placeCursor(330,350); await sleep(1100); if(!alive())return;
  placeCursor(520,350); await sleep(1300); if(!alive())return;
  // 3. knock on the locked Design room
  shot(2); frame(40,110,680,190);
  placeCursor(470,210); await sleep(1300); if(!alive())return;
  $('acts').classList.add('on'); await sleep(600);
  placeCursor(606,236); await sleep(1000); if(!alive())return;
  $('kbtn').classList.add('press'); await click(); $('kbtn').classList.remove('press');
  $('acts').classList.remove('on');
  const k=$('knock'),k1=$('k1'),room=$('droom');
  k.classList.add('on'); room.classList.add('nudge');
  k1.textContent='Knock knock'; k1.classList.remove('in'); k1.offsetWidth; k1.classList.add('in');
  await sleep(1050); k1.textContent='knock knock'; k1.classList.remove('in'); k1.offsetWidth; k1.classList.add('in');
  await sleep(1100); k.classList.remove('on'); room.classList.remove('nudge'); if(!alive())return;
  // 4. inside the room: Maya lets you in
  shot(3); frame(300,0,420,200);
  $('dock').classList.add('on'); placeCursor(560,40,true); await sleep(1100);
  placeCursor(394,104); await sleep(1100); if(!alive())return;
  $('letin').classList.add('press'); await click(); $('letin').classList.remove('press');
  $('dock').classList.remove('on'); await sleep(500);
  // 5. walk in: your avatar flies from your desk into the room
  shot(4); frame(0,60,1250,360);
  $('toast').classList.add('on');
  placeCursor(1180,440);
  const f=$('flyer'), from=$('pt-sam');
  f.style.transition='none'; f.style.left='732px'; f.style.top='298px'; f.style.opacity=1; f.offsetWidth; f.style.transition='';
  from.style.opacity=.45;
  await sleep(250);
  f.style.left='174px'; f.style.top='184px'; f.style.width='40px'; f.style.height='40px';
  await sleep(1350); if(!alive())return;
  f.style.opacity=0;
  const c=document.createElement('span'); c.className='cav extra'; c.style.backgroundImage=`url(${ppl.sam})`;
  $('cluster').insertBefore(c,$('rsub'));
  $('rsub').textContent='You joined Maya and Daniel'; $('hsub').textContent='7 in the office · 3 talking · 1 in focus';
  await sleep(900); $('toast').classList.remove('on');
  // talker switches to you
  $('cv-maya').classList.remove('talk'); c.classList.add('talk'); $('rsub').textContent='You are talking';
  await sleep(1600); if(!alive())return;
  frame(0,0,1500,680); await sleep(2200); if(!alive())return;
  $('cv-maya').classList.add('talk');
  play();
}
$('replay').onclick=()=>play();
docOn('visibilitychange',()=>{ if(!document.hidden) play() });
frame(0,0,1500,680,true);
play();

  }
  {

const stackEl=document.getElementById('stack');if(stackEl)stackEl.innerHTML=['maya','daniel','nora','ethan','priya'].map(k=>`<span style="background-image:url(${ppl[k]})"></span>`).join('');
/* ── short clips: each plays while on screen and loops ── */
const S=ms=>new Promise(r=>setTimeout(r,ms));
const CUR='<div class="mini-cursor"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 2l15 8.5-6.6 1.6L9.6 19z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg><span class="clk"></span></div>';
function moveTo(el,target,dx=0.5,dy=0.6){const c=el.querySelector('.mini-cursor'),r=el.getBoundingClientRect(),t=target.getBoundingClientRect();c.style.left=(t.left-r.left+t.width*dx)+'px';c.style.top=(t.top-r.top+t.height*dy)+'px'}
async function tap(el){const c=el.querySelector('.mini-cursor');c.classList.remove('click');c.offsetWidth;c.classList.add('click');await S(250)}
const av=(p,cls='a')=>`<span class="${cls}" style="background-image:url(${p})"></span>`;

const CLIPS={
 status:{
  html:`<div class="center"><div class="stile" id="st"><div class="row"><span class="pav" id="stdot" style="background-image:url(${ppl.maya});--sd:#22c55e"></span><div><div class="pn">Maya Chen</div><div class="pr">Designer</div></div></div><div class="sig" id="stsig"></div></div></div>`,
  states:[['pencil','Working on Spring banners','','#22c55e'],['video','Talking in Design room','cyan','#9fdcff'],['clock','Back at 2:30','amber','#fbbf24'],['moon','In focus · 45 min','violet','#a78bfa'],['sun','On leave · back Oct 6','violet','#a78bfa']],
  i:0,
  set(el){const [ic,t,c,d]=this.states[this.i%this.states.length];const s=el.querySelector('#stsig');s.className='sig fade-in '+c;s.innerHTML=`<i data-lucide="${ic}"></i>${t}`;el.querySelector('#stdot').style.setProperty('--sd',d);el.querySelector('#st').style.opacity=this.i%5===4?.65:1;lucide.createIcons()},
  init(el){el.querySelector('#st').onclick=()=>{this.i++;this.set(el)};this.set(el)},
  async loop(el,alive){while(alive()){await S(2200);if(!alive())return;this.i++;this.set(el)}}
 },
 wave:{
  html:`<div class="center"><div class="tlive">${[['ethan','Ethan'],['nora','Nora'],['daniel','Daniel']].map(([k,n])=>`<div class="tla" id="w-${k}">${av(ppl[k])}<span>${n}</span><span class="hand"><i data-lucide="hand"></i></span></div>`).join('')}</div><div class="toast" id="wt" style="position:static">${av(ppl.ethan)}Ethan waved at you</div></div>`,
  async loop(el,alive){while(alive()){const h=el.querySelector('#w-ethan .hand'),t=el.querySelector('#wt');h.classList.remove('on');t.classList.remove('on');await S(900);h.classList.add('on');await S(400);t.classList.add('on');await S(2600);if(!alive())return;t.innerHTML=`${av(ppl.sam)}You waved back`;await S(1800);t.classList.remove('on');h.classList.remove('on');await S(500);t.innerHTML=`${av(ppl.ethan)}Ethan waved at you`}}
 },
 lounge:{
  html:`<div class="row-h"><div><div style="display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px"><i data-lucide="coffee" style="width:18px;height:18px"></i>Lounge</div><span class="pill" style="margin-top:10px"><i class="d" style="background:#22c55e"></i><span id="lc">2 chatting</span></span></div>
   <div class="lounge-av" id="la">${[['maya','Maya'],['daniel','Daniel']].map(([k,n],i)=>`<div class="lav">${av(ppl[k])}<span>${n}</span><span class="eq ${i?'quiet':''}"><i></i><i></i><i></i></span></div>`).join('')}</div>
   <div class="toast" id="lt2" style="position:static">${av(ppl.nora)}Nora dropped in</div></div>`,
  async loop(el,alive){while(alive()){const la=el.querySelector('#la'),t=el.querySelector('#lt2');[...la.children].slice(2).forEach(c=>c.remove());el.querySelector('#lc').textContent='2 chatting';t.classList.remove('on');
   const eqs=()=>la.querySelectorAll('.eq');let k=0;const iv=setInterval(()=>{eqs().forEach((e,j)=>e.classList.toggle('quiet',j!==k%eqs().length));k++},1500);
   await S(2400);if(!alive()){clearInterval(iv);return}
   const n=document.createElement('div');n.className='lav fade-in';n.innerHTML=`${av(ppl.nora)}<span>Nora</span><span class="eq quiet"><i></i><i></i><i></i></span>`;la.appendChild(n);t.classList.add('on');el.querySelector('#lc').textContent='3 chatting';
   await S(4200);clearInterval(iv);t.classList.remove('on');await S(400)}}
 },
 knock:{
  html:`<div class="center"><div class="kcard"><div class="who">${av(ppl.daniel)}<div><b>Daniel</b> knocked<br><span style="color:var(--dim);font-size:12.5px">Got a minute?</span></div></div>
   <div class="bt"><span class="act pr" data-a="in">Come in</span><span class="act" data-a="five">Give me 5</span><span class="act" data-a="no">Not now</span></div></div><div class="kres" id="kr"></div></div>`+CUR,
  res:{in:'Starting a call with Daniel…',five:'Daniel sees: "Maya will be free in 5 minutes."',no:'Daniel sees: "Maya can\'t talk right now."'},
  init(el){el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{this.user=Date.now();this.show(el,b.dataset.a)})},
  show(el,a){const r=el.querySelector('#kr');r.className='kres fade-in';r.textContent=this.res[a]},
  async loop(el,alive){const order=['in','five','no'];let i=0;while(alive()){await S(1400);if(!alive())return;if(Date.now()-(this.user||0)<8000){await S(1500);continue}
   const a=order[i++%3],b=el.querySelector(`[data-a=${a}]`);el.querySelector('#kr').textContent='';moveTo(el,b);await S(1000);await tap(el);this.show(el,a);await S(2600)}}
 },
 lock:{
  html:`<div class="center"><div class="lroom"><div class="room-t"><i data-lucide="pen-tool"></i>Design room<span class="lock" id="lk" style="display:none"><i data-lucide="lock"></i>Locked</span></div>
   <div class="cluster">${av(ppl.maya,'cav')}${av(ppl.daniel,'cav')}<span class="room-sub q" id="lsub">Open · anyone can drop in</span></div>
   <div class="sw" id="sw"><span class="tr"></span><span id="swt">Open · anyone can drop in</span></div></div>
   <div class="kres" id="lr"></div></div>`+CUR,
  locked:false,
  set(el,v){this.locked=v;el.querySelector('#sw').classList.toggle('off',v);el.querySelector('#lk').style.display=v?'':'none';
   el.querySelector('#swt').textContent=v?'Locked · people knock':'Open · anyone can drop in';el.querySelector('#lsub').textContent=v?'Locked · knock to ask to come in':'Open · anyone can drop in';
   const r=el.querySelector('#lr');r.className='kres fade-in';r.textContent=v?'Nora tries to join… and knocks instead.':'Nora walks straight in.'},
  init(el){el.querySelector('#sw').onclick=()=>{this.user=Date.now();this.set(el,!this.locked)}},
  async loop(el,alive){while(alive()){await S(1500);if(!alive())return;if(Date.now()-(this.user||0)<8000){await S(1500);continue}moveTo(el,el.querySelector('#sw .tr'));await S(1000);await tap(el);this.set(el,!this.locked);await S(2800)}}
 },
 note:{
  html:`<div class="center" style="align-items:stretch;max-width:520px;margin:0 auto">
   <div style="display:flex;align-items:center;gap:10px;font-size:13.5px"><span class="pav" style="background-image:url(${ppl.leo});--sd:#52525b;width:34px;height:34px"></span><b>Leo Hart</b><span style="color:var(--dim);font-size:12px">Offline</span></div>
   <div class="bubble" id="nb" style="align-self:flex-end;opacity:0"><i data-lucide="hand" style="width:13px;height:13px;vertical-align:-2px"></i> Knocked · got a minute when you're back?</div>
   <div class="kres" id="nn" style="opacity:0">Left Leo a knock note. They're offline right now.</div>
   <div class="bubble" id="nr" style="align-self:flex-start;opacity:0">Back now! Calling you.</div></div>`,
  async loop(el,alive){while(alive()){['nb','nn','nr'].forEach(i=>{const e=el.querySelector('#'+i);e.style.opacity=0;e.classList.remove('fade-in')});await S(900);
   for(const [i,w] of [['nb',900],['nn',2200],['nr',2600]]){if(!alive())return;const e=el.querySelector('#'+i);e.style.opacity=1;e.classList.add('fade-in');await S(w)}}}
 },
 meet:{
  html:`<div class="call2">
   <div class="cbar"><span class="livepill" style="margin:0"><i></i>LIVE</span><b>Design room</b><span class="cmut" id="mt">18:42</span><span class="cmut" style="display:flex;align-items:center;gap:5px"><i data-lucide="lock" style="width:13px;height:13px"></i>Locked</span>
    <span class="cright"><span class="stack2">${['maya','daniel','ethan','sam'].map(k=>`<span style="background-image:url(${ppl[k]})"></span>`).join('')}</span>4 in the room</span></div>
   <div class="cgrid">${[['maya','Maya Chen',''],['daniel','Daniel Park','mic-off'],['ethan','Ethan Cole',''],['sam','You','']].map(([k,n,m])=>`<div class="ctile" data-k="${k}" style="background-image:url(/office/call-${k}.jpg)"><span class="cname">${m?`<i data-lucide="${m}" class="mi"></i>`:`<span class="eq quiet"><i></i><i></i><i></i></span>`}${n}</span></div>`).join('')}</div>
   <div class="cctrl"><span class="cb"><i data-lucide="mic"></i></span><span class="cb"><i data-lucide="video"></i></span><span class="cb"><i data-lucide="monitor-up"></i></span><span class="cb"><i data-lucide="hand"></i></span><span class="cb"><i data-lucide="message-circle"></i></span><span class="cb end"><i data-lucide="phone-off"></i>Leave</span></div>
   <div class="cknock" id="ck"><div class="who">${av(ppl.nora)}<div><b>Nora Ali</b> is knocking<br><span>Design room is locked</span></div></div><div class="bt"><span class="act pr" id="ckin">Let in</span><span class="act">Not now</span></div></div>
   <div class="chand" id="chand"><i data-lucide="hand"></i>Ethan raised a hand</div>
  </div>`,
  talk(el,k){el.querySelectorAll('.ctile').forEach(t=>{const on=t.dataset.k===k;t.classList.toggle('talk',on);const e=t.querySelector('.eq');if(e)e.classList.toggle('quiet',!on)})},
  async loop(el,alive){let s=18*60+42;const tick=setInterval(()=>{s++;el.querySelector('#mt').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`},1000);
   const seq=[['maya',3200],['ethan',2400],['maya',2600],['sam',2400]];let i=0;
   while(alive()){const [k,ms]=seq[i%seq.length];this.talk(el,k);
    if(i%4===1){el.querySelector('#chand').classList.add('on');setTimeout(()=>el.querySelector('#chand').classList.remove('on'),2200)}
    if(i%4===2){const ck=el.querySelector('#ck');ck.classList.add('on');setTimeout(()=>{el.querySelector('#ckin').classList.add('press')},1600);setTimeout(()=>{ck.classList.remove('on');el.querySelector('#ckin').classList.remove('press')},2300)}
    i++;await S(ms)}
   clearInterval(tick)}
 },
 share:{
  html:`<div class="share2"><div class="desk" id="desk"><span class="shared2">Maya is sharing</span>
   <div class="hd">Spring campaign banners<span class="chip2">Draft 3</span></div>
   <div class="banners"><div class="bn" style="background-image:url(/office/banner-1.jpg);aspect-ratio:685/627"></div><div class="bn" style="background-image:url(/office/banner-2.jpg);aspect-ratio:532/627" id="b2"></div><div class="bn" style="background-image:url(/office/banner-3.jpg);aspect-ratio:567/627"></div></div>
   <svg class="ink2" id="ink"></svg>
   <svg class="pen" id="pen" viewBox="0 0 24 24"><path d="M3 21l3.5-1 11-11-2.5-2.5-11 11z" fill="#f59e0b" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/><path d="M15 6.5l2.5 2.5 2-2a1.7 1.7 0 0 0-2.5-2.5z" fill="#fff" stroke="#000" stroke-width="1.2"/></svg></div>
   <div class="tbar"><span><i data-lucide="mouse-pointer-2"></i>Pointer</span><span class="on"><i data-lucide="pen-line"></i>Marker</span><span class="dot"></span><span id="mode"><i data-lucide="clock"></i>Fade</span><span><i data-lucide="eraser"></i>Clear</span></div></div>`,
  async draw(el,d,alive,ms){const svg=el.querySelector('#ink'),pen=el.querySelector('#pen');const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.appendChild(p);
   const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;const t0=performance.now();
   await new Promise(res=>{const f=t=>{if(!alive())return res();const k=Math.min(1,(t-t0)/ms),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;p.style.strokeDashoffset=L*(1-e);const pt=p.getPointAtLength(L*e);pen.style.left=pt.x+'px';pen.style.top=pt.y+'px';k<1?requestAnimationFrame(f):res()};requestAnimationFrame(f)});return p},
  async loop(el,alive){let keep=false;while(alive()){const desk=el.querySelector('#desk'),svg=el.querySelector('#ink'),b2=el.querySelector('#b2');svg.innerHTML='';
   const W=desk.clientWidth;svg.setAttribute('viewBox',`0 0 ${W} ${desk.clientHeight}`);
   const r=b2.getBoundingClientRect(),dr=desk.getBoundingClientRect();const x=r.left-dr.left,y=r.top-dr.top,w=r.width,h=r.height;
   const cx=x+w/2,cy=y+h/2,rx=w/2+14,ry=h/2+10;
   const circle=`M${cx+rx*.2} ${cy-ry} C ${cx+rx*1.05} ${cy-ry}, ${cx+rx} ${cy+ry}, ${cx} ${cy+ry} C ${cx-rx} ${cy+ry}, ${cx-rx*1.02} ${cy-ry*1.02}, ${cx+rx*.05} ${cy-ry*1.06}`;
   const ty=Math.max(26,y-26), tx=cx+rx*.55;
   const arrow=`M${tx-8} ${ty-6} Q ${cx+rx*.15} ${ty-10}, ${cx+rx*.32} ${cy-ry+4} M${cx+rx*.32} ${cy-ry+4} l -11 -6 M${cx+rx*.32} ${cy-ry+4} l 3 -12`;
   el.querySelector('#mode').innerHTML=`<i data-lucide="${keep?'check':'clock'}"></i>${keep?'Keep':'Fade'}`;lucide.createIcons();
   await S(700);if(!alive())return;
   await this.draw(el,circle,alive,1500);await S(250);
   await this.draw(el,arrow,alive,900);
   const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',tx);t.setAttribute('y',ty);t.textContent='Use this one';svg.appendChild(t);
   await S(keep?3600:2400);if(!alive())return;
   [...svg.children].forEach(c=>c.style.opacity=0);await S(900);keep=!keep}}
 },
 chat:{
  html:`<div class="cc">
   <div class="cc-call"><div class="cc-bar"><span class="livepill" style="margin:0"><i></i>LIVE</span><b>Design room</b><span class="cmut">21:06</span></div>
    <div class="cc-grid">${['maya','daniel','ethan','sam'].map(k=>`<div class="ctile${k==='maya'?' talk':''}" style="background-image:url(/office/call-${k}.jpg)"><span class="cname">${k==='sam'?'You':k[0].toUpperCase()+k.slice(1)}</span></div>`).join('')}</div></div>
   <div class="cc-chat" id="ccp"><div class="cc-hd"><i data-lucide="message-circle"></i>Chat<span>Design room</span></div>
    <div class="cc-list" id="ccl"></div>
    <div class="cc-in"><i data-lucide="paperclip"></i><span>Message Design room</span><i data-lucide="arrow-right"></i></div>
    <div class="cc-drop" id="ccd"><i data-lucide="image"></i>Drop to share with the room</div></div>
   <div class="cc-file" id="ccf"><span class="th" style="background-image:url(/office/banner-2.jpg)"></span><span><b>new-season.jpg</b><br><small>1.2 MB</small></span></div>
  </div>`+CUR,
  msg(l,who,body){const d=document.createElement('div');d.className='cc-m fade-in';d.innerHTML=`<span class="a" style="background-image:url(${ppl[who]})"></span><div><b>${who==='sam'?'You':who[0].toUpperCase()+who.slice(1)}</b>${body}</div>`;l.appendChild(d);l.scrollTop=l.scrollHeight;return d},
  async loop(el,alive){
   const l=el.querySelector('#ccl'),f=el.querySelector('#ccf'),d=el.querySelector('#ccd'),p=el.querySelector('#ccp'),c=el.querySelector('.mini-cursor');
   while(alive()){
    l.innerHTML='';d.classList.remove('on');f.style.transition='none';f.style.opacity=0;
    this.msg(l,'maya','<p>Let\'s pick the hero banner for the launch.</p>');await S(700);
    this.msg(l,'ethan','<p>Sam, do you have the new one?</p>');await S(1100);if(!alive())return;
    // pick up the file on the left and drag it into the chat
    const r=el.getBoundingClientRect(),cr=el.querySelector('.cc-call').getBoundingClientRect(),pr=p.getBoundingClientRect();
    const sx=cr.left-r.left+40,sy=cr.bottom-r.top-90;
    f.style.left=sx+'px';f.style.top=sy+'px';f.offsetWidth;f.style.transition='';f.style.opacity=1;
    c.style.transition='none';c.style.left=(sx+30)+'px';c.style.top=(sy+24)+'px';c.offsetWidth;c.style.transition='';
    await S(500);
    const tx=pr.left-r.left+40,ty=pr.top-r.top+pr.height/2-30;
    f.style.left=tx+'px';f.style.top=ty+'px';c.style.left=(tx+30)+'px';c.style.top=(ty+24)+'px';
    await S(500);d.classList.add('on');await S(700);if(!alive())return;
    await tap(el);d.classList.remove('on');f.style.opacity=0;
    const m=this.msg(l,'sam','<div class="cc-img" style="background-image:url(/office/banner-2.jpg)"><span class="up"><i></i></span></div>');
    await S(60);m.querySelector('.up i').style.width='100%';await S(1000);m.querySelector('.up').style.opacity=0;
    c.style.left='92%';c.style.top='92%';
    await S(700);if(!alive())return;
    const t=this.msg(l,'maya','<p class="dots"><i></i><i></i><i></i></p>');await S(1100);t.querySelector('div').innerHTML='<b>Maya</b><p>Love it. Ship this one.</p>';
    await S(1300);if(!alive())return;
    this.msg(l,'daniel','<div class="cc-doc"><i data-lucide="file-text"></i><span><b>Launch brief.pdf</b><br><small>PDF · 240 KB</small></span></div>');lucide.createIcons();
    await S(3600)}
  }
 },
 desk:{
  html:`<div class="center"><div class="dk"><div class="dk-me"><span class="pav" id="dk-av" style="background-image:url(${ppl.sam});--sd:#22c55e"></span><div><div class="pn">Sam Rivera</div><div class="sig" id="dk-sig"><i data-lucide="pencil"></i>Homepage hero</div></div></div>
   <div class="dk-btns"><span class="act" data-st="brb"><i data-lucide="clock"></i>Back in 30</span><span class="act" data-st="focus"><i data-lucide="moon"></i>Focus 45 min</span></div></div></div>`+CUR,
  ST:{none:['pencil','Homepage hero','','#22c55e'],brb:['clock','Back at 3:30','amber','#fbbf24'],focus:['moon','In focus · 45 min','violet','#a78bfa']},
  set(el,k){const [ic,t,c,d]=this.ST[k];const g=el.querySelector('#dk-sig');g.className='sig fade-in '+c;g.innerHTML=`<i data-lucide="${ic}"></i>${t}`;el.querySelector('#dk-av').style.setProperty('--sd',d);el.querySelectorAll('[data-st]').forEach(b=>b.classList.toggle('pr',b.dataset.st===k));lucide.createIcons()},
  init(el){el.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{this.user=Date.now();this.set(el,b.classList.contains('pr')?'none':b.dataset.st)})},
  async loop(el,alive){const seq=['brb','none','focus','none'];let i=0;while(alive()){await S(1600);if(!alive())return;if(Date.now()-(this.user||0)<8000)continue;const k=seq[i++%4];const b=el.querySelector(`[data-st="${k==='none'?(i%4===2?'brb':'focus'):k}"]`);moveTo(el,b);await S(900);await tap(el);this.set(el,k);await S(1800)}}
 },
 side:{
  html:`<div class="center"><div class="sb"><div class="sb-i"><i data-lucide="calendar-days"></i>Meetings</div><div class="sb-i on"><i data-lucide="building-2"></i>Office<span class="sb-n" id="sb-n">6</span></div><div class="sb-i"><i data-lucide="message-circle"></i>Chat</div><div class="sb-i"><i data-lucide="users"></i>Team</div></div></div>`,
  async loop(el,alive){const n=el.querySelector('#sb-n');let v=6;while(alive()){await S(1700);v=v>=9?5:v+1;n.textContent=v;n.classList.remove('bump');void n.offsetWidth;n.classList.add('bump')}}
 },
 allhands:{
  html:`<div class="ah"><div class="ah-hd"><span class="ah-ic"><i data-lucide="users"></i></span><div><b>All hands</b><small>Friday 10:00 · Weekly update</small></div><span class="livepill" style="margin-left:auto"><i></i>LIVE</span></div><div class="ah-ppl" id="ah-ppl"></div><div class="ah-n" id="ah-n"></div></div>`,
  async loop(el,alive){const K=['maya','daniel','ethan','nora','sam','chloe','leo','priya','maya','daniel','ethan','nora','sam','chloe'];const box=el.querySelector('#ah-ppl'),n=el.querySelector('#ah-n');
   while(alive()){box.innerHTML='';n.textContent='';for(let i=0;i<K.length;i++){if(!alive())return;const a=document.createElement('span');a.className='ah-av';a.style.backgroundImage=`url(${ppl[K[i]]})`;box.appendChild(a);n.textContent=`${i+1} joined`;await S(220)}await S(2600)}}
 },
 focus:{
  html:`<div class="center"><div class="fring"><svg viewBox="0 0 120 120"><circle class="trk" cx="60" cy="60" r="56"/><circle cx="60" cy="60" r="56" id="fc" stroke-dasharray="352" stroke-dashoffset="0"/></svg><span id="ft">45:00</span></div>
   <div style="display:flex;align-items:center;gap:8px;font-size:13px"><span class="pav" style="background-image:url(${ppl.priya});--sd:#a78bfa"></span><b>Priya</b><span style="color:#c4b5fd">In focus</span></div>
   <div class="pill" id="fw" style="opacity:0"><i data-lucide="hand" style="width:13px;height:13px"></i><span>Daniel knocked. It will wait until Priya is out.</span></div></div>`,
  async loop(el,alive){while(alive()){let s=45*60;const t=el.querySelector('#ft'),c=el.querySelector('#fc'),w=el.querySelector('#fw');w.style.opacity=0;
   for(let i=0;i<40&&alive();i++){s-=67;t.textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;c.style.strokeDashoffset=352*(1-s/2700);if(i===12){w.style.opacity=1;w.classList.add('fade-in')}await S(140)}
   await S(2400)}}
 },
 cal:{
  html:`<div class="center"><div class="cal"><div style="display:flex;justify-content:space-between;align-items:center"><span class="pill" id="cp"><i class="d" style="background:#22c55e"></i><span>Available</span></span><span class="clock" id="cc">15:28</span></div>
   <div class="ev"><span>Design review</span><span class="clock">11:00</span></div><div class="ev" id="ce"><span>Client check-in</span><span class="clock">15:30</span></div><div class="ev"><span>Spring banners</span><span class="clock">17:00</span></div></div></div>`,
  async loop(el,alive){const p=el.querySelector('#cp'),c=el.querySelector('#cc'),e=el.querySelector('#ce');
   const set=(col,txt)=>{p.innerHTML=`<i class="d" style="background:${col}"></i><span>${txt}</span>`;p.classList.remove('fade-in');p.offsetWidth;p.classList.add('fade-in')};
   while(alive()){set('#22c55e','Available');e.classList.remove('now');for(const t of ['15:28','15:29']){c.textContent=t;await S(900)}if(!alive())return;
   c.textContent='15:30';e.classList.add('now');set('#ef4444','In a meeting');await S(2600);c.textContent='16:00';e.classList.remove('now');set('#22c55e','Available');await S(1800)}}
 },
 n2t:{
  html:`<div class="n2t"><div class="notes"><b>Design review · 24 min</b>Maya will finish the banner sizes by Friday.<br>Ethan to fix the iPad login before the build.<br>Sam sends the new hero to Nora tomorrow.</div>
   <div class="arrow"><i data-lucide="sparkles" style="width:18px;height:18px"></i></div>
   <div class="tasks">${[['Finish banner sizes','Fri','maya'],['Fix iPad login','Thu','ethan'],['Send new hero to Nora','Tomorrow','sam']].map(([t,d,k])=>`<div class="tk"><span class="r"></span>${t}<span style="color:var(--dim);font-size:11.5px;margin-left:8px">${d}</span>${av(ppl[k])}</div>`).join('')}</div></div>`,
  async loop(el,alive){while(alive()){const t=el.querySelectorAll('.tk');t.forEach(x=>x.classList.remove('in'));await S(1200);for(const x of t){if(!alive())return;x.classList.add('in');await S(650)}await S(3200)}}
 },
};
const ID={desk:'c-desk',side:'c-side',allhands:'c-allhands',status:'c-status',wave:'c-wave',lounge:'c-lounge',knock:'c-knock',lock:'c-lock',note:'c-note',meet:'c-meet',share:'c-share',chat:'c-chat',focus:'c-focus',cal:'c-cal',n2t:'c-n2t'};
Object.entries(ID).forEach(([k,id])=>{
  const el=document.getElementById(id), c=CLIPS[k];
  el.insertAdjacentHTML('beforeend',c.html); c.init&&c.init(el);
  let token=0;
  new IntersectionObserver(([e])=>{ token++; if(e.isIntersecting){const me=token;c.loop(el,()=>me===token&&!document.hidden)} },{threshold:.35}).observe(el);
});

const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(e=>rio.observe(e));
const links=[...document.querySelectorAll('.cnav a[data-ch]')];
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.dataset.ch===e.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
document.querySelectorAll('.chap').forEach(c=>cio.observe(c));
const FEED=[['maya','<b>Maya</b> started a call in the Design room'],['ethan','<b>Ethan</b> waved at Nora'],['priya','<b>Priya</b> went into focus for 45 min'],['nora','<b>Nora</b> dropped into the Lounge'],['daniel','<b>Daniel</b> knocked on Maya'],['chloe','<b>Chloe</b> will be back at 2:30'],['sam','<b>Sam</b> joined the Design room']];
let fi=0;const tk=document.getElementById('tick');
function nextTick(){const [k,t]=FEED[fi++%FEED.length];tk.className='tick go';tk.innerHTML=`<span class="a" style="background-image:url(${ppl[k]})"></span><span>${t}</span><span style="color:var(--dim)">· just now</span>`;tk.offsetWidth}
nextTick();setInterval(()=>{tk.classList.remove('go');void tk.offsetWidth;nextTick()},3200);
lucide.createIcons();

  }
  {

/* headline types itself, pauses, deletes, and moves to the next line.
   *word* is the one important word, shown in colour. */
(function(){
  const LINES=['Welcome to the *office*.','Work side by side,\nfrom *anywhere*.','Chat is not an *office*.\nThis is.','*Knock* first.\nThen talk.','The *hallway* your\nremote team lost.'];
  const el=document.getElementById('tw'); let i=0;
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
  /* plain text without the markers, and the first k letters drawn with the highlight */
  const plain=t=>t.replace(/\*/g,'');
  const show=(t,k)=>{let out='',n=0,hl=false;for(const ch of t){if(ch==='*'){out+=hl?'</span>':'<span class="hl">';hl=!hl;continue}if(n>=k)break;out+=esc(ch);n++}if(hl)out+='</span>';el.innerHTML=out};
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){show(LINES[0],1e9);return}
  (async function run(){
    for(;;){const t=LINES[i++%LINES.length],p=plain(t);
      for(let k=1;k<=p.length;k++){show(t,k);await wait(p[k-1]===','||p[k-1]==='.'?220:48+Math.random()*40)}
      await wait(2600);
      for(let k=p.length;k>=0;k--){show(t,k);await wait(24)}
      await wait(380)}
  })();
})();

  }

  /* ── Office tour: the door, Nora's lines, and "You" walking through ── */
  {
    const W = (ms) => new Promise((r) => setTimeout(r, ms));
    const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const door = root.querySelector("#door"), panel = root.querySelector("#door-panel"), come = root.querySelector("#come-in");
    let knocking = false;
    async function knock() {
      if (knocking || !door) return; knocking = true;
      door.classList.remove("open", "k-on"); come.classList.remove("on");
      await W(300);
      door.classList.add("k-on"); panel.classList.remove("shake"); void panel.offsetWidth; panel.classList.add("shake");
      await W(1200); come.classList.add("on");
      await W(700); door.classList.add("open");
      await W(3200); knocking = false;
    }
    if (door) {
      door.addEventListener("click", knock);
      door.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); knock(); } });
      const dio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { dio.disconnect(); setTimeout(knock, 400); } }, { threshold: 0.5 });
      dio.observe(door);
    }

    /* Nora types her line when you reach each room. */
    const tio = new IntersectionObserver((es) => es.forEach(async (e) => {
      if (!e.isIntersecting) return; tio.unobserve(e.target);
      const el = e.target, full = el.dataset.say, bub = el.closest(".guide");
      bub.classList.add("on");
      if (reduceM) { el.textContent = full; return; }
      bub.classList.add("typing"); await W(700); bub.classList.remove("typing");
      for (let i = 1; i <= full.length; i++) { el.textContent = full.slice(0, i); await W(full[i - 1] === "." || full[i - 1] === "," ? 180 : 22); }
    }), { threshold: 0.8 });
    root.querySelectorAll(".g-t[data-say]").forEach((x) => tio.observe(x));

    /* "You" walks down the footpath as you scroll, stepping a little as it goes. */
    const tour = root.querySelector("#tour"), walker = root.querySelector("#walker");
    if (tour && walker) {
      let last = 0;
      const walk = () => {
        const r = tour.getBoundingClientRect(), mid = window.innerHeight * 0.42;
        const p = Math.max(0, Math.min(1, (mid - r.top) / (r.height - 120)));
        walker.style.top = (p * (r.height - 120)) + "px";
        const y = window.scrollY; if (Math.abs(y - last) > 4) { walker.classList.toggle("step", !walker.classList.contains("step")); last = y; }
      };
      addEventListener("scroll", walk, { passive: true }); addEventListener("resize", walk); walk();
    }
  }

  /* ── the glass door: knock, it slides open, you walk in ── */
  {
    const W = (ms) => new Promise((r) => setTimeout(r, ms));
    const gd = root.querySelector("#gdoor");
    let busyD = false;
    async function knockGlass() {
      if (!gd || busyD) return; busyD = true;
      gd.classList.remove("open", "kn", "in");
      await W(250); gd.classList.add("kn");
      await W(1300); gd.classList.add("open");
      await W(900); gd.classList.add("in");
      const hint = root.querySelector("#gd-hint"); if (hint) hint.textContent = "Click to knock again";
      await W(2600); busyD = false;
    }
    if (gd) {
      gd.addEventListener("click", knockGlass);
      gd.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); knockGlass(); } });
      /* The door waits for the visitor to knock; nothing opens on its own. */
    }
  }
  /* ── The entrance: the glass doors slide open as you scroll and you walk in.
     The section is tall and its stage is sticky, so the page itself drives the
     scene: scroll down to go in, scroll up to step back out. Past the end the
     page carries on into the tour. ── */
  {
    const og = root.querySelector("#og");
    if (og) {
      const $o = (id) => root.querySelector("#" + id);
      const plan = $o("og-plan"), dl = $o("og-dl"), dr = $o("og-dr"), frame = $o("og-frame"), title = $o("og-title"),
        tag = $o("og-tag"), hint = $o("og-hint"), prog = $o("og-prog"), you = $o("og-you"), youT = $o("og-you-t"), nora = $o("og-nora");
      const others = ["og-reception", "og-lounge", "og-desks", "og-focus"].map($o);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
      const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
      const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      const fit = () => Math.min(innerWidth * 0.9 / 1200, innerHeight * 0.82 / 680, 1.15);
      let target = 0, cur = 0, started = false, raf = 0, arrived = null, lastTick = 0;
      const read = () => {
        const r = og.getBoundingClientRect(), total = og.offsetHeight - innerHeight;
        target = total > 0 ? clamp(-r.top / total, 0, 1) : 1;
        if (target > 0.004) started = true;
        /* no frame for a while (first paint, or frames paused): draw straight away */
        if (!reduce && performance.now() - lastTick > 200) { cur = target; draw(cur); }
      };
      const draw = (p) => {
        const base = fit();
        /* 0 to .45: the doors slide apart while you step forward */
        const o = ease(seg(p, 0.04, 0.45));
        dl.style.transform = `translateX(${-o * 102}%)`;
        dr.style.transform = `translateX(${o * 102}%)`;
        const step = 1 + o * 0.12;
        frame.style.transform = `scale(${1 + o * 0.35})`;
        frame.style.opacity = String(1 - seg(p, 0.25, 0.45));
        const t = 1 - seg(p, 0.02, 0.2);
        title.style.opacity = String(t);
        title.style.transform = `translateY(${-(1 - t) * 24}px) scale(${0.96 + t * 0.04})`;
        title.style.filter = `blur(${(1 - t) * 10}px)`;
        hint.style.opacity = started ? "0" : "1";
        /* you arrive at your desk once you're through the door; Nora waves */
        const inside = p > 0.42;
        if (inside !== arrived) {
          arrived = inside;
          you.classList.toggle("here", inside);
          youT.textContent = inside ? "You just arrived" : "Waiting for you";
          nora.textContent = inside ? "Nora waved at you" : "Nora is here";
        }
        /* .5 to .88: into the Design room, the other rooms step back */
        const z = ease(seg(p, 0.5, 0.88));
        const s1 = Math.min(innerWidth * 0.56 / 470, innerHeight * 0.54 / 300) / base;
        const scale = base * step * (1 + z * (s1 - 1));
        const tx = -z * scale * (235 - 600), ty = -z * scale * (150 - 340) - z * innerHeight * 0.06;
        plan.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
        others.forEach((el) => { el.style.opacity = String(1 - z * 0.75); });
        $o("og-walker").style.opacity = String(1 - z);
        /* .86 to 1: Nora says hi */
        const g = seg(p, 0.86, 0.98);
        tag.style.opacity = String(g);
        tag.style.transform = `translateY(${(1 - g) * 20}px)`;
        prog.style.transform = `scaleX(${p})`;
      };
      plan.style.transformOrigin = "600px 340px";
      addEventListener("scroll", read, { passive: true });
      addEventListener("resize", read);
      read();
      if (reduce) {
        /* No motion: doors open, the whole office in view, the headline on top. */
        draw(0.5); title.style.opacity = "1"; title.style.filter = "none"; title.style.transform = "none"; hint.style.opacity = "0";
      } else {
        const loop = () => {
          lastTick = performance.now();
          cur += (target - cur) * 0.14;
          if (Math.abs(target - cur) < 0.0005) cur = target;
          draw(cur);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        offs.push(() => cancelAnimationFrame(raf));
      }

      /* life inside the office */
      const talkers = [["og-t-maya", "Maya is talking"], ["og-t-daniel", "Daniel is talking"]];
      let ti = 0;
      setInterval(() => {
        ti = (ti + 1) % 2;
        talkers.forEach((x, i) => $o(x[0]).classList.toggle("on", i === ti));
        $o("og-talker").textContent = talkers[ti][1];
      }, 3200);
      const mmss = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
      let ds = 12 * 60 + 4, fs = 24 * 60 + 10;
      setInterval(() => { ds++; $o("og-dtime").textContent = mmss(ds); fs = fs > 0 ? fs - 1 : 25 * 60; $o("og-ftime").textContent = mmss(fs); }, 1000);
      /* Ethan walks from his desk to the Lounge and back */
      const w = $o("og-walker"), P = [[95, 410], [300, 310], [700, 250], [960, 170]];
      let at = 0;
      w.style.transform = `translate(${P[0][0]}px,${P[0][1]}px)`;
      const walk = () => {
        at = (at + 1) % 2;
        const path = at ? P : P.slice().reverse();
        let k = 0;
        const next = () => {
          if (k >= path.length) {
            $o("og-lb").classList.toggle("on", at === 1);
            $o("og-lc").textContent = at ? "3 chatting" : "2 chatting";
            setTimeout(walk, at ? 4200 : 3000);
            return;
          }
          w.style.transform = `translate(${path[k][0]}px,${path[k][1]}px)`;
          k++;
          setTimeout(next, 900);
        };
        next();
      };
      if (!reduce) setTimeout(walk, 1500);
    }
  }

  /* ── The tour map and the soft zoom ──
     "You" walks along the map's hallway to the room being read about: it stays
     in a room for most of the chapter and walks over near the end. Each clip's
     screen starts close up (1.22) and settles to normal size as it comes up. */
  {
    const mapIn = root.querySelector("#cmap-in"), you = root.querySelector("#cmap-you");
    const rooms = [...root.querySelectorAll(".cm-room")];
    const chaps = rooms.map((a) => root.querySelector("#" + a.dataset.ch)).filter(Boolean);
    const scrs = [...root.querySelectorAll(".tour .clip .scr")];
    const reduceZ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const smooth = (t) => t * t * (3 - 2 * t);
    let lastY = 0, lastOn = "";
    const hall = root.querySelector(".cmap-hall");
    /* room centres measured from the hallway's left edge, where "You" lives */
    const centre = (a) => { const r = a.getBoundingClientRect(); return r.left - hall.getBoundingClientRect().left + r.width / 2; };
    const track = root.querySelector("#cmap-track");
    const update = () => {
      if (you && chaps.length === rooms.length && chaps.length) {
        const mid = innerHeight * 0.45;
        const tops = chaps.map((c) => c.getBoundingClientRect().top);
        let i = 0;
        while (i < tops.length - 1 && tops[i + 1] <= mid) i++;
        let x = centre(rooms[i]);
        if (i < tops.length - 1 && tops[i] <= mid) {
          /* walk over during the last 30% of the chapter */
          const f = clamp((mid - tops[i]) / (tops[i + 1] - tops[i]), 0, 1);
          const w = smooth(clamp((f - 0.7) / 0.3, 0, 1));
          x = centre(rooms[i]) + (centre(rooms[i + 1]) - centre(rooms[i])) * w;
        }
        you.style.left = x + "px";
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 6) { you.classList.toggle("step", !you.classList.contains("step")); lastY = y; }
        /* keep the room you're in visible when the map scrolls sideways (phones) */
        const on = rooms[i].dataset.ch;
        if (on !== lastOn) {
          lastOn = on;
          rooms.forEach((a) => a.classList.toggle("on", a.dataset.ch === on));
          if (mapIn && mapIn.scrollWidth > mapIn.clientWidth) {
            const r = rooms[i].getBoundingClientRect(), t = track.getBoundingClientRect();
            mapIn.scrollTo({ left: Math.max(0, r.left - t.left + r.width / 2 - mapIn.clientWidth / 2), behavior: "smooth" });
          }
        }
      }
      if (!reduceZ) {
        const vh = innerHeight;
        scrs.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom < -50 || r.top > vh + 50) return;
          /* from the moment it peeks in until it reaches the upper third */
          const t = clamp((vh - r.top) / (vh * 0.72), 0, 1);
          el.style.transform = `scale(${(1.22 - 0.22 * smooth(t)).toFixed(4)})`;
        });
      }
    };
    let queued = false;
    /* once per frame; a timer backs it up when frames are paused */
    const run1 = () => { if (!queued) return; queued = false; update(); };
    const onScroll = () => { if (queued) return; queued = true; requestAnimationFrame(run1); setTimeout(run1, 120); };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", update);
    update();
  }

  return () => {
    timers.forEach((id) => window.clearTimeout(id)); intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect()); offs.forEach((f) => f());
  };
}
