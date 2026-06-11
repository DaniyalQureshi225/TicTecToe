import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AVATARS } from '../constants/avatars';

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#fe07eaff', '#A29BFE'];

export default function ScoreBoard({ players, scores, currentPlayerIndex }) {
  return (
    <View style={styles.container}>
      {players.map((p, idx) => {
        const isActive = idx === currentPlayerIndex;
        const avatar = AVATARS.find(a => a.id === p.avatar);
        const score = scores[p.id] || 0;
        return (
          <View
            key={p.id}
            style={[
              styles.card,
              isActive && { borderColor: PLAYER_COLORS[idx], borderWidth: 2 },
            ]}>
            <Text style={styles.emoji}>{avatar ? avatar.emoji : '👤'}</Text>
            <Text style={[styles.name, isActive && { color: PLAYER_COLORS[idx] }]} numberOfLines={1}>
              {p.name}
            </Text>
            <Text style={[styles.score, isActive && { color: PLAYER_COLORS[idx] }]}>
              {score}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minWidth: 60,
  },
  emoji: {
    fontSize: 16,
  },
  name: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2D3436',
    marginTop: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D3436',
    marginTop: 1,
  },
});
