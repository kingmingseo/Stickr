import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigations from './BottomTabNavigation';
import { RootStackParamList } from '../types/navigation';
import useSupabaseSession from '../hooks/useSupabaseSession';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchScreen from '../screens/search/SearchScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigation() {
  const { isAuthenticated } = useSupabaseSession();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        const guestStatus = await AsyncStorage.getItem('guestMode');
        console.log('guestStatus', guestStatus);
        setGuestMode(guestStatus === '1');
        setShowOnboarding(!seen);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return null;

  // 초기 라우트 계산: 온보딩 > 비로그인(비게스트) 로그인 플로우 > 게스트/로그인 시 메인
  const initialRouteName = showOnboarding
    ? 'OnboardingScreen'
    : !isAuthenticated && !guestMode
    ? 'AuthNavigation'
    : 'BottomTabNavigation';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
      <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigations} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default RootNavigation;
