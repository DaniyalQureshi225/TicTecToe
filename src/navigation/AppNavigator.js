import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerSetupScreen from '../screens/PlayerSetupScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="PlayerSetup"
          component={PlayerSetupScreen}
          options={{
            headerShown: true,
            headerTitle: 'Setup Players',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: '#F0F2F5' },
            headerTintColor: '#2D3436',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          options={{
            headerShown: true,
            headerTitle: 'Leaderboard',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: '#F0F2F5' },
            headerTintColor: '#2D3436',
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
