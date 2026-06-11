import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  makeMove,
  setNextTurn,
  setGameWon,
  setGameDraw,
  resetGame,
  startGame,
} from '../redux/gameSlice';
import { recordWin, recordLoss, recordDraw } from '../redux/leaderboardSlice';
import { checkWin, isBoardFull } from '../utils/winDetection';
import { getAIMove } from '../utils/aiPlayer';
import { BOARD_SIZE, GAME_STATUS } from '../constants/gameConfig';
import { AVATARS } from '../constants/avatars';
import SoundManager from '../utils/SoundManager';
import { onGameFinished } from '../services/AdManager';
import GameCell from '../components/GameCell';
import AnimatedButton from '../components/AnimatedButton';
import { ENUM } from '../utils/enum';

const CELL_GAP = 2;

export default function GameScreen({ navigation }) {
  const dispatch = useDispatch();
  const board = useSelector(state => state.game.board);
  const currentPlayerIndex = useSelector(state => state.game.currentPlayerIndex);
  const gameStatus = useSelector(state => state.game.gameStatus);
  const winCells = useSelector(state => state.game.winCells);
  const isAIMode = useSelector(state => state.game.isAIMode);
  const playerCount = useSelector(state => state.game.playerCount);
  const players = useSelector(state => state.players.list);
  const leaderRecords = useSelector(state => state.leaderboard.records);

  const aiTimeoutRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    hasNavigatedRef.current = false;
    SoundManager.playBackgroundMusic('bgGame');

    if (isAIMode) {
      SoundManager.setupAppStateListener();
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      SoundManager.stopBackgroundMusic();
    };
  }, []);

  const currentPlayer = players[currentPlayerIndex];

  const turnScale = useSharedValue(1);
  useEffect(() => {
    turnScale.value = withSpring(1.1, {}, () => {
      turnScale.value = withSpring(1);
    });
  }, [currentPlayerIndex]);

  const turnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: turnScale.value }],
  }));

  const getRecord = useCallback(
    playerId => {
      const r = leaderRecords.find(rec => rec.playerId === playerId);
      return r || { wins: 0, losses: 0, draws: 0, totalGames: 0 };
    },
    [leaderRecords],
  );

  function handleCellPress(row, col) {
    if (gameStatus !== GAME_STATUS.PLAYING) {
      SoundManager.playError();
      return;
    }
    if (board[row][col]) {
      SoundManager.playError();
      return;
    }
    if (isAIMode && currentPlayerIndex !== 0) return;

    executeMove(row, col);
  }

  function executeMove(row, col) {
    SoundManager.playTap();
    dispatch(makeMove({ row, col }));

    const testBoard = board.map(r => [...r]);
    testBoard[row][col] = currentPlayerIndex + 1;

    const winResult = checkWin(testBoard, row, col);
    if (winResult) {
      dispatch(setGameWon({ winner: winResult.winner, cells: winResult.cells }));

      const winnerPlayerId = winResult.winner;
      dispatch(recordWin(winnerPlayerId));

      players.forEach(p => {
        if (p.id !== winnerPlayerId) {
          dispatch(recordLoss(p.id));
        }
      });

      SoundManager.playWin();

      setTimeout(() => {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          SoundManager.stopBackgroundMusic();
          onGameFinished();
          navigation.navigate('Result');
        }
      }, 1200);
      return;
    }

    if (isBoardFull(testBoard)) {
      dispatch(setGameDraw());
      dispatch(recordDraw(players.map(p => p.id)));

      SoundManager.playDraw();

      setTimeout(() => {
        if (!hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          SoundManager.stopBackgroundMusic();
          onGameFinished();
          navigation.navigate('Result');
        }
      }, 1200);
      return;
    }

    dispatch(setNextTurn());
  }

  useEffect(() => {
    if (
      isAIMode &&
      gameStatus === GAME_STATUS.PLAYING &&
      currentPlayerIndex !== 0
    ) {
      aiTimeoutRef.current = setTimeout(() => {
        const aiMove = getAIMove(board, currentPlayerIndex + 1);
        if (aiMove) {
          executeMove(aiMove[0], aiMove[1]);
        }
      }, 500);
    }
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [currentPlayerIndex, gameStatus, isAIMode]);

  function handleReset() {
    SoundManager.playButtonClick();
    dispatch(resetGame());
    dispatch(startGame({ playerCount, isAIMode }));
  }

  const playerAvatarMap = {};
  players.forEach((p, idx) => {
    const a = AVATARS.find(av => av.id === p.avatar);
    playerAvatarMap[idx + 1] = a ? a.emoji : '👤';
  });

  const currentAvatar = currentPlayer
    ? AVATARS.find(a => a.id === currentPlayer.avatar)
    : null;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.gameTitle}>🎮 {ENUM.appName}</Text>
          <AnimatedButton
            title="Reset"
            onPress={handleReset}
            color="#FF6584"
            size="sm"
            style={{ paddingHorizontal: 16 }}
          />
        </View>

        {currentPlayer && (
          <Animated.View style={[styles.turnIndicator, turnAnimStyle]}>
            <Text style={styles.turnEmoji}>
              {currentAvatar ? currentAvatar.emoji : '👤'}
            </Text>
            <Text style={styles.turnText}>
              {currentPlayer.name}'s Turn
            </Text>
          </Animated.View>
        )}

        <ScrollView
          contentContainerStyle={styles.boardContainer}
          scrollEnabled={false} // Prevents scrolling since a 10x10 fits fully in portrait
          showsVerticalScrollIndicator={false}>

          <View style={styles.boardWrapper}>
            <View style={styles.board}>
              {board.map((row, rowIdx) => (
                /* Explicit Row Wrapper forces exactly 10 blocks across, cleanly balancing the grid */
                <View key={`row-${rowIdx}`} style={styles.boardRow}>
                  {row.map((cell, colIdx) => (
                    <View
                      key={`${rowIdx}-${colIdx}`}
                      style={[styles.cellWrapper, { padding: CELL_GAP }]}
                    >
                      <GameCell
                        row={rowIdx}
                        col={colIdx}
                        value={cell}
                        onPress={handleCellPress}
                        isWinCell={winCells.some(([r, c]) => r === rowIdx && c === colIdx)}
                        disabled={gameStatus !== GAME_STATUS.PLAYING}
                        cellSize="100%"
                        avatarEmoji={cell > 0 ? playerAvatarMap[cell] : null}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

        </ScrollView>

        <View style={styles.scoresRow}>
          {players.map((p, idx) => {
            const rec = getRecord(p.id);
            const isActive = idx === currentPlayerIndex;
            const pAvatar = AVATARS.find(a => a.id === p.avatar);
            return (
              <View
                key={p.id}
                style={[styles.scoreCard, isActive && styles.scoreCardActive]}>
                <Text style={styles.scoreEmoji}>
                  {pAvatar ? pAvatar.emoji : '👤'}
                </Text>
                <Text style={styles.scoreName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.scoreStat}>
                  W:{rec.wins} L:{rec.losses}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  gameTitle: { fontSize: 22, fontWeight: '800', color: '#2D3436' },
  turnIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  turnEmoji: { fontSize: 24 },
  turnText: { fontSize: 16, fontWeight: '700', color: '#6C63FF' },
  turnSymbol: { fontSize: 16, fontWeight: '600', color: '#636E72' },

  // Structured Grid System
  boardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  boardWrapper: {
    width: '100%',
    maxWidth: 480, // Keeps the layout perfect on larger tablets
    aspectRatio: 1, // Ensures a clean, uniform box
  },
  board: {
    flex: 1,
    backgroundColor: '#DFE6E9',
    borderRadius: 8,
    padding: 2,
  },
  boardRow: {
    flex: 1, // Equally breaks down the container height into 10 sections
    flexDirection: 'row',
  },
  cellWrapper: {
    flex: 1, // Equally breaks down the row width into 10 sections
  },

  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DFE6E9',
  },
  scoreCard: { alignItems: 'center', padding: 6, borderRadius: 12, minWidth: 60 },
  scoreCardActive: { backgroundColor: '#6C63FF20' },
  scoreEmoji: { fontSize: 20 },
  scoreName: { fontSize: 11, fontWeight: '700', color: '#2D3436', marginTop: 2 },
  scoreStat: { fontSize: 10, color: '#636E72' },
});