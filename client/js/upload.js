import { BASE_URL } from "./env.js";
import { getFileIdFromStorage, endSession } from "./common.js";

const fileInput = document.querySelector(".upload__out-input-file");
const uploadBtn = document.querySelector(".upload__out-upload-btn");
const playBtn = document.querySelector(".upload__out-play-btn");
const uploadLbl = document.querySelector(".upload__label");
const audioCont = document.querySelector(".upload__out-play");
const uploadImg = document.querySelector(".upload__img");

fileInput.addEventListener("click", () => {
  uploadLbl.innerHTML = "";
  uploadLbl.style.display = "none";
  uploadImg.style.display = "none";
  playBtn.style.display = "none";
  audioCont.style.display = "none";
  sessionStorage.clear();
  fileInput.value = "";
});

fileInput.addEventListener("input", () => {
  console.log("input");
  uploadLbl.innerHTML = "";
  uploadLbl.style.display = "none";
  if (fileInput.files[0]) {
    uploadImg.style.display = "block";
    uploadImg.style.opacity = 0.3;
  }
});

uploadBtn.addEventListener("click", async () => {
  const uploadedFile = fileInput.files[0];

  if (!uploadedFile) {
    uploadLbl.innerHTML = "No file selected.";
    uploadLbl.style.display = "block";
    uploadImg.style.display = "none";
    return;
  }

  uploadImg.style.opacity = 1;

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
      document.querySelector(".f0__label").style.display = "none";
      return response.json();
    })

    .then((uploadResult) => {
      sessionStorage.setItem("uploadID", uploadResult.id);
      isUploaded();
    })

    .catch((err) => {
      console.error(err);
      uploadLbl.innerHTML = "Error uploading file";
      uploadLbl.style.display = "block";
    });
});

playBtn.addEventListener("click", () => {
  const storedID = getFileIdFromStorage();

  if (!storedID) {
    uploadLbl.innerHTML = "No file selected.";
    uploadLbl.style.display = "block";
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
        audioCont.style.display = "block";
        audioCont.innerHTML = `
            <audio class="upload__out-play-audio" controls src="${url}"></audio>
            `;
      } else {
        return;
      }
    })
    .catch((err) => {
      uploadLbl.innerHTML = "Something went wrong.";
      uploadLbl.style.display = "block";
      console.error("Fetch error: ", err);
    });
});

function isUploaded() {
  const stored = getFileIdFromStorage();
  if (stored) {
    playBtn.style.display = "block";
    uploadLbl.innerHTML = "";
    uploadLbl.style.display = "none";
    uploadImg.style.display = "block";
  } else {
    audioCont.style.display = "none";
    playBtn.style.display = "none";
    uploadImg.style.display = "none";
  }
}

isUploaded();
