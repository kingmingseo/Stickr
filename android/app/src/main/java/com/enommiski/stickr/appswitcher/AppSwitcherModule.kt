package com.enommiski.stickr.appswitcher

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppSwitcherModule(private val ctx: ReactApplicationContext) :
        ReactContextBaseJavaModule(ctx) {
  override fun getName(): String = "AppSwitcher"

  @ReactMethod
  fun bringToForeground(packageName: String, promise: Promise) {
    try {
      val pm = reactApplicationContext.packageManager
      val intent =
              pm.getLaunchIntentForPackage(packageName)
                      ?: run {
                        promise.reject("ENOAPP", "Package not found: $packageName")
                        return
                      }

      // 기존 인스타그램 태스크가 있으면 앞으로 가져오고, 없으면 새 태스크를 생성
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

      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("EAPP_SWITCH", e)
    }
  }
}
