package com.brewskey;


import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import io.particle.android.sdk.cloud.models.AccountInfo;
import io.particle.android.sdk.devicesetup.ParticleDeviceSetupLibrary;
import io.particle.android.sdk.devicesetup.ParticleDeviceSetupLibrary.DeviceSetupCompleteReceiver;
import io.particle.android.sdk.devicesetup.SetupCompleteIntentBuilder;
import io.particle.android.sdk.devicesetup.SetupResult;

// variant 1: with intent Main activity and receiver
// receiver is in particle docs, but it was used there with deprected API, so idk.
// with this setup it doesn't do anything.
public class DeviceSetupModule extends ReactContextBaseJavaModule {

    public DeviceSetupModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ParticleDeviceSetupLibrary.initWithSetupOnly(reactContext);
    }

    @Override
    public String getName() {
        return "DeviceSetup";
    }

    @ReactMethod
    public void setup(final Promise promise) {
        // those methods aren't invoked
        DeviceSetupCompleteReceiver receiver = new DeviceSetupCompleteReceiver() {
            @Override
            public void onSetupSuccess(@NonNull String configuredDeviceId) {
                promise.resolve(configuredDeviceId)
            }

            @Override
            public void onSetupFailure() {
                promise.reject("fu", "uufufufufufu");
            }
        };
        receiver.register(getReactApplicationContext());
        ParticleDeviceSetupLibrary.startDeviceSetup(getReactApplicationContext(), getCurrentActivity().getClass());
        receiver.unregister(getReactApplicationContext());
    }
}

// variant 2: with intent builder
public class DeviceSetupModule extends ReactContextBaseJavaModule {
    private final SetupCompleteIntentBuilder setupCompleteIntentBuilder = new SetupCompleteIntentBuilder() {
        @Override
        public Intent buildIntent(Context ctx, @Nullable SetupResult result) {
            // the following doesnt
             Intent intent = new Intent(ctx, MainActivity.class);
             intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

             return intent;
        }
    };

    public DeviceSetupModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ParticleDeviceSetupLibrary.initWithSetupOnly(reactContext);
    }

    @Override
    public String getName() {
        return "DeviceSetup";
    }

    @ReactMethod
    public void setup(final Promise promise) {
        ParticleDeviceSetupLibrary.startDeviceSetup(getReactApplicationContext(), setupCompleteIntentBuilder);
    }
}

// variant 3: with createActivity for Result
// like in react-native docs
public class DeviceSetupModule extends ReactContextBaseJavaModule {
    private Promise resultPromise;

    private final ActivityEventListener myActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if(resultPromise == null) {
                return;
            }

            resultPromise.resolve();
        }
    }

    public DeviceSetupModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ParticleDeviceSetupLibrary.initWithSetupOnly(reactContext);
        reactContext.addActivityEventListener(myActivityEventListener);
    }

    @Override
    public String getName() {
        return "DeviceSetup";
    }

    @ReactMethod
    public void setup(final Promise promise) {
        Activity currentActivity = getCurrentActivity();
        resultPromise = promise;

        // then they create intent and pass it to startActivityForResult
       final Intent someIntent = Intent();
        currentActivity.startActivityForResult(intent, REQUEST_CODE);

        // i have to idea how to combine it with the lib:
        ParticleDeviceSetupLibrary.startDeviceSetup(getReactApplicationContext(), setupCompleteIntentBuilder);
    }
}
