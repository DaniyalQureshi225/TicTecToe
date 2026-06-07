import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enabled: true,
  volume: 0.3,
  lastGameMode: 2,
};

const soundSlice = createSlice({
  name: 'sound',
  initialState,
  reducers: {
    setSoundEnabled(state, action) {
      state.enabled = action.payload;
    },
    setSoundVolume(state, action) {
      state.volume = action.payload;
    },
    toggleSound(state) {
      state.enabled = !state.enabled;
    },
    setLastGameMode(state, action) {
      state.lastGameMode = action.payload;
    },
  },
});

export const { setSoundEnabled, setSoundVolume, toggleSound, setLastGameMode } =
  soundSlice.actions;
export default soundSlice.reducer;
