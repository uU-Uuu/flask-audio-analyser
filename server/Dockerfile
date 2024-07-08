FROM python:3.8.10-slim-buster

WORKDIR /app

COPY . /app

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

RUN pip install -r requirements.txt

ENV PYTHONPATH "${PYTHONPATH}:/app"

EXPOSE 5000

ENV FLASK_APP app

CMD ["flask", "run", "--host=0.0.0.0"]
