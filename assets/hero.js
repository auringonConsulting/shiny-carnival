// Homepage intro. Plays once per browser session, on the homepage only.
//
// What happens: film paint drifts across the hero with no menu bar. "From intent", then
// "to operation.", appear over it; then the logo, stacked (mark above the name). The name
// rises to the menu bar while the mark swings round to its left, the paint fades, and the
// page arrives: ground line, stone outlines, sun, headline, paragraph, then the stones
// fill with color, then the menu. After that everything here stops and is removed.
//
// Classes on <html> (set by the small script in the <head> of index.html):
//   intro-on    first visit this session, intro playing
//   intro-seen  settled page (later visits, after the intro, and what every failure falls back to)
// No class (intro switched off, no JavaScript, reduced motion): the plain page.
//
// Safety: every entry point runs inside guard(); any error calls fail(), which cancels
// everything and shows the settled page. The <head> script has its own timers that do the
// same without this file.
(function(){
var d=document,root=d.documentElement,I=window.__intro;
if(!I||I.dead||!root.classList.contains('intro-on'))return;

// ================= SETTINGS: the numbers worth changing =================
var PAINT='live';      // 'live' = paint drawn in the browser; 'clip' = assets/intro-paint.mp4
var FLOW=0.022;        // live paint: drift speed while words are up (loops per second): nearly at rest
var SMOOTH=0.15;       // seconds of smoothing on the speed curve (the film uses 0.15)
var MEANDER=1.0;       // small wandering of each wash on its own slow clock: position, turn, size and the shape of its edge (0 = none)
var LAG=0.16;          // seconds the heaviest wash trails the lightest when the paint speeds up or settles (0 = all move as one)
var SWELL=0.10;        // how much each wash expands during a sweep and draws back in as the words land (0 = none)
var RECOIL=0.20;       // after each sweep the paint carries a little too far and eases back before it rests (0 = none)
var SURGE=15;         // how much faster it moves when no words are up. The launch film runs about
                       // 0.26 loops/s between words and 0.03-0.05 under them: a quick sweep, then a pause.
                       // 0 = one steady speed. The words below are spaced so each sweep has room to happen.
var W1=[0.80,1.70];    // "From intent": [appears, starts to leave], seconds
var W2=[2.70,3.60];    // "to operation."
var LOGO_IN=4.60;      // stacked logo appears
var LIFT=5.45;         // logo lifts off; the handover below is timed from here
var FLY=1.0;           // logo's travel time to the menu bar
var RISE=12;            // pixels a phrase rises as it settles (the film uses 22 on a larger frame)
var DEV=0.40,OUT=0.30; // a phrase's develop-in and fade-out
// Handover, seconds after LIFT: [start, duration] (stones: [start, gap between stones, duration])
var H={dry:[0.05,0.85],line:[0.55,0.70],outline:[0.70,0.09,0.45],sun:[0.85,0.95],
       h1:[1.10,0.60],sub:[1.30,0.70],seats:[1.50,0.70],menu:[2.35,0.60],
       fill:[1.95,0.07,0.45],cue:[2.40,0.70],
       rest:[2.40,0.70]};  // the page below the hero, hidden while the paint fills the screen
var TAIL=3.2;          // seconds after LIFT when everything is finished and removed
var BLUR=0.0030;       // softness over the whole paint, as a share of the width (was 0.0042)
var RIM=0.26;          // darker edge where pigment pools at the rim of each wash (0 = none)
var GRAIN=0.30;        // film grain strength over the paint (0 = none)
var TYPE_GRAIN=0.22;   // grain over the words and logo, so they sit in the film (0 = none)
var MOTTLE=0.44;       // how blotchy the dried paint is (0 = flat color)
var BACKER=0.55;       // the paint deepens behind the words while they are up (0 = none)
var LOBES=[ // ph: which phrase; x,y: offset from the centre (shares of the light's box); w,h: size; pk: strength; d: delay (s);
            // tau: how slowly it dims; mx,my: how far it drifts outward; out: flare as the phrase leaves; r: its shape
 {ph:0,x:-0.20,y:-0.10,w:0.74,h:1.05,pk:1.00,d:0.00,tau:0.50,mx:-0.07,my:-0.05,out:0.30,r:'58% 42% 47% 53%/52% 60% 40% 48%'},
 {ph:0,x: 0.24,y: 0.14,w:0.50,h:0.78,pk:0.42,d:0.14,tau:0.34,mx: 0.05,my: 0.03,out:0.60,r:'41% 59% 55% 45%/60% 43% 57% 40%'},
 {ph:0,x: 0.03,y: 0.02,w:0.62,h:0.62,pk:0.46,d:0.02,tau:0.75,mx: 0.01,my: 0.00,out:0.20,r:'52% 48% 50% 50%/56% 50% 50% 44%'},  // directly behind the words
 {ph:1,x: 0.22,y: 0.08,w:0.80,h:1.10,pk:0.92,d:0.03,tau:0.58,mx: 0.08,my: 0.02,out:0.25,r:'45% 55% 60% 40%/48% 40% 60% 52%'},
 {ph:1,x:-0.26,y:-0.16,w:0.44,h:0.70,pk:0.36,d:0.20,tau:0.30,mx:-0.04,my:-0.06,out:0.70,r:'60% 40% 44% 56%/42% 58% 46% 54%'},
 {ph:1,x: 0.02,y: 0.30,w:0.36,h:0.50,pk:0.24,d:0.09,tau:0.42,mx: 0.00,my: 0.07,out:0.00,r:'50% 50% 42% 58%/55% 45% 55% 45%'}];
 LOBES.push({ph:1,x:-0.02,y:0.00,w:0.66,h:0.60,pk:0.42,d:0.05,tau:0.70,mx:-0.01,my:0.01,out:0.20,r:'48% 52% 52% 48%/50% 56% 44% 50%'});  // directly behind the words
var GLOW=0.85;         // warm light that swells under each phrase as it develops (0 = none)
var FONT_WAIT=0.5,PAINT_WAIT=1.0; // longest waits before starting (font) or giving up (paint)
// ========================================================================
try{var qm=/[?&]paint=(live|clip)\b/.exec(location.search);if(qm)PAINT=qm[1]}catch(e){}
if(window.__introPaint)PAINT=window.__introPaint;

var q=function(s){return d.querySelector(s)},qa=function(s){return [].slice.call(d.querySelectorAll(s))};
var hero=q('.hero'),wash=q('.arrival-wash'),nav=q('nav.top'),navA=q('nav.top .wordmark'),navS=navA&&navA.querySelector('svg');
var anims={word:[],fly:[],hand:[]},timers=[],nodes=[],paint=null,t0=0,ended=false,lifted=false,headBail=I.bail;
function stopAll(){ended=true;['word','fly','hand'].forEach(function(k){anims[k].forEach(function(a){try{a.cancel()}catch(e){}});anims[k]=[]});
 timers.forEach(clearTimeout);timers=[];try{if(paint)paint.stop()}catch(e){}
 nodes.forEach(function(n){try{if(n.parentNode)n.parentNode.removeChild(n)}catch(e){}});nodes=[];
 try{if(nav)nav.inert=false;if(navA)navA.style.opacity='';if(wash)wash.style.height=''}catch(e){}}
I.bail=function(){try{stopAll()}catch(e){}headBail()};       // the head script's timers now clean up after us too
function fail(){I.bail()}
function guard(fn){return function(){if(I.dead)return;try{return fn.apply(this,arguments)}catch(e){fail()}}}
if(!hero||!wash||!nav||!navS||!hero.animate){fail();return}
I.started=true;

function A(group,el,kf,dur,delay,easing){var a=el.animate(kf,{duration:dur*1000,delay:delay*1000,easing:easing||'linear',fill:'both'});anims[group].push(a);return a}
function later(fn,sec){timers.push(setTimeout(guard(fn),sec*1000))}
function node(tag,cls,parent){var e=d.createElement(tag);e.className=cls;(parent||d.body).appendChild(e);nodes.push(e);return e}
function ease3(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function sstep(x){x=x<0?0:x>1?1:x;return x*x*(3-2*x)}
// The paint's speed, as in the launch film's code: it brakes quickly as a phrase lands (quartic ease-out),
// lets go gently as the phrase leaves (quadratic ease-in), and the whole curve is smoothed so there are no corners.
var CURVE=null;
function curves(){var DT=0.01,n=Math.ceil((LIFT+3)/DT),sp=new Float32Array(n),dp=new Float32Array(n),WIN=[[W1[0],W1[1]],[W2[0],W2[1]],[LOGO_IN,LIFT+0.1]];
 function env(t,a,b,tin,tout){if(t<a)return 0;if(t<a+tin){var x=1-(t-a)/tin;return 1-x*x*x*x}if(t<b)return 1;if(t<b+tout){var y=(t-b)/tout;return 1-y*y}return 0}
 for(var i=0;i<n;i++){var t=i*DT,m=0,m2=0;WIN.forEach(function(w){m=Math.max(m,env(t,w[0]-0.08,w[1],0.6,0.45));m2=Math.max(m2,env(t,w[0]-0.5,w[1]+0.3,0.6,0.4))});
  var rc=0;WIN.forEach(function(w){var z=(t-(w[0]+0.34))/0.13;rc+=Math.exp(-z*z)});sp[i]=FLOW*(1+SURGE*Math.pow(1-m,1.5))-RECOIL*FLOW*SURGE*rc;dp[i]=m2}
 function blur(a,sig){var r=Math.ceil(sig*3),k=[],ks=0,o=new Float32Array(a.length);for(var j=-r;j<=r;j++){var v=Math.exp(-j*j/(2*sig*sig));k.push(v);ks+=v}
  for(var i=0;i<a.length;i++){var acc=0;for(var j=-r;j<=r;j++){var q=i+j;q=q<0?0:q>=a.length?a.length-1:q;acc+=a[q]*k[j+r]}o[i]=acc/ks}return o}
 sp=blur(sp,SMOOTH/DT);dp=blur(dp,0.22/DT);
 function at(a,t){var x=t/DT,i=Math.floor(x);if(i<0)return a[0];if(i>=n-1)return a[n-1];return a[i]+(a[i+1]-a[i])*(x-i)}
 return{speed:function(t){return at(sp,t)},deep:function(t){return Math.min(1,1.3*at(dp,t))}}}

// ---------------- the paint ----------------
var WASHES=[{"cx": 85, "cy": 60, "rx": 195, "ry": 145, "c": [123, 157, 163], "rot": 0.6, "alpha": 0.38, "soft": 10, "edge": 0.5, "drift": [120, 70], "k": [1, 2], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.14349, 0.10721, 0.06287, 0.04808, 0.05112], "phs": [5.2149, 1.4091, 1.0557, 0.3372, 5.008], "mph": [-2, 2, -2, -2, 2], "p": [0.2792, 6.0363, 4.2255, 3.5559, 4.5873]}, {"cx": 330, "cy": 215, "rx": 340, "ry": 255, "c": [188, 97, 49], "rot": 0.5, "alpha": 0.5, "soft": 7, "edge": 0.5, "drift": [110, 55], "k": [1, 1], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.1685, 0.08992, 0.10174, 0.04257, 0.04068], "phs": [4.8181, 2.1384, 1.2707, 5.7752, 5.4369], "mph": [-1, 2, -1, -1, -2], "p": [2.2029, 6.1381, 3.3985, 4.7981, 0.2682]}, {"cx": 960, "cy": 215, "rx": 360, "ry": 285, "c": [154, 78, 39], "rot": 0.9, "alpha": 0.46, "soft": 7, "edge": 0.5, "drift": [95, 60], "k": [1, 1], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.17013, 0.04683, 0.0923, 0.06217, 0.02759], "phs": [3.3755, 4.2135, 0.3283, 5.6468, 2.8588], "mph": [1, -2, -2, 1, 1], "p": [2.6664, 4.9855, 2.5351, 3.8271, 1.4112]}, {"cx": 30, "cy": 665, "rx": 290, "ry": 220, "c": [128, 130, 104], "rot": 0.8, "alpha": 0.46, "soft": 7, "edge": 0.5, "drift": [150, 80], "k": [1, 2], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.18302, 0.0831, 0.07891, 0.07851, 0.06667], "phs": [0.1383, 4.8928, 4.6076, 5.7508, 0.311], "mph": [-1, -1, 2, 1, 1], "p": [3.9193, 4.9787, 2.3498, 2.1216, 5.7269]}, {"cx": 420, "cy": 625, "rx": 335, "ry": 250, "c": [188, 97, 49], "rot": 0.3, "alpha": 0.5, "soft": 7, "edge": 0.5, "drift": [130, 50], "k": [1, 1], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.11708, 0.05768, 0.04368, 0.07087, 0.05964], "phs": [5.7991, 1.1208, 1.6353, 1.8844, 3.2183], "mph": [-2, 2, 1, -2, 1], "p": [3.3711, 3.0173, 0.3305, 6.1913, 4.0471]}, {"cx": 1060, "cy": 610, "rx": 320, "ry": 250, "c": [233, 194, 137], "rot": -0.6, "alpha": 0.58, "soft": 7, "edge": 0.5, "drift": [120, 75], "k": [1, 2], "breathe": 0.07, "spin": 0.12, "deepen": 0, "amps": [0.0685, 0.09166, 0.09622, 0.0421, 0.05717], "phs": [2.8144, 0.7261, 3.1804, 3.6373, 0.1604], "mph": [-1, 1, 1, -1, -1], "p": [1.4567, 1.412, 0.1536, 2.9288, 5.2656]}, {"cx": 600, "cy": 328, "rx": 540, "ry": 225, "c": [154, 78, 39], "rot": 0.03, "alpha": 0.46, "soft": 10, "edge": 0.5, "drift": [55, 14], "k": [1, 2], "breathe": 0.04, "spin": 0.05, "deepen": 0.28, "amps": [0.0693, 0.08622, 0.03443, 0.02913, 0.04559], "phs": [4.7319, 3.6521, 1.3091, 0.0408, 3.4578], "mph": [-1, -2, 1, 1, -1], "p": [4.8036, 4.2453, 3.9668, 4.3293, 2.4273]}];
function livePaint(host){ // seven translucent washes, redrawn every frame at one steady speed
 var TAU=Math.PI*2,KS=[2,3,4,5,6],N=110,W=1200,H0=630,GR=MOTTLE,cv=d.createElement('canvas'),ctx=cv.getContext('2d'),S,ox,oy,PADN,NOISE=[],NQ=1,NW=0,NH=0,raf=0,on=false,pt=[0,0],f0=0.02,ts=0;
 if(!ctx)throw new Error('no canvas');host.appendChild(cv);nodes.push(cv);
 function rngf(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
 function noise(cw,ch,col,alpha,seed){var c=d.createElement('canvas');c.width=cw;c.height=ch;var rnd=rngf(seed);
  function grid(step){var gw=Math.ceil(cw/step)+2,gh=Math.ceil(ch/step)+2,g=new Float32Array(gw*gh);for(var i=0;i<g.length;i++)g[i]=rnd()*2-1;return{g:g,gw:gw,step:step}}
  function samp(G,x,y){var fx=x/G.step,fy=y/G.step,ix=Math.floor(fx),iy=Math.floor(fy),u=fx-ix,v=fy-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);var g=G.g,gw=G.gw,i=iy*gw+ix;return (g[i]*(1-u)+g[i+1]*u)*(1-v)+(g[i+gw]*(1-u)+g[i+gw+1]*u)*v}
  var G1=grid(78*S*NQ),G2=grid(40*S*NQ),G3=grid(Math.max(3,11*S*NQ)),n=new Float32Array(cw*ch),sum=0,sq=0,i=0;
  for(var y=0;y<ch;y++)for(var x=0;x<cw;x++){var val=samp(G1,x,y)+0.5*samp(G2,x,y)+0.38*samp(G3,x,y);n[i++]=val;sum+=val;sq+=val*val}
  var mean=sum/n.length,sd=Math.sqrt(sq/n.length-mean*mean),id=c.getContext('2d').createImageData(cw,ch),dd=id.data,amin=alpha*(1-GR);
  for(i=0;i<n.length;i++){var z=(n[i]-mean)/sd;z=Math.max(-1.6,Math.min(1.6,z));var Al=Math.min(0.97,alpha*(1+GR*z/1.6*1.15)),beta=Math.max(0,(Al-amin)/(1-amin));
   dd[i*4]=col[0];dd[i*4+1]=col[1];dd[i*4+2]=col[2];dd[i*4+3]=Math.round(beta*255)}
  c.getContext('2d').putImageData(id,0,0);return c}
 function size(){var r=host.getBoundingClientRect();var iw=Math.min(540,Math.max(330,Math.round(r.width*0.37)));
  cv.width=Math.round(iw*1.08);cv.height=Math.round(iw*r.height/r.width*1.08);
  cv.style.cssText='position:absolute;left:-4%;top:-4%;width:108%;height:108%';  // no CSS blur: the canvas is drawn small and scaled up, which softens it for free
  var sc=Math.max(iw/W,(iw*r.height/r.width)/H0);S=sc;ox=(cv.width-W*sc)/2;oy=(cv.height-H0*sc)*0.4;PADN=Math.ceil(170*S);
  NQ=Math.min(1,560/(W*S+2*PADN));NW=Math.ceil(W*S)+2*PADN;NH=Math.ceil(H0*S)+2*PADN;
  NOISE=WASHES.map(function(w,i){return noise(Math.ceil(NW*NQ),Math.ceil(NH*NQ),w.c,w.alpha,(i+1)*9973)})}
 function draw(f,deep,T,sw){if(deep==null)deep=1;T=T||0;sw=sw||0;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='rgb(241,242,218)';ctx.fillRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='multiply';
  for(var i=0;i<WASHES.length;i++){var w=WASHES[i],tau=TAU*(PH[i]==null?f:PH[i]),osc=function(k,p,a){return a*(Math.sin(k*tau+p)-Math.sin(p))};
   var mg=MEANDER*(w.deepen?0.5:1),dx=osc(w.k[0],w.p[0],w.drift[0])+mg*15*wob(i,0,T),dy=osc(w.k[1],w.p[1],w.drift[1])+mg*11*wob(i,1,T),sr=1+osc(1,w.p[2],w.breathe*1.5)+mg*0.022*wob(i,2,T)+SWELL*sw*(w.deepen?0.4:0.7+0.6*((i*37)%7)/6),rot=w.rot+osc(1,w.p[3],w.spin)+mg*0.045*wob(i,3,T),cr=Math.cos(rot),sn=Math.sin(rot);
   var cx=(w.cx+dx)*S+ox,cy=(w.cy+dy)*S+oy;ctx.beginPath();
   var cp=[];for(var m=0;m<5;m++)cp[m]=w.phs[m]+w.mph[m]*tau+mg*0.42*wob(i,4+m,T);
   for(var j=0;j<N;j++){var th=TAU*j/N,r=1;for(var m=0;m<5;m++)r+=w.amps[m]*Math.sin(KS[m]*th+cp[m]);
    var x=Math.cos(th)*r*w.rx*sr*S,y=Math.sin(th)*r*w.ry*sr*S,px=x*cr-y*sn+cx,py=x*sn+y*cr+cy;if(j)ctx.lineTo(px,py);else ctx.moveTo(px,py)}
   ctx.closePath();ctx.fillStyle='rgb('+w.c[0]+','+w.c[1]+','+w.c[2]+')';ctx.globalAlpha=Math.min(0.97,w.alpha+w.deepen*deep)*(1-GR);ctx.fill();
   ctx.save();ctx.clip();ctx.globalAlpha=1;ctx.drawImage(NOISE[i],dx*S+ox-PADN,dy*S+oy-PADN,NW,NH);
   ctx.strokeStyle=ctx.fillStyle;ctx.lineJoin='round';ctx.globalAlpha=w.alpha*0.2;ctx.lineWidth=w.soft*5.2*S;ctx.stroke();ctx.lineWidth=w.soft*2.4*S;ctx.stroke();if(RIM>0){ctx.globalAlpha=w.alpha*RIM;ctx.lineWidth=7*S;ctx.stroke()}ctx.restore()}
  // cheap softening inside the canvas (replaces the CSS blur, which made the browser re-blur the whole screen every frame)
  if(BLUR>0){ctx.globalCompositeOperation='source-over';var o=Math.max(1,cv.width*BLUR*0.9);ctx.globalAlpha=0.5;ctx.drawImage(cv,o,0);ctx.drawImage(cv,0,o);ctx.globalAlpha=0.34;ctx.drawImage(cv,-o,-o);ctx.globalAlpha=0.25;ctx.drawImage(cv,o,-o)}}
 var WR=rngf(4177),WF=[],WP=[];for(var wi=0;wi<WASHES.length*18;wi++){WF.push(0.55+WR()*1.5);WP.push(WR()*TAU)}
 function wob(i,c,T){var k=(i*9+c)*2;return 0.62*Math.sin(T*WF[k]+WP[k])+0.38*Math.sin(T*WF[k+1]*1.9+WP[k+1])-(0.62*Math.sin(WP[k])+0.38*Math.sin(WP[k+1]))*Math.exp(-T*1.5)}
 var ph=f0,last=0,TL=0,SW=0,PH=[],AMAX=0;WASHES.forEach(function(w){AMAX=Math.max(AMAX,w.rx*w.ry)});
 var TAUS=WASHES.map(function(w){return 0.03+LAG*Math.sqrt(w.rx*w.ry/AMAX)});WASHES.forEach(function(w,i){PH[i]=f0});CURVE=CURVE||curves();
 var loop=guard(function(now){if(!on)return;if(!ts){ts=now;last=now}var dt=Math.min(0.05,(now-last)/1000);last=now;var T=(now-ts)/1000;ph+=CURVE.speed(T)*dt;for(var i=0;i<PH.length;i++)PH[i]+=(ph-PH[i])*(LAG>0?1-Math.exp(-dt/TAUS[i]):1);TL=T;SW+=((Math.max(-0.3,Math.min(1,(CURVE.speed(T)-FLOW)/(FLOW*SURGE))))-SW)*(1-Math.exp(-dt/0.12));draw(ph,CURVE.deep(T),T,SW);raf=requestAnimationFrame(loop)});
 size();draw(f0,0);
 return{ready:Promise.resolve(),start:function(){on=true;raf=requestAnimationFrame(loop)},stop:function(){on=false;cancelAnimationFrame(raf)},resize:guard(function(){size();draw(ph,1,TL,SW)})}}
function clipPaint(host){ // a short clip rendered from the launch film's own code
 var v=d.createElement('video');v.muted=true;v.playsInline=true;v.setAttribute('playsinline','');v.setAttribute('muted','');v.preload='auto';
 v.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover';v.src=window.__introClip||'/assets/intro-paint.mp4';host.appendChild(v);nodes.push(v);
 var ready=new Promise(function(res,rej){v.addEventListener('canplay',res,{once:true});v.addEventListener('error',rej,{once:true})});
 return{ready:ready,start:function(){var p=v.play();if(p&&p.catch)p.catch(fail)},stop:function(){try{v.pause()}catch(e){}},resize:function(){}}}

// ---------------- layout ----------------
var VBW=951.11,VBH=153.43,LX=195.9,LY=24.87,LW=VBW-LX,LH=98.26;
function geom(){var hr=hero.getBoundingClientRect();wash.style.height=Math.max(hr.bottom+window.scrollY,window.innerHeight)+'px';
 var phone=innerWidth<700,SW=phone?innerWidth*0.62:Math.min(innerWidth*0.3,400),M0=SW*0.38,gap=SW*0.06,Lh0=SW*LH/LW;
 var cy=hr.top+hr.height*(phone?0.47:0.44),top=cy-(M0+gap+Lh0)/2,cx=innerWidth/2,R=navS.getBoundingClientRect(),k=R.width/VBW;
 return{cy:cy-hr.top,L0:{x:cx-SW/2,y:top+M0+gap,w:SW},M0:{w:M0},L1:{x:R.left+LX*k,y:R.top+LY*k,w:LW*k},M1:{w:VBH*k}}}
function logoPath(g){ // the name rises, then glides left; the mark swings from above it to its left side and never crosses the letters
 var N=36,kl=[],km=[];
 for(var i=0;i<=N;i++){var t=i/N,sw=t<0.12?Math.sin(t/0.12*Math.PI)*0.025:0,u=t<0.1?0:(t-0.1)/0.9,ex=ease3(u),ey=1-Math.pow(1-ease3(u),1.5);
  var lw=g.L0.w+(g.L1.w-g.L0.w)*ex,lx=g.L0.x+(g.L1.x-g.L0.x)*ex-g.L0.w*sw/2,ly=g.L0.y+(g.L1.y-g.L0.y)*ey,s=lw/g.L1.w*(1+sw);
  kl.push({transform:'translate('+lx.toFixed(2)+'px,'+ly.toFixed(2)+'px) scale('+s.toFixed(4)+')',offset:t});
  var a=1-Math.pow(1-u,2.4),b=Math.pow(u,2.0),mw=(0.38+(VBH/LW-0.38)*ex)*lw,relx=(0.5+(-(LX-VBH/2)/LW-0.5)*a)*lw;
  var rely0=-(0.06*g.L0.w+g.M0.w/2)/g.L0.w,rely1=(VBH/2-LY)/LW,rely=(rely0+(rely1-rely0)*b)*lw;
  km.push({transform:'translate('+(lx+relx-mw/2).toFixed(2)+'px,'+(ly+rely-mw/2).toFixed(2)+'px) scale('+(mw/g.M1.w*(1+sw)).toFixed(4)+')',offset:t})}
 return{kl:kl,km:km}}

// ---------------- the sequence ----------------
var lobes=[],grain=null,grain2=null,backer=null,glow=null,typeBox=null,pieces=[];
function grainTile(){var c=d.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d'),im=x.createImageData(256,256),s=7;
 function r(){s|=0;s=s+0x6D2B79F5|0;var t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
 for(var i=0;i<im.data.length;i+=4){var g=(r()+r()+r())/3,dv=Math.max(-1,Math.min(1,(g-0.5)*3.0)),lt=dv>0;im.data[i]=lt?255:64;im.data[i+1]=lt?244:42;im.data[i+2]=lt?222:28;im.data[i+3]=Math.abs(dv)*(lt?70:120)}
 x.putImageData(im,0,0);return c.toDataURL()}
function build(){var g=geom();
 paint=(PAINT==='clip'?clipPaint:livePaint)(wash);
 if(GRAIN>0){grain=node('div','film intro-grain',wash);grain.style.backgroundImage='url('+grainTile()+')';grain.style.opacity=GRAIN}
 var hy=hero.getBoundingClientRect().top+window.scrollY+g.cy,bw=Math.min(innerWidth*0.92,Math.max(innerWidth*0.56,620)),bh=Math.max(170,Math.min(innerHeight*0.36,330));
 function spot(cls){var e=node('div',cls,wash);e.style.cssText='left:'+(innerWidth/2-bw/2)+'px;top:'+(hy-bh/2)+'px;width:'+bw+'px;height:'+bh+'px';return e}
 if(BACKER>0)backer=spot('intro-backer');if(GLOW>0)glow=spot('intro-glow');
 // each phrase gets its own uneven light: a strong side and a weaker one, different for the two phrases
 lobes=[];if(GLOW>0)LOBES.forEach(function(L){var e=node('div','intro-glow',wash),w=bw*L.w,h=bh*L.h;
  e.style.cssText='left:'+(innerWidth/2+bw*L.x-w/2)+'px;top:'+(hy+bh*L.y-h/2)+'px;width:'+w+'px;height:'+h+'px;border-radius:'+L.r;lobes.push(e)});
 if(TYPE_GRAIN>0&&grain){grain2=node('div','film intro-grain intro-grain--type',hero);grain2.style.backgroundImage=grain.style.backgroundImage;grain2.style.opacity=TYPE_GRAIN}
 typeBox=node('div','intro-type',hero);typeBox.setAttribute('aria-hidden','true');typeBox.style.setProperty('--ty',g.cy+'px');
 typeBox.innerHTML='<span>From intent</span><span>to operation.</span>';
 var P=[].slice.call(navS.querySelectorAll('path')).map(function(e){return e.getAttribute('d')}),markD=P.pop();
 function piece(vb,inner,w,h){var e=node('div','intro-fly');e.setAttribute('aria-hidden','true');e.style.width=w+'px';e.style.height=h+'px';e.innerHTML='<svg viewBox="'+vb+'" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';return e}
 pieces=[piece('0 0 '+VBH+' '+VBH,'<path d="'+markD+'"/>',g.M1.w,g.M1.w),
         piece(LX+' '+LY+' '+LW+' '+LH,P.map(function(x){return '<path d="'+x+'"/>'}).join(''),g.L1.w,g.L1.w*LH/LW)];
 return g}
function run(g){t0=performance.now();try{clearTimeout(I.wd)}catch(e){}I.wd=setTimeout(function(){if(root.classList.contains('intro-on'))I.bail()},(LIFT+TAIL+1.5)*1000);nav.inert=true;paint.start();
 var p=logoPath(g),END=LIFT+TAIL,E='cubic-bezier(.16,1,.3,1)';
 // paint: in, hold, dry to a trace, gone
 A('hand',wash,[{opacity:0,offset:0},{opacity:1,offset:0.5/END},{opacity:1,offset:(LIFT+H.dry[0])/END},{opacity:0.07,offset:(LIFT+H.dry[0]+H.dry[1])/END},{opacity:0.07,offset:(END-0.9)/END},{opacity:0,offset:1}],END,0);
 if(grain)A('hand',grain,[{opacity:GRAIN,offset:0},{opacity:GRAIN,offset:(LIFT+0.05)/END},{opacity:0,offset:(LIFT+0.9)/END},{opacity:0,offset:1}],END,0);
 if(grain2)A('hand',grain2,[{opacity:TYPE_GRAIN,offset:0},{opacity:TYPE_GRAIN,offset:(LIFT+0.05)/END},{opacity:0,offset:(LIFT+0.7)/END},{opacity:0,offset:1}],END,0);
 // the paint deepens behind the words for as long as words are up: one slow swell, not a pulse
 if(backer)A('hand',backer,[{opacity:0,transform:'scale(.94)',offset:0},{opacity:BACKER,transform:'scale(1)',offset:(W1[0]+0.25)/END},{opacity:BACKER,transform:'scale(1.05)',offset:LIFT/END},{opacity:0,transform:'scale(1.08)',offset:(LIFT+0.7)/END},{opacity:0,transform:'scale(1.08)',offset:1}],END,0,'ease-in-out');
 // warm light under each phrase as it develops, settling to a low glow while it is read
 if(glow){var gl=GLOW*0.3;A('hand',glow,[{opacity:0,transform:'scale(.86)',offset:0},{opacity:0,transform:'scale(.86)',offset:(LOGO_IN-0.25)/END,easing:'cubic-bezier(.3,0,.5,1)'},
   {opacity:GLOW,transform:'scale(.98)',offset:(LOGO_IN+0.07)/END,easing:'cubic-bezier(.1,.6,.3,1)'},{opacity:gl,transform:'scale(1.1)',offset:(LIFT-0.05)/END,easing:'ease-in'},{opacity:gl,transform:'scale(1.12)',offset:LIFT/END,easing:'ease-out'},
   {opacity:GLOW*0.8,transform:'scale(1.2)',offset:(LIFT+0.14)/END},{opacity:0,transform:'scale(1.3)',offset:(LIFT+0.8)/END},{opacity:0,transform:'scale(1.3)',offset:1}],END,0)}
 // phrase light: gathers, blooms fast, then dims on a long tail while drifting outward; a softer flare as the phrase leaves
 lobes.forEach(function(e,i){var L=LOBES[i],w=L.ph?W2:W1,a0=w[0]-0.30+L.d,pk=w[0]+0.06+L.d,ex=w[1]+0.14+L.d*0.5,t1=ex+0.6,n=44,kf=[],bw=e.offsetWidth,bh=e.offsetHeight;
  for(var j=0;j<=n;j++){var t=a0+(t1-a0)*j/n,o;
   if(t<pk){var u=(t-a0)/(pk-a0);o=u*u*u*(u*(6*u-15)+10)}                    // smooth gather, no corner at either end
   else o=0.22+0.78*Math.exp(-(t-pk)/L.tau);                                 // long dimming tail down to a low glow
   var f=Math.exp(-Math.pow((t-ex)/0.17,2)),fade=t>ex?Math.max(0,1-(t-ex)/(t1-ex)):1;o=(o*(t>ex?fade*fade:1)+L.out*f)*L.pk*GLOW;
   var g=t<a0?0:1-Math.exp(-(t-a0)/0.9),sc=0.78+0.5*g;
   kf.push({opacity:Math.min(1,o).toFixed(3),transform:'translate('+(L.mx*bw*g*2).toFixed(1)+'px,'+(L.my*bh*g*2).toFixed(1)+'px) scale('+sc.toFixed(3)+')',offset:j/n})}
  kf[n].opacity=0;A('hand',e,kf,t1-a0,a0)});
 // the two phrases: develop in, hold, fade
 [W1,W2].forEach(function(w,i){var el=typeBox.children[i],dur=w[1]-w[0]+OUT;
  A('word',el,[{opacity:0,filter:'blur(7px) brightness(1.25)',offset:0,easing:'cubic-bezier(.2,.7,.3,1)'},{opacity:1,filter:'blur(0px) brightness(1)',offset:DEV/dur},{opacity:1,filter:'blur(0px) brightness(1)',offset:(w[1]-w[0])/dur,easing:'cubic-bezier(.5,0,.9,.5)'},{opacity:0,filter:'blur(3px) brightness(1)',offset:1}],dur,w[0]);
  A('word',el,[{transform:'translateY('+RISE+'px)'},{transform:'translateY(0)'}],0.7,w[0],'cubic-bezier(.16,1,.3,1)')});
 // the stacked logo: develops in, holds, then travels
 pieces[0].style.transform=p.km[0].transform;pieces[1].style.transform=p.kl[0].transform;
 pieces.forEach(function(e,i){A('word',e,[{opacity:0,filter:'blur(7px) brightness(1.25)'},{opacity:1,filter:'blur(0px) brightness(1)'}],DEV,LOGO_IN);
  A('fly',e,i?p.kl:p.km,FLY,LIFT);
  [].forEach.call(e.querySelectorAll('path'),function(x){A('fly',x,[{fill:'#f1f2da'},{fill:'#3a3a3a'}],0.12,LIFT+FLY*0.42,'linear')})});
 later(function(){lifted=true},LIFT);
 later(function(){navA.style.opacity=1;pieces.forEach(function(e){e.style.display='none'})},LIFT+FLY+0.03);
 // the page
 A('hand',q('.hero .hline'),[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],H.line[1],LIFT+H.line[0],'cubic-bezier(.6,0,.3,1)');
 qa('.hero .stone').forEach(function(s,i){A('hand',s,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],H.outline[2],LIFT+H.outline[0]+i*H.outline[1],'cubic-bezier(.2,.7,.2,1)')});
 var sun=q('.hero .sun');if(sun)A('hand',sun,[{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'none'}],H.sun[1],LIFT+H.sun[0],'cubic-bezier(.3,.2,.2,1)');
 qa('.hero h1 span').forEach(function(e){A('hand',e,[{opacity:0},{opacity:1}],H.h1[1],LIFT+H.h1[0],'ease-out')});
 [['.hero .sub',H.sub],['.hero .seats',H.seats]].forEach(function(x){var e=q(x[0]);if(e)A('hand',e,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],x[1][1],LIFT+x[1][0],E)});
 qa('nav.top ul,.nav-toggle').forEach(function(e){A('hand',e,[{opacity:0},{opacity:1}],H.menu[1],LIFT+H.menu[0],'ease-out')});
 qa('.hero .stone .tintable').forEach(function(e,i){A('hand',e,[{fillOpacity:0},{fillOpacity:1}],H.fill[2],LIFT+H.fill[0]+i*H.fill[1],'ease-out')});
 var cue=q('.hero .cue');if(cue)A('hand',cue,[{opacity:0},{opacity:1}],H.cue[1],LIFT+H.cue[0],'ease');
 qa('.hero ~ *, body > footer').forEach(function(e){A('hand',e,[{opacity:0},{opacity:1}],H.rest[1],LIFT+H.rest[0],'ease-out')});
 later(finish,END+0.05)}
function finish(){if(ended)return;stopAll();root.classList.remove('intro-on');root.classList.add('intro-seen');I.dead=true;try{I.off()}catch(e){}try{sessionStorage.setItem('auringonIntro','1')}catch(e){}}
function skip(){ // any input: get to the page quickly, without anything jumping
 if(ended||I.dead)return;if(!t0){fail();return}
 var now=(performance.now()-t0)/1000,rate=3,left;
 if(now<LIFT){var jump=(LIFT-now)*1000,flew=now>LOGO_IN+DEV;
  anims.word.forEach(function(a){try{a.cancel()}catch(e){}});anims.word=[];if(typeBox)typeBox.style.display='none';
  if(!flew){anims.fly.forEach(function(a){try{a.cancel()}catch(e){}});anims.fly=[];pieces.forEach(function(e){e.style.display='none'});
   anims.hand.push(navA.animate([{opacity:0},{opacity:1}],{duration:300,fill:'both'}))}
  anims.fly.concat(anims.hand).forEach(function(a){try{a.currentTime=(a.currentTime||0)+jump;a.playbackRate=rate}catch(e){}});
  timers.forEach(clearTimeout);timers=[];left=TAIL/rate;
  if(flew)later(function(){navA.style.opacity=1;pieces.forEach(function(e){e.style.display='none'})},FLY/rate+0.03)}
 else{anims.fly.concat(anims.hand).forEach(function(a){try{a.playbackRate=rate}catch(e){}});left=Math.max(0,LIFT+TAIL-now)/rate;timers.forEach(clearTimeout);timers=[];
  if(now<LIFT+FLY)later(function(){navA.style.opacity=1;pieces.forEach(function(e){e.style.display='none'})},(LIFT+FLY-now)/rate+0.03);else{navA.style.opacity=1;pieces.forEach(function(e){e.style.display='none'})}}
 later(finish,left+0.05)}
I.onskip=guard(skip);

var begin=guard(function(){if(ended||t0)return;if(I.skip){fail();return}
 var g=build(),started=false;
 function go(){if(started||ended||I.dead)return;started=true;if(I.skip){fail();return}run(geom())}
 var fonts=(d.fonts&&d.fonts.load)?d.fonts.load('400 80px "Instrument Serif"'):Promise.resolve();
 var fontOrWait=Promise.race([fonts,new Promise(function(r){setTimeout(r,FONT_WAIT*1000)})]);
 Promise.all([paint.ready,fontOrWait]).then(guard(go),guard(fail));
 timers.push(setTimeout(guard(function(){if(!started)fail()}),PAINT_WAIT*1000+FONT_WAIT*1000))});
window.addEventListener('resize',guard(function(){if(t0&&!ended){/* a resize mid-intro: settle rather than misplace the logo */finish()}}));
begin();
})();
