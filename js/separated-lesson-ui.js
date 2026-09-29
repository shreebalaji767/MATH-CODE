/* Strict lesson UI: memory, mathematics, and coding are separate layers. */
(function(){
 const esc=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const clean=s=>String(s??"").trim();
 const card=(h,b)=>'<div class="box"><h4>'+esc(h)+'</h4>'+b+'</div>';

 function whyText(t){
  const title=clean(t.title)||"this concept";
  const definition=clean(t.definition||t.math);
  const summary=clean(t.summary);
  const explicit=clean(t.why);
  if(explicit)return explicit;
  return "Why it exists: "+title+" gives us a precise mathematical way to describe, calculate, compare, or reason about this kind of object or relationship. "+
    (definition?"The concept is needed because its definition gives a rule we can apply consistently instead of relying on vague intuition. ":"")+
    (summary?"In this lesson, that rule is used for: "+summary:"");
 }

 function absurdDefinition(t){
  const title=clean(t.title)||"this concept";
  const formal=clean(t.definition||t.math)||("a mathematical idea called "+title);
  const summary=clean(t.summary);
  return "🤪 ABSURD DEFINITION — "+title+"\n\n"+
   "What it actually means: "+formal+
   "\n\n"+
   "Absurd version of the SAME definition: imagine "+title+" is a bizarre little mathematical law-enforcer. Its entire job is to make every object obey the rule above. It walks around with a giant clipboard, checks the conditions one by one, and refuses to accept “almost.” If the conditions are satisfied, it shouts “MATHEMATICALLY LEGAL!” and stamps the object. If they are not satisfied, it throws the object into the tiny bin marked NOT THIS THING.\n\n"+
   (summary?"In practical terms, this lesson is about "+summary.toLowerCase()+". So the creature is not random: its ridiculous behaviour is a memory picture for the actual mathematical idea. ":"")+
   "The important part is the definition itself. The absurd story is only the costume: remember the rule, the conditions, and what the rule lets you determine.\n\n"+
   "MEMORY TEST: if you can explain what "+title+" IS, what condition makes something qualify, and what the concept lets you calculate or conclude, then you remembered the definition—not merely the joke.";
 }

 function render(i){
  const t=window.__MATH_CODE_LESSONS?.[i],root=document.querySelector("#detail");
  if(!t||!root)return;
  const buttons=[...document.querySelectorAll("#list .topic-btn")];
  buttons.forEach((b,n)=>b.classList.toggle("active",n===i));
  const definition=clean(t.definition||t.math)||"A formal definition for this lesson is being generated from the curriculum entry.";
  const why=clean(t.why)||"This concept exists to give a precise rule for describing, classifying, calculating, or reasoning about the mathematical objects in this lesson.";
  const notation=clean(t.notation)||"Use the symbols introduced by the definition; notation names mathematical objects and relationships precisely.";
  const formula=clean(t.formula)||"No single formula is required; apply the definition, theorem, identity, or standard law for this concept.";
  const example=clean(t.example)||"Choose a small valid example, substitute concrete values, calculate step by step, and verify the result against the definition.";
  const steps=clean(t.steps||t.humanMethod)||"1. State the definition. 2. Identify known values and conditions. 3. Apply the rule. 4. Calculate. 5. Verify the result.";
  const exact=clean(t.exactVsApprox)||"Exact mathematics follows the definition exactly; numerical code may use finite approximations.";
  const representation=clean(t.representation)||clean(t.code)||"Choose a data representation that preserves the mathematical information needed by the algorithm.";
  const code=clean(t.codingLesson||t.code)||"Translate the mathematical rule into explicit data, operations, control flow, and validation.";
  const javascript=clean(t.javascript)||"// Translate the definition into explicit JavaScript operations.\\nfunction solve(input){ return input; }";
  const complexity=clean(t.complexity)||"Depends on the chosen representation and algorithm.";
  const precision=clean(t.precision)||"Check rounding, overflow, underflow, tolerances, and domain restrictions when using finite machine numbers.";
  const mistakes=clean(t.mistakes)||"Do not confuse the mathematical definition with its computer representation; validate domains and edge cases.";
  const practice=Array.isArray(t.practice)?t.practice:["Explain the definition in your own words.","Work one small example by hand.","Implement the rule in JavaScript and test an edge case."];
  root.innerHTML=
   '<div class="detail">'+
   '<div class="detail-top"><div><div class="lesson-kicker">'+esc(t.field)+' · '+esc(t.level)+'</div><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p></div>'+
   '<div><div class="translation-badge">🤪 Memory → 📐 Mathematics → 💻 Code</div><div class="translation-mini"><span>🤪 Remember the idea</span><span>→</span><span>📐 State the rule</span><span>→</span><span>💻 Implement the rule</span></div><button type="button" class="complete strict-complete" data-complete>'+((window.__MC_COMPLETED?.has(i))?"✓ Completed":"Mark complete")+'</button></div></div>'+
   '<div class="lesson-tools strict-flow"><button class="lesson-tool" data-local-prev>← Previous</button><span>Lesson '+(i+1)+' / '+window.__MATH_CODE_LESSONS.length+'</span><button class="lesson-tool" data-local-next>Next →</button></div>'+
   '<nav class="lesson-nav"><a href="#idiotic">🤪 Idiotic</a><a href="#math">📐 Maths</a><a href="#coding">💻 Coding</a><a href="#difference">↔ Difference</a><a href="#practice">✓ Practice</a></nav>'+
   '<section id="idiotic" class="lesson-section strict-lesson strict-idiotic"><div class="section-label">LAYER 1 · MEMORY</div><h3>🤪 IDIOTIC — ABSURD DEFINITION</h3><div class="idiot-box"><p>'+esc(absurdDefinition(t))+'</p></div></section>'+
   '<section id="math" class="lesson-section strict-lesson strict-math"><div class="section-label">LAYER 2 · FORMAL MATHEMATICS</div><h3>📐 MATHS — DEFINITION AND MATHEMATICS ONLY</h3><div class="translation-grid">'+
   card("Why this concept exists",'<p>'+esc(why)+'</p>')+
   card("Definition",'<p class="formal-definition">'+esc(definition)+'</p>')+
   card("Notation",'<pre class="formula">'+esc(notation)+'</pre>')+
   card("Formula / theorem / law",'<pre class="formula">'+esc(formula)+'</pre>')+
   card("Worked example",'<p>'+esc(example)+'</p>')+
   card("Calculation steps",'<p>'+esc(steps)+'</p>')+
   card("Exact vs approximate",'<p>'+esc(exact)+'</p>')+
   '</div></section>'+
   '<section id="coding" class="lesson-section strict-lesson strict-code"><div class="section-label">LAYER 3 · IMPLEMENTATION</div><h3>💻 CODING — IMPLEMENTATION ONLY</h3><div class="translation-grid">'+
   card("Data representation",'<pre class="code">'+esc(representation)+'</pre>')+
   card("Algorithm / procedure",'<p>'+esc(code)+'</p>')+
   card("JavaScript implementation",'<pre class="code">'+esc(javascript)+'</pre><button type="button" class="lesson-tool copy-code">Copy JavaScript</button>')+
   card("Time and space complexity",'<p>'+esc(complexity)+'</p>')+
   card("Precision issues",'<p>'+esc(precision)+'</p>')+
   card("Coding mistakes",'<p>'+esc(mistakes)+'</p>')+
   '</div></section>'+
   '<section id="difference" class="lesson-section strict-lesson strict-difference"><div class="section-label">TRANSLATION</div><h3>↔ Math → Code difference</h3><p>'+esc(t.differenceDetailed||t.difference||"")+'</p></section>'+
   '<section id="practice" class="lesson-section strict-lesson strict-practice"><div class="section-label">CHECK YOURSELF</div><h3>✓ Practice</h3><div class="practice-list">'+practice.map((p,n)=>'<div><b>'+(n+1)+'</b>'+esc(p)+'</div>').join("")+'</div></section>'+
   '</div>';
  const complete=root.querySelector("[data-complete]");
  complete?.addEventListener("click",()=>{
   const key="mc-completed";let done=new Set();
   try{done=new Set(JSON.parse(localStorage.getItem(key)||"[]"));}catch(_){}
   done.has(i)?done.delete(i):done.add(i);
   window.__MC_COMPLETED=done;localStorage.setItem(key,JSON.stringify([...done]));
   complete.textContent=done.has(i)?"✓ Completed":"Mark complete";
  });
  const prev=root.querySelector("[data-local-prev]"),next=root.querySelector("[data-local-next]");
  if(prev)prev.disabled=i<=0;if(next)next.disabled=i>=window.__MATH_CODE_LESSONS.length-1;
  prev?.addEventListener("click",()=>{if(i>0)render(i-1);});
  next?.addEventListener("click",()=>{if(i<window.__MATH_CODE_LESSONS.length-1)render(i+1);});
  root.querySelector(".copy-code")?.addEventListener("click",async e=>{try{await navigator.clipboard.writeText(javascript);e.currentTarget.textContent="✓ Copied";setTimeout(()=>e.currentTarget.textContent="Copy JavaScript",1200);}catch(_){e.currentTarget.textContent="Copy unavailable";}});
 }
 function install(){
  const lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];
  if(!lessons.length)return;
  window.__MATH_CODE_LESSONS=lessons;
  try{window.__MC_COMPLETED=new Set(JSON.parse(localStorage.getItem("mc-completed")||"[]"));}catch(_){window.__MC_COMPLETED=new Set();}
  window.renderSeparatedLesson=render;
  const list=document.querySelector("#list");
  if(list){
   list.innerHTML='<div class="side-title"><strong>LESSONS</strong><span>'+lessons.length+' mapped</span></div><div class="side-search"><input id="lessonFilter" type="search" placeholder="Filter lessons…"></div><div class="side-items">'+lessons.map((t,i)=>'<button type="button" class="topic-btn" data-i="'+i+'"><span class="topic-field">'+esc(t.field)+'</span><strong>'+esc(t.title)+'</strong></button>').join("")+'</div>';
   const items=list.querySelector(".side-items"),filter=list.querySelector("#lessonFilter");
   const apply=()=>{const q=clean(filter?.value).toLowerCase();items.querySelectorAll(".topic-btn").forEach(b=>{const i=Number(b.dataset.i),t=lessons[i];b.hidden=!!q&&!((t.field+" "+t.title+" "+t.summary).toLowerCase().includes(q));});};
   filter?.addEventListener("input",apply);
   list.addEventListener("click",e=>{const b=e.target.closest(".topic-btn");if(!b)return;e.preventDefault();e.stopPropagation();render(Number(b.dataset.i));});
  }
  render(0);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();