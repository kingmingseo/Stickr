export type AuthStackParamList = {
  AuthHomeScreen: undefined;
  OnboardingScreen: undefined;
  BottomTabNavigation: undefined;
};

export type BottomTabParamList = {
  MainScreen: undefined;
  FavoritesScreen: undefined;
  MyPageScreen: undefined;
};


export type RootStackParamList = {
  OnboardingScreen: undefined;
  BottomTabNavigation: undefined;
  AuthNavigation: undefined;
  SearchScreen: undefined;
};

export type MyPageStackParamList = {
  MyPageScreen: undefined;
  ProfileEditScreen: { title?: string } | undefined;
  IndividualEditScreen: { title?: string } | undefined;
};
