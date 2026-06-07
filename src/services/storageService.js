import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PLAYERS: '@tictactoe_players',
  LEADERBOARD: '@tictactoe_leaderboard',
  THEME: '@tictactoe_theme',
  SOUND: '@tictactoe_sound',
};

export async function savePlayers(players) {
  try {
    await AsyncStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to save players', e);
  }
}

export async function loadPlayers() {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load players', e);
    return [];
  }
}

export async function saveLeaderboard(leaderboard) {
  try {
    await AsyncStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export async function loadLeaderboard() {
  try {
    const data = await AsyncStorage.getItem(KEYS.LEADERBOARD);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load leaderboard', e);
    return [];
  }
}

export async function saveTheme(theme) {
  try {
    await AsyncStorage.setItem(KEYS.THEME, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export async function loadTheme() {
  try {
    const data = await AsyncStorage.getItem(KEYS.THEME);
    return data ? JSON.parse(data) : 'light';
  } catch (e) {
    console.error('Failed to load theme', e);
    return 'light';
  }
}

export async function saveSound(settings) {
  try {
    await AsyncStorage.setItem(KEYS.SOUND, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save sound settings', e);
  }
}

export async function loadSound() {
  try {
    const data = await AsyncStorage.getItem(KEYS.SOUND);
    return data ? JSON.parse(data) : { enabled: true, volume: 0.3 };
  } catch (e) {
    console.error('Failed to load sound settings', e);
    return { enabled: true, volume: 0.3 };
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
}
