// @flow

import type { EntityID } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import OwnerPoursList from '../components/poursLists/OwnerPoursList';
import SectionHeader from '../common/SectionHeader';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import lazyLoad from '../common/lazyLoad';

type InjectedProps = {|
  tapId: EntityID,
|};

@lazyLoad
@flatNavigationParamsAndScreenProps
class TapDetailsStatsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <OwnerPoursList
          ListHeaderComponent={<SectionHeader title="Recent pours" />}
          queryOptions={{
            filters: [DAOApi.createFilter('tap/id').equals(tapId)],
          }}
        />
      </Container>
    );
  }
}

export default TapDetailsStatsScreen;
