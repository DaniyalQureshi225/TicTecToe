import { Platform, AppState } from 'react-native';

let Sound = null;

try {
  const SoundModule = require('react-native-sound');
  Sound = SoundModule.default || SoundModule;
  if (typeof Sound !== 'function') {
    Sound = null;
  } else {
    try { Sound.setCategory('Playback'); } catch (e) {}
  }
} catch (e) {
  // react-native-sound not linked
}

const SOUND_FILES = {
  bgHome: 'bg_home.mp3',
  bgGame: 'bg_game.mp3',
  tap: 'tap.mp3',
  win: 'win.mp3',
  draw: 'draw.mp3',
  error: 'error.mp3',
  button: 'button.mp3',
};

const TAP_DEBOUNCE_MS = 80;

class SoundManager {
  static enabled = true;
  static volume = 0.5;
  static bgVolume = 0.3;
  static currentBgInstance = null;
  static currentBgName = null;
  static appStateSubscription = null;
  static wasPlayingBeforeBackground = false;
  static preloaded = {};

  static configure(enabled, volume) {
    this.enabled = enabled;
    if (volume !== undefined) {
      this.volume = volume;
      this.bgVolume = volume * 0.6;
      if (this.currentBgInstance) {
        try { this.currentBgInstance.setVolume(this.bgVolume); } catch (e) {}
      }
    }
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  static _soundPath(file) {
    return Platform.OS === 'android' ? file.replace('.mp3', '') : file;
  }

  static playOneShot(name) {
    if (!this.enabled || !Sound) return;
    const file = SOUND_FILES[name];
    if (!file) return;

    const path = this._soundPath(file);
    const sfx = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) return;
      sfx.setVolume(this.volume);
      sfx.play(success => {
        sfx.release();
      });
    });
  }

  static playBackgroundMusic(track) {
    if (!this.enabled || !Sound) return;
    if (this.currentBgName === track) return;

    this.stopBackgroundMusic();

    const file = SOUND_FILES[track];
    if (!file) return;

    const path = this._soundPath(file);
    const bgMusic = new Sound(path, Sound.MAIN_BUNDLE, error => {
      if (error) return;
      bgMusic.setNumberOfLoops(-1);
      bgMusic.setVolume(this.bgVolume);
      bgMusic.play();
      this.currentBgInstance = bgMusic;
      this.currentBgName = track;
    });
  }

  static stopBackgroundMusic() {
    if (this.currentBgInstance) {
      try {
        this.currentBgInstance.stop();
        this.currentBgInstance.release();
      } catch (e) {}
      this.currentBgInstance = null;
      this.currentBgName = null;
    }
  }

  static pauseBackgroundMusic() {
    if (this.currentBgInstance) {
      try { this.currentBgInstance.pause(); } catch (e) {}
    }
  }

  static resumeBackgroundMusic() {
    if (!this.enabled || !this.currentBgInstance) return;
    try {
      this.currentBgInstance.play();
    } catch (e) {}
  }

  static setupAppStateListener() {
    if (this.appStateSubscription) return;
    this.appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        if (this.wasPlayingBeforeBackground) {
          this.resumeBackgroundMusic();
          this.wasPlayingBeforeBackground = false;
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (this.currentBgInstance) {
          this.wasPlayingBeforeBackground = true;
          this.pauseBackgroundMusic();
        }
      }
    });
  }

  static preloadAll() {
    if (!Sound) return;
    Object.entries(SOUND_FILES).forEach(([name, file]) => {
      if (name.startsWith('bg')) return;
      const path = this._soundPath(file);
      this.preloaded[name] = new Sound(path, Sound.MAIN_BUNDLE, () => {});
    });
  }

  static playTap() {
    const now = Date.now();
    if (now - (SoundManager._lastTapTime || 0) < TAP_DEBOUNCE_MS) return;
    SoundManager._lastTapTime = now;
    this.playOneShot('tap');
  }

  static playWin() { this.playOneShot('win'); }
  static playDraw() { this.playOneShot('draw'); }
  static playError() { this.playOneShot('error'); }
  static playButtonClick() { this.playOneShot('button'); }
}

SoundManager._lastTapTime = 0;

export default SoundManager;
