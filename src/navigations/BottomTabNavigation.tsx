import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';
import { BottomTabParamList } from '../types/navigation';
import MainScreen from '../screens/home/MainScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import MyPageNavigation from './MypageNavigation';
import CustomHeader from '../components/CustomHeader';
import { FilterProvider } from '../contexts/FilterContext';
import { useTranslation } from '../hooks/useTranslation';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigation = () => {
  const theme = useThemeStore(s => s.theme);
  const { t } = useTranslation();
  
  return (
    <FilterProvider>
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
          height : 60
        },
        tabBarActiveTintColor: colors[theme].PURPLE_400,
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
          tabBarLabel: t('home'),
        }}
      />
      <Tab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="heart" size={20} color={color} />
          ),
          tabBarLabel: t('favorites'),
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
          tabBarLabel: t('myPage'),
        }}
        listeners={({ navigation }) => ({
          tabPress: _e => {
            navigation.navigate('MyPageScreen');
          },
        })}
      />
      </Tab.Navigator>
    </FilterProvider>
  );
};

export default BottomTabNavigation;
