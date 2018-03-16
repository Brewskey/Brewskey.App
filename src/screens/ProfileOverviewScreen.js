// @flow

import type { Account } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { StyleSheet, View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import UserAvatar from '../common/avatars/UserAvatar';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';
import UserBadges from '../components/UserBadges';
import SectionHeader from '../common/SectionHeader';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

const styles = StyleSheet.create({
  // todo make separate components for such things
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

type InjectedProps = {|
  account: Account,
|};

// todo figure out how to use FlatLists nested in ScrollView
@flatNavigationParamsAndScreenProps
class ProfileOverviewScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Overview',
  };

  render() {
    const { account } = this.injectedProps;
    return (
      <BeveragePoursList
        ListHeaderComponent={
          <View>
            <View style={styles.avatarContainer}>
              <UserAvatar userName={account.userName} size={200} />
            </View>
            <SectionHeader title="Badges" />
            <UserBadges userID={account.id} />
            <SectionHeader title="Recent Pours" />
          </View>
        }
        queryOptions={{
          filters: [DAOApi.createFilter('owner/id').equals(account.id)],
          orderBy: [{ column: 'id', direction: 'desc' }],
        }}
      />
    );
  }
}

export default ProfileOverviewScreen;
