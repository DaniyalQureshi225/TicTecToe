import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AVATARS } from '../constants/avatars';

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Avatar</Text>
      <FlatList
        data={AVATARS}
        numColumns={4}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              onPress={() => onSelect(item.id)}
              style={[
                styles.avatarItem,
                isSelected && styles.avatarSelected,
              ]}>
              <Text style={styles.avatarEmoji}>{item.emoji}</Text>
              {isSelected && <View style={styles.checkBadge} />}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2D3436',
  },
  avatarItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#6C63FF20',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  checkBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6C63FF',
  },
});
