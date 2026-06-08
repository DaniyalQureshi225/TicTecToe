import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, isAdAvailable, AD_UNIT_ID_BANNER_HOME } from '../services/AdManager';

export default function AppBannerAd({ unitId, style }) {
  if (!isAdAvailable() || !BannerAd) return null;

  return (
    <View style={[styles.bannerContainer, style]}>
      <BannerAd
        unitId={unitId || AD_UNIT_ID_BANNER_HOME}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    width: '100%',
  },
});
