import { Platform } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let bgMusic = null;
let isBgMusicPlaying = false;
let currentVolume = 0.5;

export function initAudio() {
  return new Promise(resolve => {
    bgMusic = new Sound('bg_home.mp3', error => {
      if (error) {
        bgMusic = null;
      }
      resolve();
    });
  });
}

export function playBackgroundMusic(loop = true) {
  if (!bgMusic || isBgMusicPlaying) return;
  bgMusic.setNumberOfLoops(loop ? -1 : 0);
  bgMusic.setVolume(currentVolume);
  bgMusic.play(success => {
    if (!success) {
      isBgMusicPlaying = false;
    }
  });
  isBgMusicPlaying = true;
}

export function stopBackgroundMusic() {
  if (!bgMusic) return;
  if (isBgMusicPlaying) {
    bgMusic.stop();
    isBgMusicPlaying = false;
  }
}

export function setBgVolume(vol) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (bgMusic) {
    bgMusic.setVolume(currentVolume);
  }
}

export function playMoveSound() {
  try {
    const sfx = new Sound('move.wav', error => {
      if (!error) {
        sfx.setVolume(0.4);
        sfx.play(() => sfx.release());
      } else {
        fallbackBeep(80);
      }
    });
  } catch (_) {}
}

export function playWinSound() {
  try {
    const sfx = new Sound('win.wav', error => {
      if (!error) {
        sfx.setVolume(0.6);
        sfx.play(() => sfx.release());
      } else {
        fallbackBeep(200);
      }
    });
  } catch (_) {}
}

export function playDrawSound() {
  fallbackBeep(100);
}

let beepCounter = 0;

function fallbackBeep(durationMs) {
  try {
    const { NativeModules } = require('react-native');
    const RNSound = NativeModules.RNSound;
    if (RNSound && RNSound.playSystemSound) {
      RNSound.playSystemSound(beepCounter % 2 === 0 ? 1104 : 1105);
      beepCounter++;
    }
  } catch (_) {}
}

export function cleanupAudio() {
  if (bgMusic) {
    bgMusic.stop();
    bgMusic.release();
    bgMusic = null;
  }
  isBgMusicPlaying = false;
}
