import librosa
import ffmpeg
from pydub import AudioSegment
from matplotlib import pyplot as plt
import numpy as np


def mp3_2_wav(src_mp3, out_wav):
    audio = AudioSegment.from_mp3(src_mp3)
    audio.export(out_wav, format='wav')


def get_f0(sr):
    y, sr = librosa.load(sr)
    f0, voiced_flag, voiced_probs = librosa.pyin(y,
                                                 sr=sr,
                                                 fmin=librosa.note_to_midi('C2'), 
                                                 fmax=librosa.note_to_midi('C7'))
    f0 = f0[voiced_flag]
    print(f0, min(f0), max(f0))
    print(np.mean(f0), np.median(f0), np.argmax(np.bincount(f0.astype(int))))
    times = librosa.times_like(f0, sr=sr)
    return y, times, f0


def get_f0_plot(sr):
    y, times, f0 = get_f0(sr)

    D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
    fig, ax = plt.subplots()
    img = librosa.display.specshow(D, x_axis='time', y_axis='log', ax=ax)
    ax.set(title='pYIN fundamental frequency estimation')
    fig.colorbar(img, ax=ax, format='%+2.f dB')
    ax.plot(times, f0, label='f0', color='cyan', linewidth=3)
    ax.legend(loc='upper right')




if __name__ == '__main__':
    mp3_2_wav( './audio/mp3/22.mp3', './audio/wav/22.wav')
    get_f0_plot('./audio/wav/22.wav')
    plt.show()

