import { BASE_URL } from "./env.js";
import { getFileIdFromStorage, endSession } from "./common.js";

const fileInput = document.querySelector(".upload__input-file");
const uploadBtn = document.querySelector(".upload__upload-btn");
const playBtn = document.querySelector(".upload__play-btn");
const uploadLbl = document.querySelector(".upload__label");
const audioCont = document.querySelector(".upload__play");

uploadBtn.addEventListener("click", async () => {
  const uploadedFile = fileInput.files[0];

  if (!uploadedFile) {
    uploadLbl.innerHTML = "No file selected.";
    return;
  }

  const formData = new FormData();
  formData.append("file", uploadedFile);

  fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      document.querySelector(".f0__label").innerHTML = "";
      return response.json();
    })

    .then((uploadResult) => {
      sessionStorage.setItem("uploadID", uploadResult.id);
      isUploaded();
    })

    .catch((err) => {
      console.error(err);
      uploadLbl.innerHTML = "Error uploading file";
    });
});

playBtn.addEventListener("click", () => {
  const storedID = getFileIdFromStorage();

  if (!storedID) {
    uploadLbl.innerHTML = "No file selected.";
    return;
  }

  fetch(`${BASE_URL}/play?id=${storedID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(() => {
          endSession(uploadLbl);
        });
      } else {
        return response.blob();
      }
    })

    .then((blob) => {
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        audioCont.style.visibility = "visible";
        audioCont.innerHTML += `
            <audio class="upload__play-audio" controls src="${url}"></audio>
            `;
      } else {
        return;
      }
    })
    .catch((err) => {
      uploadLbl.innerHTML = "Something went wrong.";
      console.error("Fetch error: ", err);
    });
});

function isUploaded() {
  const stored = getFileIdFromStorage();
  if (stored) {
    playBtn.style.visibility = "visible";
    uploadLbl.innerHTML = "";
    document.querySelector(".upload__img").style.visibility = "visible";
  } else {
    playBtn.style.visibility = "hidden";
    document.querySelector(".upload__img").style.visibility = "hidden";
  }
}

isUploaded();
