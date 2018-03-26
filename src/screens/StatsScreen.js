// @flow

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import nullthrows from 'nullthrows';
import { AchievementStore } from '../stores/DAOStores';
import AuthStore from '../stores/AuthStore';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Container from '../common/Container';
import Header from '../common/Header';
import Fragment from '../common/Fragment';
import UserBadges from '../components/UserBadges';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';

type InjectedProps = {
  initialPopUpAchievementType?: AchievementType,
};

@flatNavigationParamsAndScreenProps
class StatsScreen extends InjectedComponent<InjectedProps> {
  _userBadges: ?UserBadges;

  componentDidMount() {
    const { initialPopUpAchievementType } = this.props;
    initialPopUpAchievementType &&
      nullthrows(this._userBadges).openBadgeModal(initialPopUpAchievementType);
  }
  componentWillReceiveProps(props: InjectedProps) {
    const { initialPopUpAchievementType } = props;
    initialPopUpAchievementType &&
      nullthrows(this._userBadges).openBadgeModal(initialPopUpAchievementType);
  }

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
                <UserBadges
                  ref={ref => (this._userBadges = ref)}
                  userID={userID}
                />
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
