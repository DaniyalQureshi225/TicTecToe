import { BOARD_SIZE, WIN_LENGTH } from '../constants/gameConfig';

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

export function checkWin(board, lastRow, lastCol) {
  const player = board[lastRow][lastCol];
  if (!player) return null;

  for (const [dr, dc] of DIRECTIONS) {
    const cells = [[lastRow, lastCol]];

    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = lastRow + dr * i;
      const c = lastCol + dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] !== player) break;
      cells.push([r, c]);
    }

    for (let i = 1; i < WIN_LENGTH; i++) {
      const r = lastRow - dr * i;
      const c = lastCol - dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] !== player) break;
      cells.push([r, c]);
    }

    if (cells.length >= WIN_LENGTH) {
      return { winner: player, cells };
    }
  }

  return null;
}

export function isBoardFull(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!board[r][c]) return false;
    }
  }
  return true;
}

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
}
