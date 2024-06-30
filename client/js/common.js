export const BASE_URL = 'http://127.0.0.1:5000';


export function getFileIdFromStorage() { 
    return [sessionStorage.getItem('uploadID'), sessionStorage.getItem('uploadTime')];
}


export function freqToNote(freq) {
    if (freq === 0 || freq === 'NaN') return NaN;
    const note = Tone.Frequency(freq, 'hz').toNote();
    return note;
}
