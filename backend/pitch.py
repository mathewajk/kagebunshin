import parselmouth
import numpy as np
import matplotlib.pyplot as plt

def get_pitch(sound):
    pitch = sound.to_pitch()
    return pitch
    
def draw_pitch(pitch):
    # Extract selected pitch contour, and
    # replace unvoiced samples by NaN to not plot
    pitch_values = pitch.selected_array['frequency']
    pitch_values[pitch_values==0] = np.nan
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=5, color='w')
    plt.plot(pitch.xs(), pitch_values, 'o', markersize=2)
    plt.grid(False)
    plt.ylim(0, pitch.ceiling)
    plt.ylabel("fundamental frequency [Hz]")

def main():
    sound = parselmouth.Sound("test.wav")
    sound2 = parselmouth.Sound("test2.wav")
    pitch = get_pitch(sound)
    pitch2 = get_pitch(sound2)
    draw_pitch(pitch)
    draw_pitch(pitch2)
    plt.show()

main()