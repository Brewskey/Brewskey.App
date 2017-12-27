// @flow

import type { EntityID } from 'brewskey.js-api';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import PoursList from '../components/PoursList';
import SectionHeader from '../common/SectionHeader';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  tapId: EntityID,
|};

@flatNavigationParamsAndScreenProps
class TapDetailsStatsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render() {
    const { tapId } = this.injectedProps;
    return (
      <Container>
        <SectionHeader title="Recent pours" />
        <PoursList
          queryOptions={{
            filters: [DAOApi.createFilter('tap/id').equals(tapId)],
            orderBy: [{ column: 'id', direction: 'desc' }],
          }}
        />
      </Container>
    );
  }
}

export default TapDetailsStatsScreen;
