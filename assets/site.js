// Auringon — shared behavior for the split site.
// Ported from the single-file build; showView routing replaced by real pages.

// Legacy deep links: the single-file site addressed views as #hashes.
// Anyone holding an old link lands on the new page instead of the homepage hero.
(function(){
var LEGACY={
'about':'/about/','offerings':'/offerings/','journal':'/journal/',
'post-failure-modes':'/journal/four-ways-urban-work-fails/',
'post-container-moves':'/journal/container-moves/',
'post-urban-systems':'/journal/the-working-layer/',
'engagement-tlc':'/work/building-a-product-practice/',
'engagement-bandwagon':'/work/shipping-a-new-service-line/',
'engagement-adhoc':'/work/growing-an-account-from-the-inside/'
};
var raw='';
try{raw=window.location.hash.replace(/^#/,'').trim();}catch(e){}
if(LEGACY[raw]&&window.location.pathname==='/'){window.location.replace(LEGACY[raw]);}
})();

// Analytics: page views fire on load; these name the moments that matter.
function track(name,params){
if(typeof gtag==='function'){try{gtag('event',name,params||{});}catch(e){}}
}

// Nav: hairline border once scrolled
function navScrolled(){
var nav=document.getElementById('nav');
if(!nav)return;
var sc=window.scrollY>8;
nav.classList.toggle('scrolled',sc);
document.body.classList.toggle('scrolled',sc);
}
window.addEventListener('scroll',navScrolled,{passive:true});
navScrolled();
// Arrival wash: the sky glaze dries as the stones soak (soak delays run
// 2.25-3.3s; the dry starts as the first stone drinks). Scrolling remains
// a quick early exit; once dried, it stays dry.
setTimeout(function(){document.body.classList.add('wash-dried');},2400);

// Mobile nav toggle
(function(){
var btn=document.getElementById('navToggle'),list=document.getElementById('navList');
if(!btn||!list)return;
btn.addEventListener('click',function(){
var open=list.classList.toggle('open');
btn.setAttribute('aria-expanded',open?'true':'false');
});
})();

// Sticky-nav-aware scrolling: scrollIntoView doesn't know the nav is there,
// so a target's top can land underneath it (most visible on small screens,
// where the door panels are taller than the viewport).
function navOffset(){
var nav=document.getElementById('nav');
return (nav?nav.getBoundingClientRect().height:70)+16;
}
function scrollBelowNav(el){
window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-navOffset(),behavior:'smooth'});
}
// block:'nearest', but with the nav as the true top edge: no scroll if the
// element is fully visible, minimal scroll otherwise.
function scrollIntoViewBelowNav(el){
var r=el.getBoundingClientRect(),top=navOffset();
if(r.top<top){scrollBelowNav(el);}
else if(r.bottom>window.innerHeight){
window.scrollTo({top:window.scrollY+Math.min(r.bottom-window.innerHeight+16,r.top-top),behavior:'smooth'});
}
}

// Fork: pick one door at a time; its detail opens beneath the row
function selectDoor(which){
var card=document.getElementById('card-'+which);
var detail=document.getElementById('detail-'+which);
if(!card||!detail)return;
var wasOpen=card.classList.contains('selected');
var grid=card.closest('.doors-grid');
['founder','funder','prime'].forEach(function(k){
var c=document.getElementById('card-'+k);
if(!c)return;
c.classList.remove('selected');
c.setAttribute('aria-expanded','false');
document.getElementById('detail-'+k).classList.remove('open');
});
grid.classList.toggle('has-open',!wasOpen);
if(!wasOpen){
card.classList.add('selected');
card.setAttribute('aria-expanded','true');
detail.classList.add('open');
track('door_open',{door:which});
requestAnimationFrame(function(){scrollIntoViewBelowNav(detail);});
}
}

// Ways: collapsed on mobile, open on desktop
(function(){
var mq=window.matchMedia('(max-width:800px)');
var ways=document.querySelectorAll('details.way');
if(!ways.length)return;
function setWays(){ways.forEach(function(d){d.open=!mq.matches;});}
ways.forEach(function(d){d.addEventListener('toggle',function(){if(!mq.matches&&!d.open){d.open=true;}});});
if(mq.addEventListener){mq.addEventListener('change',setWays);}else{mq.addListener(setWays);}
setWays();
})();

// Close a door from the bottom of its panel and return to the fork
function closeDoor(which){
selectDoor(which);
var fork=document.getElementById('fork');
if(fork)scrollBelowNav(fork);
}

// Doors on touch: hover can't wake the scenes, so the scroll position does.
// The door nearest the middle of the screen runs; the others hold still —
// the doors' rule (attention on one, the rest recede), with the thumb for a
// cursor. Desktop never attaches the listener; reduced motion is handled in
// the CSS, where the animations live.
(function(){
var hoverless=window.matchMedia('(hover: none)');
var doors=document.querySelectorAll('.door-card');
if(!doors.length)return;
var ticking=false,attached=false;
function update(){
ticking=false;
var vc=window.innerHeight/2,best=null,bestD=Infinity;
doors.forEach(function(d){
var r=d.getBoundingClientRect();
if(r.bottom<=0||r.top>=window.innerHeight){d.classList.remove('in-view');return;}
var dist=Math.abs((r.top+r.bottom)/2-vc);
if(dist<bestD){bestD=dist;best=d;}
});
doors.forEach(function(d){d.classList.toggle('in-view',d===best);});
}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
function setSpy(){
if(hoverless.matches&&!attached){
attached=true;
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll,{passive:true});
update();
}else if(!hoverless.matches&&attached){
attached=false;
window.removeEventListener('scroll',onScroll);
window.removeEventListener('resize',onScroll);
doors.forEach(function(d){d.classList.remove('in-view');});
}
}
if(hoverless.addEventListener){hoverless.addEventListener('change',setSpy);}else{hoverless.addListener(setSpy);}
setSpy();
})();

// Email + booking: copy the address as a visible fallback (mail handlers are
// blocked in some previews), and name both moments for analytics.
(function(){
var toast=document.createElement('div');toast.className='copy-toast';document.body.appendChild(toast);
var t;
document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
a.addEventListener('click',function(){
track('email_click');
try{navigator.clipboard.writeText('hello@auringon.com').catch(function(){});}catch(e){}
toast.textContent='hello@auringon.com copied';
toast.classList.add('show');
clearTimeout(t);t=setTimeout(function(){toast.classList.remove('show');},2200);
});
});
document.querySelectorAll('a[href*="calendar.app.google"]').forEach(function(a){
a.addEventListener('click',function(){track('book_call_click');});
});
})();

// Subscribe confirmation: Formspree redirects back with ?subscribed=1
(function(){
var params;
try{params=new URLSearchParams(window.location.search);}catch(e){return;}
if(params.get('subscribed')!=='1')return;
var form=document.getElementById('subscribe-form'),thanks=document.getElementById('subscribe-thanks');
if(form&&thanks){form.hidden=true;thanks.hidden=false;}
try{history.replaceState({},'',window.location.pathname+window.location.hash);}catch(e){}
})();

// Subscribe: submit in place via Formspree AJAX; fall back to the classic POST if blocked
(function(){
var form=document.getElementById('subscribe-form'),thanks=document.getElementById('subscribe-thanks');
if(!form||!thanks)return;
form.addEventListener('submit',function(e){
e.preventDefault();
fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
.then(function(r){
if(r.ok){form.hidden=true;thanks.hidden=false;track('subscribe');}
else{form.submit();}
})
.catch(function(){form.submit();});
});
})();

// Post pages: chapter rail + chips (click-to-scroll, scroll-spy).
// Each page is one piece now, so the links scope to the whole document.
(function(){
var links=Array.prototype.slice.call(document.querySelectorAll('a[data-target]'));
if(links.length){
// Chapter bar: keep the active chip in view. The bar scrolls sideways with
// its scrollbar hidden, so an off-screen active chip simply vanishes. Center
// the chip whenever the active chapter changes — but hands off while a
// finger is on the bar, and no animation for reduced-motion readers.
// Scrolls the bar element only (never scrollIntoView, which can drag the
// page along with it).
var bar=document.querySelector('.mobile-jump ul');
var barHeld=false,holdT,quietUntil=0;
// The browser's native smooth scroll is brisk; the bar deserves the site's
// calmer pace. Glide with a sine ease over a distance-scaled duration, so
// short nudges stay quick and long moves settle in gently. A newer glide,
// or a finger on the bar, supersedes the one in flight.
var glideId=0;
function glideBar(to){
var from=bar.scrollLeft,dist=to-from;
if(Math.abs(dist)<2){bar.scrollLeft=to;return;}
var dur=Math.min(700,Math.max(320,Math.abs(dist)*1.1));
var start=null,id=++glideId;
function step(ts){
if(id!==glideId)return;
if(start===null)start=ts;
var p=Math.min(1,(ts-start)/dur);
bar.scrollLeft=from+dist*(0.5-0.5*Math.cos(Math.PI*p));
if(p<1)requestAnimationFrame(step);
}
requestAnimationFrame(step);
}
if(bar){
['touchstart','pointerdown'].forEach(function(ev){
bar.addEventListener(ev,function(){barHeld=true;clearTimeout(holdT);glideId++;},{passive:true});
});
['touchend','touchcancel','pointerup','pointercancel'].forEach(function(ev){
bar.addEventListener(ev,function(){clearTimeout(holdT);holdT=setTimeout(function(){barHeld=false;},400);},{passive:true});
});
}
function centerChip(target,force){
if(!bar)return;
if(!force&&(barHeld||Date.now()<quietUntil))return;
var chip=bar.querySelector('a[data-target="'+target+'"]');
if(!chip)return;
var br=bar.getBoundingClientRect(),cr=chip.getBoundingClientRect();
if(!br.width)return; // bar is display:none (desktop)
var left=bar.scrollLeft+(cr.left-br.left)-(br.width-cr.width)/2;
left=Math.max(0,Math.min(left,bar.scrollWidth-bar.clientWidth));
var smooth=!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
if(smooth){glideBar(left);}
else{bar.scrollLeft=left;}
}
function go(link,e){
if(e)e.preventDefault();
var t=document.getElementById(link.getAttribute('data-target'));
if(!t)return;
var offset=navOffset();
var jump=document.querySelector('.mobile-jump');
if(jump&&getComputedStyle(jump).display!=='none')offset+=jump.getBoundingClientRect().height;
window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-offset,behavior:'smooth'});
// Center the destination chip now rather than letting the spy chase the
// page through every chapter in between; keep the spy's hands off the bar
// while the page glides.
centerChip(link.getAttribute('data-target'),true);
quietUntil=Date.now()+900;
}
links.forEach(function(l){
l.setAttribute('tabindex','0');
l.setAttribute('role','link');
l.addEventListener('click',function(e){go(l,e);});
l.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')go(l,e);});
});
var lastActive=null;
function spy(){
var trigger=window.innerHeight*0.3,active=null;
links.forEach(function(l){
var t=document.getElementById(l.getAttribute('data-target'));
if(t&&t.getBoundingClientRect().top<=trigger)active=l.getAttribute('data-target');
});
links.forEach(function(l){l.classList.toggle('active',l.getAttribute('data-target')===active);});
if(active!==lastActive){
lastActive=active;
if(active)centerChip(active,false);
}
}
window.addEventListener('scroll',spy,{passive:true});
// Run once on load: a reader arriving mid-page (restored scroll, hash link)
// should find the bar already pointing at the right chapter.
spy();
}
// Hrefless onclick anchors: keyboard access + link semantics
document.querySelectorAll('a[onclick]:not([href])').forEach(function(l){
l.setAttribute('tabindex','0');
l.setAttribute('role','link');
l.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();l.click();}});
});
})();
