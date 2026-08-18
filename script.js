// Study Bloom — cozy productivity app foundation
const $ = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

const STORAGE = {
  assignments: 'sb_assignments_v3', habits: 'sb_habits_v3', todos: 'sb_todos_v3',
  events: 'sb_events_v3', classes: 'sb_classes_v3', profile: 'sb_profile_v3',
  theme: 'sb_theme_v3', dark: 'sb_dark_v3', sessions: 'sb_sessions_v3'
};
const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let assignments = load(STORAGE.assignments, []);
let habits = load(STORAGE.habits, [
  {id:1,name:'Drink water',category:'health',completed:false},
  {id:2,name:'Study for 1 hour',category:'uni',completed:false},
  {id:3,name:'Read 20 pages',category:'personal',completed:false}
]);
let todos = load(STORAGE.todos, []);
let events = load(STORAGE.events, []);
let myClasses = load(STORAGE.classes, []);
let profile = load(STORAGE.profile, {name:'Study Bloom', dashboardTitle:'my dashboard', avatar:'', dashboardPhoto:'', dashboardPhotos:[]});
if(!Array.isArray(profile.dashboardPhotos)) profile.dashboardPhotos = profile.dashboardPhoto ? [profile.dashboardPhoto] : [];
if(!('dashboardPhoto' in profile)) profile.dashboardPhoto='';
let currentTheme = localStorage.getItem(STORAGE.theme) || 'pink';
let darkMode = localStorage.getItem(STORAGE.dark) === 'true';
let sessions = Number(localStorage.getItem(STORAGE.sessions) || 0);
let selectedDateString = null;
let calendarDate = new Date();
let selectedClass = null;
let selectedChapter = null;
let studyIndex = 0;
let studyAnswers = [];

// ---------- Opening ----------
const splash = $('splash');
const app = $('app');
function syncSplashTheme(){
  if(!splash) return;
  splash.classList.remove('theme-pink','theme-blue','theme-red','theme-yellow','theme-matcha','dark');
  splash.classList.add(`theme-${currentTheme}`);
  splash.classList.toggle('dark', darkMode);
}
function revealApp(){
  if(!splash.classList.contains('hidden')){
    splash.classList.add('hidden');
    app.classList.remove('hidden-app');
  }
}
syncSplashTheme();
setTimeout(revealApp, 1900);

// ---------- Profile / theme ----------
function applyTheme(){
  document.body.classList.remove('theme-pink','theme-blue','theme-red','theme-yellow','theme-matcha');
  document.body.classList.add(`theme-${currentTheme}`);
  document.body.classList.toggle('dark', darkMode);
  syncSplashTheme();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--accent').trim());
  qsa('.theme-choice').forEach(b=>b.classList.toggle('active', b.dataset.theme === currentTheme));
  $('darkModeToggle').checked = darkMode;
}
function avatarMarkup(target){
  if(profile.avatar) target.innerHTML = `<img src="${profile.avatar}" alt="Profile picture">`; else target.textContent = '♡';
}
function renderProfile(){
  $('dashboardTitle').textContent = profile.dashboardTitle || 'my dashboard';
  $('miniName').textContent = profile.name || 'Study Bloom';
  $('profileName').value = profile.name || '';
  $('profileDashboardTitle').value = profile.dashboardTitle || '';
  avatarMarkup($('miniAvatar')); avatarMarkup($('profileAvatarLarge'));
}
applyTheme(); renderProfile();

qsa('.theme-choice').forEach(b=>b.addEventListener('click',()=>{ currentTheme=b.dataset.theme; localStorage.setItem(STORAGE.theme,currentTheme); applyTheme(); }));
$('darkModeToggle').addEventListener('change',e=>{ darkMode=e.target.checked; localStorage.setItem(STORAGE.dark,darkMode); applyTheme(); });
function renderDashboardPhotoManager(){
  const box=$('dashboardPhotoManager');
  if(!box) return;
  const photos=profile.dashboardPhotos || [];
  box.innerHTML = photos.length ? photos.map((src,i)=>`<div class=\"dashboard-photo-thumb\"><img src=\"${src}\" alt=\"Dashboard photo ${i+1}\"><button type=\"button\" data-photo-index=\"${i}\" aria-label=\"Remove photo ${i+1}\">×</button></div>`).join('') : '<span class=\"muted small\">No custom photos yet — Study Bloom defaults will be used.</span>';
  box.querySelectorAll('[data-photo-index]').forEach(btn=>btn.addEventListener('click',()=>{
    profile.dashboardPhotos.splice(Number(btn.dataset.photoIndex),1);
    profile.dashboardPhoto = profile.dashboardPhotos[0] || '';
    save(STORAGE.profile,profile);
    renderDashboardPhotoManager(); renderPhoto();
  }));
}
$('saveProfile').addEventListener('click',()=>{
  profile.name = $('profileName').value.trim() || 'Study Bloom';
  profile.dashboardTitle = $('profileDashboardTitle').value.trim() || 'my dashboard';
  const file = $('profilePicture').files[0];
  const dashboardFiles = [...($('dashboardPicture').files || [])];
  if(dashboardFiles.length > 10){ showToast('Please choose no more than 10 dashboard photos.'); return; }
  const finish = ()=>{ save(STORAGE.profile,profile); renderProfile(); renderDashboardPhotoManager(); renderPhoto(); $('dashboardPicture').value=''; showToast('Profile saved ♡'); };
  const readDashboards = (next)=>{
    if(!dashboardFiles.length){ next(); return; }
    const readers=dashboardFiles.map(f=>new Promise(resolve=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.readAsDataURL(f); }));
    Promise.all(readers).then(results=>{
      const combined=[...(profile.dashboardPhotos||[]),...results].slice(0,10);
      profile.dashboardPhotos=combined; profile.dashboardPhoto=combined[0] || ''; next();
    });
  };
  const readAvatar = ()=>{
    if(!file){ readDashboards(finish); return; }
    const reader=new FileReader();
    reader.onload=()=>{ profile.avatar=reader.result; readDashboards(finish); };
    reader.readAsDataURL(file);
  };
  readAvatar();
});
$('removeDashboardPicture').addEventListener('click',()=>{
  profile.dashboardPhotos=[]; profile.dashboardPhoto='';
  save(STORAGE.profile,profile);
  $('dashboardPicture').value='';
  renderDashboardPhotoManager(); renderPhoto();
  showToast('Back to Study Bloom photos ♡');
});
$('editDashboardTitle').addEventListener('click',()=>{ $('dashboardTitleInput').value=profile.dashboardTitle || ''; openModal('titleModal'); });
$('saveDashboardTitle').addEventListener('click',()=>{ profile.dashboardTitle=$('dashboardTitleInput').value.trim()||'my dashboard'; save(STORAGE.profile,profile); renderProfile(); closeModal('titleModal'); });

// ---------- Navigation ----------
function navigate(page){
  qsa('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  qsa('.page').forEach(p=>p.classList.toggle('active-page',p.id===`${page}Page`));
  if(page==='calendar') renderCalendar();
  closeSidebar();
  window.scrollTo({top:0,behavior:'smooth'});
}
qsa('.nav-button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
$('mobileMenu').addEventListener('click',()=>{ $('sidebar').classList.add('open'); $('sidebarOverlay').classList.add('show'); });
$('sidebarOverlay').addEventListener('click',closeSidebar);
function closeSidebar(){ $('sidebar').classList.remove('open'); $('sidebarOverlay').classList.remove('show'); }

// ---------- Greeting / date ----------
function updateDateGreeting(){
  const now=new Date();
  $('today').textContent=now.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});
  const hour=now.getHours();
  $('greeting').textContent = hour < 12 ? 'Good morning! ☀️' : hour < 18 ? 'Good afternoon! 🌤️' : 'Good night! 🌙';
}
updateDateGreeting(); setInterval(updateDateGreeting,60000);

// ---------- Toast ----------
function showToast(message){
  let t=$('sbToast'); if(!t){ t=document.createElement('div'); t.id='sbToast'; t.style.cssText='position:fixed;right:20px;bottom:20px;z-index:500;background:var(--card-solid);border:1px solid var(--line);box-shadow:var(--shadow);padding:13px 16px;border-radius:14px;color:var(--text);font-weight:600;'; document.body.appendChild(t); }
  t.textContent=message; t.style.opacity='1'; clearTimeout(t._timer); t._timer=setTimeout(()=>t.style.opacity='0',2600);
}

// ---------- Assignments ----------
const priorityInfo={urgent:{label:'High',class:'priority-urgent'},medium:{label:'Medium',class:'priority-medium'},low:{label:'Low',class:'priority-low'}};
const reminderLabels={none:'No reminder','10m':'10 minutes before','30m':'30 minutes before','1d':'1 day before','2d':'2 days before','3d':'3 days before','4d':'4 days before','5d':'5 days before'};
function assignmentFormClear(){ $('assignmentName').value=''; $('assignmentCourse').value=''; $('assignmentDate').value=''; $('assignmentTime').value='23:59'; $('assignmentPriority').value='urgent'; $('assignmentReminder').value='none'; }
$('addAssignmentButton').addEventListener('click',()=>$('assignmentForm').classList.toggle('hidden'));
$('cancelAssignment').addEventListener('click',()=>{ $('assignmentForm').classList.add('hidden'); assignmentFormClear(); });
$('dashboardAddAssignment').addEventListener('click',()=>{navigate('assignments');$('assignmentForm').classList.remove('hidden');});
$('saveAssignment').addEventListener('click',()=>{
  const name=$('assignmentName').value.trim(), course=$('assignmentCourse').value.trim(), date=$('assignmentDate').value, time=$('assignmentTime').value || '23:59';
  if(!name||!date){showToast('Please add an assignment name and due date.');return;}
  assignments.push({id:Date.now(),name,course,date,time,priority:$('assignmentPriority').value,reminder:$('assignmentReminder').value,completed:false,reminded:false});
  save(STORAGE.assignments,assignments); assignmentFormClear(); $('assignmentForm').classList.add('hidden'); renderAll(); showToast('Assignment saved ♡');
});
function assignmentDateText(date){ return new Date(date+'T00:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
function createAssignmentElement(a){
  const d=document.createElement('article'); const p=priorityInfo[a.priority]||priorityInfo.low; d.className=`assignment ${p.class} ${a.completed?'completed':''}`;
  d.innerHTML=`<div class="assignment-info"><strong>${escapeHtml(a.name)}</strong><p>${escapeHtml(a.course||'University')} · Due ${assignmentDateText(a.date)}</p></div><div class="assignment-meta"><span class="priority-chip">${p.label}</span><span class="muted">${reminderLabels[a.reminder||'none']}</span></div><div class="assignment-actions"><button class="icon-button complete-assignment" type="button">${a.completed?'↩':'✓'}</button><button class="icon-button delete-assignment" type="button">🗑</button></div>`;
  d.querySelector('.complete-assignment').onclick=()=>{a.completed=!a.completed;save(STORAGE.assignments,assignments);renderAll();};
  d.querySelector('.delete-assignment').onclick=()=>{assignments=assignments.filter(x=>x.id!==a.id);save(STORAGE.assignments,assignments);renderAll();}; return d;
}
function displayAssignments(){
  const list=$('assignmentList'), dash=$('dashboardAssignmentList'); list.innerHTML=''; dash.innerHTML='';
  [...assignments].sort((a,b)=>a.date.localeCompare(b.date)).forEach((a,i)=>{list.appendChild(createAssignmentElement(a)); if(i<4) dash.appendChild(createAssignmentElement(a));});
  $('assignmentCount').textContent=assignments.filter(a=>!a.completed).length;
  if(!assignments.length) { list.innerHTML='<div class="muted">No assignments yet. Add your first one above ♡</div>'; dash.innerHTML='<div class="muted">Your upcoming work will appear here.</div>'; }
}

// ---------- Habits ----------
function habitElement(h){ const el=document.createElement('div');el.className='habit';el.innerHTML=`<label class="habit-left"><input type="checkbox" ${h.completed?'checked':''}><span>${escapeHtml(h.name)}</span></label><button class="habit-delete" type="button">🗑</button>`; el.querySelector('input').onchange=e=>{h.completed=e.target.checked;save(STORAGE.habits,habits);renderAll();};el.querySelector('.habit-delete').onclick=()=>{habits=habits.filter(x=>x.id!==h.id);save(STORAGE.habits,habits);renderAll();};return el; }
function displayHabits(){
  ['personal','uni','health'].forEach(cat=>{const box=$(`${cat}Habits`);box.innerHTML='';habits.filter(h=>h.category===cat).forEach(h=>box.appendChild(habitElement(h)));if(!box.children.length)box.innerHTML='<p class="muted">Nothing here yet. Add a little habit ♡</p>';});
  const done=habits.filter(h=>h.completed).length;$('habitProgress').textContent=`${done}/${habits.length}`;$('habitStreak').textContent=done?Math.max(1,Math.min(99,done)):0;
  const dash=$('dashboardHabitList');dash.innerHTML='';habits.slice(0,4).forEach(h=>dash.appendChild(habitElement(h)));if(!habits.length)dash.innerHTML='<div class="muted">Add your first habit.</div>';
}
qsa('.add-habit-category').forEach(b=>b.addEventListener('click',()=>{ $('habitCategory').value=b.dataset.category; $('habitForm').classList.remove('hidden'); $('habitName').focus(); }));
$('dashboardAddHabit').addEventListener('click',()=>{navigate('habits');$('habitForm').classList.remove('hidden');$('habitName').focus();});
$('cancelHabit').addEventListener('click',()=>{$('habitForm').classList.add('hidden');$('habitName').value='';});
$('saveHabit').addEventListener('click',()=>{const name=$('habitName').value.trim();if(!name){showToast('Give your habit a name first ♡');return;}habits.push({id:Date.now(),name,category:$('habitCategory').value,completed:false});save(STORAGE.habits,habits);$('habitName').value='';$('habitForm').classList.add('hidden');renderAll();});

// ---------- Todo ----------
$('addTodoButton').onclick=()=>$('todoForm').classList.remove('hidden'); $('cancelTodo').onclick=()=>$('todoForm').classList.add('hidden');
$('saveTodo').onclick=()=>{const name=$('todoName').value.trim();if(!name){showToast('Please add a task.');return;}todos.push({id:Date.now(),name,completed:false});save(STORAGE.todos,todos);$('todoName').value='';$('todoForm').classList.add('hidden');displayTodos();updateProgress();};
function displayTodos(){const list=$('todoList');list.innerHTML='';if(!todos.length){list.innerHTML='<p class="muted">No tasks yet. A clear desk is a happy desk ♡</p>';return;}todos.forEach(t=>{const el=document.createElement('div');el.className='todo';el.innerHTML=`<label class="todo-left"><input type="checkbox" ${t.completed?'checked':''}><span>${escapeHtml(t.name)}</span></label><button class="habit-delete" type="button">🗑</button>`;el.querySelector('input').onchange=e=>{t.completed=e.target.checked;save(STORAGE.todos,todos);updateProgress();};el.querySelector('.habit-delete').onclick=()=>{todos=todos.filter(x=>x.id!==t.id);save(STORAGE.todos,todos);displayTodos();updateProgress();};list.appendChild(el);});}

// ---------- Calendar + events ----------
$('previousMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();}; $('nextMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();};
function renderCalendar(){
  const year=calendarDate.getFullYear(), month=calendarDate.getMonth(); $('calendarTitle').textContent=calendarDate.toLocaleDateString(undefined,{month:'long',year:'numeric'}); const box=$('calendarDays');box.innerHTML='';
  let start=new Date(year,month,1).getDay();start=start===0?6:start-1;const count=new Date(year,month+1,0).getDate();
  for(let i=0;i<start;i++){const e=document.createElement('div');e.className='calendar-day empty';box.appendChild(e);}
  for(let day=1;day<=count;day++){const cell=document.createElement('div');cell.className='calendar-day';const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;const num=document.createElement('div');num.className='calendar-day-number';num.textContent=day;cell.appendChild(num);const now=new Date();if(day===now.getDate()&&month===now.getMonth()&&year===now.getFullYear())cell.classList.add('today');
    assignments.filter(a=>a.date===ds).slice(0,3).forEach(a=>{const d=document.createElement('span');d.className=`assignment-dot ${priorityInfo[a.priority]?.class||'priority-low'}`;d.textContent=`📚 ${a.name}`;cell.appendChild(d);});
    events.filter(e=>e.date===ds).slice(0,2).forEach(e=>{const d=document.createElement('span');d.className='event-dot';d.textContent=`♡ ${e.name}`;cell.appendChild(d);});
    cell.onclick=()=>showSelectedDate(ds);box.appendChild(cell);
  }
}
function showSelectedDate(ds){selectedDateString=ds;$('selectedDatePanel').classList.remove('hidden');const d=new Date(ds+'T00:00:00');$('selectedDateTitle').textContent=d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'});const box=$('selectedDateItems');box.innerHTML='';const as=assignments.filter(a=>a.date===ds), es=events.filter(e=>e.date===ds);if(!as.length&&!es.length)box.innerHTML='<p class="muted">Nothing scheduled yet. Add something nice ♡</p>';as.forEach(a=>{const p=priorityInfo[a.priority]||priorityInfo.low;const el=document.createElement('div');el.className='date-item';el.innerHTML=`<strong>${escapeHtml(a.name)}</strong><p class="muted">📚 ${escapeHtml(a.course||'University')} · <span class="priority-chip">${p.label}</span></p>`;box.appendChild(el);});es.forEach(e=>{const el=document.createElement('div');el.className='date-item';el.innerHTML=`<strong>♡ ${escapeHtml(e.name)}</strong><p class="muted">Personal event</p>`;box.appendChild(el);});}
$('addEventButton').onclick=()=>{ $('eventDate').value=selectedDateString||formatDate(new Date()); openModal('eventModal'); };
$('saveEvent').onclick=()=>{const name=$('eventName').value.trim(),date=$('eventDate').value;if(!name||!date){showToast('Add an event name and date.');return;}events.push({id:Date.now(),name,date});save(STORAGE.events,events);$('eventName').value='';closeModal('eventModal');renderCalendar();if(selectedDateString===date)showSelectedDate(date);showToast('Event added ♡');};

// ---------- Photos ----------
const defaultPhotos=['assets/photo1.jpeg','assets/photo2.jpeg','assets/photo3.jpeg'];let photoIndex=0;function renderPhoto(){ const custom=profile.dashboardPhotos||[]; const photos=custom.length?custom:defaultPhotos; if(photoIndex>=photos.length) photoIndex=0; $('stackImage').src=photos[photoIndex]; $('photoNumber').textContent=`${photoIndex+1} / ${photos.length}`; $('previousPhoto').disabled=photos.length<=1; $('nextPhoto').disabled=photos.length<=1; } $('previousPhoto').onclick=()=>{const photos=(profile.dashboardPhotos||[]).length?profile.dashboardPhotos:defaultPhotos;photoIndex=(photoIndex+photos.length-1)%photos.length;renderPhoto();};$('nextPhoto').onclick=()=>{const photos=(profile.dashboardPhotos||[]).length?profile.dashboardPhotos:defaultPhotos;photoIndex=(photoIndex+1)%photos.length;renderPhoto();};renderPhoto();renderDashboardPhotoManager();

// ---------- Progress ----------
function updateProgress(){const total=assignments.length+habits.length+todos.length;const done=assignments.filter(a=>a.completed).length+habits.filter(h=>h.completed).length+todos.filter(t=>t.completed).length;const pct=total?Math.round(done/total*100):0;$('progressFill').style.width=`${pct}%`;$('progressText').textContent=`${pct}%`;$('progressDetails').textContent=total?`${done} of ${total} little tasks completed today.`:'Complete an assignment, habit, or task to grow your progress.';}

// ---------- Classes / chapters / flashcards ----------
$('addClassButton').onclick=()=>{const name=prompt('Class name?');if(!name?.trim())return;myClasses.push({id:Date.now(),name:name.trim(),chapters:[]});save(STORAGE.classes,myClasses);renderClasses();};
function renderClasses(){const box=$('classesContainer');box.innerHTML='';if(!myClasses.length){box.innerHTML='<div class="class-card"><strong>No classes yet</strong><p class="muted">Add your university classes to begin.</p></div>';return;}myClasses.forEach(c=>{const card=document.createElement('div');card.className='class-card';card.innerHTML=`<strong>📚 ${escapeHtml(c.name)}</strong><p class="muted">${c.chapters.length} chapter${c.chapters.length===1?'':'s'}</p>`;card.onclick=()=>openClass(c.id);box.appendChild(card);});}
function openClass(id){selectedClass=myClasses.find(c=>c.id===id);$('classesContainer').classList.add('hidden');$('classDetails').classList.remove('hidden');$('selectedClassName').textContent=selectedClass.name;renderChapters();}
$('backToClasses').onclick=()=>{$('classDetails').classList.add('hidden');$('classesContainer').classList.remove('hidden');selectedClass=null;};
$('addChapterButton').onclick=()=>{if(!selectedClass)return;const name=prompt('Chapter name?');if(!name?.trim())return;selectedClass.chapters.push({id:Date.now(),name:name.trim(),flashcards:[]});save(STORAGE.classes,myClasses);renderChapters();};
function renderChapters(){const box=$('chapterContainer');box.innerHTML='';if(!selectedClass.chapters.length){box.innerHTML='<div class="chapter-card"><strong>No chapters yet</strong><p class="muted">Add one to start making flashcards.</p></div>';return;}selectedClass.chapters.forEach(ch=>{const el=document.createElement('div');el.className='chapter-card';el.innerHTML=`<strong>📖 ${escapeHtml(ch.name)}</strong><p class="muted">${ch.flashcards.length} flashcards</p>`;el.onclick=()=>openChapter(ch.id);box.appendChild(el);});}
function openChapter(id){selectedChapter=selectedClass.chapters.find(c=>c.id===id);$('classDetails').classList.add('hidden');$('flashcardView').classList.remove('hidden');$('selectedChapterName').textContent=`🧠 ${selectedChapter.name}`;renderFlashcards();}
$('backToChapters').onclick=()=>{$('flashcardView').classList.add('hidden');$('classDetails').classList.remove('hidden');selectedChapter=null;};
$('addFlashcardButton').onclick=()=>$('flashcardForm').classList.remove('hidden');$('cancelFlashcardButton').onclick=()=>$('flashcardForm').classList.add('hidden');
$('saveFlashcardButton').onclick=()=>{if(!selectedChapter)return;const q=$('flashcardQuestion').value.trim(),a=$('flashcardAnswer').value.trim();if(!q||!a){showToast('Add both the question and answer.');return;}selectedChapter.flashcards.push({id:Date.now(),question:q,answer:a});save(STORAGE.classes,myClasses);$('flashcardQuestion').value='';$('flashcardAnswer').value='';$('flashcardForm').classList.add('hidden');renderFlashcards();};
function renderFlashcards(){const box=$('flashcardList');box.innerHTML='';if(!selectedChapter.flashcards.length){box.innerHTML='<p class="muted">No flashcards yet.</p>';return;}selectedChapter.flashcards.forEach((c,i)=>{const el=document.createElement('div');el.className='flashcard';el.innerHTML=`<div class="flashcard-inner"><div class="flashcard-face"><span>CARD ${i+1}</span><h3>${escapeHtml(c.question)}</h3><p>Click to reveal</p></div><div class="flashcard-face flashcard-back"><span>ANSWER</span><p>${escapeHtml(c.answer)}</p><button class="delete-flashcard" type="button">🗑</button></div></div>`;el.onclick=e=>{if(!e.target.closest('.delete-flashcard'))el.classList.toggle('flipped');};el.querySelector('.delete-flashcard').onclick=e=>{e.stopPropagation();selectedChapter.flashcards.splice(i,1);save(STORAGE.classes,myClasses);renderFlashcards();};box.appendChild(el);});}
$('fullscreenFlashcards').onclick=openStudyMode;$('startStudyTimer').onclick=()=>{navigate('dashboard');startPomodoro();showToast('Focus café started 🍵');};
function openStudyMode(){if(!selectedChapter?.flashcards.length){showToast('Add some flashcards first ♡');return;}studyIndex=0;studyAnswers=new Array(selectedChapter.flashcards.length).fill(null);$('studyResult').classList.add('hidden');$('studyMode').classList.remove('hidden');showStudyCard();}
function showStudyCard(){const c=selectedChapter.flashcards[studyIndex];$('studyCardNumber').textContent=`${studyIndex+1} / ${selectedChapter.flashcards.length}`;$('studyScore').textContent=`Score: ${studyAnswers.filter(x=>x===true).length}`;$('studyQuestion').textContent=c.question;$('studyAnswer').textContent=c.answer;$('studyAnswer').classList.add('hidden');}
$('studyCard').onclick=()=>$('studyAnswer').classList.toggle('hidden');
function markStudy(value){studyAnswers[studyIndex]=value;$('studyScore').textContent=`Score: ${studyAnswers.filter(x=>x===true).length}`;if(studyIndex===selectedChapter.flashcards.length-1){const correct=studyAnswers.filter(x=>x===true).length;const total=studyAnswers.length;const unanswered=studyAnswers.filter(x=>x===null).length;$('studyResult').classList.remove('hidden');$('studyResult').textContent=`Set complete ✨ ${correct}/${total} correct (${Math.round(correct/total*100)}%).${unanswered?' Some cards were left unanswered.':''}`;}else{studyIndex++;showStudyCard();}}
$('studyRight').onclick=()=>markStudy(true);$('studyWrong').onclick=()=>markStudy(false);$('studyNext').onclick=()=>{if(studyIndex<selectedChapter.flashcards.length-1){studyIndex++;showStudyCard();}};$('studyPrevious').onclick=()=>{if(studyIndex>0){studyIndex--;showStudyCard();}};$('exitStudyMode').onclick=()=>$('studyMode').classList.add('hidden');

// ---------- Pomodoro / Focus Café ----------
let pomodoroTime=25*60, pomodoroMode='study', pomodoroRunning=false, pomodoroInterval=null, drink='matcha';
function updateBrewVisual(){const total=pomodoroMode==='study'?25*60:5*60;const progress=Math.max(0,Math.min(1,1-pomodoroTime/total));$('drinkLiquid').style.height=`${25+progress*65}%`;$('drinkLiquid').classList.toggle('coffee',drink==='coffee');$('brewStage').classList.toggle('brewing',pomodoroRunning);$('brewStage').classList.toggle('ready',pomodoroTime<=3&&pomodoroRunning===false);$('brewStage').classList.toggle('hot',false);$('brewStatus').textContent=pomodoroMode==='break'?'break time':pomodoroRunning?'brewing…':'ready to brew';if(pomodoroMode==='break')$('brewMessage').textContent='Take a breath. Your drink is ready ♡';else if(pomodoroRunning)$('brewMessage').textContent=drink==='matcha'?'Matcha is slowly coming together…':'Your iced coffee is coming together…';else if(pomodoroTime===25*60)$('brewMessage').textContent=drink==='matcha'?'Your matcha is waiting for you.':'Your iced coffee is waiting for you.';}
function updatePomodoroDisplay(){const m=Math.floor(pomodoroTime/60),s=pomodoroTime%60;$('pomodoroTimer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('pomodoroMode').textContent=pomodoroMode==='study'?'📚 Study Time':'🌷 Break Time';$('pomodoroSessions').textContent=`Sessions completed: ${sessions}`;updateBrewVisual();}
qsa('.drink-option').forEach(b=>b.onclick=()=>{if(pomodoroRunning)return;drink=b.dataset.drink;qsa('.drink-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');updatePomodoroDisplay();});
function playBell(){try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const t=ctx.currentTime;[0,1.6].forEach((offset,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(i?1046:784,t+offset);osc.frequency.exponentialRampToValueAtTime(i?880:520,t+offset+.65);gain.gain.setValueAtTime(.0001,t+offset);gain.gain.exponentialRampToValueAtTime(.17,t+offset+.03);gain.gain.exponentialRampToValueAtTime(.0001,t+offset+.7);osc.connect(gain);gain.connect(ctx.destination);osc.start(t+offset);osc.stop(t+offset+.72);});}catch(e){}}
function finishPomodoro(){clearInterval(pomodoroInterval);pomodoroInterval=null;pomodoroRunning=false;playBell();if(pomodoroMode==='study'){sessions++;localStorage.setItem(STORAGE.sessions,sessions);pomodoroMode='break';pomodoroTime=5*60;showToast('🔔 Your drink is ready! Time for a little break ♡');}else{pomodoroMode='study';pomodoroTime=25*60;showToast('🔔 Break finished — ready for another cup?');}updatePomodoroDisplay();updateProgress();}
function startPomodoro(){if(pomodoroRunning)return;pomodoroRunning=true;updateBrewVisual();pomodoroInterval=setInterval(()=>{pomodoroTime--;if(pomodoroTime<=0)finishPomodoro();else updatePomodoroDisplay();},1000);}
function pausePomodoro(){clearInterval(pomodoroInterval);pomodoroInterval=null;pomodoroRunning=false;updatePomodoroDisplay();}
function resetPomodoro(){pausePomodoro();pomodoroTime=pomodoroMode==='study'?25*60:5*60;updatePomodoroDisplay();}
$('pomodoroStart').onclick=startPomodoro;$('pomodoroPause').onclick=pausePomodoro;$('pomodoroReset').onclick=resetPomodoro;$('pomodoroStudy').onclick=()=>{pausePomodoro();pomodoroMode='study';pomodoroTime=25*60;updatePomodoroDisplay();};$('pomodoroBreak').onclick=()=>{pausePomodoro();pomodoroMode='break';pomodoroTime=5*60;updatePomodoroDisplay();};

// ---------- Notifications ----------
$('notificationPermission').onclick=async()=>{if(!('Notification' in window)){ $('notificationStatus').textContent='This browser does not support notifications.';return;}const p=await Notification.requestPermission();$('notificationStatus').textContent=p==='granted'?'Notifications enabled ♡':'Notifications were not enabled.';};
qsa('.auth-demo').forEach(b=>b.onclick=()=>{ $('authStatus').textContent=`${b.dataset.provider} sign-in needs your OAuth project credentials. The interface is ready; we will connect the real provider during the account/backend step.`; });

// ---------- Modals ----------
function openModal(id){$(id).classList.remove('hidden');}function closeModal(id){$(id).classList.add('hidden');}qsa('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));qsa('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m.id);}));

function formatDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

function checkReminders(){
  if(!('Notification' in window)||Notification.permission!=='granted')return;const now=Date.now();
  assignments.forEach(a=>{if(!a.reminder||a.reminder==='none'||a.completed||a.reminded)return;const due=new Date(a.date+'T'+(a.time||'23:59')+':00').getTime();const mins={ '10m':10,'30m':30,'1d':1440,'2d':2880,'3d':4320,'4d':5760,'5d':7200}[a.reminder];if(mins && now>=due-mins*60000 && now<=due+60000){new Notification('Study Bloom reminder',{body:`${a.name} is due ${assignmentDateText(a.date)}.`});a.reminded=true;save(STORAGE.assignments,assignments);}});
}
setInterval(checkReminders,30000);

function renderAll(){displayAssignments();displayHabits();displayTodos();renderCalendar();updateProgress();renderClasses();updatePomodoroDisplay();}
renderPhoto();renderAll();
