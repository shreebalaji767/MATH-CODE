/* Math → Code Translator
   One owner for the Translator UI. Keeps IDIOTIC, MATHS and CODING strictly separate.
*/
(function(){
  "use strict";

  function esc(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function clean(value){ return String(value == null ? "" : value).trim(); }
  function el(sel){ return document.querySelector(sel); }

  function getLessons(){
    if(Array.isArray(window.LESSONS) && window.LESSONS.length) return window.LESSONS;
    if(Array.isArray(window.TOPICS) && window.TOPICS.length){
      return window.TOPICS.map(function(t,i){
        var field=t[0]||"Foundations", level=t[1]||"Foundation", title=t[2]||"Topic";
        var summary=t[3]||"", math=t[4]||summary, code=t[5]||"";
        return {
          id:i, field:field, level:level, title:title, summary:summary,
          math:math, code:code, difference:t[6]||"",
          definition:math,
          why:"This concept exists to give a precise mathematical model for "+summary.toLowerCase()+".",
          notation:"Use the standard mathematical notation introduced by the definition.",
          formula:"Apply the definition, theorem, identity, or standard law for this concept.",
          steps:"1. State the definition. 2. Identify known values and conditions. 3. Apply the rule. 4. Calculate. 5. Verify.",
          example:"Take a small valid example, substitute concrete values, calculate step by step, and verify the result.",
          representation:code||"Represent the mathematical objects with suitable JavaScript data.",
          javascript:"// Translate the mathematical rule into explicit JavaScript.\nfunction solve(input){\n  return input;\n}",
          complexity:"Depends on the chosen algorithm and representation.",
          precision:"Check rounding, finite precision, overflow, underflow, and domain restrictions.",
          exactVsApprox:"Exact mathematics follows the definition exactly; machine arithmetic may use finite approximations.",
          mistakes:"Do not confuse mathematical notation with executable code. Validate domains and edge cases.",
          differenceDetailed:t[6]||"Mathematics is the abstract model; code is an executable representation.",
          practice:[
            "Explain the definition in your own words.",
            "Work one small example by hand.",
            "Implement the rule in JavaScript and test an edge case."
          ]
        };
      });
    }
    return [];
  }

  var lessons=getLessons();
  var completed=new Set();
  try{ completed=new Set(JSON.parse(localStorage.getItem("mc-completed")||"[]")); }catch(e){}

  function whyText(t){
    return clean(t.why) || ("This concept exists to give a precise rule for describing, calculating, comparing, or reasoning about "+clean(t.title||"this concept")+".");
  }

  function absurdDefinitionParts(t){
    var title=clean(t.title)||"this concept";
    var formal=clean(t.definition||t.math)||"a precise mathematical concept";
    var why=clean(t.why)||"It gives us a precise way to describe or reason about the idea.";
    var notation=clean(t.notation)||"Use the notation appropriate to the definition.";
    return [
      "🤪 ABSURD DEFINITION — "+title,
      "I AM ABOUT TO EXPLAIN "+title+" AND I HAVE ABSOLUTELY NO BUSINESS BEING ALLOWED NEAR A WHITEBOARD.",
      "THE ACTUAL FACT HIDING INSIDE MY NONSENSE: "+formal,
      "NOW THE NONSENSE STARTS: "+title+" is when the mathematical universe puts on one shoe, forgets where it left the other shoe, and then says, 'YES, THIS IS FINE, PLEASE CHECK THE CONDITIONS.' I personally would check the fridge, the ceiling fan, three potatoes and possibly the moon, but mathematics is annoyingly more organised than me. The real rule is the definition above. Everything else I say is suspicious.",
      "HERE IS MY EXTREMELY PROFESSIONAL IDIOT METHOD: First I look at the object. Then I stare at it until it becomes uncomfortable. Then I check the actual defining conditions. If the required conditions are satisfied, I shout 'CONGRATULATIONS, YOU ARE "+title+"!' If they are not satisfied, I throw a tiny imaginary chair at the object and say 'NO, NICE TRY.' The chair has no mathematical significance. I just felt it was necessary.",
      "WHY DOES THIS THING EXIST? "+why+" Translation from idiot language: people needed a precise rule so they could talk about the same mathematical idea without everybody inventing their own version after eating a sandwich. That precise rule is what matters.",
      "HOW DO I KNOW I AM NOT MAKING EVERYTHING UP? "+notation+" I use the mathematical properties that actually define the concept. I do NOT decide based on appearance, vibes, horoscope, potato temperature, or whether the number looks confident. If the definition says a condition is required, that condition is required. My brain may be wearing a traffic cone, but the mathematics is still driving the bus.",
      "FINAL IDIOT CHECK: "+title+" means the formal definition stated above, not 'whatever ridiculous sentence I just said.' If I can explain the definition, identify its important conditions, and tell you what the concept is describing, then the nonsense has successfully carried the facts into my brain. If I only remember the potatoes, I have failed the exam."
    ];
  }


  function card(title,body,klass){
    return '<div class="box '+(klass||"")+'"><h4>'+esc(title)+'</h4>'+body+'</div>';
  }
  function textCard(title,value){
    return card(title,"<p>"+esc(clean(value)||"Not supplied in the curriculum.")+"</p>");
  }
  function preCard(title,value,klass){
    return card(title,'<pre class="'+(klass||"formula")+'">'+esc(clean(value)||"Not supplied in the curriculum.")+"</pre>");
  }

  function render(index){
    lessons=getLessons();
    if(!lessons.length){
      var detail=el("#detail"), list=el("#list");
      if(list) list.innerHTML='<div class="side-title"><strong>LESSONS</strong><span>0 mapped</span></div><p style="padding:12px;color:#fff">Curriculum could not be loaded.</p>';
      if(detail) detail.innerHTML='<div class="detail"><h3>Translator could not load the curriculum.</h3><p>Check the browser console for the first JavaScript error.</p></div>';
      return;
    }

    if(index<0 || index>=lessons.length) index=0;
    var t=lessons[index];
    var detail=el("#detail");
    if(!detail) return;

    document.querySelectorAll(".topic-btn").forEach(function(btn){
      btn.classList.toggle("active",Number(btn.getAttribute("data-i"))===index);
    });

    var practice=Array.isArray(t.practice)?t.practice:[];
    detail.innerHTML=
      '<div class="detail">'+
      '<div class="detail-top"><div><small>'+esc(t.field||"")+' · '+esc(t.level||"")+'</small><h3>'+esc(t.title||"")+'</h3><p>'+esc(t.summary||"")+'</p></div>'+
      '<button id="strict-complete" class="strict-complete '+(completed.has(index)?"done":"")+'">'+(completed.has(index)?"✓ Completed":"Mark complete")+'</button></div>'+
      '<div class="translation-mini"><span>🤪 Remember the idea</span><span>→</span><span>📐 State the rule</span><span>→</span><span>💻 Implement the rule</span></div>'+

      '<section id="idiotic" class="lesson-section strict-lesson strict-idiotic">'+
      '<h3>🤪 IDIOTIC — ACTUAL DEFINITION IN ABSURD TONE</h3>'+
      '<div class="idiot-box">'+absurdDefinitionParts(t).map(function(part){return "<p>"+esc(part)+"</p>";}).join("")+'</div></section>'+

      '<section id="math" class="lesson-section strict-lesson strict-math">'+
      '<h3>📐 MATHS — FORMAL MATHEMATICS ONLY</h3><div class="boxes">'+
      textCard("Why this concept exists",whyText(t))+
      '<div class="box"><h4>Definition</h4><p class="formal-definition">'+esc(clean(t.definition||t.math)||"No definition supplied.")+'</p></div>'+
      preCard("Notation",t.notation)+
      preCard("Formula / theorem / law",t.formula)+
      textCard("Worked example",t.example)+
      textCard("Calculation steps",t.steps||t.humanMethod)+
      textCard("Exact vs approximate",t.exactVsApprox)+
      '</div></section>'+

      '<section id="code" class="lesson-section strict-lesson strict-code">'+
      '<h3>💻 CODING — IMPLEMENTATION ONLY</h3><div class="boxes">'+
      preCard("Data representation",t.representation||t.code,"code")+
      preCard("JavaScript implementation",t.javascript||t.js,"code")+
      textCard("Time and space complexity",t.complexity)+
      textCard("Precision & numerical issues",t.precision)+
      textCard("Common implementation mistakes",t.mistakes)+
      '</div></section>'+

      '<section id="difference" class="lesson-section"><h3>Math ↔ Code difference</h3><div class="difference">'+esc(t.differenceDetailed||t.difference||"")+'</div></section>'+
      '<section id="practice" class="lesson-section"><h3>Practice</h3><div class="practice-list">'+
      practice.map(function(p,n){return '<div><b>'+(n+1)+'. </b>'+esc(p)+'</div>';}).join("")+
      '</div></section></div>';

    var complete=el("#strict-complete");
    if(complete) complete.onclick=function(){
      if(completed.has(index)) completed.delete(index); else completed.add(index);
      localStorage.setItem("mc-completed",JSON.stringify(Array.from(completed)));
      render(index);
    };
  }

  function buildList(){
    var list=el("#list");
    if(!list) return;
    lessons=getLessons();
    list.innerHTML=
      '<div class="side-title"><strong>LESSONS</strong><span>'+lessons.length+' mapped</span></div>'+
      '<div class="side-search"><input id="lessonFilter" type="search" placeholder="Filter lessons..." aria-label="Filter lessons"></div>'+
      '<div class="side-items">'+
      lessons.map(function(t,i){
        return '<button type="button" class="topic-btn" data-i="'+i+'"><span class="topic-field">'+esc(t.field||"")+'</span><strong>'+esc(t.title||"")+'</strong></button>';
      }).join("")+
      '</div>';

    list.querySelectorAll(".topic-btn").forEach(function(btn){
      btn.onclick=function(){ render(Number(btn.getAttribute("data-i"))); };
    });

    var filter=el("#lessonFilter");
    if(filter) filter.oninput=function(){
      var q=filter.value.toLowerCase().trim();
      list.querySelectorAll(".topic-btn").forEach(function(btn){
        btn.style.display=btn.textContent.toLowerCase().indexOf(q)>=0?"flex":"none";
      });
    };
  }

  function install(){
    lessons=getLessons();
    buildList();
    render(0);
    window.__MATH_CODE_LESSONS=lessons;
    window.renderSeparatedLesson=render;
  }

  window.renderSeparatedLesson=render;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install);
  else install();
})();