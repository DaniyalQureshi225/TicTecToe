import { createSlice } from '@reduxjs/toolkit';
import { PLAYER_SYMBOLS } from '../constants/gameConfig';

const initialState = {
  list: [],
  nextId: 1,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    addPlayer(state, action) {
      const { name, avatar } = action.payload;
      state.list.push({
        id: state.nextId,
        name,
        avatar,
        symbol: PLAYER_SYMBOLS[state.list.length] || '?',
      });
      state.nextId += 1;
    },
    removePlayer(state, action) {
      state.list = state.list.filter(p => p.id !== action.payload);
    },
    updatePlayer(state, action) {
      const { id, name, avatar } = action.payload;
      const player = state.list.find(p => p.id === id);
      if (player) {
        if (name !== undefined) player.name = name;
        if (avatar !== undefined) player.avatar = avatar;
      }
    },
    setPlayers(state, action) {
      state.list = action.payload;
      state.nextId =
        action.payload.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
    },
    resetPlayers() {
      return initialState;
    },
  },
});

export const { addPlayer, removePlayer, updatePlayer, setPlayers, resetPlayers } =
  playersSlice.actions;
export default playersSlice.reducer;
