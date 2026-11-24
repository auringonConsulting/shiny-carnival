/* Looping film paint for a page band (used on the 404 page). Add data-paint to an empty, positioned element.
   Same paint as the homepage intro, on a slow endless drift. Stops while the tab is hidden; reduced motion gets one still frame. */
(function(){'use strict';var d=document,host=d.querySelector('[data-paint]');if(!host)return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var MOTTLE=0.44,BLUR=0.0030,RIM=0.26,MEANDER=1.0,LAG=0.16,SWELL=0.06,FLOW=0.012,SURGE=4,ROT=false;
var I={dead:false},nodes=[];function guard(fn){return function(){try{return fn.apply(this,arguments)}catch(e){I.dead=true}}}
// a slow tide: the paint drifts, gathers a little speed about every twelve seconds, and eases off again
var CURVE={speed:function(T){var s=0.5+0.5*Math.sin(T*0.52-1.2);return FLOW*(1+SURGE*s*s*s)},deep:function(){return 0.55}};
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
 function size(lazy){var r=host.getBoundingClientRect();var iw=Math.min(540,Math.max(330,Math.round(r.width*0.37)));
  cv.width=Math.round(iw*1.08);cv.height=Math.round(iw*r.height/r.width*1.08);
  cv.style.cssText='position:absolute;left:-4%;top:-4%;width:108%;height:108%';  // no CSS blur: the canvas is drawn small and scaled up, which softens it for free
  ROT=r.height>r.width*1.1;var vw=ROT?cv.height:cv.width,vh=ROT?cv.width:cv.height,sc=Math.max(vw/1.08/W,vh/1.08/H0);S=sc;ox=(vw-W*sc)/2;oy=(vh-H0*sc)*(ROT?0.5:0.4);PADN=Math.ceil(170*S);
  NQ=Math.min(1,560/(W*S+2*PADN));NW=Math.ceil(W*S)+2*PADN;NH=Math.ceil(H0*S)+2*PADN;
  NOISE=[];if(!lazy)WASHES.forEach(function(w,i){mk(i)})}
 function mk(i){var w=WASHES[i];NOISE[i]=noise(Math.ceil(NW*NQ),Math.ceil(NH*NQ),w.c,w.alpha,(i+1)*9973)}
 function draw(f,deep,T,sw){if(deep==null)deep=1;T=T||0;sw=sw||0;ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='rgb(241,242,218)';ctx.fillRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='multiply';if(ROT)ctx.setTransform(0,1,-1,0,cv.width,0);
  for(var i=0;i<WASHES.length;i++){var w=WASHES[i],tau=TAU*(PH[i]==null?f:PH[i]),osc=function(k,p,a){return a*(Math.sin(k*tau+p)-Math.sin(p))};
   var mg=MEANDER*(w.deepen?0.5:1),dx=osc(w.k[0],w.p[0],w.drift[0])+mg*15*wob(i,0,T),dy=osc(w.k[1],w.p[1],w.drift[1])+mg*11*wob(i,1,T),sr=1+osc(1,w.p[2],w.breathe*1.5)+mg*0.022*wob(i,2,T)+SWELL*sw*(w.deepen?0.4:0.7+0.6*((i*37)%7)/6),rot=w.rot+osc(1,w.p[3],w.spin)+mg*0.045*wob(i,3,T),cr=Math.cos(rot),sn=Math.sin(rot);
   var cx=(w.cx+dx)*S+ox,cy=(w.cy+dy)*S+oy;ctx.beginPath();
   var cp=[];for(var m=0;m<5;m++)cp[m]=w.phs[m]+w.mph[m]*tau+mg*0.42*wob(i,4+m,T);
   for(var j=0;j<N;j++){var th=TAU*j/N,r=1;for(var m=0;m<5;m++)r+=w.amps[m]*Math.sin(KS[m]*th+cp[m]);
    var x=Math.cos(th)*r*w.rx*sr*S,y=Math.sin(th)*r*w.ry*sr*S,px=x*cr-y*sn+cx,py=x*sn+y*cr+cy;if(j)ctx.lineTo(px,py);else ctx.moveTo(px,py)}
   ctx.closePath();ctx.fillStyle='rgb('+w.c[0]+','+w.c[1]+','+w.c[2]+')';ctx.globalAlpha=Math.min(0.97,w.alpha+w.deepen*deep)*(1-GR);ctx.fill();
   ctx.save();ctx.clip();ctx.globalAlpha=1;if(NOISE[i])ctx.drawImage(NOISE[i],dx*S+ox-PADN,dy*S+oy-PADN,NW,NH);
   ctx.strokeStyle=ctx.fillStyle;ctx.lineJoin='round';ctx.globalAlpha=w.alpha*0.2;ctx.lineWidth=w.soft*5.2*S;ctx.stroke();ctx.lineWidth=w.soft*2.4*S;ctx.stroke();if(RIM>0&&!LITE){ctx.globalAlpha=w.alpha*RIM;ctx.lineWidth=7*S;ctx.stroke()}ctx.restore()}
  // cheap softening inside the canvas (replaces the CSS blur, which made the browser re-blur the whole screen every frame)
  ctx.setTransform(1,0,0,1,0,0);if(BLUR>0&&!LITE){ctx.globalCompositeOperation='source-over';var o=Math.max(1,cv.width*BLUR*0.9);ctx.globalAlpha=0.5;ctx.drawImage(cv,o,0);ctx.drawImage(cv,0,o);ctx.globalAlpha=0.34;ctx.drawImage(cv,-o,-o);ctx.globalAlpha=0.25;ctx.drawImage(cv,o,-o)}}
 var WR=rngf(4177),WF=[],WP=[];for(var wi=0;wi<WASHES.length*18;wi++){WF.push(0.55+WR()*1.5);WP.push(WR()*TAU)}
 function wob(i,c,T){var k=(i*9+c)*2;return 0.62*Math.sin(T*WF[k]+WP[k])+0.38*Math.sin(T*WF[k+1]*1.9+WP[k+1])-(0.62*Math.sin(WP[k])+0.38*Math.sin(WP[k+1]))*Math.exp(-T*1.5)}
 var LITE=false,FN=0,FS=0,ph=f0,last=0,TL=0,SW=0,PH=[],AMAX=0;WASHES.forEach(function(w){AMAX=Math.max(AMAX,w.rx*w.ry)});
 var TAUS=WASHES.map(function(w){return 0.03+LAG*Math.sqrt(w.rx*w.ry/AMAX)});WASHES.forEach(function(w,i){PH[i]=f0});CURVE=CURVE||curves();
 var loop=guard(function(now){if(!on)return;if(!ts){ts=now;last=now}var raw=(now-last)/1000,dt=Math.min(0.05,raw);last=now;var T=(now-ts)/1000;if(FN<14){if(FN>1)FS+=raw;if(++FN===14&&FS/12>0.034)LITE=true}ph+=CURVE.speed(T)*dt;for(var i=0;i<PH.length;i++)PH[i]+=(ph-PH[i])*(LAG>0?1-Math.exp(-dt/TAUS[i]):1);TL=T;SW+=((Math.max(-0.3,Math.min(1,(CURVE.speed(T)-FLOW)/(FLOW*SURGE))))-SW)*(1-Math.exp(-dt/0.12));draw(ph,CURVE.deep(T),T,SW);raf=requestAnimationFrame(loop)});
 size(true);
 var ready=new Promise(function(res,rej){var i=0;(function step(){if(I.dead){res();return}try{mk(i)}catch(e){rej(e);return}if(++i<WASHES.length)setTimeout(step,0);else{try{draw(f0,0)}catch(e){rej(e);return}res()}})()});
 return{ready:ready,start:function(){on=true;raf=requestAnimationFrame(loop)},stop:function(){on=false;cancelAnimationFrame(raf)},resize:guard(function(){size();draw(ph,1,TL,SW)})}}

try{var p=livePaint(host);p.ready.then(function(){host.classList.add('is-painted');if(!reduce)p.start()},function(){});
 d.addEventListener('visibilitychange',function(){if(reduce||I.dead)return;if(d.hidden)p.stop();else p.start()});
 var rt=0,w0=innerWidth;window.addEventListener('resize',function(){if(innerWidth===w0)return;w0=innerWidth;clearTimeout(rt);rt=setTimeout(p.resize,200)})}catch(e){}
})();
