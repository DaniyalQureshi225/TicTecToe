import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AVATARS } from '../constants/avatars';

export default function PlayerCard({
  player,
  isActive,
  onRemove,
  compact = false,
}) {
  const avatar = AVATARS.find(a => a.id === player.avatar);
  const avatarEmoji = avatar ? avatar.emoji : '👤';

  return (
    <View
      style={[
        styles.card,
        isActive && styles.activeCard,
        compact && styles.compact,
      ]}>
      <Text style={styles.avatar}>{avatarEmoji}</Text>
      <View style={styles.info}>
        <Text style={[styles.name, compact && styles.compactText]} numberOfLines={1}>
          {player.name}
        </Text>

      </View>
      {onRemove && (
        <TouchableOpacity onPress={() => onRemove(player.id)} style={styles.removeBtn}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compact: {
    padding: 8,
    marginVertical: 2,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  avatar: {
    fontSize: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
  },
  compactText: {
    fontSize: 13,
  },
  symbol: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 2,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FF6B6B',
    fontWeight: '700',
    fontSize: 14,
  },
});
