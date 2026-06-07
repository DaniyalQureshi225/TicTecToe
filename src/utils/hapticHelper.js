import { Platform } from 'react-native';

let ReactNativeHapticFeedback;

try {
  ReactNativeHapticFeedback = require('react-native-haptic-feedback').default;
} catch (e) {
  // react-native-haptic-feedback not available
}

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export function triggerImpact(style = 'medium') {
  if (!ReactNativeHapticFeedback) return;
  try {
    ReactNativeHapticFeedback.trigger('impact' + style.charAt(0).toUpperCase() + style.slice(1), options);
  } catch (e) {
    // Silent fail
  }
}

export function triggerNotification(type = 'success') {
  if (!ReactNativeHapticFeedback) return;
  try {
    ReactNativeHapticFeedback.trigger('notification' + type.charAt(0).toUpperCase() + type.slice(1), options);
  } catch (e) {
    // Silent fail
  }
}
