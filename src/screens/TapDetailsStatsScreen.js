// @flow

import type { Tap } from 'brewskey.js-api';

import * as React from 'react';
import { View } from 'react-native';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import OwnerPoursList from '../components/poursLists/OwnerPoursList';
import SectionHeader from '../common/SectionHeader';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  noFlowSensorWarning: ?React.Element<any>,
  tap: Tap,
|};

@flatNavigationParamsAndScreenProps
class TapDetailsStatsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render() {
    const { noFlowSensorWarning, tap: { id } } = this.injectedProps;
    return (
      <Container>
        <OwnerPoursList
          ListHeaderComponent={
            <View>
              {noFlowSensorWarning}
              <SectionHeader title="Recent pours" />
            </View>
          }
          queryOptions={{
            filters: [DAOApi.createFilter('tap/id').equals(id)],
          }}
        />
      </Container>
    );
  }
}

export default TapDetailsStatsScreen;
