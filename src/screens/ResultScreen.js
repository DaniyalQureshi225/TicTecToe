import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { GAME_STATUS } from '../constants/gameConfig';
import { AVATARS } from '../constants/avatars';
import { resetGame } from '../redux/gameSlice';
import { startGame } from '../redux/gameSlice';
import AnimatedButton from '../components/AnimatedButton';
import AppBannerAd from '../components/AppBannerAd';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { showInterstitialAd } from '../services/AdManager';

export default function ResultScreen({ navigation }) {
  const dispatch = useDispatch();
  const gameStatus = useSelector(state => state.game.gameStatus);
  const winner = useSelector(state => state.game.winner);
  const players = useSelector(state => state.players.list);
  const playerCount = useSelector(state => state.game.playerCount);
  const isAIMode = useSelector(state => state.game.isAIMode);

  const winnerPlayer = winner ? players.find(p => p.id === winner) : null;
  const winnerAvatar = winnerPlayer
    ? AVATARS.find(a => a.id === winnerPlayer.avatar)
    : null;

  const isDraw = gameStatus === GAME_STATUS.DRAW;
  const isWon = gameStatus === GAME_STATUS.WON;

  function handlePlayAgain() {
    dispatch(resetGame());
    dispatch(startGame({ playerCount, isAIMode }));
    showInterstitialAd(() => navigation.navigate('Game'));
  }

  function handleGoHome() {
    dispatch(resetGame());
    navigation.navigate('Home');
  }

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        {isWon && winnerPlayer && (
          <CelebrationOverlay winnerName={winnerPlayer.name} />
        )}

        <View style={styles.content}>
          <View style={styles.resultCard}>
            {isDraw ? (
              <>
                <Text style={styles.bigEmoji}>🤝</Text>
                <Text style={styles.resultTitle}>It's a Draw!</Text>
                <Text style={styles.resultSub}>No one wins this round</Text>
              </>
            ) : winnerPlayer ? (
              <>
                <Text style={styles.bigEmoji}>
                  {winnerAvatar ? winnerAvatar.emoji : '🏆'}
                </Text>
                <Text style={styles.resultTitle}>{winnerPlayer.name}</Text>
                <Text style={styles.winsLabel}>Wins!</Text>
                <View style={styles.trophyRow}>
                  <Text style={styles.trophyEmoji}>🏆</Text>
                  <Text style={styles.trophyEmoji}>🏆</Text>
                  <Text style={styles.trophyEmoji}>🏆</Text>
                </View>
              </>
            ) : null}
          </View>

          <View style={styles.buttons}>
            <AnimatedButton
              title="🔄 Play Again"
              onPress={handlePlayAgain}
              color="#6C63FF"
              size="lg"
              style={{ width: '100%', marginBottom: 12 }}
            />
            <AnimatedButton
              title="🏠 Home"
              onPress={handleGoHome}
              color="#43E97B"
              textColor="#1a1a2e"
              size="lg"
              style={{ width: '100%' }}
            />
          </View>
        </View>
        <AppBannerAd />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 32,
  },
  bigEmoji: { fontSize: 80, marginBottom: 12 },
  resultTitle: { fontSize: 36, fontWeight: '800', color: '#2D3436', textAlign: 'center' },
  resultSub: { fontSize: 18, color: '#636E72', marginTop: 8 },
  winsLabel: { fontSize: 24, fontWeight: '700', color: '#FF6584', marginTop: 4 },
  trophyRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  trophyEmoji: { fontSize: 32 },
  buttons: { width: '100%' },
});
