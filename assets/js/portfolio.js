(()=>{
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const lerp=(a,b,t)=>a+(b-a)*t;
 const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
 const root=document.documentElement, motion=matchMedia('(prefers-reduced-motion: reduce)');
 let reduce=motion.matches;
 const setIfChanged=(el,k,v)=>{if(el.style.getPropertyValue(k)!==String(v))el.style.setProperty(k,v)};
 const cursor=document.querySelector('.cursor-glow');
 // Preserve the original .16 easing, but stop scheduling frames once the
 // pointer settles. Resume only on pointer input or media/visibility changes.
 const finePointer=matchMedia('(pointer:fine)');
 let cursorFrame=0,x=-30,y=-30,px=-30,py=-30;
 const follow=()=>{
  cursorFrame=0;
  if(reduce||!finePointer.matches||document.hidden)return;
  px+=(x-px)*.16;py+=(y-py)*.16;
  cursor.style.left=px+'px';cursor.style.top=py+'px';
  if(Math.abs(x-px)+Math.abs(y-py)>.01)cursorFrame=requestAnimationFrame(follow);
 };
 const requestCursor=()=>{if(cursor&&!cursorFrame&&!reduce&&finePointer.matches&&!document.hidden)cursorFrame=requestAnimationFrame(follow)};
 const updateCursor=()=>{
  if(!cursor)return;
  cursor.style.display=reduce||!finePointer.matches?'none':'';
  if(reduce||!finePointer.matches||document.hidden){cancelAnimationFrame(cursorFrame);cursorFrame=0;}else requestCursor();
 };
 if(cursor){
  addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;requestCursor()},{passive:true});
  document.querySelectorAll('a').forEach(a=>{
   a.addEventListener('mouseenter',()=>document.body.classList.add('is-link-hover'));
   a.addEventListener('mouseleave',()=>document.body.classList.remove('is-link-hover'));
  });
  finePointer.addEventListener('change',updateCursor);
  document.addEventListener('visibilitychange',updateCursor);
  updateCursor();
 }
 const intro=document.querySelector('.intro-scene'), portal=document.querySelector('.work-title'),projects=[...document.querySelectorAll('.project-scene')];
 const progress=el=>{const r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight))};
 let scheduled=false;
 // All choreography thresholds, interpolation values and CSS variables below
 // are the production baseline. Scroll work remains coalesced to one RAF.
 function render(){scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;root.style.setProperty('--progress',(max?scrollY/max*100:0)+'%');
 if(reduce)return;
 if(intro){const p=progress(intro);const exit=smooth(.17,.46,p),shift=smooth(.24,.59,p),ent=smooth(.48,.65,p),out=smooth(.84,.98,p),show=ent*(1-out);
 const set=(k,v)=>setIfChanged(intro,k,v);
 set('--intro-left-o',(1-exit).toFixed(3));
  set('--intro-left-x',lerp(0,-85,exit)+'px');
  set('--intro-left-y',lerp(0,-20,exit)+'px');
  set('--intro-role-o',(1-exit).toFixed(3));
  set('--intro-role-x',lerp(0,85,exit)+'px');
  set('--intro-role-y',lerp(0,14,exit)+'px');
  set('--role-small-x',lerp(0,42,exit)+'px');
  set('--role-main-x',lerp(0,-60,exit)+'px');
  set('--role-last-x',lerp(0,80,exit)+'px');
  set('--person-x',lerp(0,-.155*innerWidth,shift)+'px');
  set('--person-y',lerp(0,22,shift)+'px');
  set('--person-scale',lerp(1,1.055,shift));
  set('--light-o',lerp(.7,.9,shift));
  set('--light-scale',lerp(1,.85,shift));
  set('--statement-o',show.toFixed(3));
  set('--statement-x',(lerp(60,0,ent)+lerp(0,-32,out))+'px');
  set('--statement-y',(lerp(24,0,ent)+lerp(0,-19,out))+'px');
  set('--statement-pe',show>.4?'auto':'none');
  set('--scroll-o',1-smooth(.12,.35,p));
  set('--scroll-y',lerp(0,12,smooth(.12,.35,p))+'px');
  set('--index1-o',1-smooth(.4,.58,p));
  set('--index2-o',lerp(.18,1,smooth(.4,.58,p)))}
 if(portal){const p=progress(portal),est=smooth(0,.22,p),exp=smooth(.18,.7,p),cov=smooth(.48,.8,p),ex=smooth(.16,.48,p),inn=smooth(.48,.64,p),out=smooth(.76,.94,p);const set=(k,v)=>setIfChanged(portal,k,v);
  set('--planet-x',(lerp(135,-18,est)+lerp(0,-8,exp))+'px');
  set('--planet-y',lerp(0,4,exp)+'px');
  set('--planet-scale',lerp(.8,4.65,exp));
  set('--planet-o',lerp(.76,1,est));
  set('--planet-ring-o',1-smooth(.38,.72,p));
  set('--planet-brightness',lerp(1,.72,cov));
  set('--portal-wash',cov);
  set('--work-copy-o',1-ex);
  set('--work-copy-x',lerp(0,-72,ex)+'px');
  set('--work-copy-y',lerp(0,-18,ex)+'px');
  set('--work-copy-scale',lerp(1,.975,ex));
  set('--portal-label-o',inn*(1-out));
  set('--portal-label-y',(lerp(28,0,inn)+lerp(0,-18,out))+'px')}
 projects.forEach((section)=>{const p=progress(section),first=section.dataset.project==='1',ent=smooth(first?.10:0,first?.32:.26,p),exit=smooth(.74,1,p);const set=(k,v)=>setIfChanged(section,k,v);
 if(first)set('--p1-dark-o',smooth(.04,.34,p));
  set('--project-copy-x',(lerp(-70,0,ent)+lerp(0,-40,exit))+'px');
  set('--project-copy-y',(lerp(30,0,ent)+lerp(0,-35,exit))+'px');
  set('--project-copy-o',ent*(1-exit*.65));
  set('--device-x',(lerp(150,0,ent)+lerp(0,-30,exit))+'px');
  set('--device-y',(lerp(50,0,ent)+lerp(0,-20,exit))+'px');
  set('--device-scale',lerp(.88,1,ent));
  set('--device-ry',(lerp(-10,-3,ent)+lerp(0,2,exit))+'deg');
  set('--device-rx',lerp(4,0,ent)+'deg')});}
 const request=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(render)}};addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});render();
 const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.09});document.querySelectorAll('.reveal').forEach(el=>reduce?el.classList.add('visible'):observer.observe(el));
 motion.addEventListener('change',()=>{reduce=motion.matches;
 if(reduce)document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));updateCursor();request();});
 // Keyboard focus can otherwise enter an opacity-zero sticky scene. Move only
 // in response to keyboard focus; ordinary pointer/scroll choreography is intact.
 document.addEventListener('focusin',e=>{
  const target=e.target;
 if(!(target instanceof HTMLElement))return;
  target.closest('.reveal')?.classList.add('visible');
  if(reduce)return;
  const project=target.closest('.project-scene');
  const statement=target.closest('.intro-statement');
  const hero=target.closest('.intro-role');
  const section=project||((statement||hero)?intro:null);
  const hidden=project?getComputedStyle(project.querySelector('.project-copy')).opacity<.5:statement?getComputedStyle(statement).opacity<.5:hero?getComputedStyle(hero).opacity<.5:false;
  if(section&&hidden){const r=section.getBoundingClientRect();const p=project?.5:statement?.66:0;scrollTo({top:scrollY+r.top+Math.max(0,r.height-innerHeight)*p,behavior:'instant'});request();}
 });
})();
