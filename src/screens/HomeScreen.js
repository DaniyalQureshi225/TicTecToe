import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { toggleSound } from '../redux/soundSlice';
import SoundManager from '../utils/SoundManager';
import { AD_UNIT_ID_BANNER_HOME, BannerAd, BannerAdSize, isAdAvailable } from '../services/AdManager';
import AnimatedButton from '../components/AnimatedButton';

function MenuItem({ title, onPress, color, delay, icon }) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
    opacity.value = withDelay(delay, withSpring(1));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.menuItemContainer, animatedStyle]}>
      <AnimatedButton
        title={`${icon}  ${title}`}
        onPress={onPress}
        color={color}
        size="lg"
        style={styles.menuButton}
        textStyle={styles.menuButtonText}
      />
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const soundEnabled = useSelector(state => state.sound.enabled);

  useEffect(() => {
    SoundManager.setupAppStateListener();
    SoundManager.playBackgroundMusic('bgHome');
    return () => {
      SoundManager.stopBackgroundMusic();
    };
  }, []);

  function handleToggleSound() {
    SoundManager.playButtonClick();
    dispatch(toggleSound());
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.soundToggle}
          onPress={handleToggleSound}
          activeOpacity={0.7}>
          <Text style={styles.soundIcon}>
            {soundEnabled ? '🔊' : '🔇'}
          </Text>
          <Text style={styles.soundLabel}>
            Sound {soundEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.emoji}>🎮</Text>
          <Text style={styles.title}>TicTacToe</Text>
          <Text style={styles.subtitle}>for Four Players</Text>
        </View>

        <View style={styles.menu}>
          <MenuItem
            title="Start Game"
            icon="▶️"
            color="#6C63FF"
            delay={100}
            onPress={() => navigation.navigate('PlayerSetup')}
          />
          <MenuItem
            title="Leaderboard"
            icon="🏆"
            color="#FF6584"
            delay={200}
            onPress={() => navigation.navigate('Leaderboard')}
          />
        </View>

        <Text style={styles.footer}>🎯 Get 5 in a row to win!</Text>

        {isAdAvailable() && BannerAd && (
          <View style={styles.bannerContainer}>
            <BannerAd
              unitId={AD_UNIT_ID_BANNER_HOME}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  soundToggle: {
    position: 'absolute',
    top: 16,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  soundIcon: { fontSize: 20 },
  soundLabel: { fontSize: 13, fontWeight: '600', color: '#2D3436' },
  header: { alignItems: 'center', marginBottom: 48 },
  emoji: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: '800', color: '#2D3436', letterSpacing: 1 },
  subtitle: { fontSize: 18, color: '#636E72', marginTop: 4 },
  menu: { gap: 16 },
  menuItemContainer: { marginBottom: 4 },
  menuButton: { height: 60, borderRadius: 20 },
  menuButtonText: { fontSize: 18 },
  footer: { textAlign: 'center', color: '#636E72', marginTop: 48, fontSize: 15 },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
