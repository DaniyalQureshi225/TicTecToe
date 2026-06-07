import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AVATARS } from '../constants/avatars';
import { AD_UNIT_ID_BANNER_LEADERBOARD, BannerAd, BannerAdSize, isAdAvailable } from '../services/AdManager';
import AnimatedButton from '../components/AnimatedButton';

export default function LeaderboardScreen({ navigation }) {
  const players = useSelector(state => state.players.list);
  const records = useSelector(state => state.leaderboard.records);

  const sorted = [...records]
    .sort((a, b) => b.wins - a.wins)
    .map((rec, idx) => {
      const player = players.find(p => p.id === rec.playerId);
      const avatar = player
        ? AVATARS.find(a => a.id === player.avatar)
        : null;
      return {
        ...rec,
        rank: idx + 1,
        playerName: player ? player.name : `Player ${rec.playerId}`,
        avatarEmoji: avatar ? avatar.emoji : '👤',
      };
    });

  const getRankEmoji = rank => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  function renderItem({ item }) {
    return (
      <View style={styles.row}>
        <Text style={styles.rank}>{getRankEmoji(item.rank)}</Text>
        <Text style={styles.avatar}>{item.avatarEmoji}</Text>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.playerName}</Text>
          <Text style={styles.stats}>
            W: {item.wins} · L: {item.losses} · D: {item.draws}
          </Text>
        </View>
        <View style={styles.totalGames}>
          <Text style={styles.totalLabel}>Games</Text>
          <Text style={styles.totalValue}>{item.totalGames}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Leaderboard</Text>
          <Text style={styles.subtitle}>Ranked by most wins</Text>
        </View>

        {sorted.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No games played yet</Text>
            <Text style={styles.emptyHint}>
              Play some games to see the leaderboard!
            </Text>
          </View>
        ) : (
          <FlatList
            data={sorted}
            keyExtractor={item => String(item.playerId)}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}

        <View style={styles.bottomSection}>
          <AnimatedButton
            title="← Back"
            onPress={() => navigation.goBack()}
            color="#6C63FF"
            size="md"
            style={{ width: '100%', marginBottom: 8 }}
          />
          {isAdAvailable() && BannerAd && (
            <BannerAd
              unitId={AD_UNIT_ID_BANNER_LEADERBOARD}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F2F5' },
  container: { flex: 1 },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#2D3436' },
  subtitle: { fontSize: 16, color: '#636E72', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: { fontSize: 24, width: 40, textAlign: 'center', fontWeight: '700' },
  avatar: { fontSize: 32, marginHorizontal: 12 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  stats: { fontSize: 13, color: '#636E72', marginTop: 2 },
  totalGames: { alignItems: 'center', marginLeft: 8 },
  totalLabel: { fontSize: 11, color: '#B2BEC3', fontWeight: '600' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#6C63FF' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 20, fontWeight: '700', color: '#2D3436' },
  emptyHint: { fontSize: 14, color: '#636E72', marginTop: 8, textAlign: 'center' },
  bottomSection: { padding: 16, paddingBottom: 8 },
});
