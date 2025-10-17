import { LanguageMode } from '../types/languageMode';

/**
 * 다국어 번역 텍스트
 *
 * 사용법:
 * const { t } = useTranslation();
 * <Text>{t('home')}</Text>
 */
export const translations = {
  korean: {
    // 네비게이션
    home: '홈',
    favorites: '즐겨찾기',
    myPage: '마이',

    // 토스트 메시지
    copyComplete: '복사 완료!',
    copyFailed: '복사 실패',
    imageCopiedToClipboard: '이미지가 클립보드에 복사되었습니다',
    urlCopied: 'URL 복사',
    imageUrlCopied: '이미지 URL을 복사했습니다',
    copyError: '이미지 복사 중 오류가 발생했습니다',
    instagramShortcut: '인스타 바로가기',

    // 카테고리
    all: '전체',
    emotion: '감정',
    animal: '동물',
    food: '음식',
    activity: '활동',

    // 정렬
    popular: '🔥 인기',
    recent: '🚀 최신',

    // 프로필
    profile: '프로필',
    editProfile: '프로필 편집',
    editMyInfo: '내 정보 수정',
    guest: '게스트',
    guestMode: '게스트 모드',
    copiedStickers: '복사한 스티커',
    likedStickers: '좋아요한 스티커',
    uploadedStickers: '업로드한 스티커',
    settings: '설정',
    languageSettings: '언어',
    themeSettings: '다크 테마',
    logout: '로그아웃',

    // 프로필 편집
    changeProfilePhoto: '프로필 사진 변경',
    nickname: '닉네임',
    changeNickname: '닉네임 변경',
    bio: '자기소개',
    changeBio: '자기소개 변경',
    bioPlaceholder: '자기소개를 입력해보세요',
    takePhoto: '카메라로 촬영하기',
    chooseFromGallery: '갤러리에서 선택하기',
    profileImageUpdated: '프로필 이미지가 업데이트되었습니다.',
    imageUploadFailed: '이미지 업로드에 실패했습니다.',
    deleteAccount: '회원 탈퇴',
    enterNewNickname: '새로운 닉네임을 입력해주세요',
    enterNewBio: '새로운 자기소개를 입력해주세요',
    updateComplete: '변경 완료',
    updateFailed: '변경 실패',  
    accountDeleted: '계정이 삭제되었습니다.',
    deleteAccountFailed: '계정 삭제에 실패했습니다.',

    // 로그인
    login: '로그인',
    signup: '회원가입',
    loginRequired: '로그인이 필요해요',
    loginPrompt: '즐겨찾기 기능을 사용하려면\n로그인해주세요',
    loginButton: '로그인하기',
    or: '또는',

    // Auth 화면
    appSubtitle: '스티커를 활용해 인스타 스토리 꾸미기!',
    signupWithApple: 'Apple로 회원가입하기',
    loginWithApple: 'Apple로 로그인하기',
    signupWithGoogle: 'Google로 회원가입하기',
    loginWithGoogle: 'Google로 로그인하기',
    signupWithKakao: '카카오로 회원가입하기',
    loginWithKakao: '카카오로 로그인하기',

    // 온보딩
    onboarding1Title: '원하는 스티커를 선택하세요!',
    onboarding1Subtitle: '쉽고 빠르게 복사 후 인스타로 이동하기',
    onboarding2Title: '복사한 스티커를 붙여넣어 보세요!',
    onboarding2Subtitle: '키보드 상단 복사한 스티커 터치하기',
    onboarding3Title: '마음 껏 꾸미기!',
    onboarding3Subtitle: '원하는 크기와 위치에 조정 후 완료!',
    continue: '계속',
    start: '시작하기',
    skip: '건너뛰기',
    
    // Gboard 온보딩
    gboardOnboardingTitle: 'Gboard가 필요해요',
    gboardOnboardingSubtitle: 'Stickr는 Gboard를 통해 스티커를 붙여넣어요',
    gboardInstallTitle1: '설정 앱 접근하기',
    gboardInstallTitle2: '언어 및 입력 방식 탭 터치',
    gboardInstallTitle3: '스크린 키보드 탭 터치',
    gboardInstallTitle4: '키보드 관리 탭 터치',
    gboardInstallTitle5: 'Gboard 활성화 하기',
    gboardInstallTitle6: '기본 키보드 설정 탭 터치',
    gboardInstallTitle7: 'Gboard 활성화 후 완료',
    gboardInstallSubtitle: '아래 버튼을 눌러 Gboard를 설치해주세요',
    gboardSetupTitle: 'Gboard 설정하기',
    gboardSetupSubtitle: 'Gboard 설치 완료 후 설정 앱 실행 -> 일반',
    gboardCheckInstalled: '설치 확인',
    installGboard: 'Gboard 설치하러 가기',
    howToUse: 'Stickr 사용법 보기',
    gboardSetupSubtitle2: '언어 및 입력 방식를 선택해주세요',
    gboardSetupSubtitle3: '스크린 키보드를 선택해주세요',
    gboardSetupSubtitle4: '키보드 관리를 선택해주세요',
    gboardSetupSubtitle5: 'Gboard를 활성화후 뒤로 가기',
    gboardSetupSubtitle6: '기본 키보드 설정 탭 선택해주세요!',
    gboardSetupSubtitle7: 'Gboard로 기본 키보드 변경완료!',
    gboardSetupComplete: '설정 완료!',
    gboardSetupCompleteSubtitle: 'Gboard 설정이 완료되었습니다',

    // Auth Form
    email: '이메일 주소',
    emailRequired: '이메일을 입력해주세요',
    password: '비밀번호',
    passwordRequired: '비밀번호를 입력해주세요',
    passwordConfirm: '비밀번호 확인',
    passwordConfirmRequired: '비밀번호 확인을 입력해주세요',
    nickname: '닉네임',
    nicknameRequired: '닉네임을 입력해주세요',
    passwordMismatch: '비밀번호 불일치',
    passwordMismatchMessage: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
    signupFailed: '회원가입 실패',
    verificationEmailSent: '인증메일 전송',
    verificationEmailMessage: '이메일을 확인하여 계정을 활성화해주세요.',
    loginFailed: '로그인 실패',
    errorOccurred: '오류 발생',
    unexpectedError: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
    forgotPassword: '아이디 혹은 비밀번호를 잊으셨나요?',
    startAsGuest: '게스트로 시작하기',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
    emailNotConfirmed:
      '이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.',
    userAlreadyRegistered: '이미 가입된 이메일입니다.',
    passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
    invalidEmailFormat: '올바른 이메일 형식을 입력해주세요.',
    unknownError: '알 수 없는 오류가 발생했습니다.',

    // 검색
    search: '검색',
    searchPlaceholder: '스티커 검색...',
    noResults: '검색 결과가 없습니다',

    // 기타
    termsOfService: '서비스 이용약관',
    privacyPolicy: '개인정보처리방침',

    // 공통
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    complete: '완료되었습니다',
    delete: '삭제',
    edit: '편집',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    retry: '다시 시도',

    // 빈 상태
    noStickers: '표시할 스티커가 없어요',
    noStickersSubtitle: '필터를 바꾸거나 다시 시도해 주세요',
    noFavorites: '즐겨찾기한 스티커가 없습니다',
  },
  english: {
    // Navigation
    home: 'Home',
    favorites: 'Favorites',
    myPage: 'My Page',

    // Toast Messages
    copyComplete: 'Copy Complete!',
    copyFailed: 'Copy Failed',
    imageCopiedToClipboard: 'Image copied to clipboard',
    urlCopied: 'URL Copied',
    imageUrlCopied: 'Image URL copied',
    copyError: 'Error copying image',
    instagramShortcut: 'Go to Instagram',

    // Categories
    all: 'All',
    emotion: 'Emotion',
    animal: 'Animal',
    food: 'Food',
    activity: 'Activity',

    // Sort
    popular: '🔥 Popular',
    recent: '🚀 Recent',

    // Profile
    profile: 'Profile',
    editProfile: 'Edit Profile',
    editMyInfo: 'Edit My Info',
    guest: 'Guest',
    guestMode: 'Guest Mode',
    copiedStickers: 'Copied Stickers',
    likedStickers: 'Liked Stickers',
    uploadedStickers: 'Uploaded Stickers',
    settings: 'Settings',
    languageSettings: 'Language',
    themeSettings: 'Dark Theme',
    logout: 'Logout',

    // Profile Edit
    changeProfilePhoto: 'Change Profile Photo',
    nickname: 'Nickname',
    changeNickname: 'Change Nickname',
    bio: 'Bio',
    changeBio: 'Change Bio',
    bioPlaceholder: 'Enter your bio',
    takePhoto: 'Take Photo',
    chooseFromGallery: 'Choose from Gallery',
    profileImageUpdated: 'Profile image updated.',
    imageUploadFailed: 'Image upload failed.',
    deleteAccount: 'Delete Account',
    enterNewNickname: 'Enter new nickname',
    enterNewBio: 'Enter new bio',
    updateComplete: 'Update Complete',
    updateFailed: 'Update Failed',
    accountDeleted: 'Account deleted.',
    deleteAccountFailed: 'Account deletion failed.',
    // Login
    login: 'Login',
    signup: 'Sign Up',
    loginRequired: 'Login Required',
    loginPrompt: 'Please login to\nuse favorites',
    loginButton: 'Login',
    or: 'Or',

    // Auth Screen
    appSubtitle: 'Decorate Instagram Story with Stickers!',
    signupWithApple: 'Sign up with Apple',
    loginWithApple: 'Login with Apple',
    signupWithGoogle: 'Sign up with Google',
    loginWithGoogle: 'Login with Google',
    signupWithKakao: 'Sign up with Kakao',
    loginWithKakao: 'Login with Kakao',

    // Onboarding
    onboarding1Title: 'Decorate your story with stickers',
    onboarding1Subtitle: 'Easy and fast copy & paste',
    onboarding2Title: 'Like & Favorites',
    onboarding2Subtitle: 'Save and quickly find your favorite stickers',
    onboarding3Title: 'Search & Categories',
    onboarding3Subtitle: 'Find stickers that match your mood',
    continue: 'Continue',
    start: 'Get Started',
    skip: 'Skip',
    
    // Gboard Onboarding
    gboardOnboardingTitle: 'Gboard is Required',
    gboardOnboardingSubtitle: 'Stickr uses Gboard to paste stickers',
    gboardInstallTitle: 'Install Gboard',
    gboardInstallSubtitle: 'Tap the button below to install Gboard',
    gboardSetupTitle: 'Set up Gboard',
    gboardSetupSubtitle: 'Settings → System → Languages & input → Enable Gboard',
    gboardCheckInstalled: 'Check Installation',
    installGboard: 'Install Gboard',
    howToUse: 'How to use Stickr',
    gboardSetupSubtitle2: 'Select language and input method',
    gboardSetupSubtitle3: 'Select screen keyboard',
    gboardSetupSubtitle4: 'Select keyboard management',
    gboardSetupSubtitle5: 'Enable Gboard and go back',
    gboardSetupSubtitle6: 'Select default keyboard setting tab',
    gboardSetupSubtitle7: 'Default keyboard changed to Gboard',
    gboardSetupComplete: 'Setup Complete!',
    gboardSetupCompleteSubtitle: 'Gboard setup is complete',
    
    // Auth Form
    email: 'Email',
    emailRequired: 'Please enter your email',
    password: 'Password',
    passwordRequired: 'Please enter your password',
    passwordConfirm: 'Confirm Password',
    passwordConfirmRequired: 'Please confirm your password',
    nickname: 'Nickname',
    nicknameRequired: 'Please enter your nickname',
    passwordMismatch: 'Password Mismatch',
    passwordMismatchMessage: 'Password and confirmation do not match.',
    signupFailed: 'Sign Up Failed',
    verificationEmailSent: 'Verification Email Sent',
    verificationEmailMessage:
      'Please check your email to activate your account.',
    loginFailed: 'Login Failed',
    errorOccurred: 'Error Occurred',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    forgotPassword: 'Forgot your email or password?',
    startAsGuest: 'Start as Guest',
    invalidCredentials: 'Invalid email or password.',
    emailNotConfirmed: 'Email not verified. Please check your email.',
    userAlreadyRegistered: 'This email is already registered.',
    passwordTooShort: 'Password must be at least 6 characters.',
    invalidEmailFormat: 'Please enter a valid email format.',
    unknownError: 'An unknown error occurred.',

    // Search
    search: 'Search',
    searchPlaceholder: 'Search stickers...',
    noResults: 'No results found',

    // Others
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',

    // Common
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    complete: 'Complete',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',

    // Empty State
    noStickers: 'No stickers to display',
    noStickersSubtitle: 'Try changing filters or refresh',
    noFavorites: 'No favorite stickers',
  },
} as const;

// 번역 키 타입
export type TranslationKey = keyof typeof translations.korean;

// 헬퍼 함수: 번역 가져오기
export function getTranslation(
  language: LanguageMode,
  key: TranslationKey,
): string {
  return translations[language][key] || key;
}
