import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';
import { BottomTabParamList } from '../types/navigation';
import MainScreen from '../screens/home/MainScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import MyPageNavigation from './MypageNavigation';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigation = () => {
  const theme = useThemeStore(s => s.theme);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
        headerStyle: {
          backgroundColor: colors[theme].WHITE,
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },

        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: colors[theme].GRAY_300,
          backgroundColor: colors[theme].WHITE,
        },
        tabBarActiveTintColor: '#6D5EF5',
        tabBarInactiveTintColor: colors[theme].GRAY_400,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={25} color={color} />
          ),
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="heart" size={20} color={color} />
          ),
          tabBarLabel: '즐겨찾기',
        }}
      />
      <Tab.Screen
        name="MyPageScreen"
        component={MyPageNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={20} color={color} />
          ),
          tabBarLabel: '마이',
        }}
        listeners={({ navigation }) => ({
          tabPress: _e => {
            navigation.navigate('MyPageScreen');
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
