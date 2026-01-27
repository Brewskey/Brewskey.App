import { Stack } from 'expo-router';

import { withErrorBoundary } from '../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../common/ErrorScreen';

/**
 * Tap details layout: Stack of index, (tap-tabs), keg, edit.
 * - index: redirects to on_tap
 * - (tap-tabs): On Tap / Stats / Leaderboard tabs (route group, no URL segment)
 * - keg: keg flow (keg/_layout)
 * - edit: edit flow (edit/_layout)
 * No segment/pathname logic—expo-router picks the active child from the file tree.
 */
const TapDetailsLayout = () => <Stack screenOptions={{ headerShown: false }} />;

export default withErrorBoundary(TapDetailsLayout, ErrorScreen);
