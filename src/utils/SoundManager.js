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
const FADE_DURATION_MS = 300;
const FADE_STEPS = 10;

class SoundManager {
  static sounds = {};
  static enabled = true;
  static volume = 0.3;
  static bgVolume = 0.15;
  static currentBgName = null;
  static currentBgInstance = null;
  static appStateSubscription = null;
  static wasPlayingBeforeBackground = false;

  static configure(enabled, volume) {
    this.enabled = enabled;
    if (volume !== undefined) {
      this.volume = volume;
      this.bgVolume = volume * 0.5;
      if (this.currentBgInstance) {
        try { this.currentBgInstance.setVolume(this.bgVolume); } catch (e) {}
      }
    }
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  static isEnabled() {
    return this.enabled;
  }

  static getSoundPath(file) {
    if (Platform.OS === 'android') {
      return file.replace('.mp3', '');
    }
    return file;
  }

  static loadSound(name, file) {
    if (this.sounds[name]) return;
    if (!Sound) return;

    const soundPath = this.getSoundPath(file);

    this.sounds[name] = new Sound(
      soundPath,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          this.sounds[name] = null;
        }
      },
    );
  }

  static play(name) {
    if (!this.enabled) return;

    if (!this.sounds[name]) {
      this.loadSound(name, SOUND_FILES[name]);
      setTimeout(() => { this.play(name); }, 100);
      return;
    }

    const instance = this.sounds[name];
    if (!instance) return;

    try {
      instance.stop(() => {
        instance.setCurrentTime(0);
        instance.setVolume(this.volume);
        instance.play(success => {
          if (!success) {
            instance.reset();
          }
        });
      });
    } catch (e) {}
  }

  static _fadeVolume(from, to, duration, instance, callback) {
    const steps = FADE_STEPS;
    const stepDuration = duration / steps;
    const diff = to - from;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const vol = from + diff * progress;
      try { instance.setVolume(Math.max(0, vol)); } catch (e) {}
      if (currentStep >= steps) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, stepDuration);
  }

  static fadeIn(instance, targetVolume, duration, callback) {
    if (!Sound) return;
    try { instance.setVolume(0); } catch (e) {}
    this._fadeVolume(0, targetVolume, duration, instance, callback);
  }

  static fadeOutAndStop(instance, duration, callback) {
    if (!Sound) { try { instance.release(); } catch(e) {} if (callback) callback(); return; }
    const currentVol = this.bgVolume;
    this._fadeVolume(currentVol, 0, duration, instance, () => {
      try {
        instance.stop();
        instance.release();
      } catch (e) {}
      if (callback) callback();
    });
  }

  static playBackgroundMusic(track) {
    if (!this.enabled) return;
    if (this.currentBgName === track) return;

    this.stopBackgroundMusic();

    const file = SOUND_FILES[track];
    if (!file || !Sound) return;

    const soundPath = this.getSoundPath(file);

    const bgMusic = new Sound(
      soundPath,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) return;

        bgMusic.setNumberOfLoops(-1);
        bgMusic.play();
        this.currentBgInstance = bgMusic;
        this.currentBgName = track;

        setTimeout(() => {
          this.fadeIn(bgMusic, this.bgVolume, FADE_DURATION_MS);
        }, 50);
      },
    );
  }

  static stopBackgroundMusic() {
    if (this.currentBgInstance) {
      this.fadeOutAndStop(this.currentBgInstance, FADE_DURATION_MS);
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
    if (!this.enabled) return;
    if (this.currentBgInstance && this.currentBgName) {
      try {
        this.currentBgInstance.play();
        this.fadeIn(this.currentBgInstance, this.bgVolume, FADE_DURATION_MS);
      } catch (e) {}
    }
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

  static removeAppStateListener() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  static preloadAll() {
    if (!Sound) return;
    Object.entries(SOUND_FILES).forEach(([name, file]) => {
      if (!name.startsWith('bg')) {
        this.loadSound(name, file);
      }
    });
  }

  static playTap() {
    const now = Date.now();
    if (now - SoundManager._lastTapTime < TAP_DEBOUNCE_MS) return;
    SoundManager._lastTapTime = now;
    this.play('tap');
  }

  static playWin() { this.play('win'); }
  static playDraw() { this.play('draw'); }
  static playError() { this.play('error'); }
  static playButtonClick() { this.play('button'); }

  static release(name) {
    if (this.sounds[name]) {
      try { this.sounds[name].release(); } catch (e) {}
      delete this.sounds[name];
    }
  }

  static releaseAll() {
    this.stopBackgroundMusic();
    Object.keys(this.sounds).forEach(key => this.release(key));
  }
}

SoundManager._lastTapTime = 0;

export default SoundManager;
