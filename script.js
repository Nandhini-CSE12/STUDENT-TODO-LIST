const $=id=>document.getElementById(id);
let tasks=[],filter='all',nextId=1;
const screens=[...document.querySelectorAll('.screen')];
function showScreen(n){screens.forEach((s,i)=>s.classList.toggle('active',i===n-1));$('stepProgress').style.width=(n*25)+'%';if(n===3)renderTasks();if(n===4)renderSummary();window.scrollTo({top:0,behavior:'smooth'});}
function toast(msg){const el=$('toast');el.textContent=msg;el.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display='none',2200)}
function addTask(name,due=''){name=name.trim();if(!name)return toast('Please type a task first.');tasks.push({id:nextId++,name,due,done:false});$('newTask').value='';$('dueDate').value='';renderTasks();toast('Task added to your list.')}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderTasks(){
 const list=$('taskList');let visible=tasks.filter(t=>filter==='all'||(filter==='completed'?t.done:!t.done));
 document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
 if(!visible.length){list.innerHTML='<div class="empty">'+(tasks.length?'No tasks in this filter.':'No tasks yet — add your first task above!')+'</div>';return}
 list.innerHTML=visible.map(t=>`<div class="task ${t.done?'done':''}"><input class="task-check" type="checkbox" aria-label="Mark ${escapeHtml(t.name)} complete" data-check="${t.id}" ${t.done?'checked':''}><div class="task-main"><div class="task-name">${escapeHtml(t.name)}</div><div class="task-meta">${t.due?'Due: '+escapeHtml(t.due):'Student task'}</div></div><span class="status">${t.done?'✓ Done':'Pending'}</span><button class="delete" data-delete="${t.id}" title="Delete task" aria-label="Delete ${escapeHtml(t.name)}">×</button></div>`).join('');
 list.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{const t=tasks.find(t=>t.id===Number(el.dataset.check));if(t){t.done=el.checked;renderTasks();if(t.done)toast('Nice work! Task completed ✓')}}));
 list.querySelectorAll('[data-delete]').forEach(el=>el.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==Number(el.dataset.delete));renderTasks();toast('Task deleted.')}));
}
function renderSummary(){
 const name=$('studentName').value.trim();$('greeting').textContent=name?`You're doing great, ${name}!`:"You're making progress!";
 const done=tasks.filter(t=>t.done),pending=tasks.filter(t=>!t.done),total=tasks.length,pct=total?Math.round(done.length/total*100):0;
 $('totalCount').textContent=total;$('doneCount').textContent=done.length;$('pendingCount').textContent=pending.length;$('percent').textContent=pct+'%';$('progressBar').style.width=pct+'%';
 $('completedSummary').innerHTML=done.length?done.map(t=>`<li>${escapeHtml(t.name)}</li>`).join(''):'<li>Nothing completed yet</li>';
 $('pendingSummary').innerHTML=pending.length?pending.map(t=>`<li>${escapeHtml(t.name)}</li>`).join(''):'<li>All tasks completed — great job!</li>';
}
$('to2').addEventListener('click',()=>{if(!$('studentName').value.trim())return toast('Please enter your name.');if(!$('studentAge').value||+$('studentAge').value<5||+$('studentAge').value>100)return toast('Please enter a valid age.');if(!$('learning').value.trim())return toast('Please tell us what you are learning.');showScreen(2)});
$('back1').addEventListener('click',()=>showScreen(1));
$('to3').addEventListener('click',()=>{const chosen=[...document.querySelectorAll('#screen2 input[type=checkbox]:checked')].map(e=>e.value);const other=$('otherTask').value.trim();if(other)chosen.push(other);chosen.forEach(n=>{if(!tasks.some(t=>t.name.toLowerCase()===n.toLowerCase()))tasks.push({id:nextId++,name:n,due:'',done:false})});showScreen(3)});
$('back2').addEventListener('click',()=>showScreen(2));
$('addTask').addEventListener('click',()=>addTask($('newTask').value,$('dueDate').value));
$('newTask').addEventListener('keydown',e=>{if(e.key==='Enter')addTask($('newTask').value,$('dueDate').value)});
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;renderTasks()}));
$('to4').addEventListener('click',()=>showScreen(4));$('back3').addEventListener('click',()=>showScreen(3));
$('startOver').addEventListener('click',()=>{if(!confirm('Start a new day? This will clear your current task list.'))return;tasks=[];nextId=1;filter='all';document.querySelectorAll('#screen2 input[type=checkbox]').forEach(e=>e.checked=false);$('otherTask').value='';showScreen(1);toast('Ready for a fresh start!')});
