<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    name: {
        type: String,
        default: 'Recording'
    },
    id: {
        type: String,
        default: 'recording'
    }
});

const emit = defineEmits(['sendData']);

const isRecording = ref(false);
const audioChunks = ref([]);
const recorder = ref(null);
const recording = ref(null);
const duration = ref(null);
const currentTime = ref(0);
const isPlaying = ref(false);
const refreshInterval = ref(null);

const startRecording = () => {
    if (isRecording.value) {
        return;
    }
    console.log('Recording started.');
    isRecording.value = true;
    audioChunks.value = [];
    recorder.value.start();
}

const stopRecording = () => {
    if (!isRecording.value) {
        return;
    }
    console.log("Recording stopped.");
    isRecording.value = false;
    recorder.value.stop();
}

const registerListeners = (recording) => {
    recording.addEventListener('loadedmetadata', () => {
        duration.value = recording.duration;
    });
    recording.addEventListener('ended', () => {
        isPlaying.value = false;
    });
    clearInterval(refreshInterval.value);
    refreshInterval.value = setInterval(function () {
        currentTime.value = recording.currentTime;
    }, 100);
}

const handlerFunction = (stream) => {
    recorder.value = new MediaRecorder(stream);
    recorder.value.ondataavailable = e => {
        audioChunks.value.push(e.data);
        if (recorder.value.state === "inactive") {
          let blob = new Blob(audioChunks.value, { type: 'audio/mpeg-3' });
          recording.value = new Audio(URL.createObjectURL(blob));
          registerListeners(recording.value);
          emit('sendData', blob, props.id);
        }
    }
}

onMounted(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { handlerFunction(stream) });
});

const playRecording = () => {
    recording.value.play();
    isPlaying.value = true;
}

const stopPlaying = () => {
    recording.value.pause();
    recording.value.currentTime = 0;
    isPlaying.value = false;
}

const clear = () => {
    isRecording.value = false;
    isPlaying.value = false;
    clearInterval(refreshInterval.value);
    recording.value = null;
    duration.value = null;
    currentTime.value = 0;
}

defineExpose({
    clear
});

</script>

<template>
    <div class="audio-recorder">
        <h2>{{ name }}</h2>
            <audio v-if="recording" :src="recording.src">
                <p>Your browser does not support the <code>audio</code> element.</p>
            </audio>
        <div class="progress-bar">
            <div v-if="duration">{{ duration.toFixed(2) }}s</div>
            <div v-else>0:00</div>
            <div class="bar-container">
                <div v-if="recording" class="bar" :style="{ width: `${currentTime / (duration || 1) * 100}%` }"></div>
            </div>
            <div class="audio-controls">
                <a v-if="isRecording" @click="stopRecording" :class="{ 'disabled': !isRecording }">
                    <img class="icon" src="../assets/images/stop-icon.svg" alt="Stop" />
                </a>
                <a v-else @click="startRecording" :class="{ 'disabled': isRecording }">
                    <img class="icon record" src="../assets/images/record-icon.svg" alt="Record" />
                </a>
                <a v-if="!isPlaying"@click="playRecording" :class="{ 'disabled': !recording || isRecording || isPlaying }">
                    <img class="icon" src="../assets/images/play-icon.svg" alt="Play" />
                </a>
                <a v-else @click="stopPlaying" :class="{ 'disabled': !isPlaying }">
                    <img class="icon" src="../assets/images/stop-icon.svg" alt="Pause" />
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
  width: 25px;
  height: 25px;
}

.icon.record {
  width: 22px;
  height: 22px;
  margin-left: 2px;
}

a:hover .icon {
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.audio-recorder {
    margin-bottom: 2rem;
}

.audio-controls {
    display: flex;
    gap: 5px;
    align-items: center;
}

.progress-bar {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
}

.bar-container {
    width: 100%;
    height: 10px;
    background-color: #ddd;
}

.bar {
    height: 100%;
    background-color: #007bff;
}
</style>