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
