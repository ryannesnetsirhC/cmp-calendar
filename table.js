/**
 * Builds the grid from computeCycles() (schedule.js), buckets everything
 * into month rows, and renders the table — including the weekend/holiday
 * markers, due-soon highlighting, and the role filter. No date math lives
 * here; see schedule.js.
 */
(function () {
  const { boardCycles, fcCycles, acctCycles, staffingModel } = computeCycles();

  // ---- Due-soon highlighting ----
  // Compares each date to today (whenever the page happens to be opened) —
  // no fixed dates here, so this stays correct every day on its own.
  const TODAY = new Date();

  function daysUntil(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const t = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    return Math.round((d - t) / 86400000);
  }

  function urgencyClass(date) {
    const days = daysUntil(date);
    if (days < 0) return "";
    if (days <= 5) return "due-soon due-orange";
    if (days <= 10) return "due-soon due-yellow";
    return "";
  }

  // Renders one date as an HTML snippet with * / † markers + tooltips.
  function renderDate(date, adjusted) {
    const holiday = holidayFor(date);
    let html = formatShort(date);
    if (adjusted) html += `<sup class="mk mk-wknd" title="Moved from a weekend to this Friday">*</sup>`;
    if (holiday) html += `<sup class="mk mk-holiday" title="${holiday}">&dagger;</sup>`;
    const cls = urgencyClass(date);
    return cls ? `<span class="${cls}">${html}</span>` : html;
  }

  function renderCell(dates) {
    if (!dates || dates.length === 0) return "";
    return dates.map((d) => renderDate(d.date, d.adjusted)).join("<br>");
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

  boardCycles.forEach((c) => {
    const bucket = rows[monthNameOf(c.boardMeeting.date)];
    bucket.boardMeeting.push(c.boardMeeting);
    bucket.boardMaterials.push(c.boardMaterials);
    bucket.finalFinancialReview.push(c.finalFinancialReview);
    bucket.financialReview.push(c.financialReview);
  });

  fcCycles.forEach((c) => {
    const bucket = rows[monthNameOf(c.financeCommittee.date)];
    bucket.financeCommittee.push(c.financeCommittee);
    bucket.financeCommitteeMaterials.push(c.financeCommitteeMaterials);
  });

  acctCycles.forEach((c) => {
    const bucket = rows[monthNameOf(c.acctClose.date)];
    bucket.acctClose.push(c.acctClose);
    bucket.docsToVertex.push(c.docsToVertex);
  });

  staffingModel.forEach((s) => {
    rows[monthNameOf(s.date)].staffingModel.push(s);
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