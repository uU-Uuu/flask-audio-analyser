import { BASE_URL } from './common.js';

const fileInput = document.querySelector('.upload__input-file');
const uploadBtn = document.querySelector('.upload__upload-btn');


uploadBtn.addEventListener('click', async () => {

    const uploadedFile = fileInput.files[0];

    if (!uploadedFile) {
        document.querySelector('.upload__label').innerHTML = 'No file selected.';
        return;
    }

    const formData = new FormData();
    formData.append('file', uploadedFile);

    fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    })

    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json()
    })

    .then(uploadResult => {
        sessionStorage.setItem('uploadID', uploadResult.id);
        sessionStorage.setItem('uploadTime', uploadResult.uploaded)
    })

    .catch(err => {
        console.error(err)
        document.querySelector('.upload__label').innerHTML = 'Error uploading file';
    })

});
