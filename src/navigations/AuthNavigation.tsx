import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/auth/AuthHomeScreen';
import GboardOnboardingScreen from '../screens/onboarding/GboardOnboardingScreen';
import { AuthStackParamList } from '../types/navigation';
import BottomTabNavigations from './BottomTabNavigation';

const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AuthHomeScreen" component={AuthHomeScreen} />
      <Stack.Screen name="GboardOnboardingScreen" component={GboardOnboardingScreen} />
      <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigations} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
