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
  const PEOPLE={maya:F('maya'),daniel:F('daniel'),nora:F('nora'),ethan:F('ethan'),sam:F('sam')};
  {


/* 44 small tiles: [icon, name, one line] */
const SMALL = [
 ['list-checks','Tasks','Priority, deadlines and one-click status on every task.'],
 ['text-cursor-input','Type to Task','Type plain sentences. Dates become deadlines, @names assign teammates.'],
 ['folder-kanban','Projects','Group boards into projects and see each one move.'],
 ['image','Board Covers','Give every board a photo or a colour.'],
 ['eye','In Review','An extra column for work waiting on a second look.'],
 ['target','Milestones','Today\'s tasks become a live progress bar.'],
 ['bar-chart-3','KPI Goals','Set targets and log results each week.'],
 ['file-text','PDF Reports','Export a clean KPI report in one click.'],
 ['flame','Streaks','Badges at 3, 7, 14, 30, 60 and 100 days.'],
 ['calendar-clock','Plan My Day','Bloom builds a time-blocked plan from your tasks.'],
 ['notebook-pen','Meeting Notes','Paste your notes, get action items as tasks.'],
 ['inbox','Email Inbox','Gmail or Outlook inside the app.'],
 ['sparkles','AI Replies','Draft or polish a reply in seconds.'],
 ['mail-plus','Email to Task','AI reads the email and fills in the task for you.'],
 ['calendar-sync','Calendar Sync','Google Calendar and Outlook meetings in one place.'],
 ['bell-ring','Reminders','A countdown and an alert 5 minutes before meetings.'],
 ['calendar-days','Calendar','Your week, your meetings and your deadlines together.'],
 ['video','Video Calls','Call any teammate in one click. No Zoom needed.'],
 ['monitor-up','Screen Share','Share a screen or one window, and draw on it.'],
 ['mic','Voice Notes','Leave a voice message in chat or on a board.'],
 ['messages-square','Group Chats','Channels for every team and project.'],
 ['sticky-note','Sticky Notes','Notes that float above your workspace.'],
 ['notebook','Notes','Write, organise and keep notes next to your work.'],
 ['lock','PIN Lock','Lock private notes behind a PIN.'],
 ['bookmark','Bookmarks','Links and resources for every project.'],
 ['history','Work Log','Everything you finished, sorted by board.'],
 ['layout-dashboard','Overview','How your week is going at a glance.'],
 ['users-round','Manager Dashboard','The whole team\'s progress on one page.'],
 ['gauge','Workload Health','Spot who is overloaded before it hurts.'],
 ['newspaper','Daily Recap','A short summary of your day, ready to share.'],
 ['radio','Team Live','See who is in, who is talking and who is free.'],
 ['plane','Vacations','Plan time off so the team knows who is away.'],
 ['smile','Mood Avatars','Pick an avatar that matches your energy.'],
 ['bell','Notifications','Know the moment a task or mention needs you.'],
 ['sun-moon','Themes','Blue, Light and Black, tuned for long days.'],
 ['cloud','Cloud Sync','Everything backed up and on every device.'],
 ['shield-check','Privacy','Private by default. Your data stays yours.'],
 ['droplets','Hydration','A water timer in your sidebar, one tap to log.'],
 ['download','Trello Import','Bring your boards over in a minute.'],
 ['laptop','Mac & Windows','A real desktop app on both.'],
 ['smartphone','iPhone App','Your tasks and calls on the go. Coming soon.'],
 ['search','Search','Find tasks, boards, chats and goals from one box.'],
 ['paperclip','Attachments','Drop files and images into tasks and chats.'],
 ['user-plus','Invite Your Team','Priced per seat, from 3 to 50 people.'],
];

const BIG = {
  boards:{icon:'kanban', name:'Tasks & Boards', title:'Boards that keep moving',
    text:'Every project gets a board with its own progress, chat, comments and tags. Drag a task across and the whole team sees it.',
    points:['To Do, In Progress, In Review and Done','Photo or colour covers for every board','Comments, attachments and voice notes on tasks'], demo:'See Tasks & Boards'},
  bloom:{icon:'sparkles', name:'Bloom', ai:true, title:'Bloom, your AI assistant',
    text:'Ask Bloom what matters today. It plans your day, drafts emails, turns meeting notes into tasks and writes your recap.',
    points:['Plan My Day from your real tasks','Email replies and summaries','Meeting notes to action items'], demo:'Ask Bloom in the demo'},
  chat:{icon:'message-circle', name:'Chat', title:'Team chat, built in',
    text:'Group chats and DMs with reactions, GIFs, voice notes, files and replies, right next to your work.',
    points:['Rooms and direct messages','Reactions, GIFs and voice notes','Calls from any chat'], demo:'See the chat'},
  handover:{icon:'users', name:'Handover', title:'Hand over your work before you go',
    text:'Going on leave? Give each task to the right teammate with a short note. They accept with one click, and everything comes back to you when you return.',
    points:['Pick everything due while you are away','A person and a brief for each item','Teammates accept or decline, item by item'], demo:'See how Handover works'},
  office:{icon:'door-open', name:'Office', title:'An office for your team',
    text:'A shared space where you can see who is in, walk into a room to talk, or knock before you join.',
    points:['Rooms for every team and meeting','Knock, wave and join in one click','See who is free right now'], demo:'Explore the Office'},
};

/* layout: 10 cols x 6 rows; big tiles occupy cols 4-7, rows 2-5 */
const wall = document.getElementById('wall');
let si = 0;
const order = [];
for (let r=1;r<=6;r++) for (let c=1;c<=10;c++){
  const inCentre = c>=4 && c<=7 && r>=2 && r<=5;
  if (inCentre){
    if ((c===4||c===6) && (r===2||r===4)){
      const key = {'4,2':'boards','6,2':'chat','4,4':'handover','6,4':'office'}[`${c},${r}`];
      order.push({big:key});
    }
    continue;
  }
  order.push({small:SMALL[si++], edge:(c===1||c===10)});
}
order.forEach(o=>{
  if (o.big){
    const b = BIG[o.big];
    const el = document.createElement('div');
    el.className='big'; el.dataset.key=o.big;
    el.innerHTML = `<div class="label"><span class="badge"><i data-lucide="${b.icon}"></i></span>${b.name}${['boards','chat','handover','office'].includes(o.big)?'<span class="go"><i data-lucide="arrow-right"></i></span>':''}</div><div class="stage" id="st-${o.big}"></div>`;
    /* Each big tile opens its own page. */
    const PAGE={boards:'/work',chat:'/chat',handover:'/handover',office:'/office'}[o.big];
    if(PAGE){ el.setAttribute('role','link'); el.tabIndex=0; el.setAttribute('aria-label',b.name+': open the page'); el.classList.add('is-link'); }
    el.onclick=()=>{ if(PAGE) location.href=PAGE; else { userPick(); showChain(o.big); } };
    el.onkeydown=(e)=>{ if(e.key==='Enter'&&PAGE) location.href=PAGE; };
    wall.appendChild(el);
  } else {
    const [ic,name,line]=o.small;
    const el=document.createElement('div');
    el.className='t'+(o.edge?' edge':''); el.dataset.name=name; el.dataset.line=line; /* no title attribute: the hover card replaces the browser tooltip */
    el.innerHTML=`<i data-lucide="${ic}"></i><span>${name}</span>`;
    el.onclick=()=>{userPick();showChain(name)};
    wall.appendChild(el);
  }
});
lucide.createIcons();

/* ── connections ── */

const CHAINS={
  boards:['Type to Task','Tasks','boards','In Review','Work Log'],
  bloom:['Calendar Sync','bloom','Plan My Day','Reminders','Milestones'],
  handover:['Vacations','handover','Tasks','Notifications'],
  'Vacations':['Vacations','handover','Tasks'],
  office:['Team Live','office','Video Calls','Meeting Notes','Tasks'],
  'Email Inbox':['Email Inbox','Email to Task','boards','Daily Recap'],
  'Email to Task':['Email Inbox','Email to Task','boards','Daily Recap'],
  'AI Replies':['Email Inbox','AI Replies','bloom'],
  'Manager Dashboard':['boards','Workload Health','Manager Dashboard','PDF Reports'],
  'Workload Health':['Tasks','Workload Health','Manager Dashboard'],
  'Daily Recap':['Work Log','bloom','Daily Recap','Manager Dashboard'],
  'KPI Goals':['KPI Goals','Milestones','PDF Reports'],
  'PDF Reports':['KPI Goals','PDF Reports','Manager Dashboard'],
  'Streaks':['Tasks','Milestones','Streaks'],
  'Milestones':['Tasks','Milestones','Streaks'],
  'Meeting Notes':['office','Meeting Notes','bloom','Tasks'],
  'Plan My Day':['Calendar Sync','bloom','Plan My Day','Reminders'],
  'Calendar Sync':['Calendar Sync','Calendar','Reminders','bloom'],
  'Type to Task':['Type to Task','Tasks','boards'],
  'Tasks':['Type to Task','Tasks','boards','Work Log'],
  'Video Calls':['office','Video Calls','Screen Share','Meeting Notes'],
  'Screen Share':['Video Calls','Screen Share','Meeting Notes'],
  'Team Live':['Team Live','office','Video Calls'],
  'Group Chats':['Group Chats','Voice Notes','Attachments'],
  'Voice Notes':['Voice Notes','Group Chats'],
  'Trello Import':['Trello Import','boards','Board Covers'],
  'Board Covers':['boards','Board Covers'],
  'In Review':['boards','In Review','Work Log'],
  'Projects':['Projects','boards','Overview'],
  'Overview':['Work Log','Overview','Manager Dashboard'],
  'Work Log':['Tasks','Work Log','Overview'],
};
const NAMES={boards:'Boards',bloom:'Bloom',handover:'Handover',office:'Office'};
const smallInfo={}; SMALL.forEach(([ic,n,l])=>smallInfo[n]={ic,l});
const nodeEl=n=>BIG[n]?document.querySelector(`.big[data-key=${n}]`):document.querySelector(`.t[data-name="${n}"]`);
const links=document.getElementById('links');
function edgePoint(r,tx,ty){ // where the line from r's centre to (tx,ty) leaves r
  const cx=r.x+r.w/2, cy=r.y+r.h/2, dx=tx-cx, dy=ty-cy;
  const s=Math.min(dx?Math.abs((r.w/2-4)/dx):1e9, dy?Math.abs((r.h/2-4)/dy):1e9);
  return [cx+dx*s, cy+dy*s];
}
function rectOf(el){const w=wall.getBoundingClientRect(),r=el.getBoundingClientRect();return {x:r.left-w.left,y:r.top-w.top,w:r.width,h:r.height}}
/* Connections (lines, numbers, dimming, the automatic tour) are switched off for now.
   Set SHOW_CONNECTIONS to true to bring them all back; nothing was removed. */
const SHOW_CONNECTIONS=false;
let current=null;
const PAGES={boards:'/work',chat:'/chat',handover:'/handover',office:'/office'};
function showChain(key){
  current=key;
  if(!document.body.contains(wall)) return;
  const chain=(SHOW_CONNECTIONS?(CHAINS[key]||[key]):[key]).filter(n=>nodeEl(n));
  if(!chain.length) return;
  document.querySelectorAll('.t.chain,.big.chain,.t.on,.big.on').forEach(e=>e.classList.remove('chain','on'));
  document.querySelectorAll('.num').forEach(n=>n.remove());
  wall.classList.toggle('faded',chain.length>1);
  chain.forEach((n,k)=>{const el=nodeEl(n); if(!el) return; el.classList.add('chain');
    if(chain.length>1){const b=document.createElement('span');b.className='num';b.textContent=k+1;el.appendChild(b)}});
  let d='';
  for(let k=0;k<chain.length-1;k++){
    const A=rectOf(nodeEl(chain[k])),B=rectOf(nodeEl(chain[k+1]));
    const [x1,y1]=edgePoint(A,B.x+B.w/2,B.y+B.h/2),[x2,y2]=edgePoint(B,A.x+A.w/2,A.y+A.h/2);
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    d+=`M${x1} ${y1} Q ${mx+(y2-y1)*.12} ${my-(x2-x1)*.12}, ${x2} ${y2} `;
  }
  links.innerHTML=d?`<path d="${d}"/>`:'';
  // detail panel
  const isBig=!!BIG[key], b=BIG[key];
  const title=isBig?b.title:key, icon=isBig?b.icon:smallInfo[key].ic, text=isBig?b.text:smallInfo[key].l;
  const flow=chain.length>1?`<div class="flow">${chain.map(n=>`<span class="s">${NAMES[n]||n}</span>`).join('<i data-lucide="arrow-right"></i>')}</div>`:'';
  detail.innerHTML=`<div><h3><span class="badge"><i data-lucide="${icon}"></i></span>${title}${isBig&&b.ai?' <span class="tag">AI</span>':''}</h3><p>${text}</p>${flow}</div>
    <div class="cta">${PAGES[key]?`<a class="btn" href="${PAGES[key]}"><i data-lucide="arrow-right"></i>${b.demo}</a>`:''}
    <span class="small">${chain.length>1?'Numbers show the order they work together.':'Hover any tile for a quick look.'}</span></div>`;
  lucide.createIcons();
}
const detail=document.getElementById('detail');
const TOUR=['boards','bloom','Email Inbox','handover','office','Manager Dashboard'];
let ti=0, paused=0;
function userPick(){paused=Date.now()+20000}
setInterval(()=>{ if(!SHOW_CONNECTIONS||Date.now()<paused) return; ti=(ti+1)%TOUR.length; showChain(TOUR[ti]) },6500);
addEventListener('resize',()=>current&&showChain(current));
showChain('boards');


/* ── Boards: a card travels To Do → In Progress → Done ── */
(function(){
  const st=document.getElementById('st-boards');
  const cardHTML=(t,chip,cls)=>`<div class="card kcard"><div class="bar w1"></div><div class="bar w2"></div><span class="chip ${cls}">${chip}</span></div>`;
  st.innerHTML=`<div class="kb">
    <div class="kc"><div class="kh">To Do <b>3</b></div>${cardHTML('','High','hi')}${cardHTML('','Medium','md')}</div>
    <div class="kc"><div class="kh">In Progress <b>2</b></div>${cardHTML('','Medium','md')}</div>
    <div class="kc"><div class="kh">Done <b>5</b></div>${cardHTML('','Low','')}</div></div>
    <div class="card kcard mover" id="mv"><div class="bar w1"></div><div class="bar w2"></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="chip hi">High</span><span class="av" style="background-image:url(${PEOPLE.maya})"></span></div></div>`;
  const mv=st.querySelector('#mv'); const cols=st.querySelectorAll('.kc');
  let step=0;
  function place(){
    const col=cols[step%3]; if(!col||!document.body.contains(col)) return; const n=col.querySelectorAll('.kcard').length;
    const r=col.getBoundingClientRect(), s=st.getBoundingClientRect();
    const last=col.lastElementChild.getBoundingClientRect();
    mv.style.width=r.width+'px';
    mv.style.transform=`translate(${r.left-s.left}px,${last.bottom-s.top+6}px)`;
    step++;
  }
  setTimeout(place,50); setInterval(place,2200); addEventListener('resize',()=>{step--;place()});
})();

/* ── Bloom: question, typing, answer ── */
(function(){
  const st=document.getElementById('st-bloom');
  if(!st) return;
  const QA=[
    ['What should I do first today?', 'Start with <b>Homepage hero</b>, it\'s overdue. Then:<ul><li>Spring banners, 11:00</li><li>Client check-in, 15:30</li></ul>'],
    ['Turn my notes into tasks', 'Added <b>3 tasks</b> to Mobile App V2:<ul><li>Fix login on iPad</li><li>Send build to Ethan</li></ul>'],
  ];
  let i=0;
  function run(){
    const [q,a]=QA[i++%QA.length];
    st.innerHTML=`<div class="bl"><div class="q">${q}</div><div class="a card"><span class="typing"><i></i><i></i><i></i></span></div></div>`;
    setTimeout(()=>{st.querySelector('.a').innerHTML=a},1300);
  }
  run(); setInterval(run,5200);
})();

/* ── Chat: messages arrive, reactions pop in, someone is typing ── */
(function(){
  const st=document.getElementById('st-chat');
  if(!st) return;
  const E=n=>`<img class="emj" src="/chat/emoji/${n}.png" alt="">`;
  const M=[[PEOPLE.maya,'Maya','Banners are up for review'],[PEOPLE.daniel,'Daniel','Looks great! Ship it'],[PEOPLE.nora,'Nora','Joining the call in 2']];
  function run(){
    st.innerHTML=`<div class="ch">${M.map(([p,n,t],k)=>`<div class="msg"><span class="av" style="background-image:url(${p})"></span><div class="bub"><b>${n}</b>${t}${k===0?`<div class="reacts">${['fire','red_heart','raising_hands'].map((e,i)=>`<span class="rx" style="transition-delay:${.9+i*.25}s">${E(e)}${[4,2,3][i]}</span>`).join('')}</div>`:''}</div></div>`).join('')}<div class="msg typing-row"><span class="av" style="background-image:url(${PEOPLE.ethan})"></span><span class="typing"><i></i><i></i><i></i></span></div></div>`;
    st.querySelectorAll('.msg').forEach((m,k)=>setTimeout(()=>{m.classList.add('in'); if(k===0) m.querySelectorAll('.rx').forEach(r=>r.classList.add('in'));},250+k*800));
  }
  run(); setInterval(run,6200);
})();

/* ── Handover: each item gets a teammate, then they accept ── */
(function(){
  const st=document.getElementById('st-handover');
  const R=[['Send drafts to Acme','maya'],['Review App Store copy','ethan'],['Weekly KPI report','daniel']];
  function run(){
    st.innerHTML=`<div class="ho"><div class="ho-lv"><i data-lucide="plane"></i>On leave Oct 12 – Oct 15</div>${R.map(([t,k],i)=>`<div class="ho-r card"><span>${t}</span><span class="ho-p" id="hp${i}">Choose person</span></div>`).join('')}<div class="ho-ok" id="hok"><span class="av" style="background-image:url(${PEOPLE.maya})"></span>Maya accepted</div></div>`;
    lucide.createIcons();
    R.forEach(([t,k],i)=>setTimeout(()=>{const p=st.querySelector('#hp'+i);if(!p)return;p.className='ho-p on';p.innerHTML=`<span class="av" style="background-image:url(${PEOPLE[k]})"></span>${k[0].toUpperCase()+k.slice(1)}`},700+i*650));
    setTimeout(()=>{const o=st.querySelector('#hok');if(o)o.classList.add('on')},2900);
  }
  run(); setInterval(run,6000);
})();

/* ── Office: rooms, someone walks in, someone knocks ── */
(function(){
  const st=document.getElementById('st-office');
  st.innerHTML=`<div class="of">
    <div class="room" style="left:0;top:0;width:47%;height:70px"><span class="dot"></span>Launch Squad</div>
    <div class="room" style="right:0;top:0;width:47%;height:70px">Lounge</div>
    <div class="room" style="left:0;top:84px;width:100%;height:46px">Focus room</div>
    <span class="walker" id="w1" style="left:10%;top:32px;background-image:url(${PEOPLE.maya})"></span>
    <span class="walker" id="w2" style="left:24%;top:32px;background-image:url(${PEOPLE.daniel})"></span>
    <span class="walker" id="w3" style="left:60%;top:32px;background-image:url(${PEOPLE.ethan})"></span>
    <span class="knock" id="kn">Sam knocked on Launch Squad</span></div>`;
  const w3=st.querySelector('#w3'), kn=st.querySelector('#kn');
  let inLaunch=false;
  setInterval(()=>{
    inLaunch=!inLaunch;
    w3.style.left=inLaunch?'38%':'62%';
    if(inLaunch){kn.style.left='0';kn.style.top='96px';kn.style.opacity=1;setTimeout(()=>kn.style.opacity=0,1700)}
  },3000);
})();

  }
  /* ── Hover previews: a small designed scene for every tile ──
     Pieces marked data-s="n" appear in order (step n), then the scene holds and loops.
     A piece with data-type types its text when its step comes. The card shows the scene with the feature name and one line under it.
     Shows after a short pause on hover; on touch screens it appears in the panel under the wall. */
  {
    const iconsIn = (scope) => scope.querySelectorAll('i[data-lucide]').forEach((i) => {
      const svg = ICONS[i.getAttribute('data-lucide')]; if (!svg) return;
      const t = document.createElement('span'); t.innerHTML = svg; i.replaceWith(t.firstChild);
    });
    const P = (k) => PEOPLE[k] || PEOPLE.maya;
    const av = (k, s = '') => `<span class="pv-face"${s} style="background-image:url(${P(k)})"></span>`;
    const ic = (n) => `<i data-lucide="${n}"></i>`;
    const card = (icon, title, body, extra = '') => `<div class="pv-c ${extra}"><div class="pv-c-hd">${icon ? `<span class="pv-ic">${ic(icon)}</span>` : ''}<b>${title}</b></div>${body}</div>`;
    const row = (s, left, right = '', cls = '') => `<div class="pv-row ${cls}" data-s="${s}">${left}<span class="pv-r">${right}</span></div>`;
    const chip = (t, cls = '') => `<span class="pv-chip ${cls}">${t}</span>`;
    const tick = (s) => `<span class="pv-tick" data-s="${s}">${ic('check')}</span>`;
    const bar = (s, label, pct, color = '#7cc4ff', right = '') => `<div class="pv-barrow" data-s="${s}"><span class="pv-bl">${label}</span><span class="pv-track"><i style="--w:${pct}%;background:${color}"></i></span><span class="pv-bv">${right}</span></div>`;
    const typed = (s, text) => `<span data-s="${s}" data-type="${text.replace(/"/g, '&quot;')}"></span>`;

    const LEGACY = {
      'PIN Lock': {
        line: 'Private notes stay private. Only your PIN opens them.',
        html: () => `<div class="pv-pin"><div class="pv-note">
            <div class="pv-note-hd"><span class="pv-lock" data-lock><i data-lucide="lock"></i></span><b>Salary review</b><span class="pv-sub">Locked note</span></div>
            <div class="pv-dots">${'<span></span>'.repeat(4)}</div>
            <div class="pv-lines"><span style="width:86%"></span><span style="width:64%"></span><span style="width:74%"></span></div>
          </div></div>`,
        play(el, alive) {
          const dots = [...el.querySelectorAll('.pv-dots span')], lock = el.querySelector('[data-lock]'), note = el.querySelector('.pv-note');
          const run = async () => {
            while (alive()) {
              note.classList.remove('open'); dots.forEach((d) => d.classList.remove('on'));
              lock.innerHTML = '<i data-lucide="lock"></i>'; iconsIn(lock);
              await S(500);
              for (const d of dots) { if (!alive()) return; d.classList.add('on'); await S(260); }
              await S(250); lock.innerHTML = '<i data-lucide="lock-open"></i>'; iconsIn(lock); note.classList.add('open');
              await S(2200);
            }
          };
          run();
        },
      },
      'Email to Task': {
        line: 'One click, and AI turns an email into a task with subtasks.',
        html: () => `<div class="pv-e2t">
            <div class="pv-mail"><div class="pv-from"><span class="pv-av">JB</span><span><b>Jordan Blake</b><small>Spring campaign banners</small></span></div>
              <span class="pv-l" style="width:92%"></span><span class="pv-l" style="width:70%"></span><span class="pv-btn" data-btn><i data-lucide="sparkles"></i>Make it a task</span></div>
            <div class="pv-task" data-task><b>Design Acme spring banners</b>
              <div class="pv-chips"><span class="hi">High</span><span>Due Thu</span></div>
              ${['Homepage hero banner','Three social sizes','Email header line'].map((t) => `<div class="pv-sub2"><span></span>${t}</div>`).join('')}</div>
          </div>`,
        play(el, alive) {
          const btn = el.querySelector('[data-btn]'), task = el.querySelector('[data-task]'), subs = [...el.querySelectorAll('.pv-sub2')];
          const run = async () => {
            while (alive()) {
              task.classList.remove('in'); btn.classList.remove('press'); subs.forEach((s) => s.classList.remove('in'));
              await S(700); btn.classList.add('press'); await S(350); task.classList.add('in');
              for (const s of subs) { await S(280); if (!alive()) return; s.classList.add('in'); }
              await S(2400);
            }
          };
          run();
        },
      },
      'Vacations': {
        line: 'Book time off, see who else is away, and hand over your work.',
        html: () => `<div class="pv-vac">
            <div class="pv-cal">${['M','T','W','T','F','S','S'].map((d) => `<span class="pv-dw">${d}</span>`).join('')}
              ${Array.from({ length: 14 }, (_, i) => `<span class="pv-day${i === 2 ? ' today' : ''}">${i + 9}</span>`).join('')}
              <span class="pv-bar you" data-you style="grid-column:4 / span 4;grid-row:3">Sam · Vacation</span>
              <span class="pv-bar mate" style="grid-column:1 / span 3;grid-row:2"><span class="pv-mini" style="background-image:url(${PEOPLE.ethan})"></span>Ethan</span>
            </div>
            <div class="pv-vac-ft"><span class="pv-pill" data-back><i data-lucide="plane"></i>Back Oct 16</span><span class="pv-pill" data-ho><i data-lucide="users"></i>3 tasks handed over</span></div>
          </div>`,
        play(el, alive) {
          const you = el.querySelector('[data-you]'), back = el.querySelector('[data-back]'), ho = el.querySelector('[data-ho]');
          const run = async () => {
            while (alive()) {
              you.classList.remove('in'); back.classList.remove('in'); ho.classList.remove('in');
              await S(500); you.classList.add('in'); await S(700); back.classList.add('in'); await S(500); ho.classList.add('in');
              await S(2600);
            }
          };
          run();
        },
      },
    };
    const SCENES = {
      'Tasks': () => card('list-checks', 'Today', [
        row(1, '<span class="pv-circle"></span>Homepage hero redesign', chip('Urgent', 'red')),
        row(2, '<span class="pv-circle done" data-s="5"></span>Send drafts to Acme', chip('High', 'red')),
        row(3, '<span class="pv-circle"></span>Review App Store copy', chip('Medium', 'amber')),
        row(4, '<span class="pv-circle"></span>Weekly KPI report', chip('Low')),
      ].join('')),
      'Type to Task': () => `<div class="pv-col"><div class="pv-input">${typed(1, 'Send banners to Acme by Friday @Maya')}<span class="pv-caret"></span></div>
        <div class="pv-c" data-s="2"><div class="pv-c-hd"><span class="pv-circle"></span><b>Send banners to Acme</b></div><div class="pv-chips">${chip('Due Fri', 'blue')}${chip(av('maya') + 'Maya')}</div></div></div>`,
      'Projects': () => card('folder-kanban', 'Projects', [
        bar(1, 'Website Relaunch', 72, '#7cc4ff', '72%'), bar(2, 'Mobile App V2', 45, '#c4b5fd', '45%'), bar(3, 'Spring Campaign', 88, '#6ee7b7', '88%'),
      ].join('')),
      'Board Covers': () => `<div class="pv-covers">${['photo-1501785888041-af3ef285b470', 'photo-1490750967868-88aa4486c946', 'photo-1433086966358-54859d0ed716'].map((id, i) => `<div class="pv-cover" data-s="${i + 1}"><span style="background-image:url(https://images.unsplash.com/${id}?w=300&h=180&fit=crop&auto=format&q=60)"></span><b>${['Product Launch', 'Brand Refresh', 'Team Offsite'][i]}</b></div>`).join('')}</div>`,
      'In Review': () => `<div class="pv-kb">${['In Progress', 'In Review'].map((c, i) => `<div class="pv-kcol"><b>${c}</b>${i === 0 ? '<div class="pv-kc" data-s="1">Onboarding screens</div>' : '<div class="pv-kc" data-s="2">Spring banners' + chip(ic('eye') + 'In review', 'violet') + '</div><div class="pv-kc" data-s="3">Pricing page</div>'}</div>`).join('')}</div>`,
      'Milestones': () => `<div class="pv-ms"><div class="pv-ring" data-s="1"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" class="bg"/><circle cx="40" cy="40" r="34" class="fg"/></svg><b>5/7</b></div><div class="pv-col">${row(2, 'Today\'s milestone', chip('71%', 'green'))}${row(3, 'Two tasks to go', '')}</div></div>`,
      'KPI Goals': () => card('target', 'KPI goals · This week', [
        bar(1, 'New leads', 84, '#6ee7b7', '42/50'), bar(2, 'Demos booked', 60, '#7cc4ff', '6/10'), bar(3, 'Blog posts', 100, '#c4b5fd', '3/3'),
      ].join('')),
      'PDF Reports': () => `<div class="pv-doc" data-s="1"><div class="pv-doc-hd">${ic('file-text')}<b>KPI report · September</b></div><div class="pv-vbars">${[40, 62, 55, 78, 90].map((h, i) => `<i data-s="${i + 2}" style="--h:${h}%"></i>`).join('')}</div><span class="pv-dl" data-s="7">${ic('download')}Export PDF</span></div>`,
      'Streaks': () => `<div class="pv-streak"><div class="pv-flame" data-s="1">${ic('flame')}<b>12</b><small>day streak</small></div><div class="pv-badges">${[3, 7, 14, 30].map((d, i) => `<span class="pv-badge${d <= 12 ? ' got' : ''}" data-s="${i + 2}">${d}</span>`).join('')}</div></div>`,
      'Plan My Day': () => `<div class="pv-col"><div class="pv-ask" data-s="1">${ic('sparkles')}Plan my day</div>${[['9:30', 'Homepage hero', '#fca5a5'], ['11:00', 'Design review', '#c4b5fd'], ['13:00', 'Reply to Acme', '#7cc4ff'], ['15:30', 'Client check-in', '#6ee7b7']].map(([t, n, c], i) => `<div class="pv-slot" data-s="${i + 2}"><small>${t}</small><span style="border-left-color:${c}">${n}</span></div>`).join('')}</div>`,
      'Meeting Notes': () => `<div class="pv-split"><div class="pv-c"><div class="pv-c-hd"><b>Design review</b></div><span class="pv-l" style="width:90%"></span><span class="pv-l" style="width:70%"></span><span class="pv-l" style="width:80%"></span></div><div class="pv-arrow" data-s="1">${ic('sparkles')}</div><div class="pv-col">${row(2, '<span class="pv-circle"></span>Finish banner sizes', av('maya'))}${row(3, '<span class="pv-circle"></span>Fix iPad login', av('ethan'))}${row(4, '<span class="pv-circle"></span>Send hero to Nora', av('sam'))}</div></div>`,
      'Email Inbox': () => card('inbox', 'Inbox', [
        row(1, '<span class="pv-dot"></span><b class="pv-w">Jordan Blake</b>Spring banners', '09:09'),
        row(2, '<span class="pv-dot"></span><b class="pv-w">Maya Chen</b>Launch checklist', '08:24'),
        row(3, '<span class="pv-dot off"></span><b class="pv-w">Priya Nair</b>Subject lines', 'Wed'),
      ].join('')),
      'AI Replies': () => `<div class="pv-col"><div class="pv-bub them" data-s="1">Can you send the drafts by Friday?</div><div class="pv-bub me" data-s="2">${ic('sparkles')}${typed(3, 'Sure! All three sizes will be with you Friday morning.')}</div></div>`,
      'Calendar Sync': () => `<div class="pv-col">${row(1, '<span class="pv-src g">G</span>Google Calendar', chip('Synced', 'green'))}${row(2, '<span class="pv-src o">O</span>Outlook', chip('Synced', 'green'))}<div class="pv-ev" data-s="3"><small>11:00</small>Design review</div><div class="pv-ev b" data-s="4"><small>15:30</small>Client check-in</div></div>`,
      'Reminders': () => `<div class="pv-remind" data-s="1"><span class="pv-ic big">${ic('bell-ring')}</span><div><b>Client check-in</b><small>Starts in 5 minutes</small></div><span class="pv-join" data-s="2">Join</span></div>`,
      'Calendar': () => `<div class="pv-week">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => `<div class="pv-wd"><small>${d}</small>${i === 1 ? '<span class="pv-evb" data-s="1" style="--c:#c4b5fd">Review</span>' : ''}${i === 3 ? '<span class="pv-evb" data-s="2" style="--c:#fca5a5">Banners due</span>' : ''}${i === 2 ? '<span class="pv-evb" data-s="3" style="--c:#7cc4ff">Check-in</span>' : ''}${i === 4 ? '<span class="pv-evb" data-s="4" style="--c:#6ee7b7">Offsite</span>' : ''}</div>`).join('')}</div>`,
      'Video Calls': () => `<div class="pv-call">${['maya', 'daniel', 'ethan', 'sam'].map((k, i) => `<span class="pv-vt${i === 0 ? ' talk' : ''}" data-s="${i + 1}" style="background-image:url(/office/call-${k}.jpg)"></span>`).join('')}<span class="pv-ctl" data-s="5">${ic('mic')}${ic('video')}<em>${ic('phone-off')}</em></span></div>`,
      'Screen Share': () => `<div class="pv-share" data-s="1"><span class="pv-tag">Maya is sharing</span><div class="pv-shots"><span style="background-image:url(/office/banner-1.jpg)"></span><span style="background-image:url(/office/banner-2.jpg)"></span><span style="background-image:url(/office/banner-3.jpg)"></span></div><svg class="pv-ink" viewBox="0 0 300 160" data-s="2"><path d="M150 18 C 205 20, 210 140, 150 142 C 95 140, 92 22, 152 16"/></svg></div>`,
      'Voice Notes': () => `<div class="pv-col"><div class="pv-voice" data-s="1">${av('maya')}<span class="pv-play">${ic('play')}</span><span class="pv-wave">${Array.from({ length: 22 }, (_, i) => `<i style="--h:${[30, 60, 90, 50, 70, 40, 85, 55, 35, 75, 95, 45, 65, 30, 80, 50, 70, 40, 60, 35, 55, 25][i]}%"></i>`).join('')}</span><small>0:14</small></div><div class="pv-bub them" data-s="2">Love the new banner direction.</div></div>`,
      'Group Chats': () => card('messages-square', 'Chats', [
        row(1, '<span class="pv-hash">#</span>launch-squad', chip('3', 'count')), row(2, '<span class="pv-hash">#</span>design-crit', chip('1', 'count')), row(3, av('daniel') + 'Daniel Park', 'Call in 5?'),
      ].join('')),
      'Sticky Notes': () => `<div class="pv-stickies"><span class="pv-sticky y" data-s="1">Call Acme before 3</span><span class="pv-sticky b" data-s="2">Banner sizes: 3</span><span class="pv-sticky g" data-s="3">Book Lisbon flights</span></div>`,
      'Notes': () => card('notebook', 'Notes', [
        row(1, '<b class="pv-w">Launch day checklist</b>', 'Oct 2'), row(2, '<b class="pv-w">Ideas for Q4</b>', 'Oct 1'), row(3, ic('lock') + '<b class="pv-w">Salary review</b>', 'Sep 30'),
      ].join('')),
      'Bookmarks': () => card('bookmark', 'Launch links', [
        row(1, '<span class="pv-fav">F</span>Figma: banner files', ''), row(2, '<span class="pv-fav b">G</span>Brand guidelines', ''), row(3, '<span class="pv-fav g">A</span>App Store listing', ''),
      ].join('')),
      'Work Log': () => card('history', 'Finished this week', [
        row(1, tick(1) + 'Pricing page', 'Website'), row(2, tick(2) + 'Crash reporting', 'Mobile'), row(3, tick(3) + 'Moodboard', 'Brand'),
      ].join('')),
      'Overview': () => `<div class="pv-ov"><div class="pv-big" data-s="1"><small>Completed this week</small><b>23</b></div><div class="pv-vbars">${[30, 55, 45, 80, 65, 90, 50].map((h, i) => `<i data-s="${i + 2}" style="--h:${h}%"></i>`).join('')}</div></div>`,
      'Manager Dashboard': () => card('users-round', 'Team this week', [
        bar(1, av('maya') + 'Maya', 86, '#6ee7b7', '12'), bar(2, av('daniel') + 'Daniel', 64, '#6ee7b7', '9'), bar(3, av('ethan') + 'Ethan', 48, '#6ee7b7', '7'),
      ].join('')),
      'Workload Health': () => card('gauge', 'Workload', [
        bar(1, av('maya') + 'Maya', 92, '#f87171', 'Overloaded'), bar(2, av('ethan') + 'Ethan', 70, '#fbbf24', 'Busy'), bar(3, av('sam') + 'Sam', 34, '#7cc4ff', 'Has room'),
      ].join('')),
      'Daily Recap': () => `<div class="pv-col"><div class="pv-stats">${[['7', 'Tasks done'], ['2', 'Meetings'], ['12', 'Day streak']].map(([n, l], i) => `<div class="pv-stat" data-s="${i + 1}"><b>${n}</b><small>${l}</small></div>`).join('')}</div><div class="pv-bub them wide" data-s="4">You shipped the hero, sent the Acme drafts and closed the design review.</div></div>`,
      'Team Live': () => `<div class="pv-live">${[['maya', 'In Design room', '#9fdcff'], ['daniel', 'Available', '#22c55e'], ['priya', 'In focus', '#a78bfa'], ['nora', 'Back at 2:30', '#fbbf24']].map(([k, t, c], i) => `<div class="pv-person" data-s="${i + 1}">${av(k === 'priya' ? 'nora' : k)}<span class="pv-st" style="background:${c}"></span><small>${t}</small></div>`).join('')}</div>`,
      'Mood Avatars': () => `<div class="pv-moods">${['smile', 'flame', 'sun-moon', 'sparkles'].map((m, i) => `<span class="pv-mood" data-s="${i + 1}">${ic(m)}</span>`).join('')}<small data-s="5">How's your energy today?</small></div>`,
      'Notifications': () => card('bell', 'Notifications', [
        row(1, av('maya') + '<span>Maya sent a task for review</span>', ''), row(2, av('daniel') + '<span>Daniel mentioned you</span>', ''), row(3, av('nora') + '<span>Nora knocked</span>', ''),
      ].join('')),
      'Themes': () => `<div class="pv-themes">${[['Blue', '#15496b', '#1c587e'], ['Light', '#f1f5f9', '#ffffff'], ['Black', '#111', '#1c1c1c']].map(([n, a, b], i) => `<div class="pv-theme" data-s="${i + 1}" style="--a:${a};--b:${b}"><span></span><span></span><small>${n}</small></div>`).join('')}</div>`,
      'Cloud Sync': () => `<div class="pv-sync"><span class="pv-dev" data-s="1">${ic('laptop')}<small>Mac</small></span><span class="pv-cloud" data-s="2">${ic('cloud')}</span><span class="pv-dev" data-s="3">${ic('laptop')}<small>Windows</small></span><span class="pv-ok" data-s="4">${ic('check')}All synced</span></div>`,
      'Privacy': () => `<div class="pv-col center"><span class="pv-shield" data-s="1">${ic('shield-check')}</span>${row(2, ic('lock') + 'Your data stays yours', '')}${row(3, ic('check') + 'No ads, no tracking', '')}</div>`,
      'Hydration': () => `<div class="pv-water"><div class="pv-glass" data-s="1"><i></i></div><div class="pv-col"><b class="pv-big2" data-s="2">5 / 8</b><small data-s="3">glasses today</small><span class="pv-chip blue" data-s="4">+1 glass</span></div></div>`,
      'Trello Import': () => card('download', 'Import from Trello', [
        bar(1, 'Product Launch', 100, '#6ee7b7', ic('check')), bar(2, 'Brand Refresh', 100, '#6ee7b7', ic('check')), bar(3, 'Q4 Roadmap', 70, '#7cc4ff', '70%'),
      ].join('')),
      'Mac & Windows': () => `<div class="pv-os"><div class="pv-win" data-s="1"><span class="pv-dots3"><i></i><i></i><i></i></span><span class="pv-l" style="width:70%"></span><span class="pv-l" style="width:50%"></span><small>macOS</small></div><div class="pv-win w" data-s="2"><span class="pv-ctrl3"><i></i><i></i><i></i></span><span class="pv-l" style="width:70%"></span><span class="pv-l" style="width:50%"></span><small>Windows</small></div></div>`,
      'iPhone App': () => `<div class="pv-phone" data-s="1"><span class="pv-notch"></span>${row(2, '<span class="pv-circle"></span>Homepage hero', '')}${row(3, '<span class="pv-circle"></span>Acme drafts', '')}<span class="pv-chip" data-s="4">Coming soon</span></div>`,
      'Search': () => `<div class="pv-col"><div class="pv-input">${ic('search')}${typed(1, 'banners')}<span class="pv-caret"></span></div>${row(2, ic('list-checks') + 'Spring banners: final sizes', chip('Task'))}${row(3, ic('kanban') + 'Spring Campaign', chip('Board'))}${row(4, ic('message-circle') + '"Banners are up for review"', chip('Chat'))}</div>`,
      'Attachments': () => card('paperclip', 'Design review · files', [
        row(1, '<span class="pv-file pdf">PDF</span>Launch brief.pdf', '240 KB'), row(2, '<span class="pv-file img" style="background-image:url(/office/banner-2.jpg)"></span>new-season.jpg', '1.2 MB'), row(3, '<span class="pv-file fig">FIG</span>banners.fig', '8 MB'),
      ].join('')),
      'Invite Your Team': () => `<div class="pv-col"><div class="pv-input">${ic('user-plus')}${typed(1, 'nora@lumen.studio')}<span class="pv-caret"></span></div>${row(2, av('nora') + 'Nora Ali', chip('Invited', 'green'))}${row(3, av('ethan') + 'Ethan Cole', chip('Joined', 'blue'))}<small class="pv-note2" data-s="4">Teams of 3 to 50, priced per seat</small></div>`,
    };

    const S = (ms) => new Promise((r) => setTimeout(r, ms));
    const wallEl = root.querySelector('#wall');
    const touch = window.matchMedia('(hover: none)').matches;
    const pv = document.createElement('div');
    pv.className = 'pv-card'; pv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pv);
    offs.push(() => pv.remove());
    let token = 0, showTimer = null, hideTimer = null;

    /* Generic player: step through data-s pieces, typing any data-type text, then loop. */
    function playSteps(box, alive) {
      const pieces = [...box.querySelectorAll('[data-s]')];
      const max = Math.max(0, ...pieces.map((p) => +p.dataset.s));
      (async () => {
        while (alive()) {
          pieces.forEach((p) => { p.classList.remove('in'); if (p.dataset.type != null) p.textContent = ''; });
          await S(350);
          for (let k = 1; k <= max; k++) {
            if (!alive()) return;
            for (const p of pieces.filter((x) => +x.dataset.s === k)) {
              p.classList.add('in');
              if (p.dataset.type != null) { const t = p.dataset.type; for (let i = 1; i <= t.length && alive(); i++) { p.textContent = t.slice(0, i); await S(32); } }
            }
            await S(380);
          }
          await S(2600);
        }
      })();
    }
    function sceneHtml(name) {
      if (LEGACY[name]) return LEGACY[name].html();
      return SCENES[name] ? SCENES[name]() : '';
    }
    function play(name, box, alive) { if (LEGACY[name]) LEGACY[name].play(box, alive); else playSteps(box, alive); }
    function render(name, line) {
      pv.innerHTML = `<div class="pv-stage">${sceneHtml(name)}</div><div class="pv-txt"><b>${name}</b><span>${line || ''}</span></div>`;
      iconsIn(pv);
      const me = ++token; play(name, pv, () => me === token && pv.classList.contains('on'));
    }
    function place(tile) {
      const r = tile.getBoundingClientRect(), W = 340, gap = 12;
      let x = r.right + gap; if (x + W > window.innerWidth - 12) x = r.left - gap - W;
      x = Math.max(12, x);
      const h = pv.offsetHeight || 220;
      let y = r.top + r.height / 2 - h / 2; y = Math.max(12, Math.min(y, window.innerHeight - h - 12));
      pv.style.left = x + 'px'; pv.style.top = y + 'px';
    }
    const has = (name) => !!(LEGACY[name] || SCENES[name]);
    if (!touch) {
      wallEl.querySelectorAll('.t').forEach((tile) => {
        const name = tile.dataset.name; if (!has(name)) return;
        tile.classList.add('has-pv');
        tile.addEventListener('mouseenter', () => {
          clearTimeout(hideTimer); clearTimeout(showTimer);
          showTimer = setTimeout(() => { pv.classList.add('on'); render(name, tile.dataset.line); place(tile); }, 260);
        });
        tile.addEventListener('mouseleave', () => {
          clearTimeout(showTimer);
          hideTimer = setTimeout(() => { pv.classList.remove('on'); token++; }, 80);
        });
      });
      addEventListener('scroll', () => { pv.classList.remove('on'); token++; }, { passive: true });
    } else {
      wallEl.querySelectorAll('.t').forEach((tile) => {
        const name = tile.dataset.name; if (!has(name)) return;
        tile.addEventListener('click', () => setTimeout(() => {
          const d = document.getElementById('detail'); if (!d || d.querySelector('.pv-stage')) return;
          const box = document.createElement('div'); box.className = 'pv-inline';
          box.innerHTML = `<div class="pv-stage">${sceneHtml(name)}</div>`;
          d.prepend(box); iconsIn(box);
          const me = ++token; play(name, box, () => me === token && document.body.contains(box));
        }, 30));
      });
    }
  }
  return () => {
    timers.forEach((id) => window.clearTimeout(id)); intervals.forEach((id) => window.clearInterval(id));
    observers.forEach((o) => o.disconnect()); offs.forEach((f) => f());
  };
}
