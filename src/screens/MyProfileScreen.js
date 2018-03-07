// @flow

import * as React from 'react';
import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import AuthStore from '../stores/AuthStore';
import AvatarPicker from '../components/AvatarPicker';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';
import Container from '../common/Container';
import Header from '../common/Header';
import SectionHeader from '../common/SectionHeader';
import UserBadges from '../components/UserBadges';

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

@observer
class MyProfileScreen extends React.Component<{}> {
  render() {
    const userID = nullthrows(AuthStore.userID);
    return (
      <Container>
        <Header showBackButton title="My profile" />
        <BeveragePoursList
          ListHeaderComponent={
            <View>
              <View style={styles.avatarContainer}>
                <AvatarPicker />
              </View>
              <SectionHeader title="Badges" />
              <UserBadges userID={userID} />
              <SectionHeader title="Recent Pours" />
            </View>
          }
          queryOptions={{
            filters: [DAOApi.createFilter('owner/id').equals(userID)],
            orderBy: [{ column: 'id', direction: 'desc' }],
          }}
        />
      </Container>
    );
  }
}

export default MyProfileScreen;
