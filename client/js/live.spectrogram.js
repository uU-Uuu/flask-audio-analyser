import { getFileIdFromStorage, freqToNote } from './common.js';
import { BASE_URL } from './env.js';



// spectrBtn.addEventListener('click', async () => {

//     const storedID = getFileIdFromStorage()

//     // CHANGE LABEL N STUFF
//     if (!storedID) {
//         document.querySelector('.f0-label').innerHTML = 'No file selected.';
//         return;
//     }

//     fetch(${BASE_URL}/spectrogram?id=${storedID})

//     .then(response => {
//         if(!response.ok) {
//             throw new Error(HTTP error! Status: ${response.status});
//         }
//         return response.blob()
//     })

//     .then(blob => {
//         const url = URL.createObjectURL(blob);
//         console.log('Data received -> ', blob);
//         spectroCont = document.querySelector('.spectrogram-cont');
//         spectroCont.innerHTML = `
//         <img src="${url}" alt="Spectrogram">
//         `
//     })

//     .catch(err => {
//         console.error('Fetch error: ', err);
//     })
// })














// let started = null;

// spectrBtn.addEventListener('click', () => {
//     if (started) return;
//     started = true;
//     drawSpectrogram();
// });

// function drawSpectrogram() {
//     const canvas = document.querySelector('.spectrogram');
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width = window.innerWidth;
//     const height = canvas.height = window.innerHeight;

//     const audioCtx = new AudioContext();
//     const analyser = audioCtx.createAnalyser();

//     analyser.fftSize = 4096;

//     navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then(process);

//     function process(stream) {
//         const source = audioCtx.createMediaStreamSource(stream);
//         source.connect(analyser);
//         const data = new Uint8Array(analyser.frequencyBinCount);
//         const len = data.length;
//         const itemHeight = height / len;
//         const x = width - 1;
//         ctx.fillStyle = 'hsl(280, 100%, 10%)';
//         ctx.fillRect(0, 0, width, height);

//         loop();

//         function loop() {
//             window.requestAnimationFrame(loop);

//             let imgData = ctx.getImageData(1, 0, width - 1, height);

//             ctx.fillStyle = 'hsl(280, 100%, 10%)';
//             ctx.fillRect(0, 0, width, height);
//             ctx.clearRect(0, 0, width, height);

//             ctx.putImageData(imgData, 0, 0);
//             analyser.getByteFrequencyData(data);
//             for (let i = 0; i < len; i++) {
//                 let rat = data[i] / 255;
//                 let hue = Math.round((rat * 120) + 280 % 360);
//                 let sat = '100%';
//                 let lit = 10 + (70 * rat) + '%';
//                 ctx.beginPath();
//                 ctx.strokeStyle = hsl(${hue}, ${sat}, ${lit});
//                 ctx.moveTo(x, height - (i * itemHeight));
//                 ctx.lineTo(x, height - (i * itemHeight + itemHeight));
//                 ctx.stroke();
//             }
//         }

//     }




//     // const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//     // const 
// }