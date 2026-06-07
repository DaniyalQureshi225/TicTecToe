import { BOARD_SIZE } from '../constants/gameConfig';
import { checkWin } from './winDetection';

function findEmptyCells(board) {
  const empty = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!board[r][c]) {
        empty.push([r, c]);
      }
    }
  }
  return empty;
}

function getRandomMove(board) {
  const empty = findEmptyCells(board);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function tryGetWinningMove(board, playerId) {
  const empty = findEmptyCells(board);
  for (const [r, c] of empty) {
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = playerId;
    const result = checkWin(testBoard, r, c);
    if (result) return [r, c];
  }
  return null;
}

function tryBlockOpponent(board, playerId) {
  const empty = findEmptyCells(board);
  for (const [r, c] of empty) {
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = 1;
    const result = checkWin(testBoard, r, c);
    if (result) return [r, c];
  }
  return null;
}

function scoreCell(board, row, col, playerId) {
  let score = 0;
  const opponentId = 1;
  const directions = [[0,1],[1,0],[1,1],[1,-1]];

  for (const [dr, dc] of directions) {
    let playerCount = 1;
    let opponentCount = 0;
    let openEnds = 0;

    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] === playerId) playerCount++;
      else if (board[r][c] === null) { openEnds++; break; }
      else { opponentCount++; break; }
    }

    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) break;
      if (board[r][c] === playerId) playerCount++;
      else if (board[r][c] === null) { openEnds++; break; }
      else { opponentCount++; break; }
    }

    if (opponentCount === 0) {
      score += playerCount * 10 + openEnds * 2;
    }
  }

  return score;
}

function getBestHeuristicMove(board, aiPlayerId) {
  const empty = findEmptyCells(board);
  if (empty.length === 0) return null;

  let bestScore = -1;
  let bestMove = null;

  for (const [r, c] of empty) {
    const testBoard = board.map(row => [...row]);
    testBoard[r][c] = aiPlayerId;

    const winCheck = checkWin(testBoard, r, c);
    if (winCheck) return [r, c];

    const blockBoard = board.map(row => [...row]);
    blockBoard[r][c] = 1;
    const blockCheck = checkWin(blockBoard, r, c);
    if (blockCheck) return [r, c];
  }

  for (const [r, c] of empty) {
    const score = scoreCell(board, r, c, aiPlayerId);
    if (score > bestScore) {
      bestScore = score;
      bestMove = [r, c];
    }
  }

  return bestMove || getRandomMove(board);
}

export function getAIMove(board, aiPlayerId) {
  return getBestHeuristicMove(board, aiPlayerId);
}
