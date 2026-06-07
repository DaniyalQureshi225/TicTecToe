import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import SoundManager from '../utils/SoundManager';

let AnimatedTouchable = TouchableOpacity;
try {
  AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
} catch (e) {
  // reanimated not available, fallback to plain TouchableOpacity
}

export default function AnimatedButton({
  title,
  onPress,
  color = '#6C63FF',
  textColor = '#FFFFFF',
  disabled = false,
  style,
  textStyle,
  size = 'md',
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const height = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;

  function handlePress() {
    SoundManager.playButtonClick();
    if (onPress) onPress();
  }

  return (
    <AnimatedTouchable
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.85}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#B2BEC3' : color, height },
        animatedStyle,
        style,
      ]}>
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
