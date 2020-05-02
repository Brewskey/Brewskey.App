// @flow

import type { Permission, Tap } from 'brewskey.js-api';

import * as React from 'react';
import { View } from 'react-native';
import DAOApi from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import { checkIsAdmin } from '../permissionHelpers';
import SectionPoursList from '../components/poursLists/SectionPoursList';

type InjectedProps = {|
  noFlowSensorWarning: ?React.Node,
  tap: Tap,
  tapPermission: Permission,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class TapDetailsStatsScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render() {
    const {
      noFlowSensorWarning,
      tap: { id },
      tapPermission,
    } = this.injectedProps;
    return (
      <Container>
        <SectionPoursList
          canDeletePours={checkIsAdmin(tapPermission)}
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
