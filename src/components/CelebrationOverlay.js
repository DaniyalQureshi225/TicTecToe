import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

function ConfettiPiece({ index }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A29BFE', '#43E97B', '#FF9FF3'];

  useEffect(() => {
    translateY.value = withTiming(Dimensions.get('window').height + 100, {
      duration: 3000 + Math.random() * 2000,
    });
    translateX.value = withSequence(
      withTiming((Math.random() - 0.5) * 200, { duration: 1500 }),
      withTiming((Math.random() - 0.5) * 200, { duration: 1500 }),
    );
    rotate.value = withRepeat(
      withTiming(360, { duration: 1000 }),
      -1,
    );
    opacity.value = withTiming(0, { duration: 3000, delay: 2000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const size = 8 + Math.random() * 12;

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          width: size,
          height: size * 1.5,
          backgroundColor: colors[index % colors.length],
          left: Math.random() * width,
          borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function CelebrationOverlay() {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  confetti: {
    position: 'absolute',
    top: -20,
  },
});
