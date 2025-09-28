import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { BottomTabParamList } from '../types/navigation';
import MainScreen from '../screens/home/MainScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import MyPageNavigation from './MypageNavigation';
import CustomHeader from '../components/CustomHeader';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
        headerStyle: {
          backgroundColor: '#fff',
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },

        tabBarStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: colors.light.GRAY_300,
        },
        tabBarActiveTintColor: '#6D5EF5',
        tabBarInactiveTintColor: colors.light.GRAY_400,
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
