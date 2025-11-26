
// Fetch events from data/events.json and render calendar + lists.
async function loadEvents(){
  const res = await fetch('data/events.json');
  const data = await res.json();
  window.NIVEN_EVENTS = data.events || [];
  renderCalendar();
  renderLists();
}

function parseDate(d){ return new Date(d); }

function renderCalendar(){
  const events = window.NIVEN_EVENTS;
  const container = document.getElementById('calendar-grid');
  container.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // current month
  const first = new Date(year, month, 1);
  const last = new Date(year, month+1, 0);
  const startDay = first.getDay(); // 0 Sunday
  const daysInMonth = last.getDate();

  // create blanks for week starting Monday (in SK typical Monday=1)
  const shift = (startDay + 6) % 7; // make Monday first
  for(let i=0;i<shift;i++){
    const el = document.createElement('div');
    el.className='day card';
    el.style.opacity=0.3;
    container.appendChild(el);
  }

  for(let d=1; d<=daysInMonth; d++){
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEl = document.createElement('div');
    dayEl.className='day card';
    dayEl.innerHTML = `<div class="date-num">${d}</div>`;
    const dayEvents = events.filter(e=> e.date===dateStr);
    dayEvents.slice(0,3).forEach(ev=>{
      const span = document.createElement('div');
      span.className='event-dot';
      span.innerHTML = `<span class="badge">${ev.category}</span> <a href="#" data-id="${ev.id}" class="open-event">${ev.title}</a>`;
      dayEl.appendChild(span);
    });
    if(dayEvents.length>3){
      const more = document.createElement('div');
      more.innerHTML = `<small class="meta">+${dayEvents.length-3} viac</small>`;
      dayEl.appendChild(more);
    }
    container.appendChild(dayEl);
  }

  // attach listeners
  document.querySelectorAll('.open-event').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.dataset.id;
      openModal(id);
    });
  });
}

function renderLists(){
  const events = window.NIVEN_EVENTS;
  const regular = document.getElementById('list-regular');
  const once = document.getElementById('list-once');
  regular.innerHTML=''; once.innerHTML='';

  events.forEach(ev=>{
    const item = document.createElement('div');
    item.className='event-item';
    item.innerHTML = `<div><strong>${ev.title}</strong><div class="meta">${ev.date} ${ev.time || ''}</div></div><div><span class="badge">${ev.category}</span></div>`;
    item.querySelector('.badge').style.marginLeft='6px';
    item.addEventListener('click', ()=>openModal(ev.id));
    if(ev.type==='regular') regular.appendChild(item);
    else once.appendChild(item);
  });
}

function openModal(id){
  const ev = window.NIVEN_EVENTS.find(x=>x.id===id);
  if(!ev) return;
  const modal = document.getElementById('modal');
  document.getElementById('modal-title').textContent = ev.title;
  document.getElementById('modal-body').innerHTML = `<p><strong>Dátum:</strong> ${ev.date} ${ev.time || ''}</p><p>${ev.description || ''}</p>`;
  modal.style.display='flex';
}

function closeModal(){ document.getElementById('modal').style.display='none'; }

document.addEventListener('click', (e)=>{
  if(e.target.classList.contains('modal')) closeModal();
  if(e.target.classList.contains('close-btn')) closeModal();
});

window.addEventListener('DOMContentLoaded', loadEvents);
