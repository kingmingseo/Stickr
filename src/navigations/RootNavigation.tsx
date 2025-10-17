import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigations from './BottomTabNavigation';
import { RootStackParamList } from '../types/navigation';
import useSupabaseSession from '../hooks/useSupabaseSession';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchScreen from '../screens/search/SearchScreen';
import GboardOnboardingScreen from '../screens/onboarding/GboardOnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigation() {
  const { isAuthenticated } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const seenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        const guestStatus = await AsyncStorage.getItem('guestMode');
        console.log('guestStatus', guestStatus);
        setGuestMode(guestStatus === '1');
        setShowOnboarding(!seenOnboarding);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return null;

  // 초기 라우트 계산: 온보딩 > 비로그인(비게스트) 로그인 플로우 > 게스트/로그인 시 메인
  const initialRouteName = showOnboarding
    ? 'GboardOnboardingScreen'
    : !isAuthenticated && !guestMode
    ? 'AuthNavigation'
    : 'BottomTabNavigation';

  const navigationKey = `${guestMode}-${isAuthenticated}-${showOnboarding}`;

  return (
    <NavigationContainer key={navigationKey}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName as keyof RootStackParamList}
      >
        <Stack.Screen name="GboardOnboardingScreen" component={GboardOnboardingScreen} />
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigations}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation;
