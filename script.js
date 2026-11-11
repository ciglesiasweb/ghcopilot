"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const storageKey = "bucks2bar.monthly-values.v1";
const fields = ["income", "expense"];
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const rows = document.getElementById("month-rows");
const storageMessage = document.getElementById("storage-message");
const chartMessage = document.getElementById("chart-message");
const downloadChartButton = document.getElementById("download-chart");
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
let values = months.map(() => ({ income: "", expense: "" }));
let storageWritable = true;
let chart;

function isValidAmount(value) {
  return (
    value === "" ||
    (/^\d+(?:\.\d{0,2})?$/.test(value) && Number.isFinite(Number(value)))
  );
}

function showStorageError(message) {
  storageMessage.textContent = message;
  storageMessage.hidden = false;
  document.querySelector(".save-hint").textContent = "Not saved";
}

function loadValues() {
  let saved;
  try {
    saved = localStorage.getItem(storageKey);
  } catch (error) {
    storageWritable = false;
    showStorageError(
      "Browser storage is unavailable. Changes will only last until you leave this page.",
    );
    return;
  }

  if (saved === null) return;

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    storageWritable = false;
    showStorageError(
      "Saved data could not be read. It has not been overwritten; changes will not be saved.",
    );
    return;
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length !== months.length ||
    !parsed.every(
      (item) =>
        item &&
        typeof item === "object" &&
        fields.every(
          (field) =>
            typeof item[field] === "string" && isValidAmount(item[field]),
        ),
    )
  ) {
    storageWritable = false;
    showStorageError(
      "Saved data has an unexpected format. It has not been overwritten; changes will not be saved.",
    );
    return;
  }
  values = parsed.map((item) => ({
    income: item.income,
    expense: item.expense,
  }));
}

function saveValues() {
  if (!storageWritable) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(values));
  } catch (error) {
    storageWritable = false;
    showStorageError(
      "Changes could not be saved. They will only last until you leave this page.",
    );
  }
}

function renderRows() {
  months.forEach((month, index) => {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    heading.scope = "row";
    heading.textContent = month;
    row.appendChild(heading);

    fields.forEach((field) => {
      const cell = document.createElement("td");
      const wrapper = document.createElement("div");
      wrapper.className = "money-input";
      const prefix = document.createElement("span");
      prefix.setAttribute("aria-hidden", "true");
      prefix.textContent = "$";
      const input = document.createElement("input");
      input.type = "text";
      input.id = `${month.toLowerCase()}-${field}`;
      input.name = input.id;
      input.inputMode = "decimal";
      input.autocomplete = "off";
      input.placeholder = "0.00";
      input.value = values[index][field];
      input.setAttribute("aria-label", `${month} ${field} in US dollars`);
      input.setAttribute("aria-describedby", "input-help");
      input.addEventListener("input", () => {
        const valid = isValidAmount(input.value);
        input.setAttribute("aria-invalid", String(!valid));
        input.classList.toggle("invalid", !valid);
        if (!valid) {
          input.setCustomValidity(
            "Enter a non-negative amount with up to two decimal places.",
          );
          return;
        }
        input.setCustomValidity("");
        values[index][field] = input.value;
        saveValues();
        updateChart();
      });
      input.addEventListener("blur", () => {
        if (!input.validity.valid) input.reportValidity();
      });
      wrapper.append(prefix, input);
      cell.appendChild(wrapper);
      row.appendChild(cell);
    });
    rows.appendChild(row);
  });
}

function updateChart() {
  if (!chart) return;
  chart.data.datasets[0].data = values.map((entry) =>
    Number(entry.income || 0),
  );
  chart.data.datasets[1].data = values.map((entry) =>
    Number(entry.expense || 0),
  );
  chart.update();
  chartMessage.textContent = values.some(
    (entry) => entry.income !== "" || entry.expense !== "",
  )
    ? "Blank fields are shown as $0. Invalid edits are not included until corrected."
    : "Enter amounts in the Data tab to see your year take shape. Blank fields are shown as $0.";
}

function showChart() {
  if (typeof Chart === "undefined") {
    downloadChartButton.disabled = true;
    chartMessage.textContent =
      "The chart could not be loaded. Check your connection and reload the page; your data is still available in the Data tab.";
    return;
  }
  if (!chart) {
    chart = new Chart(document.getElementById("finance-chart"), {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Income",
            data: [],
            backgroundColor: "#4b806c",
            borderRadius: 4,
          },
          {
            label: "Expense",
            data: [],
            backgroundColor: "#e5aa83",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { usePointStyle: true, boxWidth: 8 },
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${money.format(context.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              callback: function (value) {
                return this.getLabelForValue(value).slice(0, 3);
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: { callback: (value) => money.format(value) },
          },
        },
      },
    });
  }
  downloadChartButton.disabled = false;
  updateChart();
  chart.resize();
}

downloadChartButton.addEventListener("click", () => {
  if (!chart) return;

  try {
    const image = document
      .getElementById("finance-chart")
      .toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "bucks2bar-chart.png";
    link.click();
  } catch (error) {
    chartMessage.textContent =
      "The chart image could not be created. Please try again.";
  }
});

function activateTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
  if (tab.id === "chart-tab") showChart();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let target;
    if (event.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
    if (event.key === "ArrowLeft")
      target = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === "Home") target = tabs[0];
    if (event.key === "End") target = tabs[tabs.length - 1];
    if (target) {
      event.preventDefault();
      activateTab(target);
      target.focus();
    }
  });
});

loadValues();
renderRows();
