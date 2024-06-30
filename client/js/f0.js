import { getFileIdFromStorage, freqToNote, BASE_URL } from './common.js';


const f0Btn = document.querySelector('.f0__f0-btn');
const spectrBtn = document.querySelector('.f0__spectro-btn');
const spectrF0Btn = document.querySelector('.f0__f0-spectro-btn');



function calculateF0(data) {
    
    const f0Arr = data['f0'];

    const f0Checkboxes = Array.from(document.querySelectorAll('.f0__check-option:checked')).map(checkb => checkb.value);
    let f0Values = {}

    if (f0Checkboxes.length === 0) {
        const mean = f0Arr.reduce((sum, curr) => sum + curr, 0 ) / f0Arr.length;
        f0Values['mean'] = [mean, freqToNote(mean)];

    } else {

        if (!f0Checkboxes.includes('mean')) {
            f0Values = {};
        };

        if (f0Checkboxes.includes('median')) {
            const sorted = f0Arr.slice().sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid + 1]) / 2 : sorted[mid];
            f0Values['median'] = [median, freqToNote(median)];
        };

        if (f0Checkboxes.includes('mode')) {
            const sorted = f0Arr.slice().sort((a, b) => a - b)
                                        .filter(num => num !== 0)
                                        .map(num => Math.round(num, 0))
                                        .map(freq => freqToNote(freq));
            let maxStreak = 0;
            let currStreak = 1;
            let currEl = sorted[0];
            let mode = 1;

            for (let i = 0; i < sorted.length; i++) {
                if (sorted[i] === sorted[i + 1] && sorted[i] !== 0) {
                    currStreak++;
                } else {
                    if (currStreak > maxStreak) {
                        maxStreak = currStreak;
                        mode = currEl
                    }
                }
                currStreak = 1;
                currEl = sorted[i];
            };

            if (currStreak > maxStreak) {
                maxStreak = currStreak;
                mode = currEl
            }
            const modeFin = maxStreak !== 1 ? mode : 'NaN';
            f0Values['mode'] = [modeFin, freqToNote(modeFin)];
        };

        if (f0Checkboxes.includes('max')) {
            const max = f0Arr.reduce((max, curr) => curr > max ? curr : max);
            f0Values['max'] = [max, freqToNote(max)];
        };

        if (f0Checkboxes.includes('min')) {
            const min = f0Arr.reduce((min, curr) => curr < min ? curr : min);
            f0Values['min'] = [min, freqToNote(min)];
        };
    }
    return f0Values;
}


function retrieveSpectrogram(url, div) {

    const storedID = getFileIdFromStorage();

    if (!storedID) {
        document.querySelector('.f0-label').innerHTML = 'No file selected.';
        return;
    }

    fetch(`${BASE_URL}/${url}?id=${storedID}`)

    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
    })

    .then(blob => {
        const url = URL.createObjectURL(blob);
        const spectroCont = document.querySelector(div);
        spectroCont.innerHTML = `
        <img src="${url}" alt="Spectrogram">
        `;
    })

    .catch(err => {
        console.error('Fetch error: ', err);
    })
}



f0Btn.addEventListener('click', async () => {

    const storedID = getFileIdFromStorage()

    if (!storedID) {
        document.querySelector('.f0__label').innerHTML = 'No file selected.';
        return;
    }
    
fetch(`${BASE_URL}/f0?id=${storedID}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const a = calculateF0(data);
        console.log(a)
    })

    .catch(err => {
        console.error('Fetch error: ', err)
    })

})


spectrBtn.addEventListener('click', async () => {
    retrieveSpectrogram('spectrogram', '.f0__spectrogram-cont');
})

spectrF0Btn.addEventListener('click', async () => {
    retrieveSpectrogram('f0/spectrogram', '.f0__f0-spectrogram-cont');
});
