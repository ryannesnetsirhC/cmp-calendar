/**
 * Builds the schedule from ANCHORS in table-data.js (computing the
 * derived dates), buckets everything into month rows, and renders the
 * grid — including the weekend/holiday markers and the role filter
 * toggle. No editing needed here — update table-data.js instead.
 */
(function () {
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function parseISO(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function monthNameOf(date) {
    return MONTH_NAMES[date.getMonth()];
  }
  const MONTH_ABBR = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  function formatShort(date) {
    return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}`;
  }

  // Roll Sat/Sun back to the preceding Friday. Returns {date, adjusted}.
  function rollToFriday(date) {
    const day = date.getDay(); // 0 = Sun, 6 = Sat
    if (day === 6) return { date: addDays(date, -1), adjusted: true };
    if (day === 0) return { date: addDays(date, -2), adjusted: true };
    return { date, adjusted: false };
  }

  function holidayFor(date) {
    return HOLIDAYS[toISO(date)] || null;
  }

  // Renders one date as an HTML snippet with * / † markers + tooltips.
  function renderDate(date, adjusted) {
    const holiday = holidayFor(date);
    let html = formatShort(date);
    if (adjusted) html += `<sup class="mk mk-wknd" title="Moved from a weekend to this Friday">*</sup>`;
    if (holiday) html += `<sup class="mk mk-holiday" title="${holiday}">&dagger;</sup>`;
    return html;
  }

  function renderCell(dates) {
    // dates: array of Date (already rolled) — render each, stacked.
    if (!dates || dates.length === 0) return "";
    return dates
      .map((d) => renderDate(d.date, d.adjusted))
      .join("<br>");
  }

  // ---- Build per-month buckets ----
  const rows = {};
  MONTH_ORDER.forEach((m) => {
    rows[m] = {
      docsToVertex: [], acctClose: [], staffingModel: [], financialReview: [],
      principalMaterials: [], principalMeeting: [], financeCommitteeMaterials: [],
      finalFinancialReview: [], financeCommittee: [], boardMaterials: [],
      boardMeeting: [], payrollCheckIn: [], codingCheckIn: [],
    };
  });

  ANCHORS.boardMeetings.forEach((iso) => {
    const meeting = parseISO(iso);
    const rawMaterials = addDays(meeting, -3);
    const materials = rollToFriday(rawMaterials);
    const rawFinalReview = addDays(rawMaterials, -2);
    const finalReview = rollToFriday(rawFinalReview);
    const rawFinancialReview = addDays(rawFinalReview, -7);
    const financialReview = rollToFriday(rawFinancialReview);

    const bucket = rows[monthNameOf(meeting)];
    bucket.boardMeeting.push({ date: meeting, adjusted: false });
    bucket.boardMaterials.push(materials);
    bucket.finalFinancialReview.push(finalReview);
    bucket.financialReview.push(financialReview);
  });

  ANCHORS.staffingModel.forEach((iso) => {
    const sm = parseISO(iso);
    rows[monthNameOf(sm)].staffingModel.push({ date: sm, adjusted: false });
  });

  ANCHORS.financeCommittee.forEach((iso) => {
    const fc = parseISO(iso);
    const rawMaterials = addDays(fc, -1);
    const materials = rollToFriday(rawMaterials);

    const bucket = rows[monthNameOf(fc)];
    bucket.financeCommittee.push({ date: fc, adjusted: false });
    bucket.financeCommitteeMaterials.push(materials);
  });

  ANCHORS.accountingClose.forEach((iso) => {
    const close = parseISO(iso);
    const rawDocs = addDays(close, -6);
    const docs = rollToFriday(rawDocs);

    const bucket = rows[monthNameOf(close)];
    bucket.acctClose.push({ date: close, adjusted: false });
    bucket.docsToVertex.push(docs);
  });

  // ---- Render header ----
  document.getElementById("tableTitle").textContent = TABLE_META.title;
  document.getElementById("tableUpdated").textContent = TABLE_META.updated;
  document.getElementById("tableFootnote").textContent = TABLE_META.footnote;

  const theadLabels = document.getElementById("theadLabels");
  const theadOwners = document.getElementById("theadOwners");
  const theadCadence = document.getElementById("theadCadence");
  const tbody = document.getElementById("tbody");
  const filterBar = document.getElementById("filterBar");
  const tableScroll = document.getElementById("tableScroll");

  function roleClass(role) {
    return "col-" + (role || "none");
  }

  let labelsHtml = `<th class="corner">Activity</th>`;
  let ownersHtml = `<th class="corner">Owner/Participants</th>`;
  let cadenceHtml = `<th class="corner">Month/Day</th>`;

  TABLE_COLUMNS.forEach((col) => {
    const cls = roleClass(col.role);
    labelsHtml += `<th class="${cls}">${col.label}</th>`;
    ownersHtml += `<th class="${cls}">${col.owner || ""}</th>`;
    cadenceHtml += `<th class="${cls}">${col.cadence || ""}</th>`;
  });
  labelsHtml += `<th>Notes</th>`;
  ownersHtml += `<th></th>`;
  cadenceHtml += `<th></th>`;

  theadLabels.innerHTML = labelsHtml;
  theadOwners.innerHTML = ownersHtml;
  theadCadence.innerHTML = cadenceHtml;

  // ---- Render body ----
  let bodyHtml = "";
  MONTH_ORDER.forEach((month) => {
    const r = rows[month];
    let cells = `<td class="month-cell">${month}</td>`;
    TABLE_COLUMNS.forEach((col) => {
      const cls = roleClass(col.role);
      cells += `<td class="${cls}">${renderCell(r[col.key])}</td>`;
    });
    cells += `<td></td>`; // Notes column — left for you to fill in
    bodyHtml += `<tr>${cells}</tr>`;
  });
  tbody.innerHTML = bodyHtml;

  // ---- Role filter toggle ----
  filterBar.innerHTML = ROLE_FILTERS.map(
    (f, i) => `<button type="button" class="filter-btn${i === 0 ? " active" : ""}" data-filter="${f.key}">${f.label}</button>`
  ).join("");

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const key = btn.dataset.filter;
    tableScroll.className = "table-scroll"; // reset
    if (key !== "all") {
      tableScroll.classList.add("filter-active", "filter-" + key);
    }
  });
})();