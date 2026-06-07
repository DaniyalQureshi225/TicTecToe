import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { setPlayers } from './src/redux/playersSlice';
import { setLeaderboard } from './src/redux/leaderboardSlice';
import { setTheme } from './src/redux/themeSlice';
import { setSoundEnabled, setSoundVolume, setLastGameMode } from './src/redux/soundSlice';
import { loadPlayers, loadLeaderboard, loadTheme, loadSound } from './src/services/storageService';
import SoundManager from './src/utils/SoundManager';
import { initAdMob } from './src/services/AdManager';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

function AppContent() {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        await initAdMob();
        SoundManager.setupAppStateListener();
        const [players, leaderboard, theme, sound] = await Promise.all([
          loadPlayers(),
          loadLeaderboard(),
          loadTheme(),
          loadSound(),
        ]);
        if (players.length > 0) dispatch(setPlayers(players));
        if (leaderboard.length > 0) dispatch(setLeaderboard(leaderboard));
        dispatch(setTheme(theme));
        dispatch(setSoundEnabled(sound.enabled));
        dispatch(setSoundVolume(sound.volume));
        if (sound.lastGameMode) dispatch(setLastGameMode(sound.lastGameMode));
        SoundManager.configure(sound.enabled, sound.volume);
      } catch (e) {
        console.error('Error loading persisted data', e);
      } finally {
        setReady(true);
      }
    }
    loadData();
  }, [dispatch]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F2F5" />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#636E72',
  },
});

export default App;
