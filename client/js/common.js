export function getFileIdFromStorage() {
  return sessionStorage.getItem("uploadID");
}

export function endSession(lbl) {
  lbl.innerHTML = "Session has expired. Please upload the file again.";
  document.querySelector(".f0__tablecont-table").style.visibility = "collapse";
  document.querySelector(".f0__plot").style.display = "none";
  document.querySelector(".f0__f0-spectrogram-cont").innerHTML = "";
  document.querySelector(".f0__spectrogram-cont").innerHTML = "";

  document.querySelector(".upload__img").style.display = "none";
  document.querySelector(".upload__out-play-btn").style.display = "none";
  document.querySelector(".upload__out-play").style.display = "none";
  sessionStorage.clear();
}

export function freqToNote(freq) {
  if (freq === 0 || freq === "-") return "-";
  const note = Tone.Frequency(freq, "hz").toNote();
  return note;
}

export function playFreq(freq, volume, duration) {
  const osc = new Tone.Oscillator(freq, "triangle").toDestination();
  osc.volume.value = volume;
  osc.start().stop(`+${duration}`);
}

export function zipArr(arr1, arr2) {
  return arr1.reduce((acc, curr, indx) => {
    if (indx < arr2.length) {
      acc.push([curr, arr2[indx]]);
    }
    return acc;
  }, []);
}

export function zipToObj(zipArr) {
  return zipArr.reduce((acc, [val1, val2]) => {
    if (!acc[val1]) {
      acc[val1] = [];
    }
    acc[val1].push(val2);
    return acc;
  }, {});
}

export const f0LineCol = "#c9bbba";

export const plotColorsObj = {
  mean: "#5e809b",
  median: "#85d3d8",
  mode: "#f5c1bb",
  max: "#e8a2ae",
  min: "#da9d89",
};
