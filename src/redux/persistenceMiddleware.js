import { savePlayers, saveLeaderboard, saveSound } from '../services/storageService';
import SoundManager from '../utils/SoundManager';

export const persistenceMiddleware = store => next => action => {
  const result = next(action);

  const state = store.getState();

  if (action.type?.startsWith('players/')) {
    savePlayers(state.players.list);
  }

  if (action.type?.startsWith('leaderboard/')) {
    saveLeaderboard(state.leaderboard.records);
  }

  if (action.type?.startsWith('sound/')) {
    const { enabled, volume, lastGameMode } = state.sound;
    saveSound({ enabled, volume, lastGameMode });
    SoundManager.configure(enabled, volume);
  }

  return result;
};
