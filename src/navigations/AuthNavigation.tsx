import { createStackNavigator } from '@react-navigation/stack';
import AuthHomeScreen from '../screens/auth/AuthHomeScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
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
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigations} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
