import os


ALLOWED_EXTENSIONS = {'mp3', 'wav'}
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))
IMG_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'imgs'))
PORT = 5000