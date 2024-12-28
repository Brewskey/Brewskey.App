import type { Permission, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { View } from 'react-native';
import DAOApi from '@brewskey/js-api';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import { checkIsAdmin } from '../permissionHelpers';
import SectionPoursList from '../components/poursLists/SectionPoursList';

type InjectedProps = {
  noFlowSensorWarning: React.ReactNode | null | undefined;
  tap: Tap;
  tapPermission: Permission;
};

@errorBoundary(<ErrorScreen showBackButton />)
class TapDetailsStatsScreen extends React.Component<InjectedProps> {
  static navigationOptions = {
    tabBarLabel: 'Stats',
  };

  render(): React.ReactElement {
    const {
      noFlowSensorWarning,
      tap: { id },
      tapPermission,
    } = this.props;
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
