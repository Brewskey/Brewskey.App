// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import FriendRequestsList from '../components/FriendRequestsList';
import { observer } from 'mobx-react/native';
import { Badge } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import FriendRequestsListStore from '../stores/FriendRequestsListStore';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  container: {
    left: 64,
    position: 'absolute',
    top: -1,
  },
});

@errorBoundary(<ErrorScreen showBackButton />)
class MyFriendsRequestScreen extends React.Component<{}> {
  static navigationOptions = {
    tabBarLabel: ({ tintColor }) => (
      <View>
        <Text style={{ color: tintColor }}>Requests</Text>
        <Badges />
      </View>
    ),
  };

  render() {
    return <FriendRequestsList />;
  }
}

const Badges = observer(
  () =>
    FriendRequestsListStore.pendingRequestsCount === 0 ? null : (
      <View elevation={5} style={styles.container}>
        <Badge
          containerStyle={{
            ...styles.badge,
          }}
          textStyle={{ ...styles.badgeText, color: 'black' }}
          value={FriendRequestsListStore.pendingRequestsCount}
        />
      </View>
    ),
);

export default MyFriendsRequestScreen;
