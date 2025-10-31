# React Native SVG 설정 가이드

> **기술 문서**  
> 프로젝트: Stickr  
> 작성일: 20251031

<br/>

## 📋 목차
- [문제 정의](#-문제-정의)
- [발생 환경](#-발생-환경)
- [해결 방법](#-해결-방법)
- [설정 가이드](#-설정-가이드)
- [사용법](#-사용법)
- [문제 해결](#-문제-해결)
- [베스트 프랙티스](#-베스트-프랙티스)

<br/>

## 🔴 문제 정의

### 증상
React Native 프로젝트에서 **SVG 파일을 import하여 컴포넌트로 사용할 수 없음**

### 구체적인 문제 상황

1. **Import 에러**
   ```typescript
   import KakaoIcon from '../assets/Kakao.svg';
   // ❌ Error: Cannot resolve module '../assets/Kakao.svg'
   ```

2. **TypeScript 타입 에러**
   ```typescript
   import InstagramIcon from '../assets/instagram.svg';
   <InstagramIcon width={24} height={24} />
   // ❌ Error: Cannot find module '../assets/instagram.svg'
   ```

3. **대안의 한계**
   ```tsx
   // ❌ Image로는 사용 가능하지만 색상 변경 불가
   <Image source={require('../assets/icon.svg')} />
   ```

### 목표
- SVG 파일을 React 컴포넌트로 import
- Props로 크기, 색상 등을 동적으로 변경
- TypeScript 지원

<br/>

## 🌍 발생 환경

### 기술 스택
- **플랫폼**: React Native 0.81.4
- **번들러**: Metro
- **언어**: TypeScript 5.8.3
- **필요한 기능**:
  - SVG 아이콘 사용 (카카오, 인스타그램 등)
  - 동적 색상 변경
  - 크기 조절

### 사용 사례
```tsx
// 로그인 버튼에 카카오 아이콘
<Button
  label="카카오로 로그인하기"
  leftIcon={<KakaoIcon width={18} height={18} />}
/>

// 인스타그램 바로가기 버튼
<TouchableOpacity>
  <InstagramIcon width={24} height={24} fill="#E4405F" />
</TouchableOpacity>
```

<br/>

## ✅ 해결 방법

### 핵심 솔루션

**Metro 설정 + SVG Transformer + TypeScript 타입 선언**

1. `react-native-svg`: SVG 렌더링 라이브러리
2. `react-native-svg-transformer`: SVG 파일을 React 컴포넌트로 변환
3. Metro 설정: SVG를 소스 파일로 인식
4. TypeScript 타입 선언: SVG 모듈 타입 정의

<br/>

## 🛠 설정 가이드

### 1단계: 패키지 설치

```bash
# SVG 렌더링 라이브러리 (필수)
npm install react-native-svg

# SVG 변환 도구 (개발 의존성)
npm install --save-dev react-native-svg-transformer
```

**버전 호환성**:
```json
{
  "react-native-svg": "^15.13.0",
  "react-native-svg-transformer": "^1.5.1"
}
```

### 2단계: Metro 설정

#### 파일: `metro.config.js`

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // SVG 파일을 React 컴포넌트로 변환
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // SVG를 자산(asset) 확장자에서 제거
    assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(
      ext => ext !== 'svg'
    ),
    // SVG를 소스 확장자에 추가
    sourceExts: [
      ...getDefaultConfig(__dirname).resolver.sourceExts,
      'svg',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

#### 주요 변경사항 설명

| 설정 | 역할 | 효과 |
|------|------|------|
| `transformer.babelTransformerPath` | SVG 변환 도구 지정 | SVG → React 컴포넌트 |
| `resolver.assetExts.filter()` | SVG를 자산에서 제거 | Image로 인식 방지 |
| `resolver.sourceExts.push('svg')` | SVG를 소스 코드로 추가 | import 가능 |

### 3단계: TypeScript 타입 선언

#### 파일: `src/types/svg.d.ts`

```typescript
/**
 * SVG 파일을 React 컴포넌트로 인식하도록 타입 선언
 */
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  
  const content: React.FC<SvgProps>;
  export default content;
}
```

#### 설명

- `SvgProps`: `react-native-svg`에서 제공하는 Props 타입
- 주요 Props:
  ```typescript
  interface SvgProps {
    width?: number | string;
    height?: number | string;
    fill?: string;
    stroke?: string;
    opacity?: number;
    // ... 기타 SVG 속성
  }
  ```

### 4단계: tsconfig.json 확인 (필요 시)

#### 파일: `tsconfig.json`

```json
{
  "compilerOptions": {
    "typeRoots": [
      "./src/types",
      "./node_modules/@types"
    ]
  },
  "include": [
    "src/**/*"
  ]
}
```

**확인 사항**:
- `src/types` 경로가 `typeRoots`에 포함되어 있는지
- `include`에 `src/**/*`가 포함되어 있는지

### 5단계: Metro 캐시 초기화 및 재시작

```bash
# Metro 캐시 초기화
npx react-native start --reset-cache

# 새 터미널에서 앱 실행
# Android
npx react-native run-android

# iOS (macOS만 해당)
cd ios && pod install && cd ..
npx react-native run-ios
```

<br/>

## 🎨 사용법

### 기본 사용법

#### 1. SVG 파일 준비

```
src/
├── assets/
│   ├── Kakao.svg
│   ├── instagram.svg
│   └── Stickr.png
```

**권장 SVG 구조**:
```xml
<!-- Kakao.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.477 2 2 5.582 2 10c0 ..." fill="currentColor"/>
</svg>
```

#### 2. Import 및 사용

```tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import KakaoIcon from '../assets/Kakao.svg';
import InstagramIcon from '../assets/instagram.svg';

const MyComponent = () => {
  return (
    <View>
      {/* 기본 사용 */}
      <KakaoIcon width={24} height={24} />
      
      {/* 색상 변경 */}
      <InstagramIcon 
        width={32} 
        height={32} 
        fill="#E4405F" 
      />
      
      {/* 버튼에 포함 */}
      <TouchableOpacity style={styles.button}>
        <KakaoIcon width={18} height={18} />
        <Text>카카오 로그인</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 고급 사용법

#### 1. 색상 변경

```tsx
// SVG 파일에서 fill="currentColor"로 설정되어 있어야 함
<KakaoIcon width={24} height={24} fill="#FEE500" />
<InstagramIcon width={24} height={24} fill="#E4405F" />
```

**팁**: SVG 파일 내부의 `fill` 속성을 제거하거나 `currentColor`로 설정하면 Props로 색상 제어 가능

#### 2. 동적 크기 조절

```tsx
const IconButton = ({ size = 24, color = '#000' }) => (
  <TouchableOpacity>
    <KakaoIcon width={size} height={size} fill={color} />
  </TouchableOpacity>
);

// 사용
<IconButton size={32} color="#FEE500" />
```

#### 3. 스타일 적용

```tsx
<View style={styles.iconContainer}>
  <InstagramIcon 
    width={24} 
    height={24}
    style={styles.icon}
  />
</View>

const styles = StyleSheet.create({
  iconContainer: {
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  icon: {
    // SVG 자체에는 제한적으로 적용됨
  },
});
```

#### 4. 애니메이션과 함께 사용

```tsx
import Animated from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(KakaoIcon);

<Animated.View style={{ transform: [{ rotate: rotation }] }}>
  <KakaoIcon width={24} height={24} />
</Animated.View>
```

### 실제 프로젝트 사용 예시

#### 로그인 버튼 (AuthHomeScreen)

```tsx
import KakaoIcon from '../../assets/Kakao.svg';

<GeneralCustomButton
  label="카카오로 로그인하기"
  leftIcon={<KakaoIcon width={18} height={18} />}
  backgroundColor="#FEE500"
  textColor="rgba(0, 0, 0, 0.85)"
  onPress={handleKakaoLogin}
/>
```

#### 토스트 인스타그램 버튼 (App.tsx)

```tsx
import InstagramIcon from './src/assets/instagram.svg';

<TouchableOpacity
  style={styles.instagramButton}
  onPress={handleInstagramPress}
>
  <InstagramIcon width={24} height={24} />
</TouchableOpacity>
```

<br/>

## 🔧 문제 해결

### 일반적인 문제들

#### 1. "Cannot resolve module" 오류

```bash
# 증상
Error: Cannot resolve module '../assets/icon.svg'

# 해결책
npx react-native start --reset-cache
```

**원인**: Metro 캐시에 이전 설정이 남아있음

#### 2. TypeScript 오류

```typescript
// 증상
Cannot find module '../assets/icon.svg' or its corresponding type declarations.

// 해결책 1: src/types/svg.d.ts 파일 확인
// 해결책 2: tsconfig.json의 typeRoots 확인
// 해결책 3: IDE 재시작 (VSCode: Cmd/Ctrl + Shift + P → "Reload Window")
```

#### 3. SVG가 렌더링되지 않음

```tsx
// 증상
<KakaoIcon /> // 아무것도 표시되지 않음

// 해결책: width와 height를 명시적으로 설정
<KakaoIcon width={24} height={24} />
```

**원인**: SVG 파일 내부에 고정 크기가 없으면 0x0으로 렌더링됨

#### 4. 색상 변경이 안 됨

```tsx
// 증상
<KakaoIcon fill="#FF0000" /> // 색상이 변경되지 않음

// 해결책: SVG 파일 수정
// ❌ 수정 전
<path d="..." fill="#000000" />

// ✅ 수정 후
<path d="..." fill="currentColor" />
// 또는 fill 속성을 완전히 제거
<path d="..." />
```

#### 5. iOS에서만 안 보임

```bash
# 증상
Android: 정상 작동
iOS: SVG 표시 안 됨

# 해결책: CocoaPods 재설치
cd ios
rm -rf Pods
pod install
cd ..
npx react-native run-ios
```

### 플랫폼별 주의사항

#### Android

- ✅ 추가 설정 불필요
- ✅ 모든 SVG 기능 지원

#### iOS

- ✅ CocoaPods 의존성 설치 필요
- ⚠️ 일부 복잡한 SVG 렌더링 이슈 가능

<br/>

## ⭐ 베스트 프랙티스

### 1. SVG 파일 최적화

#### 사용 전

```xml
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- 불필요한 메타데이터 -->
  <title>Icon</title>
  <desc>Created with Sketch.</desc>
  
  <!-- 인라인 스타일 -->
  <path style="fill: #000000; stroke: #FF0000;" d="..."/>
</svg>
```

#### 사용 후 (최적화)

```xml
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="..."/>
</svg>
```

**최적화 도구**:
- [SVGO](https://github.com/svg/svgo)
- [SVGOMG](https://jakearchibald.github.io/svgomg/) (온라인)

### 2. 디렉토리 구조

```
src/
├── assets/
│   ├── icons/           # SVG 아이콘
│   │   ├── social/      # 카테고리별 분류
│   │   │   ├── kakao.svg
│   │   │   ├── instagram.svg
│   │   │   └── google.svg
│   │   └── ui/
│   │       ├── close.svg
│   │       └── search.svg
│   └── images/          # PNG, JPG 이미지
│       └── logo.png
```

### 3. 재사용 가능한 아이콘 컴포넌트

```tsx
// src/components/Icon.tsx
import React from 'react';
import { SvgProps } from 'react-native-svg';

// 아이콘 매핑
import KakaoIcon from '../assets/icons/social/kakao.svg';
import InstagramIcon from '../assets/icons/social/instagram.svg';
import CloseIcon from '../assets/icons/ui/close.svg';

const iconMap = {
  kakao: KakaoIcon,
  instagram: InstagramIcon,
  close: CloseIcon,
};

interface IconProps extends SvgProps {
  name: keyof typeof iconMap;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  ...props
}) => {
  const SvgIcon = iconMap[name];
  
  return (
    <SvgIcon
      width={size}
      height={size}
      fill={color}
      {...props}
    />
  );
};

// 사용
<Icon name="kakao" size={24} color="#FEE500" />
<Icon name="instagram" size={32} color="#E4405F" />
```

### 4. Props 타입 안전성

```tsx
import { SvgProps } from 'react-native-svg';

interface IconButtonProps {
  icon: React.FC<SvgProps>;
  size?: number;
  color?: string;
  onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: IconComponent,
  size = 24,
  color = '#000',
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <IconComponent width={size} height={size} fill={color} />
  </TouchableOpacity>
);

// 사용 (타입 안전)
<IconButton 
  icon={KakaoIcon} 
  size={32} 
  color="#FEE500" 
  onPress={handlePress} 
/>
```

### 5. 성능 최적화

```tsx
// ❌ 매번 새 컴포넌트 생성
<Button icon={<KakaoIcon width={24} height={24} />} />

// ✅ 메모이제이션
const kakaoIcon = useMemo(
  () => <KakaoIcon width={24} height={24} />,
  []
);
<Button icon={kakaoIcon} />

// ✅ 또는 컴포넌트 외부에서 정의
const KAKAO_ICON = <KakaoIcon width={24} height={24} />;
<Button icon={KAKAO_ICON} />
```

<br/>

## 📚 참고 자료

### 공식 문서
- [react-native-svg 공식 문서](https://github.com/react-native-svg/react-native-svg)
- [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer)
- [Metro 설정 가이드](https://metrobundler.dev/docs/configuration/)

### 유용한 도구
- [SVGOMG](https://jakearchibald.github.io/svgomg/): SVG 최적화 (온라인)
- [SVG Path Visualizer](https://svg-path-visualizer.netlify.app/): SVG 경로 시각화
- [React SVGR](https://react-svgr.com/): SVG → React 컴포넌트 변환 (웹용, 참고용)

<br/>

## ✅ 체크리스트

설정 완료 후 다음 사항들을 확인하세요:

- [ ] `react-native-svg` 패키지 설치됨
- [ ] `react-native-svg-transformer` 패키지 설치됨
- [ ] `metro.config.js` 수정됨
- [ ] `src/types/svg.d.ts` 생성됨
- [ ] Metro 캐시 초기화 완료 (`--reset-cache`)
- [ ] SVG 파일이 `src/assets/` 경로에 위치함
- [ ] SVG 컴포넌트가 올바르게 import됨
- [ ] 앱에서 SVG 아이콘이 표시됨
- [ ] TypeScript 에러 없음
- [ ] iOS에서 정상 작동 (macOS의 경우)

<br/>

---

<div align="center">

**✅ 설정 완료**  
React Native에서 SVG를 컴포넌트로 사용 가능

</div>
