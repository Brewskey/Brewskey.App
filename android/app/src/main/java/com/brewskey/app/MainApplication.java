package com.brewskey.app;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactApplication;
import com.gettipsi.stripe.StripeReactPackage;
import com.microsoft.codepush.react.CodePush;

//import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
//import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
//import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import community.revteltech.nfc.NfcManagerPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.krazylabs.OpenAppSettingsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new StripeReactPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new SplashScreenReactPackage(),
            new RandomBytesPackage(),
            new ReactNativePushNotificationPackage(),
            new NfcManagerPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new OpenAppSettingsPackage(),
            new CodePush("ZlNwkrexUXfszUfPqdPtmkTvByYM505a7461-8d36-4cd2-9890-9634a2c7bfe6", MainApplication.this, BuildConfig.DEBUG)
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
