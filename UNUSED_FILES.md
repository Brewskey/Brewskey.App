# Unused Files and Components

This document lists files and components that appear to be unused in the codebase. Review each item before deleting to ensure it's not needed.

## Screens (Not Imported Anywhere)

These screen components are defined but never imported or used:

1. **`src/screens/ProfileOverviewScreen.tsx`**
   - Profile overview screen component
   - Not imported anywhere in the codebase

2. **`src/screens/ProfileStatsScreen.tsx`**
   - Profile stats screen component (appears to be a placeholder)
   - Not imported anywhere in the codebase

3. **`src/screens/MyFriendsContactScreen.tsx`**
   - Friends contact screen component
   - Not imported anywhere in the codebase

4. **`src/screens/SplashScreen.tsx`**
   - Splash screen component (only uses AppLoading internally)
   - Not imported anywhere in the codebase
   - Note: AppLoading is used by SplashScreen, but SplashScreen itself is unused

## Unused Utility Functions

1. **`src/utils.tsx`** - Function `isClassBasedComponent`
   - Defined but never used anywhere in the codebase
   - Only appears in its own definition

## Type Definition Files

1. **`src/types/react-native-elements.js.flow`**
   - Flow type definitions for react-native-elements
   - This is a TypeScript project, so Flow type definitions are likely unnecessary
   - Not imported anywhere

## Workspace/Configuration Files

1. **`src/brewskeyapp.code-workspace`**
   - VS Code workspace configuration file
   - Typically should not be in source control
   - Contains workspace-specific settings

## Notes

- All other components, utilities, and files checked appear to be in use
- The `checkIsIphoneX` function in `utils.tsx` is only used internally by `getStatusBarHeight`, which is used, so it's fine
- `Fragment`, `ColorIcon`, `CachedImage`, `Container`, `OverviewItem`, and `OverviewItem2` are all actively used
- All form components (LoginForm, RegisterForm, ResetPasswordForm, ChangePasswordForm, CardForm) are in use
- All WifiSetupStep screens are used

## Recommendation

Before deleting:
1. Check if any of these screens are referenced in routing configuration (expo-router might auto-discover them)
2. Verify that `isClassBasedComponent` isn't needed for future use
3. Confirm that Flow types aren't being used by any tooling
4. Review git history to see if these files were recently removed from usage
