/**
 * Renders the spreadsheet-style grid in table.html from table-data.js.
 * No editing needed here — update table-data.js instead.
 */
(function () {
  document.getElementById("tableTitle").textContent = TABLE_META.title;
  document.getElementById("tableUpdated").textContent = "Updated " + TABLE_META.updated;
  document.getElementById("tableFootnote").textContent = TABLE_META.footnote;

  const theadOwners = document.getElementById("theadOwners");
  const theadCadence = document.getElementById("theadCadence");
  const theadLabels = document.getElementById("theadLabels");
  const tbody = document.getElementById("tbody");

  // Header rows: Activity label / Owner / Month-Day cadence
  let labelsHtml = `<th class="corner">Activity</th>`;
  let ownersHtml = `<th class="corner">Owner/Participants</th>`;
  let cadenceHtml = `<th class="corner">Month/Day</th>`;

  TABLE_COLUMNS.forEach((col) => {
    labelsHtml += `<th>${col.label}</th>`;
    ownersHtml += `<th>${col.owner || ""}</th>`;
    cadenceHtml += `<th>${col.cadence || ""}</th>`;
  });
  labelsHtml += `<th>Notes</th>`;
  ownersHtml += `<th></th>`;
  cadenceHtml += `<th></th>`;

  theadLabels.innerHTML = labelsHtml;
  theadOwners.innerHTML = ownersHtml;
  theadCadence.innerHTML = cadenceHtml;

  // Body rows: one per month
  let bodyHtml = "";
  TABLE_MONTHS.forEach((row) => {
    const rowClass = row.highlight === "row" ? " class=\"row-highlight\"" : "";
    let cells = `<td class="month-cell">${row.month}</td>`;

    TABLE_COLUMNS.forEach((col) => {
      const val = (row.values && row.values[col.key]) || "";
      cells += `<td>${val}</td>`;
    });

    const noteClass = row.highlight === "note" ? " class=\"note-highlight\"" : "";
    cells += `<td${noteClass}>${row.notes || ""}</td>`;

    bodyHtml += `<tr${rowClass}>${cells}</tr>`;
  });

  tbody.innerHTML = bodyHtml;
})();
