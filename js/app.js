const completed=new Set(JSON.parse(localStorage.getItem('mc-completed')||'[]'));
const $=s=>document.querySelector(s);
const lessons=window.LESSONS||[];
const fields=[...new Set(lessons.map(t=>t.field))];
$('#count').textContent=lessons.length;
fields.forEach(f=>$('#field').insertAdjacentHTML('beforeend',`<option>${esc(f)}</option>`));
function filtered(){const q=$('#search').value.toLowerCase(),f=$('#field').value,l=$('#level').value;return lessons.filter(t=>(f==='all'||t.field===f)&&(l==='all'||t.level===l)&&(!q||[t.field,t.level,t.title,t.summary,t.keywords.join(' ')].join(' ').toLowerCase().includes(q)));}
function renderChips(){const a=$('#field').value;$('#chips').innerHTML='<button class="chip '+(a==='all'?'active':'')+'" data-f="all">All</button>'+fields.map(f=>`<button class="chip ${a===f?'active':''}" data-f="${esc(f)}">${esc(f)}</button>`).join('');document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{$('#field').value=b.dataset.f;render();});}
function render(){renderChips();const xs=filtered();$('#grid').innerHTML=xs.length?xs.map(t=>`<div class="card" data-i="${t.id}"><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div>`).join(''):'<p>No topics found.</p>';document.querySelectorAll('.card').forEach(c=>c.onclick=()=>openTopic(+c.dataset.i));}
function box(h,b){return `<div class="box"><h4>${h}</h4>${b}</div>`;}
function openTopic(i){
 const t=lessons[i];if(!t)return;
 document.querySelectorAll('.topic-btn').forEach((b,n)=>b.classList.toggle('active',n===i));
 $('#detail').innerHTML=`<div class="detail"><div class="detail-top"><div><small>${esc(t.field)} · ${esc(t.level)}</small><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p></div><button id="complete" class="complete ${completed.has(i)?'done':''}">${completed.has(i)?'✓ Completed':'Mark complete'}</button></div>
 <div class="lesson-nav"><a href="#learn">Learn</a><a href="#math">Math</a><a href="#code">Code</a><a href="#difference">Difference</a><a href="#practice">Practice</a></div>
 <div id="learn" class="lesson-section"><h3>Learn the idea</h3><div class="idiot-box"><div class="idiot-label">🤪 IDIOTIC EXPLANATION — REMEMBER THIS</div><p>${esc(t.idioticExplanation)}</p><small>Funny on purpose. The formal definition below is the actual mathematics.</small></div><div class="boxes">${box('Definition',`<p>${esc(t.definition)}</p>`)}${box('Intuition',`<p>${esc(t.intuition)}</p>`)}${box('Human method',`<p>${esc(t.humanMethod)}</p>`)}${box('Level guidance',`<p>${esc(t.levelNote)}</p>`)}</div></div>
 <div id="math" class="lesson-section"><h3>Mathematics</h3><div class="boxes">${box('Notation / key formula',`<pre class="formula">${esc(t.notation)}</pre>`)}${box('Formula / law',`<pre class="formula">${esc(t.formula)}</pre>`)}${box('Worked example',`<p>${esc(t.example)}</p>`)}${box('Exact vs approximate',`<p>${esc(t.exactVsApprox)}</p>`)}</div></div>
 <div id="code" class="lesson-section"><h3>Computer implementation</h3><div class="boxes">${box('Representation',`<pre class="code">${esc(t.representation)}</pre>`)}${box('JavaScript implementation',`<pre class="code">${esc(t.javascript)}</pre>`)}${box('Complexity',`<p>${esc(t.complexity)}</p>`)}${box('Precision & numerical issues',`<p>${esc(t.precision)}</p>`)}</div></div>
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