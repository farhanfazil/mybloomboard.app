// The Handover page body. handover-run.js fills in the film and the clips.
export const MARKUP = `
<div class="top">
  <div class="floaters" aria-hidden="true"><span class="fl" style="left:4%;top:18%"><img src="/chat/emoji/airplane.png" alt=""></span><span class="fl" style="left:13%;top:74%;animation-delay:1.4s;width:40px;height:40px"><img src="/chat/emoji/palm_tree.png" alt=""></span><span class="fl" style="right:5%;top:14%;animation-delay:.7s"><img src="/chat/emoji/smiling_face_with_sunglasses.png" alt=""></span><span class="fl" style="right:13%;top:72%;animation-delay:2.1s;width:40px;height:40px"><img src="/chat/emoji/handshake.png" alt=""></span></div>
  <h1 aria-label="Go on leave. Your work keeps moving."><span id="tw" aria-hidden="true"></span><span class="tcaret" aria-hidden="true"></span></h1>
  <p>Before you go, hand each task to a teammate with a short note. It all comes back to you when you return.</p>
</div>

<div class="pass" id="hpass" aria-hidden="true">
  <div class="pass-from"><span class="pf-av" style="background-image:url(/office/face-sam.jpg)"><img class="pf-badge" src="/chat/emoji/airplane.png" alt=""></span><b>Sam</b><small id="pass-st">Leaving Friday</small></div>
  <svg class="pass-paths" id="pass-paths" aria-hidden="true"></svg>
  <div class="pass-air" id="pass-air"></div>
  <div class="pass-to">
    <div class="pt" data-k="maya"><span class="pt-av" style="background-image:url(/office/face-maya.jpg)"><span class="pt-ok"><i data-lucide="check"></i></span></span><span><b>Maya</b><small>Send drafts to Acme</small></span></div>
    <div class="pt" data-k="ethan"><span class="pt-av" style="background-image:url(/office/face-ethan.jpg)"><span class="pt-ok"><i data-lucide="check"></i></span></span><span><b>Ethan</b><small>Review App Store copy</small></span></div>
    <div class="pt" data-k="daniel"><span class="pt-av" style="background-image:url(/office/face-daniel.jpg)"><span class="pt-ok"><i data-lucide="check"></i></span></span><span><b>Daniel</b><small>Weekly KPI report</small></span></div>
  </div>
</div>

<div class="film-wrap">
  <div class="film" id="hfilm">
    <div class="canvas" id="hcanvas"></div>
    <div class="cap"><span class="k" id="hcapk">01</span><span class="t" id="hcapt"></span></div>
    <div class="steps" id="hsteps"></div>
    <span class="replay" id="hreplay"><i data-lucide="rotate-ccw"></i>Replay</span>
  </div>
</div>

<div class="facts">
  <div class="fact"><b>Two minutes</b><span>Pick your work, pick people, add a note, send.</span></div>
  <div class="fact"><b>Nothing assumed</b><span>Each teammate accepts or declines every item.</span></div>
  <div class="fact"><b>Context travels</b><span>Your note stays on the task while they cover it.</span></div>
  <div class="fact"><b>It comes back</b><span>On your first day back, everything returns to you.</span></div>
</div>

<nav class="cnav"><div class="cnav-in">
  <a href="#h1" data-ch="h1">Before you go</a><a href="#h2" data-ch="h2">Pass it on</a><a href="#h3" data-ch="h3">They say yes</a><a href="#h4" data-ch="h4">While you're away</a><a href="#h5" data-ch="h5">Welcome back</a>
</div></nav>

<div data-hide-header>
<div class="chap" id="h1">
  <div class="chap-l rv"><div class="node"><span class="no">01</span><span class="when">Mon, Oct 9 · three days before</span></div><h2>Before you go</h2><p>BloomBoard sees your leave coming and reminds you to hand over in good time.</p></div>
  <div class="clips">
    <div class="clip s5 rv"><div class="scr" id="hc-remind"></div><div class="txt"><b>A reminder before you leave</b><span>Three days out, you get a nudge to hand over your work.</span></div></div>
    <div class="clip s7 rv"><div class="scr" id="hc-select"></div><div class="txt"><b>Select everything due while you're away</b><span>One click picks every task and board card due before you're back.</span></div></div>
  </div>
</div>

<div class="chap" id="h2">
  <div class="chap-l rv"><div class="node"><span class="no">02</span><span class="when">Thu, Oct 11 · the day before</span></div><h2>Pass it on</h2><p>Choose a person for each item, and leave a short note so they know where things stand.</p></div>
  <div class="clips">
    <div class="clip s6 rv"><div class="scr" id="hc-pick" style="height:290px"><span class="try">Pick a person</span></div><div class="txt"><b>The right person for each task</b><span>Teammates who are also away are marked, so work never lands on an empty desk.</span></div></div>
    <div class="clip s6 rv"><div class="scr" id="hc-brief" style="height:290px"></div><div class="txt"><b>A short brief</b><span>A note for each item. It travels with the task while they cover it.</span></div></div>
  </div>
</div>

<div class="chap" id="h3">
  <div class="chap-l rv"><div class="node"><span class="no">03</span><span class="when">Thu, Oct 11 · that evening</span></div><h2>They say yes</h2><p>Nothing is handed over until your teammate agrees. They can say no, and tell you why.</p></div>
  <div class="clips">
    <div class="clip s7 rv"><div class="scr" id="hc-accept" style="height:340px"><span class="try">Accept or decline</span></div><div class="txt"><b>Accept or decline each item</b><span>Your teammate sees your note and every brief, then answers item by item.</span></div></div>
    <div class="clip s5 rv"><div class="scr" id="hc-reply" style="height:340px"></div><div class="txt"><b>You hear back right away</b><span>If someone can't take an item, you pick someone else before you go.</span></div></div>
  </div>
</div>

<div class="chap" id="h4">
  <div class="chap-l rv"><div class="node"><span class="no">04</span><span class="when">Oct 12 to 15 · while you're away</span></div><h2>While you're away</h2><p>Your teammates have everything they need, and nobody wonders who owns what.</p></div>
  <div class="clips">
    <div class="clip s6 rv"><div class="scr" id="hc-brieftask"></div><div class="txt"><b>The brief stays on the task</b><span>Anyone opening the task sees who is covering it and your note.</span></div></div>
    <div class="clip s6 rv"><div class="scr" id="hc-away"></div><div class="txt"><b>Everyone knows you're away</b><span>Your desk in the Office shows when you're back, and messages wait for you.</span></div></div>
    <div class="clip s12 rv"><div class="scr" id="hc-tab" style="height:300px"></div><div class="txt"><b>The Handover tab</b><span>What's waiting on you, what you're covering, and what you've handed off, in one place.</span></div></div>
  </div>
</div>

<div class="chap" id="h5">
  <div class="chap-l rv"><div class="node"><span class="no">05</span><span class="when">Thu, Oct 16 · welcome back</span></div><h2>Welcome back</h2><p>On your first day back, everything returns to you with what happened while you were out.</p></div>
  <div class="clips">
    <div class="clip s12 rv"><div class="scr" id="hc-back" style="height:300px"></div><div class="txt"><b>Everything comes back to you</b><span>Finished work is marked done, and anything still open is yours again, with notes from whoever covered it.</span></div></div>
  </div>
</div>
</div>

`;
