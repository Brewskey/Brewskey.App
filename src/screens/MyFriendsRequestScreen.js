// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import FriendRequestsList from '../components/FriendRequestsList';
import { observer } from 'mobx-react';
import { Badge } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import FriendRequestsListStore from '../stores/FriendRequestsListStore';
import { COLORS } from '../theme';

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
class MyFriendsRequestScreen extends React.Component<{||}> {
  static navigationOptions = {
    tabBarLabel: ({ tintColor }: { tintColor: string }) => (
      <View>
        <Text style={{ color: tintColor }}>Requests</Text>
        <Badges />
      </View>
    ),
  };

  render(): React.Node {
    return <FriendRequestsList />;
  }
}

const elevation: any = { elevation: 5 };

const Badges = observer(() =>
  FriendRequestsListStore.pendingRequestsCount === 0 ? null : (
    <View {...elevation} style={styles.container}>
      <Badge
        badgeStyle={styles.badge}
        textStyle={{ ...styles.badgeText, color: COLORS.primary2 }}
        value={FriendRequestsListStore.pendingRequestsCount}
      />
    </View>
  ),
);

export default MyFriendsRequestScreen;
