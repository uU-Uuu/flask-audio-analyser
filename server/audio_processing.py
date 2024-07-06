import os
import librosa
from pydub import AudioSegment
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import image as mpimg
from pathlib import Path

from assist import custom_cmap


IMG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'imgs'))


def to_wav(src_mp3, out_wav):
    """
    mp3 to wav converter
    """
    try:
        audio = AudioSegment.from_mp3(src_mp3)
        audio.export(out_wav, format='wav')
        os.remove(src_mp3)
        return out_wav
    except Exception as e:
        return f'Failed to convert {src_mp3} to wav: {e}'
    

def save_img(file, fig, spec=''):
    """
    save img in the IMG folder
    return destination path
    """
    img_path = f'{IMG_PATH}\{Path(file).stem}{spec}.jpeg'
    plt.savefig(img_path)
    plt.close(fig)
    return img_path


def extract_f0(audiofile, fmin=85, fmax=300, get_times=False):
    """
    f0 measures from an audio file
    get_times=True to get times list for plot
    """
    y, sr = librosa.load(audiofile)
    f0, voiced_flag, voiced_prob = librosa.pyin(y=y,
                                                 sr=sr,
                                                 fmin=fmin,
                                                 fmax=fmax)
    times = librosa.times_like(f0, sr=sr)
    if get_times:
        return np.nan_to_num(f0).tolist(), np.nan_to_num(times).tolist()

    return np.nan_to_num(f0).tolist()


def f0_spectrogram(audiofile):
    """
    f0 pyin spectrogram as img
    """
    y, sr = librosa.load(librosa.ex('trumpet'))
    f0, voiced_flag, voiced_probs = librosa.pyin(y,
                                                sr=sr,
                                                fmin=librosa.note_to_hz('C2'),
                                                fmax=librosa.note_to_hz('C7'))
    times = librosa.times_like(f0, sr=sr)
    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)))
    fig, ax = plt.subplots()
    img = librosa.display.specshow(D, x_axis='time', y_axis='log', ax=ax, cmap=custom_cmap)
    ax.set(title='pYIN fundamental frequency estimation')
    fig.colorbar(img, ax=ax, format='%+2.f dB')
    ax.plot(times, f0, label='f0', color='white', linewidth=3)
    ax.legend(loc='upper right', framealpha=0.3, labelcolor='white')
    return save_img(file=audiofile, fig=fig, spec='f0')


def basic_spectrogram(audiofile):
    """
    melspectrogram as img
    """
    y, sr = librosa.load(audiofile)
    S = librosa.feature.melspectrogram(y=y, sr=sr)
    fig, ax = plt.subplots()
    S_db = librosa.power_to_db(S, ref=np.max)
    img = librosa.display.specshow(S_db, x_axis='time',
                                   y_axis='mel', sr=sr,
                                   fmax=8000, ax=ax, cmap=custom_cmap)
    fig.colorbar(img, ax=ax, format='%+2.0f dB')
    ax.set(title='Mel-frequency spectrogram')

    return save_img(file=audiofile, fig=fig)
