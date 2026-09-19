/**
 * Builds the grid from computeCycles() (schedule.js), buckets everything
 * into month rows, and renders the table — including the weekend/holiday
 * markers, the role filter, the editable cells, and the Save Changes
 * code generator. No date math lives here; see schedule.js.
 */
(function () {
  const { boardCycles, fcCycles, acctCycles } = computeCycles();

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
    if (days <= 5) return "due-orange";
    if (days <= 10) return "due-yellow";
    return "";
  }

  function markersFor(d) {
    const marks = [];
    if (d.adjusted) marks.push(`<sup class="mk mk-wknd" title="Moved from a weekend to this Friday">*</sup>`);
    const holiday = d.date ? holidayFor(d.date) : null;
    if (holiday) marks.push(`<sup class="mk mk-holiday" title="${holiday.label}">&dagger;</sup>`);
    if (d.tentative) marks.push(`<sup class="mk mk-tentative" title="Tentative — subject to change">&Dagger;</sup>`);
    return marks.join("");
  }

  // Renders one date as read-only HTML (Board Meeting, Finance Committee).
  function renderDate(date, adjusted) {
    const holiday = holidayFor(date);
    let html = formatShort(date);
    if (adjusted) html += `<sup class="mk mk-wknd" title="Moved from a weekend to this Friday">*</sup>`;
    if (holiday) html += `<sup class="mk mk-holiday" title="${holiday.label}">&dagger;</sup>`;
    const cls = urgencyClass(date);
    return cls ? `<span class="due-soon ${cls}">${html}</span>` : html;
  }

  function renderCell(dates) {
    if (!dates || dates.length === 0) return "";
    return dates.map((d) => renderDate(d.date, d.adjusted)).join("<br>");
  }

  // Editable cells render as plain clicked-to-look-like-text spans (same
  // look as the read-only columns) with a hidden <input type="date">
  // right behind them. Click the text to reveal the date picker; it
  // commits back to text on blur/change. Save Changes reads every
  // .cell-input directly, so this is purely a display-layer trick — the
  // underlying values and override logic are unchanged.
  function displaySpanHtml(d) {
    if (!d.date) return `<span class="cell-display cell-empty" tabindex="0">+ Add</span>`;
    const cls = urgencyClass(d.date);
    const marks = markersFor(d);
    const spanClasses = ["cell-display"];
    if (cls) spanClasses.push(cls);
    if (d.overridden) spanClasses.push("cell-overridden-text");
    return `<span class="${spanClasses.join(" ")}" tabindex="0">${formatShort(d.date)}${marks}</span>`;
  }

  // Renders one date as a click-to-edit cell (text by default, an
  // <input type="date"> underneath it).
  function renderEditableCell(dates) {
    if (!dates || dates.length === 0) return "";
    return dates
      .map((d) => {
        const iso = d.date ? toISO(d.date) : "";
        return `<div class="cell-edit">
          ${displaySpanHtml(d)}
          <input type="date" class="cell-input" data-col="${d.col}" data-anchor="${d.anchorISO}" data-default="${d.naturalISO}" value="${iso}" hidden>
        </div>`;
      })
      .join("");
  }

  // Recomputes a cell's display span after its input value changes.
  // Manual edits are never auto-rolled off a weekend and are never
  // treated as "tentative" (editing it is how you resolve tentative) —
  // but still get a holiday/weekend heads-up and the overridden style.
  function refreshDisplay(input) {
    const wrap = input.closest(".cell-edit");
    const span = wrap.querySelector(".cell-display");
    const iso = input.value;
    const def = input.dataset.default;
    if (!iso) {
      span.className = "cell-display cell-empty";
      span.textContent = "+ Add";
      return;
    }
    const date = parseISO(iso);
    let html = formatShort(date);
    const holiday = holidayFor(date);
    if (holiday) html += `<sup class="mk mk-holiday" title="${holiday.label}">&dagger;</sup>`;
    const day = date.getDay();
    if (day === 0 || day === 6) html += `<sup class="mk mk-wknd" title="Falls on a weekend">*</sup>`;
    const cls = urgencyClass(date);
    const overridden = iso !== def;
    const spanClasses = ["cell-display"];
    if (cls) spanClasses.push(cls);
    if (overridden) spanClasses.push("cell-overridden-text");
    span.className = spanClasses.join(" ");
    span.innerHTML = html;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function renderNotesCell(month) {
    const val = (typeof NOTES_OVERRIDES !== "undefined" && NOTES_OVERRIDES[month]) || "";
    return `<input type="text" class="cell-input notes-input" data-month="${month}" value="${esc(val)}" placeholder="Add a note...">`;
  }

  // ---- Build per-month buckets ----
  const rows = {};
  MONTH_ORDER.forEach((m) => {
    rows[m] = {
      docsToVertex: [], acctClose: [], staffingModel: [], spedSheetUpdatesDue: [], financialReview: [],
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
    bucket.staffingModel.push(c.staffingModel);
    bucket.spedSheetUpdatesDue.push(c.spedSheetUpdatesDue);
    bucket.principalMeeting.push(c.principalMeeting);
    bucket.principalMaterials.push(c.principalMaterials);
    bucket.payrollCheckIn.push(c.payrollCheckIn);
    bucket.codingCheckIn.push(c.codingCheckIn);
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
      const content = EDITABLE_COLUMNS.has(col.key) ? renderEditableCell(r[col.key]) : renderCell(r[col.key]);
      cells += `<td class="${cls}">${content}</td>`;
    });
    cells += `<td>${renderNotesCell(month)}</td>`;
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

  // ---- Click-to-edit wiring ----
  function openEditor(span) {
    const wrap = span.closest(".cell-edit");
    const input = wrap && wrap.querySelector(".cell-input");
    if (!input) return;
    span.hidden = true;
    input.hidden = false;
    input.focus();
    if (input.showPicker) {
      try { input.showPicker(); } catch (err) { /* not user-activated / unsupported */ }
    }
  }

  function closeEditor(input) {
    refreshDisplay(input);
    const wrap = input.closest(".cell-edit");
    const span = wrap && wrap.querySelector(".cell-display");
    input.hidden = true;
    if (span) span.hidden = false;
  }

  tbody.addEventListener("click", (e) => {
    const span = e.target.closest(".cell-display");
    if (span) openEditor(span);
  });

  tbody.addEventListener("keydown", (e) => {
    const span = e.target.closest(".cell-display");
    if (span && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openEditor(span);
    }
  });

  tbody.addEventListener("change", (e) => {
    if (e.target.matches(".cell-input[data-col]")) closeEditor(e.target);
  });

  // blur doesn't bubble, so this listener uses the capture phase.
  tbody.addEventListener(
    "blur",
    (e) => {
      if (e.target.matches && e.target.matches(".cell-input[data-col]") && !e.target.hidden) {
        closeEditor(e.target);
      }
    },
    true
  );

  // ---- Save Changes: generate an updated OVERRIDES / NOTES_OVERRIDES block ----
  const saveBtn = document.getElementById("saveChangesBtn");
  const saveOutput = document.getElementById("saveOutput");
  const saveCode = document.getElementById("saveCode");
  const copyBtn = document.getElementById("copyCodeBtn");
  const saveHint = document.getElementById("saveHint");

  function collectOverrides() {
    const overrides = {};
    tbody.querySelectorAll(".cell-input[data-col]").forEach((input) => {
      const col = input.dataset.col;
      const anchor = input.dataset.anchor;
      const val = input.value;
      const def = input.dataset.default;
      if (val && val !== def) {
        overrides[col] = overrides[col] || {};
        overrides[col][anchor] = val;
      }
    });
    const notes = {};
    tbody.querySelectorAll(".notes-input").forEach((input) => {
      const month = input.dataset.month;
      const val = input.value.trim();
      if (val) notes[month] = val;
    });
    return { overrides, notes };
  }

  function serialize(overrides, notes) {
    const lines = ["const OVERRIDES = {"];
    Object.keys(overrides).sort().forEach((col) => {
      lines.push(`  ${col}: {`);
      Object.keys(overrides[col]).sort().forEach((anchor) => {
        lines.push(`    "${anchor}": "${overrides[col][anchor]}",`);
      });
      lines.push("  },");
    });
    lines.push("};");
    lines.push("");
    lines.push("const NOTES_OVERRIDES = {");
    Object.keys(notes).forEach((month) => {
      lines.push(`  "${month}": ${JSON.stringify(notes[month])},`);
    });
    lines.push("};");
    return lines.join("\n");
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const { overrides, notes } = collectOverrides();
      saveCode.textContent = serialize(overrides, notes);
      saveOutput.hidden = false;
      saveHint.textContent = "";
      saveOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = saveCode.textContent;
      const done = () => { saveHint.textContent = "Copied!"; };
      const fail = () => { saveHint.textContent = "Couldn't copy automatically — select the text above and copy it manually."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fail);
      } else {
        fail();
      }
    });
  }
})();