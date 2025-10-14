import { createStackNavigator } from '@react-navigation/stack';
import { MyPageStackParamList } from '../types/navigation';
import MyPageScreen from '../screens/my/MyPageScreen';
import ProfileEditScreen from '../screens/my/ProfileEditScreen';
import { colors } from '../constants/colors';
import { useThemeStore } from '../store/themeStore';
import IndividualEditScreen from '../screens/my/IndividualEditScreen';

const Stack = createStackNavigator<MyPageStackParamList>();

function MyPageNavigation() {
  const theme = useThemeStore(s => s.theme);
  return (
    <Stack.Navigator
      initialRouteName="MyPageScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MyPageScreen" component={MyPageScreen} />
      <Stack.Screen
        options={{
          headerShown: true,
          // 타이틀 가운데 정렬
          headerTitleAlign: 'center',

          // 타이틀 텍스트 스타일
          headerTitle: '내 정보 수정',
          headerTitleStyle: {
            fontSize: 16, // 크기
            fontWeight: 'bold', // 굵기 ('normal' | 'bold' 또는 숫자 문자열)
            color: colors[theme].BLACK, // 색상 필요 시
          },

          // 헤더 자체 여백/높이 조정
          headerStyle: {
            height: 58, // 기본보다 낮게 (예: 48~56 사이)
            elevation: 0, // Android 그림자 제거
            shadowOpacity: 0, // iOS 그림자 제거
            backgroundColor: colors[theme].WHITE,
          },
          headerTintColor: colors[theme].MAIN_DARK_TEXT,
        }}
        name="ProfileEditScreen"
        component={ProfileEditScreen}
      />
      <Stack.Screen
        options={({route}) => ({
          headerShown: true,
          // 타이틀 가운데 정렬
          headerTitleAlign: 'center',

          // 타이틀 텍스트 스타일
          headerTitle: route.params?.title || '내 정보 수정',
          headerTitleStyle: {
            fontSize: 16, // 크기
            fontWeight: 'bold', // 굵기 ('normal' | 'bold' 또는 숫자 문자열)
            color: colors[theme].BLACK, // 색상 필요 시
          },

          // 헤더 자체 여백/높이 조정
          headerStyle: {
            height: 58, // 기본보다 낮게 (예: 48~56 사이)
            elevation: 0, // Android 그림자 제거
            shadowOpacity: 0, // iOS 그림자 제거
            backgroundColor: colors[theme].WHITE,
          },
          headerTintColor: colors[theme].MAIN_DARK_TEXT,
        })}
        name="IndividualEditScreen"
        component={IndividualEditScreen}
      />
    </Stack.Navigator>
  );
}

export default MyPageNavigation;
