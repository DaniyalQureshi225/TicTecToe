import { Platform } from 'react-native';

let BannerAd = null;
let InterstitialAd = null;
let AdEventType = null;
let TestIds = null;
let BannerAdSize = null;
let nativeAdsAvailable = false;

try {
  const Ads = require('react-native-google-mobile-ads');
  BannerAd = Ads.BannerAd;
  InterstitialAd = Ads.InterstitialAd;
  AdEventType = Ads.AdEventType;
  TestIds = Ads.TestIds;
  BannerAdSize = Ads.BannerAdSize;
  nativeAdsAvailable = true;
} catch (e) {
  // react-native-google-mobile-ads not linked
}

/*
 * PRODUCTION AD UNITS — replace test IDs with your AdMob unit IDs:
 *
 * const AD_UNIT_ID_BANNER_HOME  = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';
 * const AD_UNIT_ID_BANNER_LEADERBOARD = 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';
 * const AD_UNIT_ID_INTERSTITIAL = 'ca-app-pub-xxxxxxxxxxxxxxxx/wwwwwwwwww';
 */

const AD_UNIT_ID_BANNER_HOME = nativeAdsAvailable
  ? 'ca-app-pub-6134616462467323/7241591578'
  : '';

const AD_UNIT_ID_BANNER_LEADERBOARD = nativeAdsAvailable
  ? 'ca-app-pub-6134616462467323/7241591578'
  : '';

const AD_UNIT_ID_INTERSTITIAL = nativeAdsAvailable
  ? 'ca-app-pub-6134616462467323/9821255519'
  : '';

let interstitialInstance = null;
let gameCountSinceLastInterstitial = 0;
const INTERSTITIAL_FREQUENCY = 3;
let interstitialLoadAttempted = false;

function getInterstitial() {
  if (!nativeAdsAvailable) return null;
  if (!interstitialInstance) {
    interstitialInstance = InterstitialAd.createForAdRequest(
      AD_UNIT_ID_INTERSTITIAL,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );
  }
  return interstitialInstance;
}

function loadInterstitial() {
  if (!nativeAdsAvailable || interstitialLoadAttempted) return;
  interstitialLoadAttempted = true;

  const interstitial = getInterstitial();
  if (!interstitial) return;
  interstitial.load();

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    interstitialLoadAttempted = false;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    interstitialLoadAttempted = false;
    interstitialInstance = null;
  });

  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    interstitialLoadAttempted = false;
    interstitialInstance = null;
  });
}

function showInterstitial() {
  if (!nativeAdsAvailable) return;
  const interstitial = getInterstitial();
  if (interstitial && interstitial.loaded) {
    interstitial.show();
  } else {
    interstitialInstance = null;
  }
}

export function onGameFinished() {
  gameCountSinceLastInterstitial++;
  if (gameCountSinceLastInterstitial >= INTERSTITIAL_FREQUENCY) {
    gameCountSinceLastInterstitial = 0;
    loadInterstitial();
    setTimeout(() => showInterstitial(), 500);
  }
}

export function resetAdCounter() {
  gameCountSinceLastInterstitial = 0;
}

export async function initAdMob() {
  if (!nativeAdsAvailable) return;
  try {
    const { MobileAds } = require('react-native-google-mobile-ads');
    if (MobileAds && MobileAds.initialize) {
      await MobileAds().initialize();
    }
  } catch (e) {
    // AdMob initialization failed
  }
}

export function isAdAvailable() {
  return nativeAdsAvailable;
}

let interstitialTimedOut = false;

export function showInterstitialAd(onDismiss) {
  if (!nativeAdsAvailable) {
    if (onDismiss) onDismiss();
    return;
  }

  const interstitial = getInterstitial();

  if (interstitial && interstitial.loaded) {
    const unsubLoaded = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitialInstance = null;
        interstitialLoadAttempted = false;
        interstitialTimedOut = false;
        unsubLoaded();
        unsubError();
        if (onDismiss) onDismiss();
      },
    );
    const unsubError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      () => {
        interstitialInstance = null;
        interstitialLoadAttempted = false;
        interstitialTimedOut = false;
        unsubLoaded();
        unsubError();
        if (onDismiss) onDismiss();
      },
    );
    interstitial.show();
  } else if (!interstitialTimedOut) {
    interstitialTimedOut = true;
    loadInterstitial();
    setTimeout(() => {
      interstitialTimedOut = false;
      const retry = getInterstitial();
      if (retry && retry.loaded) {
        showInterstitialAd(onDismiss);
      } else {
        interstitialInstance = null;
        interstitialLoadAttempted = false;
        if (onDismiss) onDismiss();
      }
    }, 3000);
  } else {
    if (onDismiss) onDismiss();
  }
}

export {
  AD_UNIT_ID_BANNER_HOME,
  AD_UNIT_ID_BANNER_LEADERBOARD,
  BannerAd,
  BannerAdSize,
};
