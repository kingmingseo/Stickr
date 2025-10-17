export type AuthStackParamList = {
  AuthHomeScreen: undefined;
  BottomTabNavigation: undefined;
  GboardOnboardingScreen: undefined;
};

export type BottomTabParamList = {
  MainScreen: undefined;
  FavoritesScreen: undefined;
  MyPageScreen: undefined;
};

export type RootStackParamList = {
  GboardOnboardingScreen: undefined;
  BottomTabNavigation: undefined;
  AuthNavigation: undefined;
  SearchScreen: undefined;
};

export type MyPageStackParamList = {
  MyPageScreen: undefined;
  ProfileEditScreen: { title?: string } | undefined;
  IndividualEditScreen: { title?: string } | undefined;
};
