import { Redirect, useLocalSearchParams } from 'expo-router';

import { NotFoundScreen } from 'common/NotFoundScreen';

// Redirect to the feed tab (default tab)
export default function EditTapIndex() {
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
        pathname: '/taps/[tapId]/edit/keg',
        params: { tapId: String(tapId) },
      }}
    />
  );
}
