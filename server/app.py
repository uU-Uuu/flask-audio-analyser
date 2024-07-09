import os
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime
from matplotlib import pyplot as plt
import atexit

from audio_processing import to_wav, extract_f0, basic_spectrogram, f0_spectrogram
from assist import allowed_file, uploads_cleaner, get_file_by_id
from config import UPLOAD_FOLDER, IMG_FOLDER, PORT

class APIConfig:
    UPLOAD_FOLDER = UPLOAD_FOLDER
    IMG_FOLDER = IMG_FOLDER


app = Flask(__name__)
CORS(app)

app.config.from_object(APIConfig)
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['IMG_FOLDER'], exist_ok=True)

plt.switch_backend('Agg')

atexit.register(lambda: uploads_cleaner(UPLOAD_FOLDER))
atexit.register(lambda: uploads_cleaner(IMG_FOLDER))


@app.route('/upload', methods=['POST'])
def upload_audiofile():
    if request.method == 'POST':

        file = request.files.get('file')
        if not file:
            return jsonify({'message': 'No file provided'}), 400
        
        filename = secure_filename(file.filename)
        allowed, extension = allowed_file(filename)

        if allowed:
            curr_uuid = str(uuid.uuid4()) + '@' + datetime.now().strftime('%H%M')
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
                        'status': 'success'})


@app.route('/play', methods=['GET'])
@get_file_by_id
def get_file(filepath):
    try:
        return send_file(filepath, mimetype='audio/wav')
    except:
        return jsonify({'message': 'File not found: {e}'}), 404


@app.route('/f0', methods=['GET'])
@get_file_by_id
def get_f0(filepath):
    try:
        return jsonify({'f0': extract_f0(filepath)})
    except Exception as e:
        return jsonify({'message': 'Failed to retrive data for f0: {e}'}), 422


@app.route('/f0/plot', methods=['GET'])
@get_file_by_id
def get_f0_plot_data(filepath):
    try:
        f0, times = extract_f0(filepath, get_times=True)
        return jsonify({'f0': f0, 'times': times})
    except Exception as e:
        return jsonify({'message': 'Failed to retrive data for f0 plot: {e}'}), 422


@app.route('/f0/spectrogram', methods=['GET'])
@get_file_by_id
def get_f0_spectrogram(filepath):
    try:
        return send_file(f0_spectrogram(filepath), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve data for F0 spectrogram: {e}'}), 422
        

@app.route('/spectrogram', methods=['GET'])
@get_file_by_id
def get_spectrogram(filepath):
    try:
        return send_file(basic_spectrogram(filepath), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve data for spectrogram: {e}'}), 422
    

if __name__ == '__main__':
    app.run(port=PORT, debug=True)