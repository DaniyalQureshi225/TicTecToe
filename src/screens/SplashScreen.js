import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function SplashScreen({ navigation }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const bounceScale = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(0, { damping: 20 }),
      withSpring(1.2, { damping: 8 }),
      withSpring(1, { damping: 12 }),
    );
    opacity.value = withTiming(1, { duration: 600 });

    setTimeout(() => {
      bounceScale.value = withSequence(
        withSpring(0.8),
        withSpring(1.15),
        withSpring(1),
      );
    }, 300);

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 500 });
    }, 800);

    setTimeout(() => {
      navigation.replace('Home');
    }, 2500);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceScale.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <View style={styles.inner}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Animated.View style={bounceStyle}>
            <Text style={styles.logoEmoji}>🎮</Text>
          </Animated.View>
        </Animated.View>
        <Animated.Text style={[styles.title, bounceStyle]}>
          TicTacToe
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          for Four Players
        </Animated.Text>
        <Animated.Text style={[styles.tagline, subtitleStyle]}>
          Get 5 in a row to win!
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFFE0',
    marginTop: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFFB0',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
