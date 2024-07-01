import { getFileIdFromStorage, freqToNote, playFreq } from "./common.js";
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
      f0Arr.reduce((sum, curr) => sum + curr, 0) / f0Arr.length,
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
    f0Values["median"] = [Math.round(median, 0), freqToNote(median)];
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
    f0Values["mode"] = [Math.round(modeFin, 0), freqToNote(modeFin)];
  }

  if (f0Checkboxes.includes("max")) {
    const max = Math.round(
      f0Arr.reduce((max, curr) => (curr > max ? curr : max)),
      0
    );
    f0Values["max"] = [max, freqToNote(max)];
  }

  if (f0Checkboxes.includes("min")) {
    const min = Math.round(
      f0Arr.reduce((min, curr) => (curr < min ? curr : min)),
      0
    );
    f0Values["min"] = [min, freqToNote(min)];
  }

  return f0Values;
}

function retrieveSpectrogram(url, div) {
  const storedID = getFileIdFromStorage();
  if (!storedID) {
    document.querySelector(".f0-label").innerHTML = "No file selected.";
    return;
  }

  fetch(`${BASE_URL}/${url}?id=${storedID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })

    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const spectroCont = document.querySelector(div);
      spectroCont.innerHTML = `
        <img src="${url}" alt="Spectrogram">
        `;
    })

    .catch((err) => {
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
        f0Lbl.innerHTML = "Session has expired. Please upload the file again.";
      } else {
        try {
          const f0Obj = calculateF0(data);
          let tableRowsDomString = "";

          for (const [key, value] of Object.entries(f0Obj)) {
            let btnDomString = "";

            if (value[1] !== "-") {
              btnDomString = `
                <button class="f0__tablecont-table-playbtn btnExists" value=${value[0]}>
                    <img class="f0__tablecont-table-playbtn-icon" src="img/play-icon.svg" />
                </button>
              `;
            }
            tableRowsDomString += `
                        <tr>
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
        f0Lbl.innerHTML = "Session has expired. Please upload the file again.";
      } else {
        try {
          const f0 = data.f0;
          const times = data.times;
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
