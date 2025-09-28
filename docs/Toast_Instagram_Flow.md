### App.tsx: Toast에서 인스타그램 앞으로 가져오기 플로우

#### 사용자 흐름 요약
- 복사 성공 토스트(`successWithInstagram`)에 있는 인스타 버튼을 탭하면, 안드로이드에서 기존 인스타그램 태스크를 앞으로 가져오거나(있으면), 없으면 새로 실행합니다. 실패 시 `instagram://app` 스킴 또는 웹으로 폴백합니다.

#### 핵심 단계
1. 토스트 구성: `App.tsx`의 `toastConfig.successWithInstagram`
2. 버튼 탭 처리:
   - Android 우선: `NativeModules.AppSwitcher.bringToForeground('com.instagram.android')`
   - 실패 또는 iOS: `Linking.canOpenURL('instagram://app')` → 가능하면 앱, 아니면 `https://www.instagram.com/` 오픈
3. 성공/실패 후 `Toast.hide()`로 토스트 닫기

#### 관련 코드 (발췌)
```tsx
// App.tsx (발췌)
const toastConfig = {
  successWithInstagram: ({ text1, text2 }: any) => (
    <View style={styles.toastContainer}>
      <View style={styles.toastContent}>
        <Text style={styles.toastText1}>{text1}</Text>
        <Text style={styles.toastText2}>{text2}</Text>
      </View>
      <TouchableOpacity
        style={styles.instagramButton}
        onPress={async () => {
          try {
            if (Platform.OS === 'android' && (NativeModules as any)?.AppSwitcher?.bringToForeground) {
              await (NativeModules as any).AppSwitcher.bringToForeground('com.instagram.android')
              Toast.hide();
              return;
            }

            const appUrl = 'instagram://app'
            const canOpenApp = await Linking.canOpenURL(appUrl)
            if (canOpenApp) {
              await Linking.openURL(appUrl)
              Toast.hide()
              return
            }

            await Linking.openURL('https://www.instagram.com/')
          } catch (error) {
            console.log('인스타그램 열기 실패:', error)
          }
          Toast.hide()
        }}
      >
        <Text style={styles.instagramButtonText}>📷</Text>
      </TouchableOpacity>
    </View>
  ),
}
```

#### 안드로이드 네이티브 동작(AppSwitcher)
- `android/app/src/main/java/com/stickr/appswitcher/AppSwitcherModule.kt`
  - `getLaunchIntentForPackage('com.instagram.android')`로 런치 인텐트 획득
  - 인텐트 구성: `ACTION_MAIN` + `CATEGORY_LAUNCHER` + `FLAG_ACTIVITY_NEW_TASK` + `FLAG_ACTIVITY_RESET_TASK_IF_NEEDED`
  - 효과: 기존 인스타 태스크가 있으면 앞으로 가져오고, 없으면 새 태스크로 실행

```kotlin
// AppSwitcherModule.kt (발췌)
intent.addCategory(Intent.CATEGORY_LAUNCHER)
intent.action = Intent.ACTION_MAIN
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
intent.addFlags(Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)

val activity = ctx.currentActivity
if (activity != null) {
  activity.startActivity(intent)
} else {
  reactApplicationContext.startActivity(intent)
}
```

##### 동작 원리 상세
- `getLaunchIntentForPackage`: 대상 앱의 기본 런치 액티비티를 여는 표준 인텐트를 반환합니다. 존재하지 않으면 `ENOAPP` 에러로 리젝트합니다.
- `ACTION_MAIN` + `CATEGORY_LAUNCHER`: 홈 런처에서 실행하는 것과 동일한 진입 경로를 보장합니다.
- `FLAG_ACTIVITY_NEW_TASK`: 다른 앱의 태스크 컨텍스트에서 실행되도록 강제합니다(앱 경계 넘는 실행 시 필요).
- `FLAG_ACTIVITY_RESET_TASK_IF_NEEDED`: 기존 태스크가 존재하면, 필요한 경우 태스크를 재정렬/리셋하여 최상단으로 가져옵니다.
- `currentActivity` 유무 처리: 현재 RN 액티비티가 있으면 그 컨텍스트로 시작하고, 없으면 `Application` 컨텍스트로 실행합니다.

##### Android 11+에서의 패키지 가시성 이슈
- `AndroidManifest.xml` 내 `queries`는 두 경로를 모두 커버합니다.
  - 패키지: `com.instagram.android`
  - 스킴: `instagram://`
- 목적: 런타임에서 해당 패키지/스킴에 대한 조회와 인텐트 생성이 차단되지 않도록 허용합니다.

##### 실패/폴백 전략
- 네이티브 모듈 실패(`EAPP_SWITCH`, 미설치 등): JS 레벨에서 `Linking.canOpenURL('instagram://app')`로 앱 오픈 시도 → 미지원이면 웹(`https://www.instagram.com/`)으로 폴백.


#### Android 11+ Package Visibility
- `AndroidManifest.xml`에 `queries` 추가:
```xml
<queries>
  <package android:name="com.instagram.android" />
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="instagram" />
  </intent>
</queries>
```
- 목적: `getLaunchIntentForPackage`/`canOpenURL` 사용 시 패키지 가시성 제한으로 인한 실패 방지

#### iOS 폴백 동작
- `Linking.canOpenURL('instagram://app')` 결과에 따라 앱을 여는 방식으로만 처리(태스크 포그라운드 제어는 iOS 정책상 불가)

#### UX 디테일
- 토스트 내 인스타 버튼은 우측에 위치, 탭 시 즉시 토스트 닫힘.
- 실패 케이스에서도 마지막에 `Toast.hide()` 보장.

#### 테스트 체크리스트
- 안드로이드: 인스타가 최근 앱 목록에 살아있는 상태에서 버튼 탭 → 기존 화면 재개 확인.
- 안드로이드: 인스타가 종료된 상태에서 버튼 탭 → Cold Start로 열림 확인.
- iOS: `instagram://app` 오픈 가능/불가 시나리오 각각 동작 확인.


