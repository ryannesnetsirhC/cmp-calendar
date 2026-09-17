/**
 * Renders the month-grid calendar and the "Upcoming Dates" list
 * from the data in events.js. No editing needed here to add events.
 */

(function () {
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Index events by "YYYY-MM-DD" for fast lookup
  const eventsByDate = {};
  EVENTS.forEach((ev) => {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    eventsByDate[ev.date].push(ev);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth(); // 0-indexed

  const monthLabelEl = document.getElementById("monthLabel");
  const gridEl = document.getElementById("calendarGrid");
  const weekdayRowEl = document.getElementById("weekdayRow");
  const legendEl = document.getElementById("legend");
  const upcomingListEl = document.getElementById("upcomingList");

  function toISODate(y, m, d) {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  function renderWeekdayRow() {
    weekdayRowEl.innerHTML = WEEKDAYS.map((w) => `<div>${w}</div>`).join("");
  }

  function renderLegend() {
    legendEl.innerHTML = Object.entries(CATEGORIES)
      .map(
        ([key, cat]) => `
        <span class="legend-item">
          <span class="legend-dot" style="background:${cat.color}"></span>
          ${cat.label}
        </span>`
      )
      .join("");
  }

  function renderCalendar() {
    monthLabelEl.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let cells = "";

    for (let i = 0; i < startOffset; i++) {
      cells += `<div class="day-cell empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const iso = toISODate(viewYear, viewMonth, day);
      const dayEvents = eventsByDate[iso] || [];
      const isToday =
        viewYear === today.getFullYear() &&
        viewMonth === today.getMonth() &&
        day === today.getDate();

      const eventsHtml = dayEvents
        .map((ev) => {
          const color = (CATEGORIES[ev.category] || CATEGORIES.other).color;
          return `<div class="day-event" style="background:${color}" title="${ev.title}">${ev.title}</div>`;
        })
        .join("");

      cells += `
        <div class="day-cell${isToday ? " today" : ""}">
          <div class="day-number">${day}</div>
          <div class="day-events">${eventsHtml}</div>
        </div>`;
    }

    gridEl.innerHTML = cells;
  }

  function renderUpcoming() {
    const upcoming = EVENTS.filter((ev) => new Date(ev.date + "T00:00:00") >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8);

    if (upcoming.length === 0) {
      upcomingListEl.innerHTML = `<li class="upcoming-empty">No upcoming dates yet — add some in events.js.</li>`;
      return;
    }

    upcomingListEl.innerHTML = upcoming
      .map((ev) => {
        const d = new Date(ev.date + "T00:00:00");
        const label = d.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        return `
          <li class="upcoming-item">
            <div class="upcoming-date">${label}</div>
            <div class="upcoming-title">${ev.title}</div>
            ${ev.note ? `<div class="upcoming-note">${ev.note}</div>` : ""}
          </li>`;
      })
      .join("");
  }

  document.getElementById("prevMonth").addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    renderCalendar();
  });

  renderWeekdayRow();
  renderLegend();
  renderCalendar();
  renderUpcoming();
})();
