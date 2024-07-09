# Audio Analyser (F0)

Full-stack web application:

- Python API Flask
- JavaScript

## Features

- Upload and play an audio file (.wav .mp3)
  preferably human speech
- Calculate statistical measures of fundamental frequency (F0) with pYIN method
- Build plot for the F0 values
- Build spectrogram for pYIN F0 values
- Build melspectrogram

## API Endpoints

- POST &nbsp;&nbsp;&nbsp;&nbsp;`/upload`\
  `{`\
  `  "id" : "8ca56101-e0fa-4d0c-9419-1f4863c28af1@1839",`\
  `  "status" : "success"`\
  `}`\
  Upload an audio file (saved on the backend under new name)
  
- GET &nbsp;&nbsp;&nbsp;&nbsp;`/play?id={id}`\
  `audio file .wav`\
  Retrieve the uploaded file by id to play it

- GET &nbsp;&nbsp;&nbsp;&nbsp;`/f0?id={id}`\
  `{`\
  `  "f0" : [ 0.0, 0.0, 237.6548888104333, 239.03160957579942, ... ]`\
  `}`\
  Retrieve an array of calculated F0 values

- GET &nbsp;&nbsp;&nbsp;&nbsp;`/f0/plot?id={id}`\
  `{`\
  `  "f0" : [ 0.0, 0.0, 237.6548888104333, 239.03160957579942, ... ],`\
  `  "times" : [ 0.0, 0.023219954648526078, 0.046439909297052155, ...]`\
  `}`\
  Retrieve an array of calculated F0 values and a corresponding array of time values

- GET &nbsp;&nbsp;&nbsp;&nbsp;`/f0/spectrogram?id={id}`\
  `img  .jpeg`\
  Retrieve a pYIN F0 spectrogram image

- GET &nbsp;&nbsp;&nbsp;&nbsp;`/spectrogram?id={id}`\
  `img  .jpeg`\
  Retrieve a melspectrogram image

## Run

Clone repository

```
git clone https://github.com/uU-Uuu/flask-audio-analyser
```

Build and start Docker Compose

```
docker-compose up --build
```

Backend: `http://localhost:{SERVER_PORT}`
Frontend: `http://localhost:{CLIENT_PORT}`

Stop the application

```
docker-compose down
```

## UI Overview
<details>
<summary>:mag:</summary>

</details>


## Libraries

Flask == 3.0.3\
librosa == 0.10.2.post1\
pydub == 0.25.1\
\
plotly.js-dist == 2.33.0\
tone == 15.0.4
