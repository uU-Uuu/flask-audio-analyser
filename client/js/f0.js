import {
  getFileIdFromStorage,
  endSession,
  freqToNote,
  playFreq,
  zipArr,
  zipToObj,
  plotColorsObj,
  f0LineCol,
} from "./common.js";
import { BASE_URL } from "./env.js";

const f0Btn = document.querySelector(".f0__f0-btn");
const spectrBtn = document.querySelector(".f0__spectro-btn");
const spectrF0Btn = document.querySelector(".f0__f0-spectro-btn");
const f0Lbl = document.querySelector(".f0__label");
const allCheck = document.querySelector(".f0__check-all");
const f0PlotBtn = document.querySelector(".f0__f0-plot-btn");

function calculateF0(data) {
  const f0Arr = data["f0"].filter((val) => val !== 0);

  let f0Checkboxes = Array.from(
    document.querySelectorAll(".f0__check-option:checked")
  ).map((checkb) => checkb.value);
  let f0Values = {};

  if (f0Checkboxes.length === 0) {
    allCheck.checked = true;
    f0Checkboxes = checkAll().map((checkb) => checkb.value);
  }
  if (f0Checkboxes.includes("mean")) {
    const mean = Math.round(
      f0Arr.reduce((sum, curr) => sum + curr) / f0Arr.length,
      0
    );
    f0Values["mean"] = [mean, freqToNote(mean)];
  }

  if (f0Checkboxes.includes("median")) {
    const sorted = f0Arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid + 1]) / 2
        : sorted[mid];
    f0Values["median"] = [Math.round(median), freqToNote(median)];
  }

  if (f0Checkboxes.includes("mode")) {
    const sorted = f0Arr.slice().sort((a, b) => a - b);
    let maxStreak = 0;
    let currStreak = 1;
    let currEl = sorted[0];
    let mode = sorted[0];

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] === sorted[i + 1]) {
        currStreak++;
      } else {
        if (currStreak > maxStreak) {
          maxStreak = currStreak;
          mode = currEl;
        }
        currStreak = 1;
      }
      currEl = sorted[i];
    }

    if (currStreak > maxStreak) {
      maxStreak = currStreak;
      mode = currEl;
    }
    const modeFin = maxStreak !== 1 ? mode : "-";
    f0Values["mode"] = [Math.round(modeFin), freqToNote(modeFin)];
  }

  if (f0Checkboxes.includes("max")) {
    const max = Math.round(
      f0Arr.reduce((max, curr) => (curr > max ? curr : max))
    );
    f0Values["max"] = [max, freqToNote(max)];
  }

  if (f0Checkboxes.includes("min")) {
    const min = Math.round(
      f0Arr.reduce((min, curr) => (curr < min ? curr : min))
    );
    f0Values["min"] = [min, freqToNote(min)];
  }

  return f0Values;
}

function retrieveSpectrogram(url, div) {
  const storedID = getFileIdFromStorage();
  if (!storedID) {
    document.querySelector(".f0__label").innerHTML = "No file selected.";
    return;
  }

  fetch(`${BASE_URL}/${url}?id=${storedID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then((data) => {
          console.log(data);
          endSession(f0Lbl);
          return null;
        });
      } else {
        return response.blob();
      }
    })

    .then((blob) => {
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        const spectroCont = document.querySelector(div);
        spectroCont.innerHTML = `
            <img src="${url}" alt="Spectrogram">
            `;
      } else {
        return;
      }
    })

    .catch((err) => {
      f0Lbl.innerHTML = "Something went wrong.";
      console.error("Fetch error: ", err);
    });
}

function checkAll() {
  const f0Checkbx = document.querySelectorAll(".f0__check-option");
  if (allCheck.checked) {
    f0Checkbx.forEach((bx) => {
      bx.disabled = true;
      bx.checked = true;
    });
  } else {
    f0Checkbx.forEach((bx) => {
      bx.disabled = false;
      bx.checked = false;
    });
  }
  return Array.from(f0Checkbx);
}

function statTrace(name, values, times) {
  return {
    x: times,
    y: times.map(() => values[0]),
    mode: "markers",
    name: name,
    text: `${Math.round(values[0], 0)}Hz, ${values[1]}`,
    textposition: "top center",
    hoverinfo: "text",
    type: "scatter",
  };
}

allCheck.addEventListener("click", () => {
  checkAll();
});

f0Btn.addEventListener("click", async () => {
  const storedID = getFileIdFromStorage();

  if (!storedID) {
    document.querySelector(".f0__label").innerHTML = "No file selected.";
    return;
  }

  fetch(`${BASE_URL}/f0?id=${storedID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if ("message" in data) {
        endSession(f0Lbl);
      } else {
        try {
          const f0Obj = calculateF0(data);
          let tableRowsDomString = "";

          for (const [key, value] of Object.entries(f0Obj)) {
            let btnDomString = "";

            if (value[1] !== "-") {
              btnDomString = `
                <button class="f0__tablecont-table-playbtn btnExists ${key}" value=${value[0]}>
                    <img class="f0__tablecont-table-playbtn-icon" src="img/play-icon.svg" />
                </button>
              `;
            }
            tableRowsDomString += `
                        <tr class=${key}>
                            <th scope="col">${key}</th>
                            <td>${value[0]}</td>
                            <td>${value[1]}</td>
                            <td>${btnDomString}</td>
                        </tr>
                        `;
          }
          document.querySelector(".f0__tablecont-table tbody").innerHTML =
            tableRowsDomString;
          document.querySelector(".f0__tablecont-table").style.visibility =
            "visible";
        } catch (err) {
          console.log(err);
        }
      }
    })

    .catch((err) => {
      f0Lbl.innerHTML = "Please upload a file.";
      console.error("Fetch error: ", err);
    });
});

f0PlotBtn.addEventListener("click", async () => {
  const storedID = getFileIdFromStorage();

  if (!storedID) {
    document.querySelector(".f0__label").innerHTML = "No file selected.";
    return;
  }

  fetch(`${BASE_URL}/f0/plot?id=${storedID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if ("message" in data) {
        endSession(f0Lbl);
      } else {
        try {
          const times = data.times;
          const f0 = data.f0;
          const f0Round = f0.map((val) => Math.round(val));
          const maxTime = times[data.times.length - 1];
          const statF0 = calculateF0(data);
          const freqTime = zipToObj(zipArr(f0Round, times));

          const traces = [];
          const plotColors = [];

          const f0Trace = {
            x: times,
            y: f0.map((val) => (val === 0 ? null : val)),
            mode: "lines",
            name: "f0",
            line: {
              color: f0LineCol,
            },
            hoverinfo: "text",
            text: zipArr(f0, times).map(
              (val) => `${val[1].toFixed(2)}s ${Math.round(val[0])}Hz`
            ),
          };
          traces.push(f0Trace);

          Object.entries(statF0).forEach(([key, values]) => {
            if (freqTime.hasOwnProperty(values[0])) {
              traces.push(statTrace(key, values, freqTime[values[0]]));
              plotColors.push(plotColorsObj[key]);
            }
          });

          const layout = {
            xaxis: {
              title: "Time",
              range: [0, maxTime],
              tickmode: "linear",
              tick0: 0,
              dtick: 0.6,
            },
            yaxis: {
              title: "F0 freq.",
            },
            colorway: plotColors,
            legend: {
              orientation: "h",
              y: -0.3,
            },
            margin: {
              l: 50,
              r: 20,
              b: 40,
              t: 20,
            },
          };
          Plotly.newPlot("f0-plot", traces, layout);
        } catch (err) {
          console.log(err);
        }
      }
    })

    .catch((err) => {
      f0Lbl.innerHTML = "Please upload a file.";
      console.error("Fetch error: ", err);
    });
});

document
  .querySelector(".f0__tablecont-table")
  .addEventListener("click", (e) => {
    let targ = e.target;
    if (e.target && e.target.tagName !== "BUTTON") {
      targ = e.target.parentElement;
    }
    if (targ && targ.classList.contains("btnExists")) {
      playFreq(targ.value, -15, 2);
    }
  });

spectrBtn.addEventListener("click", async () => {
  retrieveSpectrogram("spectrogram", ".f0__spectrogram-cont");
});

spectrF0Btn.addEventListener("click", async () => {
  retrieveSpectrogram("f0/spectrogram", ".f0__f0-spectrogram-cont");
});
