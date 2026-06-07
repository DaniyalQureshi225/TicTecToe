/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (global.ErrorUtils && typeof global.ErrorUtils.setGlobalHandler === 'function') {
  const originalHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('GLOBAL_ERROR:', error && error.message, error && error.stack);
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

AppRegistry.registerComponent(appName, () => App);
