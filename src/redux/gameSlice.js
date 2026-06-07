import { createSlice } from '@reduxjs/toolkit';
import { createEmptyBoard } from '../utils/winDetection';
import { GAME_STATUS } from '../constants/gameConfig';

const initialState = {
  board: createEmptyBoard(),
  currentPlayerIndex: 0,
  gameStatus: GAME_STATUS.IDLE,
  winner: null,
  winCells: [],
  moveHistory: [],
  playerCount: 0,
  isAIMode: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state, action) {
      const { playerCount, isAIMode } = action.payload;
      state.board = createEmptyBoard();
      state.currentPlayerIndex = 0;
      state.gameStatus = GAME_STATUS.PLAYING;
      state.winner = null;
      state.winCells = [];
      state.moveHistory = [];
      state.playerCount = playerCount;
      state.isAIMode = isAIMode ?? false;
    },
    makeMove(state, action) {
      if (state.gameStatus !== GAME_STATUS.PLAYING) return;
      const { row, col } = action.payload;
      if (state.board[row][col]) return;

      const currentPlayerId = state.currentPlayerIndex + 1;
      state.board[row][col] = currentPlayerId;
      state.moveHistory.push({ row, col, playerId: currentPlayerId });
    },
    setNextTurn(state) {
      state.currentPlayerIndex =
        (state.currentPlayerIndex + 1) % state.playerCount;
    },
    setGameWon(state, action) {
      state.gameStatus = GAME_STATUS.WON;
      state.winner = action.payload.winner;
      state.winCells = action.payload.cells;
    },
    setGameDraw(state) {
      state.gameStatus = GAME_STATUS.DRAW;
    },
    resetGame() {
      return { ...initialState };
    },
    loadGameState(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  startGame,
  makeMove,
  setNextTurn,
  setGameWon,
  setGameDraw,
  resetGame,
  loadGameState,
} = gameSlice.actions;
export default gameSlice.reducer;
