import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import playersReducer from './playersSlice';
import leaderboardReducer from './leaderboardSlice';
import themeReducer from './themeSlice';
import soundReducer from './soundSlice';
import { persistenceMiddleware } from './persistenceMiddleware';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    players: playersReducer,
    leaderboard: leaderboardReducer,
    theme: themeReducer,
    sound: soundReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistenceMiddleware),
});
