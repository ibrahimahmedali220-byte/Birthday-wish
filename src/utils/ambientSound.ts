/**
 * Halal Nature Atmosphere Generator (Web Audio API)
 * Pure gentle night breeze synthesizer using soft filtered pink noise.
 * Strictly NO musical instruments, melodies, or background music.
 * Default is 100% SILENT unless explicitly turned on by user.
 */

let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let noiseNode: AudioNode | null = null;
let isPlaying = false;

export function toggleAmbientAtmosphere(): boolean {
  if (isPlaying) {
    stopAmbientAtmosphere();
    return false;
  } else {
    startAmbientAtmosphere();
    return true;
  }
}

export function isAtmosphereActive(): boolean {
  return isPlaying;
}

export function startAmbientAtmosphere(): void {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Generate 5 seconds of soft pink noise buffer
    const bufferSize = audioCtx.sampleRate * 4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Deep low pass filter to simulate distant night wind breeze
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 240;
    filter.Q.value = 1.0;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 2.5);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseSource.start();
    noiseNode = noiseSource;
    isPlaying = true;
  } catch {
    isPlaying = false;
  }
}

export function stopAmbientAtmosphere(): void {
  if (gainNode && audioCtx) {
    try {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      setTimeout(() => {
        if (noiseNode && 'stop' in noiseNode) {
          (noiseNode as AudioBufferSourceNode).stop();
        }
        isPlaying = false;
      }, 1000);
    } catch {
      isPlaying = false;
    }
  } else {
    isPlaying = false;
  }
}
