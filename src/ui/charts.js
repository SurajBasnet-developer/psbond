// Lightweight SVG charts — no libraries.

export function barChart(values, labels, { height = 120 } = {}) {
  const max = Math.max(1, ...values);
  return `<div class="chart" style="height:${height}px">
    ${values.map((v, i) => `
      <div class="col" title="${labels[i]}: ${v}">
        <i style="height:${Math.round((v / max) * 100)}%"></i>
        <span>${labels[i]}</span>
      </div>`).join('')}
  </div>`;
}

export function streakCalendar(log, days = 28) {
  const cells = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));
  // align to week start (Monday)
  const dow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);
  const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  for (let i = 0; i < days + dow; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const k = key(d);
    const hit = log[k]?.sessions > 0 || log[k]?.min > 0;
    const isToday = k === key(today);
    cells.push(`<div class="day ${hit ? 'hit' : ''} ${isToday ? 'today' : ''}" title="${k}">${d.getDate()}</div>`);
  }
  return `<div class="cal-grid">${cells.join('')}</div>`;
}
