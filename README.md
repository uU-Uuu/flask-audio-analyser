# Audio Analyser (F0)

Full-stack web application:

- Python API Flask
- JavaScript, Tone.js

## Features

- Upload and play an audio file (.wav .mp3)
  preferably human speech
- Calculate statistical measures of fundamental frequency (F0) with pYIN method
- Build plot for the F0 values
- Build spectrogram for pYIN F0 values
- Build melspectrogram

## API Endpoints

- /upload?id={id}&nbsp;&nbsp;&nbsp;&nbsp;POST
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;id&nbsp;&nbsp;(uuid + time uploaded HM as new file name)
  uploading file and saving it on the backend

- /play&nbsp;&nbsp;&nbsp;&nbsp;GET
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;audio file&nbsp;&nbsp;(wav)
  retrieve uploaded file by id to play it

- /f0?id={id}&nbsp;&nbsp;&nbsp;&nbsp;GET
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;f0&nbsp;&nbsp;(array of F0 values)
  calculate F0 values

- /f0/plot?id={id}&nbsp;&nbsp;&nbsp;&nbsp;GET
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;f0&nbsp;&nbsp;(array of F0 values)
  &nbsp;&nbsp;&nbsp;&nbsp;times&nbsp;&nbsp;(array of time values)
  calculate F0 values and corresponding time values

- /f0/spectrogram?id={id}&nbsp;&nbsp;&nbsp;&nbsp;GET
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;img&nbsp;&nbsp;(.jpeg pYIN F0 spectrogram)
  build pYIN spectrogram

- /spectrogram?id={id}&nbsp;&nbsp;&nbsp;&nbsp;GET
  response:
  &nbsp;&nbsp;&nbsp;&nbsp;img&nbsp;&nbsp;(.jpeg melspectrogram)
  build melspectrogram

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

## Libraries

**Flask==3.0.3**
**librosa==0.10.2.post1**
**pydub==0.25.1**
**matplotlib==3.7.5**
