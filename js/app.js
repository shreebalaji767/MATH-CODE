const completed=new Set(JSON.parse(localStorage.getItem('mc-completed')||'[]'));
const $=s=>document.querySelector(s);
let lessons=window.LESSONS||[];

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
fields.forEach(f=>$('#field').insertAdjacentHTML('beforeend',`<option>${esc(f)}</option>`));
function filtered(){const q=$('#search').value.toLowerCase(),f=$('#field').value,l=$('#level').value;return lessons.filter(t=>(f==='all'||t.field===f)&&(l==='all'||t.level===l)&&(!q||[t.field,t.level,t.title,t.summary,t.keywords.join(' ')].join(' ').toLowerCase().includes(q)));}
function renderChips(){const a=$('#field').value;$('#chips').innerHTML='<button class="chip '+(a==='all'?'active':'')+'" data-f="all">All</button>'+fields.map(f=>`<button class="chip ${a===f?'active':''}" data-f="${esc(f)}">${esc(f)}</button>`).join('');document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{$('#field').value=b.dataset.f;render();});}
function render(){renderChips();const xs=filtered();$('#grid').innerHTML=xs.length?xs.map(t=>`<div class="card" data-i="${t.id}"><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div>`).join(''):'<p>No topics found.</p>';document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openTopic(+c.dataset.i));}
function box(h,b,idiot){return `<div class="box">${idiot?`<div class="mini-idiot"><b>🤪 Idiot version</b><span>${esc(idiot)}</span></div>`:''}<h4>${h}</h4>${b}</div>`;}
function openTopic(i){
 const t=lessons[i];if(!t)return;
 document.querySelectorAll('.topic-btn').forEach((b,n)=>b.classList.toggle('active',n===i));
 $('#detail').innerHTML=`<div class="detail"><div class="detail-top"><div><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div><button id="complete" class="complete ${completed.has(i)?'done':''}">${completed.has(i)?'✓ Completed':'Mark complete'}</button></div>
 <div class="lesson-nav"><a href="#learn">Learn</a><a href="#math">Math</a><a href="#code">Code</a><a href="#difference">Difference</a><a href="#practice">Practice</a></div>
 <div id="learn" class="lesson-section"><h3>Learn the idea</h3><div class="idiot-box"><div class="idiot-label">🤪 IDIOTIC EXPLANATION — REMEMBER THIS</div><p>${esc(t.idioticExplanation)}</p><small>Funny on purpose. The formal definition below is the actual mathematics.</small></div><div class="boxes">${box('Definition',`<p>${esc(t.definition)}</p>`,t.mathIdioticExplanation)}${box('Intuition',`<p>${esc(t.intuition)}</p>`,t.idioticExplanation)}${box('Human method',`<p>${esc(t.humanMethod)}</p>`,t.mathIdioticExplanation)}${box('Level guidance',`<p>${esc(t.levelNote)}</p>`)}</div></div>
 <div id="math" class="lesson-section"><h3>Mathematics — actual calculation</h3><div class="boxes">${box('Notation / key formula',`<pre class="formula">${esc(t.notation)}</pre>`,t.mathIdioticExplanation)}${box('Formula / law',`<pre class="formula">${esc(t.formula)}</pre>`,t.idioticExplanation)}${box('Worked example',`<p>${esc(t.example)}</p>`,t.mathIdioticExplanation)}${box('Exact vs approximate',`<p>${esc(t.exactVsApprox)}</p>`)}</div></div>
 <div id="code" class="lesson-section"><h3>Computer implementation — actual JavaScript</h3><div class="code-idiot-box"><b>🤪 Coding idiot version</b><p>${esc(t.codeIdioticExplanation)}</p></div><div class="boxes">${box('Representation',`<pre class="code">${esc(t.representation)}</pre>`,t.codeIdioticExplanation)}${box('JavaScript implementation',`<pre class="code">${esc(t.javascript)}</pre>`,t.codeIdioticExplanation)}${box('Complexity',`<p>${esc(t.complexity)}</p>`)}${box('Precision & numerical issues',`<p>${esc(t.precision)}</p>`)}</div></div>
 <div id="difference" class="lesson-section"><h3>Math ↔ Code difference</h3><div class="difference">${esc(t.differenceDetailed)}</div><div class="boxes" style="margin-top:12px">${box('Common programming mistakes',`<p>${esc(t.mistakes)}</p>`)}${box('Related ideas',`<p>${t.related.map(x=>`<span class="tag">${esc(x)}</span>`).join(' ')}</p>`)}</div></div>
 <div id="practice" class="lesson-section"><h3>Practice & coding challenge</h3><div class="practice-list">${t.practice.map((p,n)=>`<div><b>${n+1}</b>${esc(p)}</div>`).join('')}</div></div></div>`;
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
