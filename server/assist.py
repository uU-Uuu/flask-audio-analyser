import os
from flask import jsonify, request
from datetime import datetime, timedelta
import re

from config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER, IMG_FOLDER, SESSION_TIME


def allowed_file(filename):
    """
    returns (Bool, file_extension) as a tuple
    """
    return ('.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS,
        filename.rsplit('.', 1)[1].lower())


def time_diff(time_cust_str, time_ref=datetime.now(), format='%H%M'):
    time_curr_str = time_ref.strftime(format)
    time_curr = datetime.strptime(time_curr_str, format)
    time_cust = datetime.strptime(time_cust_str, format)
    return abs(time_curr - time_cust)


def uploads_cleaner(dir):
    try:
        files = os.listdir(dir)
        if files:
            files_time = map(lambda filename: (filename, re.search(r'@(.{4})', filename).group(1)), files)
            
            for file, ft in files_time:
                if time_diff(ft) > timedelta(minutes=SESSION_TIME):
                    file_path = os.path.join(dir, file)
                    if os.path.isfile(file_path):
                        os.remove(file_path)
    except OSError:
        print('Error occurred while deleting files')


def get_file_by_id(func):
    def inner(*args, **kwargs):
        if request.method == 'GET':
            file_id = request.args.get('id')
            uploaded_time = file_id.split('@')[1]

            uploads_cleaner(UPLOAD_FOLDER)
            uploads_cleaner(IMG_FOLDER)

            if time_diff(uploaded_time) > timedelta(minutes=SESSION_TIME):
                print('-SESSION--------', time_diff(uploaded_time), timedelta(minutes=SESSION_TIME))
                return jsonify({'message': 'Session has expired. Please upload again'})
            
            file_path = os.path.join(UPLOAD_FOLDER, f'{file_id}.wav')

            if os.path.exists(file_path):
                return func(file_path, *args, **kwargs)
            else:
                return jsonify({'message': f'File not found {file_path}'}), 404
    inner.__name__ = func.__name__
    return inner


