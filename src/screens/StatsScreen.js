// @flow

import type { AchievementType } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import nullthrows from 'nullthrows';
import AuthStore from '../stores/AuthStore';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import Fragment from '../common/Fragment';
import AllBeveragesHScroll from '../components/Stats/AllBeveragesHScroll';
import UserBadges from '../components/UserBadges';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';

type InjectedProps = {
  initialPopUpAchievementType?: AchievementType,
};

@errorBoundary(ErrorScreen)
@flatNavigationParamsAndScreenProps
class StatsScreen extends InjectedComponent<InjectedProps> {
  _userBadges: ?UserBadges;
  _allBeverages = React.createRef<AllBeveragesHScroll>();

  componentDidMount() {
    const { initialPopUpAchievementType } = this.injectedProps;
    initialPopUpAchievementType &&
      nullthrows(this._userBadges).openBadgeModal(initialPopUpAchievementType);
  }

  componentDidUpdate() {
    const { initialPopUpAchievementType } = this.injectedProps;
    initialPopUpAchievementType &&
      nullthrows(this._userBadges).openBadgeModal(initialPopUpAchievementType);
  }

  _onRefresh = () => {
    nullthrows(this._userBadges).refresh();
    nullthrows(this._allBeverages.current).refresh();
  };

  render(): React.Node {
    const userID = nullthrows(AuthStore.userID);
    return (
      <Container>
        <Header title="My Stats" />
        <BeveragePoursList
          ListHeaderComponent={
            <Fragment>
              <Section bottomPadded>
                <SectionHeader title="Badges" />
                <UserBadges
                  ref={(ref) => (this._userBadges = ref)}
                  userID={userID}
                />
              </Section>
              <Section bottomPadded>
                <SectionHeader title="Beverages Poured" />
                <AllBeveragesHScroll ref={this._allBeverages} userID={userID} />
              </Section>
              <SectionHeader title="Recent Pours" />
            </Fragment>
          }
          onRefresh={this._onRefresh}
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
