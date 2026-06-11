import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

let AnimatedTouchable = TouchableOpacity;
try {
  AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
} catch (e) {
  // reanimated not available, fallback to plain TouchableOpacity
}

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#fe07eaff', '#A29BFE'];

export default function GameCell({
  row,
  col,
  value,
  onPress,
  isWinCell,
  disabled,
  cellSize,
  avatarEmoji,
}) {
  const scale = useSharedValue(1);
  const winPulse = useSharedValue(1);

  React.useEffect(() => {
    if (value && value > 0) {
      scale.value = withSequence(
        withSpring(1.3),
        withSpring(1),
      );
    }
  }, [value]);

  React.useEffect(() => {
    if (isWinCell) {
      winPulse.value = withDelay(
        (row + col) * 50,
        withSequence(
          withSpring(1.15, {}, () => {
            winPulse.value = withSpring(1);
          }),
        ),
      );
    }
  }, [isWinCell]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { scale: winPulse.value }],
  }));

  const symbolIndex = value ? value - 1 : -1;
  const bgColor = value
    ? PLAYER_COLORS[symbolIndex] + '30'
    : '#FFFFFF';

  return (
    <AnimatedTouchable
      onPress={() => onPress(row, col)}
      disabled={disabled || value !== null}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: isWinCell ? '#00FF8840' : bgColor,
          borderColor: isWinCell ? '#00FF88' : '#B2BEC3',
          borderWidth: isWinCell ? 2 : 1,
        },
        animatedStyle,
      ]}>
      {value > 0 && (
        <Text style={[styles.symbol, { fontSize: cellSize * 0.55 }]}>
          {avatarEmoji || '👤'}
        </Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  symbol: {
    fontWeight: '800',
  },
});
