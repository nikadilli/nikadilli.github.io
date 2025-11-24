async function loadEvents() {
  const res = await fetch('events.json');
  const events = await res.json();

  const today = new Date();
  const futureEvents = events.filter(e => new Date(e.date) >= new Date(today.toDateString()));

  renderCalendar(futureEvents);
  renderList(futureEvents);
}

function renderCalendar(events) {
  const cal = document.getElementById('calendar');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let html = `<h2>${now.toLocaleString('sk-SK', { month: 'long' })} ${year}</h2>`;
  html += `<div class="grid">`;

  let offset = (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);
  for (let i = 0; i < offset; i++) html += `<div class="empty"></div>`;

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const ev = events.find(e => e.date === dateStr);

    html += `<div class="day ${ev ? 'has-event' : ''}" data-date="${dateStr}">
              ${day}
             </div>`;
  }

  html += `</div>`;
  cal.innerHTML = html;

  document.querySelectorAll('.day.has-event').forEach(d => {
    d.onclick = () => openPopup(events.find(e => e.date === d.dataset.date));
  });
}

function renderList(events) {
  const list = document.getElementById('event-list');
  let html = `<h2>Nadchádzajúce udalosti</h2>`;
  events.forEach(e => {
    html += `<div class="event" onclick="openPopup(${JSON.stringify(e).replace(/"/g, '&quot;')})">
              <strong>${e.title}</strong><br>
              <span class="badge">${e.category}</span><br>
              ${new Date(e.date).toLocaleDateString('sk-SK')}
            </div>`;
  });
  list.innerHTML = html;
}

function openPopup(e) {
  document.getElementById('popup-title').textContent = e.title;
  document.getElementById('popup-date').textContent = new Date(e.date).toLocaleDateString('sk-SK');
  document.getElementById('popup-description').textContent = e.description;
  document.getElementById('popup').classList.remove('hidden');
}

document.getElementById('close-popup').onclick = () => {
  document.getElementById('popup').classList.add('hidden');
};

loadEvents();