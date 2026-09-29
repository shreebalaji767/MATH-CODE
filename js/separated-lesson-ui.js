/* Strict lesson UI: memory, mathematics, and coding are separate layers. */
(function(){
 const esc=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const clean=s=>String(s??"").trim();
 const card=(h,b)=>'<div class="box"><h4>'+esc(h)+'</h4>'+b+'</div>';

 function whyText(t){
  const explicit=clean(t.why);
  if(explicit)return explicit;
  const title=clean(t.title)||"this concept";
  const summary=clean(t.summary);
  return "This concept exists to give mathematics a precise way to describe, calculate, compare, or reason about "+title+"."+(summary?" In this curriculum, it is used to understand: "+summary:"");
 }

 function render(i){
  const t=window.__MATH_CODE_LESSONS?.[i],root=document.querySelector("#detail");
  if(!t||!root)return;

  const buttons=[...document.querySelectorAll("#list .topic-btn")];
  buttons.forEach((b,n)=>b.classList.toggle("active",n===i));

  const idiot=clean(t.idioticExplanation||t.idiotLesson)||"Use the absurd memory layer only as a memory hook; the formal rule is in Maths.";
  const definition=clean(t.definition||t.math);
  const code=clean(t.codingLesson||t.code);
  const practice=Array.isArray(t.practice)?t.practice:[];

  root.innerHTML=
   '<div class="detail">'+
   '<div class="detail-top">'+
     '<div><div class="lesson-kicker">'+esc(t.field)+' · '+esc(t.level)+'</div><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p></div>'+
     '<div class="translation-badge">🤪 Memory → 📐 Mathematics → 💻 Code</div>'+
   '</div>'+
   '<div class="lesson-tools strict-flow"><button class="lesson-tool" data-local-prev>← Previous</button><span>Lesson '+(i+1)+' / '+window.__MATH_CODE_LESSONS.length+'</span><button class="lesson-tool" data-local-next>Next →</button></div>'+
   '<nav class="lesson-nav"><a href="#idiotic">🤪 Idiotic</a><a href="#math">📐 Maths</a><a href="#coding">💻 Coding</a><a href="#difference">↔ Difference</a><a href="#practice">✓ Practice</a></nav>'+

   '<section id="idiotic" class="lesson-section strict-lesson strict-idiotic">'+
     '<div class="section-label">LAYER 1 · MEMORY</div><h3>🤪 IDIOTIC — MEMORY ONLY</h3>'+
     '<div class="idiot-box"><p>'+esc(idiot)+'</p></div>'+
   '</section>'+

   '<section id="math" class="lesson-section strict-lesson strict-math">'+
     '<div class="section-label">LAYER 2 · FORMAL MATHEMATICS</div><h3>📐 MATHS — DEFINITION AND MATHEMATICS ONLY</h3>'+
     '<div class="translation-grid">'+
       card("Why this concept exists",'<p>'+esc(whyText(t))+'</p>')+
       card("Definition",'<p class="formal-definition">'+esc(definition||"The formal definition for this lesson has not been supplied yet.")+'</p>')+
       card("Notation",'<pre class="formula">'+esc(t.notation||"")+'</pre>')+
       card("Formula / theorem / law",'<pre class="formula">'+esc(t.formula||"")+'</pre>')+
       card("Worked example",'<p>'+esc(t.example||"")+'</p>')+
       card("Calculation steps",'<p>'+esc(t.steps||t.humanMethod||"")+'</p>')+
       card("Exact vs approximate",'<p>'+esc(t.exactVsApprox||"")+'</p>')+
     '</div>'+
   '</section>'+

   '<section id="coding" class="lesson-section strict-lesson strict-code">'+
     '<div class="section-label">LAYER 3 · IMPLEMENTATION</div><h3>💻 CODING — IMPLEMENTATION ONLY</h3>'+
     '<div class="translation-grid">'+
       card("Data representation",'<pre class="code">'+esc(t.representation||"")+'</pre>')+
       card("Algorithm / procedure",'<p>'+esc(code)+'</p>')+
       card("JavaScript implementation",'<pre class="code">'+esc(t.javascript||"")+'</pre><button type="button" class="lesson-tool copy-code">Copy JavaScript</button>')+
       card("Time and space complexity",'<p>'+esc(t.complexity||"")+'</p>')+
       card("Precision issues",'<p>'+esc(t.precision||"")+'</p>')+
       card("Coding mistakes",'<p>'+esc(t.mistakes||"")+'</p>')+
     '</div>'+
   '</section>'+

   '<section id="difference" class="lesson-section strict-lesson strict-difference"><div class="section-label">TRANSLATION</div><h3>↔ Math → Code difference</h3><p>'+esc(t.differenceDetailed||t.difference||"")+'</p></section>'+
   '<section id="practice" class="lesson-section strict-lesson strict-practice"><div class="section-label">CHECK YOURSELF</div><h3>✓ Practice</h3><div class="practice-list">'+practice.map((p,n)=>'<div><b>'+(n+1)+'</b>'+esc(p)+'</div>').join("")+'</div></section>'+
   '</div>';

  const prev=root.querySelector("[data-local-prev]");
  const next=root.querySelector("[data-local-next]");
  if(prev)prev.disabled=i<=0;
  if(next)next.disabled=i>=window.__MATH_CODE_LESSONS.length-1;
  prev?.addEventListener("click",()=>{if(i>0)render(i-1);});
  next?.addEventListener("click",()=>{if(i<window.__MATH_CODE_LESSONS.length-1)render(i+1);});

  root.querySelector(".copy-code")?.addEventListener("click",async e=>{
   try{await navigator.clipboard.writeText(t.javascript||"");e.currentTarget.textContent="✓ Copied";setTimeout(()=>e.currentTarget.textContent="Copy JavaScript",1200);}
   catch(_){e.currentTarget.textContent="Copy unavailable";}
  });
 }

 function install(){
  const lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];
  if(!lessons.length)return;
  window.__MATH_CODE_LESSONS=lessons;

  const list=document.querySelector("#list");
  if(list){
   list.innerHTML='<div class="side-title"><strong>LESSONS</strong><span>'+lessons.length+' mapped</span></div>'+
    '<div class="side-search"><input id="lessonFilter" type="search" placeholder="Filter lessons…"></div>'+
    '<div class="side-items">'+lessons.map((t,i)=>'<button class="topic-btn" data-i="'+i+'"><span class="topic-field">'+esc(t.field)+'</span><strong>'+esc(t.title)+'</strong></button>').join("")+'</div>';
   const items=list.querySelector(".side-items");
   const filter=list.querySelector("#lessonFilter");
   const apply=()=>{
    const q=clean(filter?.value).toLowerCase();
    items.querySelectorAll(".topic-btn").forEach(b=>{
     const i=Number(b.dataset.i),t=lessons[i];
     b.hidden=!!q&&!((t.field+" "+t.title+" "+t.summary).toLowerCase().includes(q));
    });
   };
   filter?.addEventListener("input",apply);
   list.addEventListener("click",e=>{
    const b=e.target.closest(".topic-btn");if(!b)return;
    e.preventDefault();e.stopPropagation();render(Number(b.dataset.i));
   });
  }
  render(0);
 }

 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();