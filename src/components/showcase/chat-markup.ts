// The Chat page body. chat-run.js brings the playground and the little scenes to life.
const E = (n: string) => `<img class="emj" src="/chat/emoji/${n}.png" alt="">`;

export const MARKUP = `
<div class="hero">
  <div class="floaters" aria-hidden="true">
    <span class="fl" style="left:4%;top:22%;animation-delay:0s"><img src="/chat/emoji/fire.png" alt=""></span>
    <span class="fl" style="left:12%;top:68%;animation-delay:1.2s"><img src="/chat/emoji/party_popper.png" alt=""></span>
    <span class="fl" style="right:6%;top:18%;animation-delay:.6s"><img src="/chat/emoji/red_heart.png" alt=""></span>
    <span class="fl" style="right:13%;top:66%;animation-delay:1.8s"><img src="/chat/emoji/raising_hands.png" alt=""></span>
    <span class="fl" style="left:24%;top:6%;animation-delay:2.4s;width:40px;height:40px"><img src="/chat/emoji/thumbs_up.png" alt=""></span>
    <span class="fl" style="right:26%;top:4%;animation-delay:3s;width:40px;height:40px"><img src="/chat/emoji/face_with_tears_of_joy.png" alt=""></span>
  </div>
  <h1 class="tw-h" aria-label="Stop switching apps to talk about your work."><span id="tw" aria-hidden="true"></span><span class="tcaret" aria-hidden="true"></span></h1>
  <p class="lead">Chat sits right next to your tasks and boards, so the talk and the work stay together.</p>
</div>


<div class="vs">
  <div class="vs-col before rv">
    <h3 class="vs-t">Before</h3>
    <p class="vs-s">Three apps, one conversation.</p>
    <div class="vs-scene" id="gap-before">
      <div class="app a1"><div class="app-bar"><i></i><i></i><i></i><span>Task app</span></div><div class="app-body"><span class="ln" style="width:80%"></span><span class="ln" style="width:60%"></span><span class="ln" style="width:70%"></span></div></div>
      <div class="app a2"><div class="app-bar"><i></i><i></i><i></i><span>Chat app</span></div><div class="app-body"><span class="q">Which task was that again?</span><span class="q2">Can you send the link?</span></div></div>
      <div class="app a3"><div class="app-bar"><i></i><i></i><i></i><span>Video app</span></div><div class="app-body"><span class="ln" style="width:50%"></span><span class="join">Join meeting</span></div></div>
    </div>
    <ul class="vs-pts">
      <li><span class="x"><i data-lucide="x"></i></span>3 apps for one task</li>
      <li><span class="x"><i data-lucide="x"></i></span><span><b id="gap-n">11</b> app switches today</span></li>
      <li><span class="x"><i data-lucide="x"></i></span>Links pasted back and forth</li>
    </ul>
  </div>
  <span class="vs-arrow" aria-hidden="true"><i data-lucide="arrow-right"></i></span>
  <div class="vs-col after rv">
    <h3 class="vs-t">With BloomBoard</h3>
    <p class="vs-s">One window for the work and the talk.</p>
    <div class="vs-scene" id="gap-after">
      <div class="one">
        <div class="one-board"><div class="ob-col"><b>In Progress</b><div class="ob-card" id="gap-card">Spring banners<span class="av" style="background-image:url(/office/face-maya.jpg)"></span></div><div class="ob-card dim">Onboarding screens</div></div><div class="ob-col" id="gap-review"><b>In Review</b><div class="ob-card dim">Pricing page</div></div></div>
        <div class="one-chat"><div class="oc-hd"># spring-campaign<span class="oc-call"><i data-lucide="video"></i></span></div><div class="oc-msgs" id="gap-chat"></div></div>
      </div>
    </div>
    <ul class="vs-pts">
      <li><span class="ok"><i data-lucide="check"></i></span>1 window</li>
      <li><span class="ok"><i data-lucide="check"></i></span><span><b>0</b> app switches</span></li>
      <li><span class="ok"><i data-lucide="check"></i></span>The chat sits next to the task</li>
    </ul>
  </div>
</div>

<div class="say" data-say="Now, try it yourself."><div class="say-big" aria-label="Now, try it yourself."><span class="say-t"></span><span class="say-car"></span></div><p class="say-sub">Type a message, or pick a feature below. The team is listening.</p></div>
<div class="play-wrap rv in">
  <div class="win" id="pl">
    <aside class="side">
      <h5>Rooms</h5>
      <div class="room on"><span class="hash">#</span>launch-squad</div>
      <div class="room"><span class="hash">#</span>design-crit<span class="n" id="pl-n1">2</span></div>
      <div class="room"><span class="hash">#</span>random</div>
      <h5>Direct messages</h5>
      <div class="room"><span class="a" style="background-image:url(/office/face-maya.jpg)"></span>Maya Chen<span class="n" id="pl-n2">1</span></div>
      <div class="room"><span class="a" style="background-image:url(/office/face-daniel.jpg)"></span>Daniel Park</div>
      <div class="room"><span class="a" style="background-image:url(/office/face-nora.jpg)"></span>Nora Ali</div>
      <div class="room"><span class="a" style="background-image:url(/office/face-ethan.jpg)"></span>Ethan Cole</div>
    </aside>
    <section class="main">
      <div class="mhd"><span class="room" style="padding:0"><span class="hash">#</span></span><div><b>launch-squad</b><br><small>5 members · Maya is online</small></div>
        <div class="acts"><span class="ib" id="pl-cmu" title="Catch me up"><span class="lines3"><i></i><i></i><i></i></span><span>Catch me up</span></span><span class="ib" id="pl-call" title="Start a call"><i data-lucide="video"></i></span></div></div>
      <div class="pinbar" id="pl-pin"><i data-lucide="pin"></i><span id="pl-pin-t"></span></div>
      <div class="msgs" id="pl-msgs" aria-live="polite"></div>
      <div class="composer">
        <div class="reply-to" id="pl-reply"><i data-lucide="corner-up-left" style="width:14px;height:14px"></i>Replying to <b id="pl-reply-who"></b></div>
        <div class="crow" id="pl-crow">
          <span class="ib" id="pl-emoji" title="Emoji">${E('grinning_face_with_big_eyes')}</span>
          <span class="ib gif-btn" id="pl-gif" title="GIF">GIF</span>
          <span class="ib" id="pl-attach" title="Attach"><i data-lucide="paperclip"></i></span>
          <input id="pl-in" type="text" autocomplete="off" maxlength="160" placeholder="Message #launch-squad" aria-label="Type a message">
          <span class="ib" id="pl-mic" title="Voice note"><i data-lucide="mic"></i></span>
          <button class="send" id="pl-send" aria-label="Send"><i data-lucide="send"></i></button>
        </div>
        <div class="rec" id="pl-rec"><span class="dot"></span><span id="pl-rec-t">0:00</span><span class="wave" id="pl-rec-w"></span><span style="color:var(--dim)">Recording…</span></div>
        <div class="pop emoji-pop" id="pl-emoji-pop"></div>
        <div class="pop gif-pop" id="pl-gif-pop"></div>
        <div class="pop mention-pop" id="pl-mention-pop"></div>
      </div>
      <div class="dropzone" id="pl-drop"><i data-lucide="image"></i>Drop to share with the room</div>
      <div class="callov" id="pl-callov">
        <div class="cgrid">${['maya','daniel','ethan','sam'].map((k)=>`<div class="ct" style="background-image:url(/office/call-${k}.jpg)"><span>${k==='sam'?'You':k[0].toUpperCase()+k.slice(1)}</span></div>`).join('')}</div>
        <div class="cctl"><span><i data-lucide="mic"></i></span><span><i data-lucide="video"></i></span><span><i data-lucide="monitor-up"></i></span><span class="end" id="pl-hang"><i data-lucide="phone-off"></i>Leave</span></div>
      </div>
    </section>
    <div class="toast" id="pl-toast"></div>
    <div class="dragfile" id="pl-drag"><span class="th" style="background-image:url(/office/banner-2.jpg)"></span><span><b>new-season.jpg</b><small>1.2 MB</small></span></div>
  </div>
  <div class="dock fgrid" id="pl-dock">
    <button class="fc" data-f="react"><span class="fi">${E('fire')}</span><span class="ft"><b>Reactions</b><small>React with 3D emoji</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="gif"><span class="fi">${E('party_popper')}</span><span class="ft"><b>GIFs</b><small>Say it with a GIF</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="voice"><span class="fi"><i data-lucide="mic"></i></span><span class="ft"><b>Voice notes</b><small>Talk instead of typing</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="file"><span class="fi"><i data-lucide="paperclip"></i></span><span class="ft"><b>Files</b><small>Drop images and PDFs</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="reply"><span class="fi"><i data-lucide="corner-up-left"></i></span><span class="ft"><b>Replies</b><small>Quote any message</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="mention"><span class="fi"><span class="at">@</span></span><span class="ft"><b>Mentions</b><small>Get someone's attention</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="pin"><span class="fi"><i data-lucide="pin"></i></span><span class="ft"><b>Pin</b><small>Keep the key message on top</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="cmu"><span class="fi"><span class="lines3"><i></i><i></i><i></i></span></span><span class="ft"><b>Catch me up</b><small>A summary of what you missed</small></span><span class="fbar"></span></button>
    <button class="fc" data-f="call"><span class="fi"><i data-lucide="video"></i></span><span class="ft"><b>Call</b><small>Start a call from the chat</small></span><span class="fbar"></span></button>
  </div>
  <p class="hint">Pick a feature to watch it happen, or type your own message in the chat.</p>
</div>

<div class="sec">
  <div class="say" data-say="And the little things? Done right."><div class="say-big" aria-label="And the little things? Done right."><span class="say-t"></span><span class="say-car"></span></div><p class="say-sub">Small details that make a team chat feel quick and friendly, all in the same window as your tasks and boards.</p></div>
  <div class="bento">
    <div class="bx w2 rv"><div class="sc"><div class="fmt" id="bx-fmt"></div></div><div class="tx"><b>Format as you type</b><span>Bold, italic and strikethrough, the way you already write them.</span></div></div>
    <div class="bx rv"><div class="sc"><div class="unreads" id="bx-unread">
      <div class="room"><span class="hash">#</span>launch-squad<span class="n" data-n>3</span></div>
      <div class="room"><span class="hash">#</span>design-crit<span class="n" data-n>1</span></div>
      <div class="room"><span class="a" style="background-image:url(/office/face-maya.jpg)"></span>Maya Chen<span class="n" data-n>2</span></div>
    </div></div><div class="tx"><b>Unread at a glance</b><span>Counts tick up as people talk.</span></div></div>
    <div class="bx rv"><div class="sc"><div class="edit" id="bx-edit"></div></div><div class="tx"><b>Edit or delete</b><span>Fix a typo, or remove a message completely.</span></div></div>
    <div class="bx rv"><div class="sc"><div class="srch" id="bx-srch">
      <div class="qbox"><i data-lucide="search"></i><span id="bx-srch-q"></span></div>
      <div class="hit"><b>Maya</b> in #launch-squad<small>"The <mark>banners</mark> are up for review"</small></div>
      <div class="hit"><b>Daniel</b> in #design-crit<small>"Logo on the left for all <mark>banners</mark>"</small></div>
    </div></div><div class="tx"><b>Search every chat</b><span>Find that message from last week in a second.</span></div></div>
    <div class="bx rv"><div class="sc"><div class="knock" id="bx-knock"><span class="a" style="background-image:url(/office/face-daniel.jpg)"></span><span class="kk">Knock knock</span><div class="bts"><span class="p">Come in</span><span>Give me 5</span></div></div></div><div class="tx"><b>Knock before a call</b><span>Ask if now is good, right from the chat.</span></div></div>
    <div class="bx rv"><div class="sc"><div class="sugg" id="bx-sugg"></div></div><div class="tx"><b>Suggest a reply</b><span>Bloom offers a few replies. Tap one to send it.</span></div></div>
    <div class="bx w2 rv"><div class="sc"><div class="anywhere" id="bx-any"></div></div><div class="tx"><b>Reply from anywhere</b><span>Messages pop up over your teammate's photo on the dashboard. Answer right there, without opening Chat.</span></div></div>
    <div class="bx w3 rv"><div class="sc"><div class="presence" id="bx-pres">
      ${[['maya','Online','#22c55e'],['daniel','In a call','#9fdcff'],['nora','In focus','#a78bfa'],['ethan','Back at 2:30','#fbbf24'],['sam','Online','#22c55e']].map(([k,t,c])=>`<div class="p"><span class="a" style="background-image:url(/office/face-${k}.jpg);--c:${c}"></span>${t}</div>`).join('')}
    </div></div><div class="tx"><b>See who's free before you message</b><span>Everyone's status shows next to their name, so you know when to expect a reply.</span></div></div>
  </div>
</div>

<div class="sec">
  <div class="say" data-say="Been away for an hour? We've got you."><div class="say-big" aria-label="Been away for an hour? We've got you."><span class="say-t"></span><span class="say-car"></span></div></div>
  <div class="cmu rv">
    <div><h3>Catch up in<br>ten seconds.</h3><p>Forty new messages in #launch-squad. Bloom reads them and gives you the three things that matter, so you never scroll back through the whole thread.</p>
      <button class="cmu-btn" id="cmu-go"><span class="lines3"><i></i><i></i><i></i></span>Catch me up</button></div>
    <div class="stack" id="cmu-stack">
      ${[['maya','Banners are up, 3 sizes'],['daniel','Logo on the left please'],['nora','Acme wants them Friday'],['ethan','Build is on TestFlight'],['maya','Moving review to 11:00'],['daniel','Approved the hero']].map(([k,t],i)=>`<div class="sm" style="top:${i*48}px"><span class="a" style="background-image:url(/office/face-${k}.jpg)"></span>${t}</div>`).join('')}
      <div class="sum"><div class="summary"><b><span class="lines3"><i></i><i></i><i></i></span>Catch up · 40 messages</b><ul><li>Banners are approved, logo on the left.</li><li>Acme needs all three sizes by Friday.</li><li>Design review moved to 11:00.</li></ul></div></div>
    </div>
  </div>
</div>

<div class="sec end">
  <div class="say" data-say="That's chat in BloomBoard.<br>Right where your work is."><div class="say-big" aria-label="That's chat in BloomBoard. Right where your work is."><span class="say-t"></span><span class="say-car"></span></div></div>
</div>
`;
