/* Strict lesson separation: IDIOTIC, MATHS, and CODING are independent teaching layers. */
(function(){
  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;")
      .replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }
  function codeBlock(s){
    return '<pre class="code">'+esc(s)+'</pre>';
  }
  function sectionCard(title, body){
    return '<div class="box"><h4>'+esc(title)+'</h4>'+body+'</div>';
  }
  function topic(i){
    const t=window.__MATH_CODE_LESSONS && window.__MATH_CODE_LESSONS[i];
    if(!t) return;
    const detail=document.querySelector("#detail");
    if(!detail) return;

    document.querySelectorAll(".topic-btn").forEach((b,n)=>b.classList.toggle("active",n===i));

    const idiot=t.idioticExplanation || t.idiotLesson || t.summary || "Imagine the idea as a ridiculous machine. Remember the picture; the formal rules come next.";
    const math=t.mathLesson || t.definition || t.math || t.summary;
    const coding=t.codingLesson || t.code || "Represent the mathematical objects, implement the operations, and validate the result.";
    const why=t.why || "This concept gives mathematics a precise way to describe, calculate, or reason about a problem.";
    const notation=t.notation || "Use the standard notation introduced by the definition.";
    const formula=t.formula || "Apply the definition, theorem, identity, or law for this topic.";
    const example=t.example || "Work a small valid example by hand.";
    const steps=t.steps || t.humanMethod || "Identify the known values → apply the rule → calculate → verify.";
    const representation=t.representation || coding;
    const js=t.javascript || "// Represent the mathematical objects, then implement the rule.";
    const complexity=t.complexity || "Depends on the algorithm and representation.";
    const precision=t.precision || "Watch rounding, domain restrictions, overflow, underflow, and machine-number limits.";
    const exact=t.exactVsApprox || "Use exact representations when possible; numerical code may produce approximations.";
    const mistakes=t.mistakes || "Validate inputs, dimensions, domains, edge cases, and representation.";
    const difference=t.differenceDetailed || t.difference || "Mathematics defines the abstract object or rule; code implements a finite representation and executable procedure.";
    const practice=Array.isArray(t.practice)?t.practice:["Explain the concept.","Solve one small example by hand.","Implement one valid example in JavaScript."];
    const related=Array.isArray(t.related)?t.related:[];

    detail.innerHTML =
      '<div class="detail">'+
        '<div class="detail-top"><div><small>'+esc(t.field)+' · '+esc(t.level)+'</small><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p></div>'+
        '<button id="complete" class="complete '+(window.completed && window.completed.has(i)?"done":"")+'">'+((window.completed&&window.completed.has(i))?"✓ Completed":"Mark complete")+'</button></div>'+

        '<div class="lesson-tools strict-flow"><span>Lesson '+(i+1)+' / '+(window.__MATH_CODE_LESSONS.length)+'</span><b>🤪 IDIOTIC → 📐 MATHS → 💻 CODING</b></div>'+
        '<div class="lesson-nav"><a href="#idiotic">🤪 Idiotic</a><a href="#math">📐 Maths</a><a href="#code">💻 Coding</a><a href="#difference">Difference</a><a href="#practice">Practice</a></div>'+

        '<div id="idiotic" class="lesson-section strict-lesson strict-idiotic">'+
          '<h3>🤪 IDIOTIC — ONLY THE MEMORY EXPLANATION</h3>'+
          '<div class="idiot-box"><div class="idiot-label">🤪 REMEMBER IT LIKE THIS</div><p>'+esc(idiot)+'</p><small>This section is intentionally absurd and memorable. It does not replace the mathematics.</small></div>'+
          sectionCard("Why this idea feels useful",'<p>'+esc(why)+'</p>')+
          sectionCard("Intuition",'<p>'+esc(t.intuition || t.summary)+'</p>')+
        '</div>'+

        '<div id="math" class="lesson-section strict-lesson strict-math">'+
          '<h3>📐 MATHS — ONLY THE ACTUAL MATHEMATICS</h3>'+
          '<div class="math-rule"><b>Formal definition</b><p>'+esc(math)+'</p></div>'+
          '<div class="boxes">'+
            sectionCard("Notation",'<pre class="formula">'+esc(notation)+'</pre>')+
            sectionCard("Formula / theorem / law",'<pre class="formula">'+esc(formula)+'</pre>')+
            sectionCard("Worked example",'<p>'+esc(example)+'</p>')+
            sectionCard("Step-by-step calculation",'<p>'+esc(steps)+'</p>')+
            sectionCard("Exact vs approximate",'<p>'+esc(exact)+'</p>')+
          '</div>'+
        '</div>'+

        '<div id="code" class="lesson-section strict-lesson strict-code">'+
          '<h3>💻 CODING — ONLY THE COMPUTER IMPLEMENTATION</h3>'+
          '<div class="code-rule"><b>Computer representation</b><p>'+esc(representation)+'</p></div>'+
          '<div class="boxes">'+
            sectionCard("Algorithm / procedure",'<p>'+esc(coding)+'</p>')+
            sectionCard("JavaScript implementation",codeBlock(js))+
            sectionCard("Time / space complexity",'<p>'+esc(complexity)+'</p>')+
            sectionCard("Precision / numerical issues",'<p>'+esc(precision)+'</p>')+
          '</div>'+
          '<div class="code-actions"><button class="lesson-tool copy-code-strict">Copy JavaScript</button></div>'+
        '</div>'+

        '<div id="difference" class="lesson-section strict-lesson">'+
          '<h3>Math ↔ Code — KEEP THE DIFFERENCE CLEAR</h3>'+
          '<div class="difference">'+esc(difference)+'</div>'+
          sectionCard("Common coding mistakes",'<p>'+esc(mistakes)+'</p>')+
          (related.length?sectionCard("Related ideas",'<p>'+related.map(x=>'<span class="tag">'+esc(x)+'</span>').join(" ")+'</p>'):"")+
        '</div>'+

        '<div id="practice" class="lesson-section strict-lesson">'+
          '<h3>Practice</h3>'+
          '<div class="practice-list">'+practice.map((p,n)=>'<div><b>'+(n+1)+'</b>'+esc(p)+'</div>').join("")+'</div>'+
        '</div>'+
      '</div>';

    const complete=document.querySelector("#complete");
    if(complete){
      complete.onclick=function(){
        if(window.completed.has(i)) window.completed.delete(i); else window.completed.add(i);
        localStorage.setItem("mc-completed",JSON.stringify([...window.completed]));
        topic(i);
        if(typeof window.updateProgress==="function") window.updateProgress();
      };
    }
    const copy=document.querySelector(".copy-code-strict");
    if(copy){
      copy.onclick=async function(){
        try{
          await navigator.clipboard.writeText(js);
          copy.textContent="✓ Copied";
          setTimeout(()=>copy.textContent="Copy JavaScript",1200);
        }catch(e){ copy.textContent="Copy unavailable"; }
      };
    }
  }

  function install(){
    if(!Array.isArray(window.lessons) && Array.isArray(window.LESSONS)) window.lessons=window.LESSONS;
    const source=Array.isArray(window.lessons)?window.lessons:[];
    if(!source.length) return;
    window.__MATH_CODE_LESSONS=source;
    window.completed=window.completed instanceof Set?window.completed:new Set();
    window.openTopic=topic;
    topic(0);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install);
  else install();
})();