# Push Credentials Checklist

Use this checklist before shipping push notification changes.

## Expo / EAS

- Confirm `expo-notifications` plugin is enabled in `app.json`.
- Confirm EAS project is the expected one for production builds.
- Confirm production build profile is used for release artifacts.

## Android (FCM v1)

- Ensure the Firebase project is linked to `com.brewskey.app`.
- Ensure FCM service account credentials are configured for Expo/EAS.
- Ensure Notification Hub Android credentials target the same Firebase project.

## iOS (APNS)

- Ensure APNS key/certificate is valid for `com.brewskey.app`.
- Ensure Expo/EAS has APNS credentials configured for production.
- Ensure Notification Hub APNS credentials match the same app identifier/environment.

## Backend / Notification Hub

- Ensure `Microsoft.NotificationHub.ConnectionString` is present and valid.
- Validate push hub name/environment is correct.
- Verify `/api/v2/push` register and unregister endpoints succeed for real devices.

## Final Validation

- iOS physical device: register token, receive push, open from tray, verify in-app list.
- Android physical device: register token, receive push, open from tray, verify in-app list.
- Logout/login cycle: unregister on logout, no duplicate delivery after re-login.
