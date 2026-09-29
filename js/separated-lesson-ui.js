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

  function absurdDefinition(t){
    var title=clean(t.title)||"this concept";
    var formal=clean(t.definition||t.math)||"a precise mathematical concept";
    var why=clean(t.why)||"It gives us a precise way to describe or reason about the idea.";
    var notation=clean(t.notation)||"Use the notation appropriate to the definition.";
    return "🤪 ABSURD DEFINITION — "+title+"\\n\\n"+
      "OKAY, LISTEN, I AM THE IDIOT WHO HAS TO EXPLAIN THIS: "+title+
      " is basically this mathematical thing: "+formal+"\\n\\n"+
      "NOW MY BRAIN VERSION: I have put the entire definition into my tiny brain and it is making microwave noises. "+
      "The important part is STILL the same: if the mathematical conditions described above are satisfied, the object belongs to this concept; "+
      "if those required conditions are not satisfied, I am not allowed to yell \\"YES, THAT IS "+title+"!\\" just because it looks suspiciously similar. "+
      "So I check the actual rule, not my feelings, not vibes, not the object's hairstyle, and definitely not what my uncle shouted from the kitchen.\\n\\n"+
      "WHY THIS WEIRD THING EXISTS: "+why+" "+
      "In idiot language: mathematicians needed a reliable rule instead of everybody pointing at numbers/shapes/objects and screaming different answers. "+
      "This concept gives them that rule.\\n\\n"+
      "HOW I RECOGNISE IT WITHOUT DESTROYING THE UNIVERSE: "+notation+" "+
      "I look for the defining properties, check them properly, and then decide whether the thing qualifies. "+
      "I do NOT replace the definition with the joke. The joke is wearing a stupid hat; the mathematical facts underneath are still the boss.\\n\\n"+
      "IDIOT MEMORY TEST: If someone wakes me up at 3 AM and asks, \\"WHAT IS "+title+"?\\" I should be able to explain the real definition, name the conditions that matter, and say what the concept is used to describe or determine. "+
      "If all I can say is \\"HAHA SECURITY GUARD\\", congratulations, I remembered absolutely nothing.";
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
      '<div class="idiot-box"><p>'+esc(absurdDefinition(t))+'</p></div></section>'+

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