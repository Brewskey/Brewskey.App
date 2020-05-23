// flow-typed signature: 1f7e718942224a8746c636ec8b89e45d
// flow-typed version: <<STUB>>/react-native-permissions_v^2.1.4/flow_v0.125.1

declare module 'react-native-permissions' {
  declare type AndroidPermissions = $Readonly<{|
    ACCEPT_HANDOVER: 'ACCEPT_HANDOVER',
    ACCESS_BACKGROUND_LOCATION: 'ACCESS_BACKGROUND_LOCATION',
    ACCESS_COARSE_LOCATION: 'ACCESS_COARSE_LOCATION',
    ACCESS_FINE_LOCATION: 'ACCESS_FINE_LOCATION',
    ACTIVITY_RECOGNITION: 'ACTIVITY_RECOGNITION',
    ADD_VOICEMAIL: 'ADD_VOICEMAIL',
    ANSWER_PHONE_CALLS: 'ANSWER_PHONE_CALLS',
    BODY_SENSORS: 'BODY_SENSORS',
    CALL_PHONE: 'CALL_PHONE',
    CAMERA: 'CAMERA',
    GET_ACCOUNTS: 'GET_ACCOUNTS',
    PROCESS_OUTGOING_CALLS: 'PROCESS_OUTGOING_CALLS',
    READ_CALENDAR: 'READ_CALENDAR',
    READ_CALL_LOG: 'READ_CALL_LOG',
    READ_CONTACTS: 'READ_CONTACTS',
    READ_EXTERNAL_STORAGE: 'READ_EXTERNAL_STORAGE',
    READ_PHONE_NUMBERS: 'READ_PHONE_NUMBERS',
    READ_PHONE_STATE: 'READ_PHONE_STATE',
    READ_SMS: 'READ_SMS',
    RECEIVE_MMS: 'RECEIVE_MMS',
    RECEIVE_SMS: 'RECEIVE_SMS',
    RECEIVE_WAP_PUSH: 'RECEIVE_WAP_PUSH',
    RECORD_AUDIO: 'RECORD_AUDIO',
    SEND_SMS: 'SEND_SMS',
    USE_SIP: 'USE_SIP',
    WRITE_CALENDAR: 'WRITE_CALENDAR',
    WRITE_CALL_LOG: 'WRITE_CALL_LOG',
    WRITE_CONTACTS: 'WRITE_CONTACTS',
    WRITE_EXTERNAL_STORAGE: 'WRITE_EXTERNAL_STORAGE',
  |}>;
  declare type IOSPermissions = $Readonly<{|
    BLUETOOTH_PERIPHERAL: 'BLUETOOTH_PERIPHERAL',
    CALENDARS: 'CALENDARS',
    CAMERA: 'CAMERA',
    CONTACTS: 'CONTACTS',
    FACE_ID: 'FACE_ID',
    LOCATION_ALWAYS: 'LOCATION_ALWAYS',
    LOCATION_WHEN_IN_USE: 'LOCATION_WHEN_IN_USE',
    MEDIA_LIBRARY: 'MEDIA_LIBRARY',
    MICROPHONE: 'MICROPHONE',
    MOTION: 'MOTION',
    PHOTO_LIBRARY: 'PHOTO_LIBRARY',
    REMINDERS: 'REMINDERS',
    SIRI: 'SIRI',
    SPEECH_RECOGNITION: 'SPEECH_RECOGNITION',
    STOREKIT: 'STOREKIT',
  |}>;
  declare export var PERMISSIONS: $Readonly<{|
    ANDROID: AndroidPermissions,
    IOS: IOSPermissions,
  |}>;

  declare export var RESULTS: $Readonly<{|
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
  |}>;

  declare type PermissionType =
    | $Values<AndroidPermissions>
    | $Values<IOSPermissions>;
  declare type PermissionStatus = $Values<RESULTS>;
  declare type NotificationOption =
    | 'alert'
    | 'badge'
    | 'sound'
    | 'carPlay'
    | 'criticalAlert'
    | 'provisional';
  declare type NotificationSettings = {|
    alert?: boolean,
    badge?: boolean,
    sound?: boolean,
    carPlay?: boolean,
    criticalAlert?: boolean,
    lockScreen?: boolean,
    notificationCenter?: boolean,
  |};
  declare type NotificationsResponse = {
    status: PermissionStatus,
    settings: NotificationSettings,
  };
  declare type Rationale = {
    title: string,
    message: string,
    buttonPositive: string,
    buttonNegative?: string,
    buttonNeutral?: string,
  };

  declare export function openSettings(): Promise<void>;
  declare export function check(PermissionType): Promise<PermissionStatus>;
  declare export function request(
    PermissionType,
    Rationale,
  ): Promise<PermissionStatus>;
  declare export function checkNotifications(): Promise<NotificationsResponse>;
  declare export function checkNotifications(
    Array<NotificationOption>,
  ): Promise<NotificationsResponse>;
  declare export function checkMultiple(
    Array<PermissionType>,
  ): Promise<{
    [keys: PermissionType]: PermissionStatus,
  }>;
  declare export function requestMultiple(
    Array<PermissionType>,
  ): Promise<{
    [keys: PermissionType]: PermissionStatus,
  }>;
}
