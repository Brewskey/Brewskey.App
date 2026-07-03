const { withAndroidManifest } = require('@expo/config-plugins');

const NDEF_ACTION = 'android.nfc.action.NDEF_DISCOVERED';

/**
 * Adds an NDEF_DISCOVERED intent filter for the Brewskey Box tag URL to
 * MainActivity. Expo's built-in `android.intentFilters` config cannot
 * express NFC actions (it hardcodes the `android.intent.action.` prefix),
 * so this plugin appends the filter during prebuild. Without it, a tag tap
 * dispatched by the tag's Android Application Record reaches the launcher
 * activity without the NDEF payload, and the app cannot read the device id.
 */
module.exports = function withNfcNdefIntentFilter(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    const mainActivity = application?.activity?.find(
      (activity) => activity.$['android:name'] === '.MainActivity',
    );
    if (mainActivity == null) {
      return mod;
    }

    mainActivity['intent-filter'] = mainActivity['intent-filter'] ?? [];
    const alreadyAdded = mainActivity['intent-filter'].some((filter) =>
      (filter.action ?? []).some(
        (action) => action.$['android:name'] === NDEF_ACTION,
      ),
    );
    if (alreadyAdded) {
      return mod;
    }

    mainActivity['intent-filter'].push({
      action: [{ $: { 'android:name': NDEF_ACTION } }],
      category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
      data: [
        {
          $: {
            'android:scheme': 'https',
            'android:host': 'brewskey.com',
            'android:pathPrefix': '/d/',
          },
        },
      ],
    });
    return mod;
  });
};
