### StickerCard 이미지 → 클립보드 복사 로직 (최신 구현 기준)

#### 1) 사용자 흐름

- 스티커를 탭 → 캐시에 이미지 다운로드 → 안드로이드 네이티브로 클립보드 복사(또는 iOS/폴백) → 성공 토스트(인스타 버튼) 표시 → 임시 파일 정리

#### 2) JS 레이어(StickerCard)

- 파일: `src/components/StickerCard.tsx`
- 핵심 포인트:
  - 중복 탭 방지를 위한 가드(`isCopying`)
  - 200ms 지연으로 UI 안정화
  - 캐시 디렉터리에 다운로드(`RNFS.downloadFile`)
  - Android: `NativeModules.ImageClipboard.setImage(localPath)` 호출
  - iOS/폴백: `Clipboard.setImage` → 실패 시 `base64` Data URL 문자열 복사
  - 성공 토스트 `successWithInstagram` 표시, 실패 시 URL 복사 또는 에러 토스트

코드 발췌 1: 다운로드 및 네이티브/폴백 복사

```tsx
const handleCopyPress = async () => {
  if (isCopying) return;
  setIsCopying(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    const ext = uri
      .split('?')[0]
      .split('#')[0]
      .split('.')
      .pop()
      ?.toLowerCase();
    const safeExt = ext && ext.length <= 5 ? ext : 'jpg';
    const fileName = `stickr_${Date.now()}.${safeExt}`;
    const toFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

    const res = await RNFS.downloadFile({
      fromUrl: uri,
      toFile,
      connectionTimeout: 10000,
      readTimeout: 10000,
    }).promise;

    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
      const exists = await RNFS.exists(toFile);
      if (exists) {
        if (
          Platform.OS === 'android' &&
          (NativeModules as any)?.ImageClipboard?.setImage
        ) {
          await (NativeModules as any).ImageClipboard.setImage(toFile);
        } else {
          try {
            // @ts-ignore
            await (Clipboard as any).setImage?.(toFile);
          } catch {
            const base64 = await RNFS.readFile(toFile, 'base64');
            await Clipboard.setString(`data:image/${safeExt};base64,${base64}`);
          }
        }
```

코드 발췌 2: 성공 토스트 및 폴백 토스트, 임시 파일 정리

```tsx
        Toast.show({
          type: 'successWithInstagram',
          text1: '복사 완료!',
          text2: '이미지가 클립보드에 복사되었습니다',
          position: 'bottom',
          visibilityTime: 5000,
        });
      } else {
        throw new Error('다운로드한 파일을 찾을 수 없습니다');
      }
    } else {
      throw new Error(`다운로드 실패 (status ${res.statusCode})`);
    }

    onPress?.();
  } catch (e) {
    try {
      await Clipboard.setString(uri);
      Toast.show({ type: 'info', text1: 'URL 복사', text2: '이미지 URL을 복사했습니다' });
    } catch {
      Toast.show({ type: 'error', text1: '복사 실패', text2: '이미지 복사 중 오류가 발생했습니다' });
    }
  } finally {
    setTimeout(async () => {
      try {
        const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
        const targets = files.filter(f => f.name.startsWith('stickr_'));
        await Promise.allSettled(targets.map(f => RNFS.unlink(f.path)));
      } catch {}
      setIsCopying(false);
    }, 1500);
  }
};
```

#### 3) 안드로이드 네이티브 레이어(ImageClipboard)

- 파일: `android/app/src/main/java/com/stickr/clipboard/ImageClipboardModule.kt`
- 역할: 로컬 파일 경로 → `FileProvider`로 `content://` URI 발급 → `ClipboardManager`에 `ClipData.newUri`로 등록
- Android 13+: `ClipDescription.EXTRA_IS_SENSITIVE`를 false로 설정(현재 설정: 미리보기 허용)

코드 발췌 3: FileProvider → ClipData → setPrimaryClip

```kotlin
val authority = ctx.packageName + ".fileprovider"
val uri: Uri = FileProvider.getUriForFile(ctx, authority, file)

val clipboard = ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
val clip = ClipData.newUri(ctx.contentResolver, "image", uri)

// Android 13+ (T): 민감 콘텐츠 미리보기 제어 등 추가 메타데이터 설정 가능
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
  try {
    val extras = PersistableBundle()
    // 스티커는 일반적으로 민감 정보가 아니므로 미리보기 허용(false)
    extras.putBoolean(ClipDescription.EXTRA_IS_SENSITIVE, false)
    clip.description.setExtras(extras)
  } catch (_: Throwable) {
    // extras 설정이 실패해도 복사 동작에는 영향 없음
  }
}

clipboard.setPrimaryClip(clip)
promise.resolve(null)
```

#### 4) 매니페스트/리소스 설정

- `AndroidManifest.xml`에 `FileProvider` 등록 필요(이미 적용됨)

```xml
<provider
  android:name="androidx.core.content.FileProvider"
  android:authorities="${applicationId}.fileprovider"
  android:exported="false"
  android:grantUriPermissions="true">
  <meta-data
    android:name="android.support.FILE_PROVIDER_PATHS"
    android:resource="@xml/file_paths" />
</provider>
```

- `res/xml/file_paths.xml`에서 노출할 내부 경로 지정(캐시/파일 경로 등)

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
  <cache-path name="cache" path="." />
  <external-cache-path name="ext_cache" path="." />
  <files-path name="files" path="." />
  <external-files-path name="ext_files" path="." />
</paths>
```

#### 5) Android 버전별 동작 차이

- Android 10+(API 29~): 백그라운드 앱의 클립보드 접근은 제한. 사용자 탭(포그라운드) 시에는 복사 가능.
- Android 13+(API 33~): 시스템이 클립보드 미리보기 오버레이 제공. 현재 설정은 미리보기 허용(`EXTRA_IS_SENSITIVE=false`).
- Android 12L 이하: 시스템 미리보기 오버레이 없음.

#### 6) 토스트 UI(겹침 최소화)

- 파일: `App.tsx`
- 우측 정렬/세로 배치로 클립보드 오버레이와 겹침을 줄임. 인스타 버튼은 FontAwesome Instagram 아이콘 사용.

```tsx
const toastConfig = {
  successWithInstagram: ({ text1, text2 }: any) => (
    <View style={styles.toastContainer}>
      <TouchableOpacity
        style={styles.instagramButton}
        onPress={async () => {
          // ... 인스타 앞으로 가져오기 / 열기
        }}
      >
        <Text style={styles.instagramIcon}></Text>
      </TouchableOpacity>
      <View style={styles.toastContent}>
        <Text style={styles.toastText1}>{text1}</Text>
        <Text style={styles.toastText2}>{text2}</Text>
      </View>
    </View>
  ),
};
```

#### 7) 에뮬레이터 트러블슈팅

- 클립보드 공유 비활성화 시, 호스트와 동기화되지 않아 "복사가 안 되는 것처럼" 보일 수 있음.
  - Android Studio → AVD Manager → 해당 기기 Edit → Advanced Settings → Enable clipboard sharing 체크
  - 설정 변경 후 에뮬레이터 재시작 권장

#### 8) 테스트 체크리스트

- 스티커 탭 → 스피너 표시 → 다운로드 → 복사 성공 토스트 확인
- 인스타 버튼 → 인스타그램으로 전환 동작 확인(AppSwitcher 네이티브 포함)
- 붙여넣기 테스트: 인스타/메모장 등에서 이미지 붙여넣기 시도
- 에러/오프라인 시 URL 복사 폴백 토스트 확인

#### 9) 유지보수 팁

- `EXTRA_IS_SENSITIVE`를 true로 변경하면(Android 13+), 시스템 미리보기 오버레이를 숨길 수 있음.
- 복사 후 파일 정리 지연(1.5~2초)은 다른 앱이 URI를 읽는 타이밍을 고려한 안전장치.
- 공통 로직은 훅(`useImageCopy`)으로 분리 가능하나, 현재 코드는 컴포넌트 내부에 유지.
