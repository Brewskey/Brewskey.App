# Push Validation Runbook

Use this runbook to validate end-to-end push behavior after the native-token migration and Notification Hubs installation updates.

## Scope

- App: `Brewskey.App-v3`
- Backend: `Brewskey.Web/Source` (`/api/v2/push` flows)
- Platforms: iOS + Android physical devices

## Preconditions

- Complete credential setup in `docs/PUSH_CREDENTIALS_CHECKLIST.md`.
- Backend deployed with latest push changes.
- App build installed from the branch containing the notification commits.
- Test user has valid data for at least one tap/friend flow.

## Environment Details To Capture

- App build/version:
- Backend environment + commit hash:
- Notification Hub namespace/hub:
- Device model + OS version:
- Logged-in account:

## Core Registration Checks

### 1) Permission + token registration

- Open notifications tab in app.
- Tap Continue on permission prompt.
- Confirm permission granted.
- Confirm backend `PUT /api/v2/push` succeeds.

Pass criteria:
- No client error shown.
- Registration request returns success.

### 2) Re-registration on token refresh

- Trigger app relaunch / token refresh path.
- Confirm registration request re-sent and succeeds.

Pass criteria:
- No duplicate-notification behavior introduced.

## Backend Validation Quick Commands

Use these examples to trigger push test flows from a terminal.

### 1) Set environment variables

PowerShell:

```powershell
$HOST = "https://brewskey.com"
$ACCESS_TOKEN = "<paste bearer token>"
$HEADERS = @{ Authorization = "Bearer $ACCESS_TOKEN" }
```

### 2) Trigger push test endpoints

PowerShell:

```powershell
# Achievement
Invoke-RestMethod -Method Get `
  -Uri "$HOST/api/v2/push/test-achievement?achievementType=Welcome" `
  -Headers $HEADERS

# Low keg/tap
Invoke-RestMethod -Method Get `
  -Uri "$HOST/api/v2/push/test-tap" `
  -Headers $HEADERS

# Friend request
Invoke-RestMethod -Method Get `
  -Uri "$HOST/api/v2/push/test-friend" `
  -Headers $HEADERS
```

curl equivalents:

```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$HOST/api/v2/push/test-achievement?achievementType=Welcome"

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$HOST/api/v2/push/test-tap"

curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "$HOST/api/v2/push/test-friend"
```

### 3) Optional unregister checks

PowerShell:

```powershell
# Unregister by installation id
$INSTALLATION_ID = "<device-installation-id>"
Invoke-RestMethod -Method Delete `
  -Uri "$HOST/api/v2/push/$INSTALLATION_ID"

# Unregister all for current authenticated user
Invoke-RestMethod -Method Delete `
  -Uri "$HOST/api/v2/push/current-user" `
  -Headers $HEADERS
```

## Delivery Scenario Matrix

Run all scenarios for each payload type:
- `newAchievement`
- `lowKegLevel`
- `newFriendRequest`

Backend triggers:
- `GET /api/v2/push/test-achievement`
- `GET /api/v2/push/test-tap`
- `GET /api/v2/push/test-friend`

### Foreground

- App open and active.
- Trigger notification.
- Confirm snackbar/in-app list update.

Pass criteria:
- Notification appears in list.
- Notification content/type mapped correctly.

### Background

- Put app in background.
- Trigger notification.
- Open app from icon (not tray first).

Pass criteria:
- Notification appears in list after app resume.

### Terminated + tray-open

- Force-close app.
- Trigger notification.
- Tap notification from system tray to launch app.

Pass criteria:
- Notification is persisted in list.
- Open action routes correctly.

## Persistence + Read State Checks

### 1) Persistence across restart

- Receive 2+ notifications.
- Kill app and relaunch.

Pass criteria:
- Existing notifications remain in list.

### 2) Read behavior

- Tap a notification.

Pass criteria:
- Notification marked read.
- Expected destination opens.

### 3) Delete behavior

- Delete single notification via swipe.
- Use "clear all".

Pass criteria:
- Removed items do not reappear after restart.

## Logout / Login Lifecycle

### 1) Logout cleanup

- While registered, log out.
- Confirm backend unregister is attempted.

Pass criteria:
- No stale notifications delivered to signed-out state.

### 2) Login re-register

- Log back in.
- Trigger test notification.

Pass criteria:
- Delivery works after re-login.
- No duplicate deliveries from stale registrations.

## Failure Triage Notes

If a case fails, capture:

- Timestamp (UTC):
- Scenario name:
- Device + OS:
- Payload type:
- Expected vs actual:
- Client log snippet:
- Backend log snippet:
- Request/response status for `/api/v2/push` register/unregister:

## Results Log Template

Copy this block per test session:

```
Session:
Tester:
Date:
Environment:

Registration:
- Permission + register: PASS/FAIL
- Re-registration path: PASS/FAIL

Delivery (iOS):
- Foreground achievement/tap/friend: PASS/FAIL
- Background achievement/tap/friend: PASS/FAIL
- Terminated tray-open achievement/tap/friend: PASS/FAIL

Delivery (Android):
- Foreground achievement/tap/friend: PASS/FAIL
- Background achievement/tap/friend: PASS/FAIL
- Terminated tray-open achievement/tap/friend: PASS/FAIL

Persistence + read:
- Restart persistence: PASS/FAIL
- Read state + navigation: PASS/FAIL
- Single delete + clear all: PASS/FAIL

Logout/login lifecycle:
- Logout unregister behavior: PASS/FAIL
- Re-login registration + no duplicates: PASS/FAIL

Notes:
- 
```
