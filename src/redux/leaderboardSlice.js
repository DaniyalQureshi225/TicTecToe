import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  records: [],
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    recordWin(state, action) {
      const playerId = action.payload;
      const record = state.records.find(r => r.playerId === playerId);
      if (record) {
        record.wins += 1;
        record.totalGames += 1;
      } else {
        state.records.push({
          playerId,
          wins: 1,
          losses: 0,
          draws: 0,
          totalGames: 1,
        });
      }
    },
    recordLoss(state, action) {
      const playerId = action.payload;
      const record = state.records.find(r => r.playerId === playerId);
      if (record) {
        record.losses += 1;
        record.totalGames += 1;
      } else {
        state.records.push({
          playerId,
          wins: 0,
          losses: 1,
          draws: 0,
          totalGames: 1,
        });
      }
    },
    recordDraw(state, action) {
      const playerIds = action.payload;
      playerIds.forEach(playerId => {
        const record = state.records.find(r => r.playerId === playerId);
        if (record) {
          record.draws += 1;
          record.totalGames += 1;
        } else {
          state.records.push({
            playerId,
            wins: 0,
            losses: 0,
            draws: 1,
            totalGames: 1,
          });
        }
      });
    },
    setLeaderboard(state, action) {
      state.records = action.payload;
    },
    clearLeaderboard(state) {
      state.records = [];
    },
  },
});

export const {
  recordWin,
  recordLoss,
  recordDraw,
  setLeaderboard,
  clearLeaderboard,
} = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
