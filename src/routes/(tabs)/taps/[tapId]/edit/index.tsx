import { Redirect, useLocalSearchParams } from 'expo-router';
import NotFoundScreen from '../../../../../common/NotFoundScreen';

// Redirect to the feed tab (default tab)
export default function EditTapIndex() {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();

  if (!tapId) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  return <Redirect href={`/(tabs)/taps/${tapId}/edit/feed`} />;
}
