/* Separate lesson panes: memory analogy, formal mathematics, and implementation never share explanatory copy. */
(function(){
 const esc=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const card=(h,b)=>'<div class="box"><h4>'+esc(h)+'</h4>'+b+'</div>';
 function render(i){
  const t=window.__MATH_CODE_LESSONS?.[i],root=document.querySelector("#detail");if(!t||!root)return;
  document.querySelectorAll("#list .topic-btn").forEach((b,n)=>b.classList.toggle("active",n===i));
  const idiot=t.idioticExplanation||t.idiotLesson||t.summary||"";
  const math=t.definition||t.math||t.summary||"";
  const code=t.codingLesson||t.code||"";
  const practice=Array.isArray(t.practice)?t.practice:[];
  root.innerHTML='<div class="detail"><div class="detail-top"><div><small>'+esc(t.field)+' · '+esc(t.level)+'</small><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p></div></div>'+
   '<div class="lesson-tools strict-flow"><span>Lesson '+(i+1)+' / '+window.__MATH_CODE_LESSONS.length+'</span><b>Separate teaching sections</b></div>'+
   '<nav class="lesson-nav"><a href="#idiotic">🤪 Idiotic</a><a href="#math">📐 Maths</a><a href="#coding">💻 Coding</a><a href="#difference">Difference</a><a href="#practice">Practice</a></nav>'+
   '<section id="idiotic" class="lesson-section strict-lesson strict-idiotic"><h3>🤪 IDIOTIC — MEMORY ONLY</h3><div class="idiot-box"><p>'+esc(idiot)+'</p></div></section>'+
   '<section id="math" class="lesson-section strict-lesson strict-math"><h3>📐 MATHS — MATHEMATICS ONLY</h3>'+
   card("Why this concept exists",'<p>'+esc(t.why||"")+'</p>')+card("Formal definition",'<p>'+esc(math)+'</p>')+
   card("Notation",'<pre class="formula">'+esc(t.notation||"")+'</pre>')+card("Formula / theorem / law",'<pre class="formula">'+esc(t.formula||"")+'</pre>')+
   card("Worked example",'<p>'+esc(t.example||"")+'</p>')+card("Calculation steps",'<p>'+esc(t.steps||t.humanMethod||"")+'</p>')+
   card("Exact vs approximate",'<p>'+esc(t.exactVsApprox||"")+'</p>')+'</section>'+
   '<section id="coding" class="lesson-section strict-lesson strict-code"><h3>💻 CODING — IMPLEMENTATION ONLY</h3>'+
   card("Data representation",'<p>'+esc(t.representation||"")+'</p>')+card("Algorithm / procedure",'<p>'+esc(code)+'</p>')+
   card("JavaScript implementation",'<pre class="code">'+esc(t.javascript||"")+'</pre><button class="lesson-tool copy-code">Copy JavaScript</button>')+
   card("Time and space complexity",'<p>'+esc(t.complexity||"")+'</p>')+card("Precision issues",'<p>'+esc(t.precision||"")+'</p>')+
   card("Coding mistakes",'<p>'+esc(t.mistakes||"")+'</p>')+'</section>'+
   '<section id="difference" class="lesson-section strict-lesson"><h3>Math ↔ Code difference</h3><p>'+esc(t.differenceDetailed||t.difference||"")+'</p></section>'+
   '<section id="practice" class="lesson-section strict-lesson"><h3>Practice</h3><div class="practice-list">'+practice.map((p,n)=>'<div><b>'+(n+1)+'. </b>'+esc(p)+'</div>').join("")+'</div></section></div>';
  root.querySelector(".copy-code")?.addEventListener("click",async e=>{try{await navigator.clipboard.writeText(t.javascript||"");e.currentTarget.textContent="Copied";}catch(_){e.currentTarget.textContent="Copy unavailable";}});
 }
 function install(){
  const lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];if(!lessons.length)return;
  window.__MATH_CODE_LESSONS=lessons;
  document.addEventListener("click",e=>{const b=e.target.closest("#list .topic-btn");if(!b)return;const i=[...document.querySelectorAll("#list .topic-btn")].indexOf(b);if(i<0)return;e.preventDefault();e.stopImmediatePropagation();render(i);},true);
  render(0);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();