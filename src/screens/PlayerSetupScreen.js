import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer, removePlayer, resetPlayers } from '../redux/playersSlice';
import { startGame, resetScores } from '../redux/gameSlice';
import { setLastGameMode } from '../redux/soundSlice';
import { AVATARS } from '../constants/avatars';
import SoundManager from '../utils/SoundManager';
import { showInterstitialAd } from '../services/AdManager';
import AvatarPicker from '../components/AvatarPicker';
import PlayerCard from '../components/PlayerCard';
import AnimatedButton from '../components/AnimatedButton';
import AppBannerAd from '../components/AppBannerAd';

export default function PlayerSetupScreen({ navigation }) {
  const dispatch = useDispatch();
  const players = useSelector(state => state.players.list);
  const lastGameMode = useSelector(state => state.sound.lastGameMode);

  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [gameMode, setGameMode] = useState(lastGameMode || 2);

  useEffect(() => {
    if (gameMode !== 2) {
      dispatch(resetPlayers());
    }
  }, [gameMode]);

  const usedAvatars = players.map(p => p.avatar);

  function handleAddPlayer() {
    if (!playerName.trim() || !selectedAvatar) return;
    if (players.length >= 4) return;
    if (usedAvatars.includes(selectedAvatar)) return;
    dispatch(addPlayer({ name: playerName.trim(), avatar: selectedAvatar }));
    setPlayerName('');
    setSelectedAvatar(null);
  }

  function handleRemovePlayer(id) {
    SoundManager.playButtonClick();
    dispatch(removePlayer(id));
  }

  function handleStartGame() {
    const playerCount = gameMode === 1 ? 2 : gameMode;
    if (gameMode !== 1 && players.length < 2) return;
    if (gameMode === 1) {
      dispatch(resetPlayers());
      dispatch(addPlayer({ name: 'Player 1', avatar: '1' }));
      dispatch(addPlayer({ name: 'AI Bot', avatar: '13' }));
    }
    const isAIMode = gameMode === 1;
    dispatch(setLastGameMode(gameMode));
    dispatch(resetScores());
    dispatch(startGame({ playerCount, isAIMode }));
    showInterstitialAd(() => navigation.navigate('Game'));
  }

  const canStart = gameMode === 1 || players.length >= 2;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Player Setup</Text>
        <Text style={styles.subtitle}>Choose your game mode</Text>

        <View style={styles.startSection}>
          <Text style={styles.sectionTitle}>Game Mode</Text>
          <View style={styles.modeRow}>
            {[1, 2, 3, 4].map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeBtn,
                  gameMode === mode && styles.modeBtnActive,
                ]}
                onPress={() => {
                  setGameMode(mode);
                  SoundManager.playButtonClick();
                  dispatch(resetPlayers());
                }}>
                <Text
                  style={[
                    styles.modeBtnText,
                    gameMode === mode && styles.modeBtnTextActive,
                  ]}>
                  {mode === 1 ? '1' : `${mode}`}
                </Text>
                <Text
                  style={[
                    styles.modeLabel,
                    gameMode === mode && styles.modeLabelActive,
                  ]}>
                  {mode === 1 ? 'vs AI' : 'Players'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {gameMode === 1 && (
            <Text style={styles.aiHint}>You vs Computer (easy/medium)</Text>
          )}
        </View>

        {gameMode !== 1 && (
          <>
            <View style={styles.addPlayerSection}>
              <TextInput
                style={styles.input}
                placeholder="Enter player name..."
                placeholderTextColor="#B2BEC3"
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={20}
              />
              <AvatarPicker
                selected={selectedAvatar}
                onSelect={setSelectedAvatar}
                usedAvatars={usedAvatars}
              />
              <AnimatedButton
                title="Add Player"
                onPress={handleAddPlayer}
                disabled={
                  !playerName.trim() || !selectedAvatar || players.length >= gameMode
                }
                color="#6C63FF"
                style={{ width: '100%' }}
              />
              <Text style={styles.counter}>
                {players.length} / {gameMode} players added
              </Text>
            </View>

            {players.length > 0 && (
              <View style={styles.playersList}>
                <Text style={styles.sectionTitle}>Players</Text>
                {players.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onRemove={handleRemovePlayer}
                  />
                ))}
              </View>
            )}
          </>
        )}

        <AnimatedButton
          title="Start Game"
          onPress={handleStartGame}
          disabled={!canStart}
          color="#43E97B"
          textColor="#1a1a2e"
          size="lg"
          style={{ width: '100%', marginTop: 24 }}
        />
      </ScrollView>
      <AppBannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 32, fontWeight: '800', color: '#2D3436', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#636E72', marginBottom: 24 },
  addPlayerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#DFE6E9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2D3436',
    backgroundColor: '#F8F9FA',
  },
  counter: { textAlign: 'center', color: '#636E72', marginTop: 12, fontSize: 14 },
  playersList: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2D3436', marginBottom: 12 },
  startSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#6C63FF' },
  modeBtnText: { fontSize: 18, fontWeight: '700', color: '#636E72' },
  modeBtnTextActive: { color: '#FFFFFF' },
  modeLabel: { fontSize: 11, color: '#B2BEC3', marginTop: 2, fontWeight: '600' },
  modeLabelActive: { color: '#FFFFFFD0' },
  aiHint: { textAlign: 'center', color: '#6C63FF', fontSize: 14, marginTop: 12 },
});
