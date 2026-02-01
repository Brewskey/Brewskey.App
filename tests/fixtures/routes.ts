/**
 * Expo Router deep link paths for e2e tests.
 * Use group names in parentheses per Expo Router conventions:
 * - Menu tab: /(menu), settings: /(menu)/settings, etc.
 * - Shared routes (locations, taps, devices, beverages) use single path.
 */

/** Tab and screen paths – use /(group) for deep link to that tab */
export const ROUTES = {
  /** Home / feed tab */
  FEED: '/(feed)',
  /** Stats tab */
  STATS: '/(stats)',
  /** Notifications tab */
  NOTIFICATIONS: '/(notifications)',
  /** Menu tab */
  MENU: '/(menu)',
  /** Menu settings */
  MENU_SETTINGS: '/(menu)/settings',
  /** Menu my-friends */
  MENU_MY_FRIENDS: '/(menu)/my-friends',
  /** Menu my-friends request tab */
  MENU_MY_FRIENDS_REQUEST: '/(menu)/my-friends/myFriendsRequest',
  /** Menu help */
  MENU_HELP: '/(menu)/help',
  /** Menu write-nfc */
  MENU_WRITE_NFC: '/(menu)/write-nfc',
  /** Menu payments */
  MENU_PAYMENTS: '/(menu)/payments',
  /** Menu my-profile */
  MENU_MY_PROFILE: '/(menu)/my-profile',

  /** Shared secondary routes – single URL for all tab contexts */
  LOCATIONS: '/locations',
  LOCATIONS_NEW: '/locations/new',
  TAPS: '/taps',
  TAPS_NEW: '/taps/new',
  DEVICES: '/devices',
  DEVICES_NEW: '/devices/new',
  BEVERAGES: '/beverages',
  BEVERAGES_NEW: '/beverages/new',

  /** Nux flow – under (nux) */
  NUX_LOCATION: '/(nux)/location',
  NUX_WIFI: '/(nux)/wifi',
  NUX_DEVICE: '/(nux)/device',
  NUX_TAP: '/(nux)/tap',
  NUX_FINISH: '/(nux)/finish',
} as const;
