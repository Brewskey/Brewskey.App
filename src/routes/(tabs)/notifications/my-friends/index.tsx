import { Redirect } from 'expo-router';

// Redirect to the myFriendsMain tab (default tab)
export default function MyFriendsIndex() {
  return (
    <Redirect
      href={{
        pathname: '/(tabs)/notifications/my-friends/myFriendsMain',
        params: {},
      }}
    />
  );
}
