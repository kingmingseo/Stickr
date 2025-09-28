# React Native SVG 설정 가이드

React Native 프로젝트에서 SVG 파일을 컴포넌트로 사용하기 위한 완전한 설정 가이드입니다.

## 📋 목차
1. [필수 패키지 설치](#1-필수-패키지-설치)
2. [Metro 설정](#2-metro-설정)
3. [TypeScript 타입 선언](#3-typescript-타입-선언)
4. [Android 설정 (필요시)](#4-android-설정-필요시)
5. [iOS 설정 (필요시)](#5-ios-설정-필요시)
6. [SVG 파일 사용법](#6-svg-파일-사용법)
7. [문제 해결](#7-문제-해결)

---

## 1. 필수 패키지 설치

### 기본 SVG 패키지
```bash
npm install react-native-svg
```

### SVG 변환 도구
```bash
npm install --save-dev react-native-svg-transformer
```

---

## 2. Metro 설정

`metro.config.js` 파일을 수정하여 SVG 파일을 컴포넌트로 변환하도록 설정합니다.

### metro.config.js
```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

### 주요 변경사항 설명
- **transformer**: SVG 파일을 React 컴포넌트로 변환
- **assetExts**: SVG를 자산(asset) 확장자에서 제거
- **sourceExts**: SVG를 소스 확장자에 추가

---

## 3. TypeScript 타입 선언

TypeScript 프로젝트에서 SVG 파일을 인식할 수 있도록 타입 선언 파일을 생성합니다.

### src/types/svg.d.ts
```typescript
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```

### tsconfig.json 업데이트 (필요시)
```json
{
  "compilerOptions": {
    "typeRoots": ["./src/types", "./node_modules/@types"]
  }
}
```

---

## 4. Android 설정 (필요시)

### android/app/build.gradle
이미 `react-native-vector-icons` 설정이 있다면 추가 설정이 필요하지 않을 수 있습니다.

```gradle
apply from: "../../node_modules/react-native-svg/android.gradle"
```

---

## 5. iOS 설정 (필요시)

### CocoaPods 의존성 설치
```bash
cd ios && pod install
```

---

## 6. SVG 파일 사용법

### 6.1 기본 사용법

#### SVG 파일 import
```typescript
import MyIcon from '../assets/icons/my-icon.svg';
```

#### 컴포넌트에서 사용
```tsx
import React from 'react';
import { View } from 'react-native';
import MyIcon from '../assets/icons/my-icon.svg';

const MyComponent = () => {
  return (
    <View>
      <MyIcon width={24} height={24} />
    </View>
  );
};
```

### 6.2 고급 사용법

#### 색상 변경
```tsx
<MyIcon 
  width={24} 
  height={24} 
  fill="#FF0000"  // 빨간색으로 변경
/>
```

#### 스타일 적용
```tsx
<MyIcon 
  width={24} 
  height={24} 
  style={{ 
    backgroundColor: 'lightgray',
    borderRadius: 12,
    padding: 8 
  }}
/>
```

#### 버튼 아이콘으로 사용
```tsx
<GeneralCustomButton
  label="카카오로 로그인하기"
  leftIcon={<KakaoIcon width={18} height={18} />}
  backgroundColor="#FEE500"
  textColor="rgba(0, 0, 0, 0.85)"
/>
```

### 6.3 파일 구조 권장사항

```
src/
├── assets/
│   ├── icons/
│   │   ├── kakao.svg
│   │   ├── apple.svg
│   │   └── google.svg
│   └── images/
├── components/
└── types/
    └── svg.d.ts
```

---

## 7. 문제 해결

### 7.1 일반적인 문제들

#### "Cannot resolve module" 오류
```bash
# Metro 캐시 초기화
npx react-native start --reset-cache
```

#### TypeScript 오류
- `src/types/svg.d.ts` 파일이 올바른 위치에 있는지 확인
- `tsconfig.json`에서 타입 경로가 올바른지 확인

#### SVG가 렌더링되지 않음
- SVG 파일이 올바른 형식인지 확인
- `width`와 `height` props를 명시적으로 설정

### 7.2 Metro 설정 확인

Metro 설정이 올바르게 적용되었는지 확인하는 방법:

```bash
# 개발 서버 재시작
npx react-native start --reset-cache

# Android 빌드
npx react-native run-android

# iOS 빌드  
npx react-native run-ios
```

### 7.3 패키지 버전 호환성

#### 권장 버전
```json
{
  "react-native-svg": "^13.0.0",
  "react-native-svg-transformer": "^1.0.0"
}
```

---

## 📝 체크리스트

설정 완료 후 다음 사항들을 확인하세요:

- [ ] `react-native-svg` 패키지 설치됨
- [ ] `react-native-svg-transformer` 패키지 설치됨  
- [ ] `metro.config.js` 수정됨
- [ ] `src/types/svg.d.ts` 생성됨
- [ ] 개발 서버 재시작됨
- [ ] SVG 파일이 올바른 경로에 위치함
- [ ] SVG 컴포넌트가 올바르게 import됨
- [ ] 앱에서 SVG 아이콘이 표시됨

---

## 🔗 참고 링크

- [react-native-svg 공식 문서](https://github.com/react-native-svg/react-native-svg)
- [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer)
- [Metro 설정 가이드](https://metrobundler.dev/docs/configuration/)

---

## 💡 팁

1. **SVG 최적화**: SVG 파일을 사용하기 전에 SVGO 같은 도구로 최적화하세요.
2. **크기 조절**: `width`와 `height`를 항상 명시하여 레이아웃 시프트를 방지하세요.
3. **색상 관리**: SVG 내부의 `fill` 속성을 제거하고 props로 색상을 제어하세요.
4. **캐싱**: Metro 캐시 이슈가 있을 때는 `--reset-cache` 옵션을 사용하세요.
