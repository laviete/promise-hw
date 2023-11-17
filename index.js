"use strict";

const btnCatFact = document.getElementById("fact");
btnCatFact.onclick = updateCatFact;
updateCatFact();
function updateCatFact() {
  const catUrl = `https://catfact.ninja/fact`;
  fetch(catUrl)
    .then((response) => response.json())
    .then((data) => generateFact(data))
    .catch((err) => console.log("error: ", err));
}
function generateFact({ fact }) {
  const div = document.querySelector(".fact");
  div.textContent = `${fact}`;
}

updateMeteoData();
function updateMeteoData() {
  const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=wind_speed_10m_max,wind_gusts_10m_max&forecast_days=3`;
  fetch(meteoUrl)
    .then((response) => response.json())
    .then((data) => createTable(data))
    .catch((err) => console.log("error: ", err));
}
function createTable({
  daily: { time, wind_speed_10m_max, wind_gusts_10m_max },
}) {
  const headers = ["Time", "Wind speed", "Wind gusts", "Beaufort scale"];
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = createRow(headers, "th", false);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  time.forEach((day, i) => {
    const windSpeedBeaufort = windSpeedToBeaufort(wind_speed_10m_max[i]);
    const data = [
      day,
      wind_speed_10m_max[i],
      wind_gusts_10m_max[i],
      windSpeedBeaufort,
    ];
    const row = createRow(data, "td", true);
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  document.body.appendChild(table);
}

function createRow(items, cellType, isBeaufort) {
  const row = document.createElement("tr");
  items.map((item, index) => {
    const cell = document.createElement(cellType);
    if (isBeaufort && cellType === "td" && index === 3) {
      cell.style.backgroundColor = getBeaufortColor(item);
    }
    cell.appendChild(document.createTextNode(item));
    row.appendChild(cell);
  });
  return row;
}

const beaufortColors = {
  0: "white",
  1: "#AEF1F9",
  2: "#96F7DC",
  3: "#96F7B4",
  4: "#6FF46F",
  5: "#73ED12",
  6: "#A4ED12",
  7: "#DAED12",
  8: "#EDC212",
  9: "#ED8F12",
  10: "#ED6312",
  11: "#ED2912",
};

function getBeaufortColor(beaufort) {
  return beaufortColors[beaufort] || "#D5102D";
}

function windSpeedToBeaufort(speed) {
  if (speed < 1) return 0;
  if (speed < 5) return 1;
  if (speed < 11) return 2;
  if (speed < 19) return 3;
  if (speed < 28) return 4;
  if (speed < 38) return 5;
  if (speed < 49) return 6;
  if (speed < 61) return 7;
  if (speed < 74) return 8;
  if (speed < 88) return 9;
  if (speed < 102) return 10;
  if (speed < 117) return 11;
  return 12;
}
