let audioCache = {};

export function playShowroomSound(soundUrl) {
  if (!soundUrl) return;
  
  try {
    if (!audioCache[soundUrl]) {
      audioCache[soundUrl] = new Audio(soundUrl);
    }
    audioCache[soundUrl].currentTime = 0;
    audioCache[soundUrl].play().catch(e => console.warn("Audio play failed:", e));
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function stopAllSounds() {
  Object.values(audioCache).forEach(audio => audio.pause());
}
