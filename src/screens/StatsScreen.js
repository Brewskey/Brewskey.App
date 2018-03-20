// @flow

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import nullthrows from 'nullthrows';
import { AchievementStore } from '../stores/DAOStores';
import AuthStore from '../stores/AuthStore';
import Container from '../common/Container';
import Header from '../common/Header';
import Fragment from '../common/Fragment';
import UserBadges from '../components/UserBadges';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';

class StatsScreen extends React.Component<{}> {
  render() {
    const userID = nullthrows(AuthStore.userID);
    return (
      <Container>
        <Header title="Statistics" />
        <BeveragePoursList
          ListHeaderComponent={
            <Fragment>
              <Section bottomPadded>
                <SectionHeader title="Badges" />
                <UserBadges userID={userID} />
              </Section>
              <SectionHeader title="Recent Pours" />
            </Fragment>
          }
          onRefresh={AchievementStore.flushQueryCaches}
          queryOptions={{
            filters: [DAOApi.createFilter('owner/id').equals(userID)],
            orderBy: [{ column: 'id', direction: 'desc' }],
          }}
        />
      </Container>
    );
  }
}

export default StatsScreen;
