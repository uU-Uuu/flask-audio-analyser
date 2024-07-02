export function getFileIdFromStorage() {
  return sessionStorage.getItem("uploadID");
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

export const f0LineCol = "#faf9f5";
export const pltBckgCol = "#000000";
