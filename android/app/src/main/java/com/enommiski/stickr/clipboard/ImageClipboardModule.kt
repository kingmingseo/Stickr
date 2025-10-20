package com.enommiski.stickr.clipboard

import android.content.ClipData
import android.content.ClipDescription
import android.content.ClipboardManager
import android.content.Context
import android.os.Build
import android.os.PersistableBundle
import android.net.Uri
import androidx.core.content.FileProvider
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class ImageClipboardModule(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx) {
  override fun getName(): String = "ImageClipboard"

  @ReactMethod
  fun setImage(path: String, promise: Promise) {
    try {
      val file = File(path)
      if (!file.exists() || !file.isFile) {
        promise.reject("ENOENT", "File not found: $path")
        return
      }

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
    } catch (e: Exception) {
      promise.reject("ECLIP", e)
    }
  }
}


