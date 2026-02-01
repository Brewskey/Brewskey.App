import { Redirect, useLocalSearchParams } from 'expo-router';

import { NotFoundScreen } from 'common/NotFoundScreen';

// Redirect to the on_tap tab (default tab)
export default function TapDetailsIndex() {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();

  if (!tapId) {
    return (
      <NotFoundScreen
        message="The tap you're looking for could not be found."
        title="Tap Not Found"
      />
    );
  }

  return (
    <Redirect
      href={{
        pathname: '/(tabs)/taps/[tapId]/on_tap',
        params: { tapId: String(tapId) },
      }}
    />
  );
}
