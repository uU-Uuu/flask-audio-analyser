from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os.path
import uuid
from datetime import datetime, timezone
from tempfile import NamedTemporaryFile
from matplotlib import pyplot as plt

from audio_processing import to_wav, extract_f0, basic_spectrogram, f0_spectrogram


ALLOWED_EXTENSIONS = {'mp3', 'wav'}
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'uploads'))
IMG_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'imgs'))



class APIConfig:
    UPLOAD_FOLDER = UPLOAD_FOLDER
    IMG_FOLDER = IMG_FOLDER


app = Flask(__name__)
CORS(app)

app.config.from_object(APIConfig)
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)


plt.switch_backend('Agg')



def allowed_file(filename):
    """
    returns (Bool, file_extension) as a tuple
    """
    return ('.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS,
        filename.rsplit('.', 1)[1].lower())


def get_file_by_id(func):
    def inner(*args, **kwargs):
        if request.method == 'GET':
            file_id = request.args.get('id') 
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{file_id}.wav')

            if os.path.exists(file_path):
                return func(file_path, *args, **kwargs)
            else:
                return jsonify({'message': f'File not found {file_path}'}), 404
    inner.__name__ = func.__name__
    return inner

    

@app.route('/upload', methods=['POST'])
def upload_audiofile():
    if request.method == 'POST':

        file = request.files.get('file')
        if not file:
            return jsonify({'message': 'No file provided'}), 400
        
        filename = secure_filename(file.filename)
        allowed, extension = allowed_file(filename)

        if allowed:
            curr_uuid = str(uuid.uuid4())
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{curr_uuid}.{extension}')
            file.save(file_path)

            if extension == 'mp3':
                wav_path = os.path.join(app.config['UPLOAD_FOLDER'], f'{curr_uuid}.wav')
                converted = to_wav(file_path, wav_path)
                if 'Failed' in converted:
                    return jsonify({'message': f'Failed to convert to .wav: {converted}'}), 422
                
        else:
            return jsonify({'message': 'File type not allowed'}), 400
        
        return jsonify({'id': curr_uuid, 
                        'created': datetime.now(timezone.utc), 
                        'status': 'success'})


@app.route('/f0', methods=['GET'])
@get_file_by_id
def get_f0(filepath):
    try:
        # f0, voiced_flag, voiced_prob, times = extract_f0(file_path)
        return jsonify({'f0': extract_f0(filepath)})
        # return jsonify({'f0': f0, 'voiced_flag': voiced_flag, 'voiced_prob': voiced_prob, 'times': times}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to build a spectrogram: {e}'}), 422


@app.route('/f0/spectrogram', methods=['GET'])
@get_file_by_id
def get_f0_spectrogram(filepath):
    try:
        return send_file(f0_spectrogram(filepath), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve data for spectrogram: {e}'}), 422
        

@app.route('/spectrogram', methods=['GET'])
@get_file_by_id
def get_spectrogram(filepath):
    try:
        return send_file(basic_spectrogram(filepath), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve data for spectrogram: {e}'}), 422
        


if __name__ == '__main__':
    app.run(port=5000, debug=True)