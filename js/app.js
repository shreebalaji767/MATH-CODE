let completed=new Set();
try{completed=new Set(JSON.parse(localStorage.getItem('mc-completed')||'[]'));}catch(e){localStorage.removeItem('mc-completed');}
const $=s=>document.querySelector(s);
let lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];

// Prefer the source catalog if the lesson engine did not initialize correctly.
if(!lessons.length && Array.isArray(window.TOPICS)) lessons=window.TOPICS.map((t,i)=>({
  id:i,field:t[0],level:t[1],title:t[2],summary:t[3],math:t[4],code:t[5],difference:t[6],
  keywords:String(t[7]||'').split('|').filter(Boolean),definition:t[4],
  notation:'See the mathematical definition and notation for this topic.',
  formula:'Apply the definition, theorem, law, or standard algorithm for this topic.',
  intuition:t[3],humanMethod:'Define the problem → identify known values → apply the rule → verify the result.',
  representation:t[5],javascript:'// Basic implementation: represent the mathematical objects, then apply the rule.',
  differenceDetailed:t[6],idioticExplanation:'🤪 Learn the real rule first; the silly picture is only a memory hook.',
  mathIdioticExplanation:'🤪 Work one tiny example by hand before asking the computer to do it.',
  codeIdioticExplanation:'🤪 Code needs the recipe: data + operations + control flow + validation.',
  complexity:'Depends on the chosen algorithm.',precision:'Watch domain restrictions, rounding and machine-number limits.',
  exactVsApprox:'Mathematics can be exact; numerical JavaScript often uses finite approximations.',
  mistakes:'Check domains, dimensions, edge cases and representation.',example:'Work a small example manually, then reproduce it in JavaScript.',
  practice:['Explain the definition.','Solve a small example by hand.','Implement and test an edge case.'],related:String(t[7]||'').split('|').filter(Boolean),levelNote:'Connect the formal idea to a concrete example and then to an algorithm.'
}));

// Last-resort catalog: the page must never report zero topics because one optional
// curriculum script failed to execute. This is only a bootstrap safety net.
if(!lessons.length){
  const emergency=[
    ['Foundations','Foundation','Numbers','Numbers and number systems.'],
    ['Arithmetic','Foundation','Arithmetic','Operations, fractions, ratios and percentages.'],
    ['Algebra','Foundation','Variables and Equations','Symbols, expressions and equations.'],
    ['Geometry','Foundation','Geometry','Shapes, measurement and spatial reasoning.'],
    ['Trigonometry','Core','Trigonometric Functions','Angles, sine, cosine and tangent.'],
    ['Calculus','Core','Limits','How functions behave as inputs approach a value.'],
    ['Calculus','Core','Derivatives','Rates of change and slopes.'],
    ['Calculus','Core','Integrals','Accumulation and area.'],
    ['Linear Algebra','Core','Vectors and Matrices','Vectors, matrices and linear transformations.'],
    ['Probability','Core','Probability','Mathematical models of uncertainty.'],
    ['Statistics','Core','Mean and Variance','Describing data and its spread.'],
    ['Discrete Mathematics','Core','Logic','Formal reasoning with true/false statements.']
  ];
  lessons=emergency.map((x,i)=>({id:i,field:x[0],level:x[1],title:x[2],summary:x[3],math:x[3],code:'Use JavaScript values, arrays and functions to represent this idea.',difference:'Mathematics defines the abstract object; code implements a finite representation and algorithm.',keywords:[x[2]],definition:x[3],notation:'Use standard mathematical notation for the concept.',formula:'Apply the definition or standard law.',intuition:x[3],humanMethod:'Define → calculate → verify.',representation:'Represent the mathematical objects with suitable JavaScript data.',javascript:'// Implement the mathematical rule here.',differenceDetailed:'Math is the abstract model; code is the executable representation.',idioticExplanation:'🤪 The brain learns the rule; the computer needs the recipe.',mathIdioticExplanation:'🤪 Start with a tiny hand-worked example.',codeIdioticExplanation:'🤪 Turn the math recipe into data and operations.',complexity:'Depends on the algorithm.',precision:'Check rounding and domain limits.',exactVsApprox:'Exact mathematics may become an approximation in numerical code.',mistakes:'Validate inputs and edge cases.',example:'Start with the smallest useful example.',practice:['Explain it.','Solve one example.','Code one example.'],related:[x[2]],levelNote:'Build intuition, then formalize it.'}));
  console.warn('Math→Code emergency curriculum loaded. Check the curriculum script for a JavaScript error.');
}

// Safety fallback: if one lesson-engine script fails, the curriculum still renders
// directly from the source topic catalog instead of showing "No topics found".
if(!lessons.length && Array.isArray(window.TOPICS)){
  lessons=window.TOPICS.map((t,i)=>{
    const [field,level,title,summary,math,code,difference,keywords]=t;
    const words=String(keywords||"").split("|").filter(Boolean);
    return {
      id:i,field,level,title,summary,math,code,difference,keywords:words,
      definition:math,
      notation:"Use the symbols and notation introduced by the definition.",
      formula:"The definition/law is the primary mathematical rule for this topic.",
      intuition:summary,
      humanMethod:"Start with the definition → identify the known values → apply the rule step by step → check the result.",
      representation:code,
      javascript:"// The curriculum engine could not load this lesson's generated example.\\n// Start from the mathematical representation above and implement it step by step.",
      differenceDetailed:difference,
      idioticExplanation:"🤪 First understand the real rule. The silly version is only a memory hook: imagine the concept as a weird machine that follows strict mathematical rules.",
      mathIdioticExplanation:"🤪 Do one tiny example by hand first. If you cannot calculate the small example, the computer has no chance of magically understanding it.",
      codeIdioticExplanation:"🤪 Code needs the recipe: represent the mathematical objects, perform the operations, handle edge cases, then verify the answer.",
      complexity:"Depends on the algorithm and representation.",
      precision:"Watch rounding, finite machine numbers, overflow, underflow and domain errors.",
      exactVsApprox:"Exact mathematics uses exact symbolic/integer/rational representations when possible; numerical code often produces approximations.",
      mistakes:"Do not confuse a mathematical object with its JavaScript representation. Validate inputs and respect domain restrictions.",
      example:"Take a small valid example, calculate it by hand, then reproduce the same steps in JavaScript.",
      practice:[
        "Explain the definition in your own words.",
        "Work one small numerical example by hand.",
        "Implement the rule in JavaScript and test an edge case."
      ],
      related:words
    };
  });
}
const fields=[...new Set(lessons.map(t=>t.field))];
$('#count').textContent=lessons.length;
console.info('Math→Code curriculum loaded:',lessons.length,'lessons');
fields.forEach(f=>$('#field').insertAdjacentHTML('beforeend',`<option>${esc(f)}</option>`));
function filtered(){const q=$('#search').value.toLowerCase(),f=$('#field').value,l=$('#level').value;return lessons.filter(t=>(f==='all'||t.field===f)&&(l==='all'||t.level===l)&&(!q||[t.field,t.level,t.title,t.summary,t.keywords.join(' ')].join(' ').toLowerCase().includes(q)));}
function renderChips(){const a=$('#field').value;$('#chips').innerHTML='<button class="chip '+(a==='all'?'active':'')+'" data-f="all">All</button>'+fields.map(f=>`<button class="chip ${a===f?'active':''}" data-f="${esc(f)}">${esc(f)}</button>`).join('');document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{$('#field').value=b.dataset.f;render();});}
function render(){renderChips();const xs=filtered();$('#grid').innerHTML=xs.length?xs.map(t=>`<div class="card" data-i="${t.id}"><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div>`).join(''):'<p>No topics found.</p>';document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openTopic(+c.dataset.i));}
function box(h,b,idiot){return `<div class="box">${idiot?`<div class="mini-idiot"><b>🤪 Idiot version</b><span>${esc(idiot)}</span></div>`:''}<h4>${h}</h4>${b}</div>`;}
function openTopic(i){
 if(window.renderSeparatedLesson){window.renderSeparatedLesson(i);return;}
 const t=lessons[i];if(!t)return;
 document.querySelectorAll('.topic-btn').forEach((b,n)=>b.classList.toggle('active',n===i));
 const practice=Array.isArray(t.practice)?t.practice:[];
 $('#detail').innerHTML=`<div class="detail">
 <div class="detail-top"><div><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div><button id="complete" class="complete ${completed.has(i)?'done':''}">${completed.has(i)?'✓ Completed':'Mark complete'}</button></div>
 <div class="lesson-nav"><a href="#idiotic">Idiotic</a><a href="#math">Math</a><a href="#code">Code</a><a href="#difference">Difference</a><a href="#practice">Practice</a></div>
 <section id="idiotic" class="lesson-section strict-lesson strict-idiotic"><h3>🤪 IDIOTIC — MEMORY ONLY</h3><div class="idiot-box"><p>${esc(t.idioticExplanation||t.idiotLesson||'')}</p></div></section>
 <section id="math" class="lesson-section strict-lesson strict-math"><h3>📐 MATHS — DEFINITION AND MATHEMATICS ONLY</h3>
 <div class="boxes">
 ${box('Definition',`<p>${esc(t.definition||t.math||'')}</p>`)}
 ${box('Why this concept exists',`<p>${esc(t.why||'')}</p>`)}
 ${box('Notation',`<pre class="formula">${esc(t.notation||'')}</pre>`)}
 ${box('Formula / theorem / law',`<pre class="formula">${esc(t.formula||'')}</pre>`)}
 ${box('Worked example',`<p>${esc(t.example||'')}</p>`)}
 ${box('Calculation steps',`<p>${esc(t.steps||t.humanMethod||'')}</p>`)}
 ${box('Exact vs approximate',`<p>${esc(t.exactVsApprox||'')}</p>`)}
 </div></section>
 <section id="code" class="lesson-section strict-lesson strict-code"><h3>💻 CODING — IMPLEMENTATION ONLY</h3>
 <div class="boxes">
 ${box('Data representation',`<pre class="code">${esc(t.representation||t.code||'')}</pre>`)}
 ${box('JavaScript implementation',`<pre class="code">${esc(t.javascript||t.js||'')}</pre>`)}
 ${box('Complexity',`<p>${esc(t.complexity||'')}</p>`)}
 ${box('Precision & numerical issues',`<p>${esc(t.precision||'')}</p>`)}
 ${box('Common implementation mistakes',`<p>${esc(t.mistakes||'')}</p>`)}
 </div></section>
 <section id="difference" class="lesson-section"><h3>Math ↔ Code difference</h3><div class="difference">${esc(t.differenceDetailed||t.difference||'')}</div></section>
 <section id="practice" class="lesson-section"><h3>Practice</h3><div class="practice-list">${practice.map((p,n)=>`<div><b>${n+1}. </b>${esc(p)}</div>`).join('')}</div></section>
 </div>`;
 $('#complete').onclick=()=>{completed.has(i)?completed.delete(i):completed.add(i);localStorage.setItem('mc-completed',JSON.stringify([...completed]));openTopic(i);updateProgress();};
}
function esc(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
function buildList(){$('#list').innerHTML=lessons.map(t=>`<button class="topic-btn" data-i="${t.id}"><span>${esc(t.field)}</span>${esc(t.title)}</button>`).join('');document.querySelectorAll('.topic-btn').forEach(b=>b.onclick=()=>openTopic(+b.dataset.i));}
function updateProgress(){const p=lessons.length?Math.round(completed.size/lessons.length*100):0;$('#pct').textContent=p+'%';$('#ring').style.background=`conic-gradient(var(--accent) ${p*3.6}deg,#e7e9ee 0deg)` ;$('#pTitle').textContent=p===100?'Curriculum complete':'Keep going';$('#pText').textContent=`${completed.size} of ${lessons.length} mapped lessons completed on this device.`;}
$('#search').oninput=render;$('#field').onchange=render;$('#level').onchange=render;
$('#run').onclick=()=>{const out=[];try{const fn=new Function('console',$('#editor').value);fn({log:(...a)=>out.push(a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' '))});$('#output').textContent=out.join('\n')||'Code ran with no console output.';}catch(e){$('#output').textContent='Error: '+e.message;}};
$('#clear').onclick=()=>$('#output').textContent='';
$('#reset').onclick=()=>{if(confirm('Reset local progress?')){completed.clear();localStorage.removeItem('mc-completed');updateProgress();}};
render();buildList();openTopic(0);updateProgress();

/* =========================================================
   LESSON UX UPGRADE
   Navigation, copy actions, keyboard controls
   ========================================================= */
(function(){
  function upgradeLesson(){
    const detail=document.querySelector('#detail .detail');
    if(!detail || detail.dataset.upgraded==='1') return;
    detail.dataset.upgraded='1';

    const cards=[...document.querySelectorAll('#list .topic-btn')];
    const active=cards.findIndex(b=>b.classList.contains('active'));
    const tools=document.createElement('div');
    tools.className='lesson-tools';
    tools.innerHTML='<button class="lesson-tool" data-lesson-prev '+(active<=0?'disabled':'')+'>← Previous</button><span>Lesson '+(active+1)+' / '+cards.length+'</span><button class="lesson-tool" data-lesson-next '+(active>=cards.length-1?'disabled':'')+'>Next →</button>';
    const top=detail.querySelector('.detail-top');
    if(top) top.insertAdjacentElement('afterend',tools);

    detail.querySelectorAll('pre.code').forEach(pre=>{
      const wrap=pre.parentElement;
      if(wrap.querySelector('.copy-code')) return;
      const btn=document.createElement('button');
      btn.className='lesson-tool copy-code';
      btn.type='button';
      btn.textContent='Copy JavaScript';
      btn.addEventListener('click',async()=>{
        try{
          await navigator.clipboard.writeText(pre.textContent);
          btn.textContent='✓ Copied';
          setTimeout(()=>btn.textContent='Copy JavaScript',1200);
        }catch{
          btn.textContent='Copy unavailable';
        }
      });
      const actions=document.createElement('div');
      actions.className='code-actions';
      actions.appendChild(btn);
      wrap.insertBefore(actions,pre);
    });

    const prev=tools.querySelector('[data-lesson-prev]');
    const next=tools.querySelector('[data-lesson-next]');
    prev?.addEventListener('click',()=>{if(active>0) cards[active-1].click();});
    next?.addEventListener('click',()=>{if(active<cards.length-1) cards[active+1].click();});
    tools.querySelector('span').textContent='Lesson '+(active+1)+' / '+cards.length;
  }

  const observer=new MutationObserver(upgradeLesson);
  const detail=document.querySelector('#detail');
  if(detail) observer.observe(detail,{childList:true,subtree:true});
  upgradeLesson();

  document.addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    const active=document.querySelector('#list .topic-btn.active');
    const cards=[...document.querySelectorAll('#list .topic-btn')];
    const i=cards.indexOf(active);
    if(e.key==='ArrowLeft' && i>0){e.preventDefault();cards[i-1].click();}
    if(e.key==='ArrowRight' && i>=0 && i<cards.length-1){e.preventDefault();cards[i+1].click();}
  });
})();
