import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ENUM } from '../utils/enum';
import ScoreBoard from './ScoreBoard';

export default function GameHeader({
  players,
  scores,
  currentPlayerIndex,
  onBack,
  onReset,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{ENUM.appName}</Text>
        <TouchableOpacity onPress={onReset} style={styles.resetBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.resetText}>⟳</Text>
        </TouchableOpacity>
      </View>
      <ScoreBoard
        players={players}
        scores={scores}
        currentPlayerIndex={currentPlayerIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    paddingTop: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#2D3436',
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3436',
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 18,
    color: '#FF6584',
    fontWeight: '700',
  },
});
