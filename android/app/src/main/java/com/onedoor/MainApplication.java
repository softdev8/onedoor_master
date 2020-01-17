package com.onedoor;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.reactnative.camera.RNCameraPackage;
import com.brentvatne.react.ReactVideoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
// import io.invertase.firebase.admob.RNFirebaseAdMobPackage; //Firebase AdMob
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
// import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage; // Firebase Remote Config
// import io.invertase.firebase.crash.RNFirebaseCrashPackage; // Firebase Crash Reporting
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // Firebase Realtime Database
// import io.invertase.firebase.firestore.RNFirebaseFirestorePackage; // Firebase Firestore
// import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging
// import io.invertase.firebase.perf.RNFirebasePerformancePackage; // Firebase Performance
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // Firebase Storage

import me.hauvo.thumbnail.RNThumbnailPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AsyncStoragePackage(),
            new RNCameraPackage(),
            new ReactVideoPackage(),
            new RNThumbnailPackage(),
            new SplashScreenReactPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseDatabasePackage(),
            // new RNFirebaseMessagingPackage(),
            new RNFirebaseStoragePackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
