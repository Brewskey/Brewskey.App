import type { Permission, Tap } from '@brewskey/js-api';

import * as React from 'react';
import { View } from 'react-native';
import { createFilter } from '@brewskey/js-api/dist/filters';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import { checkIsAdmin } from '../permissionHelpers';
import SectionPoursList from '../components/poursLists/SectionPoursList';

type Props = {
  noFlowSensorWarning: React.ReactNode | null | undefined;
  tap: Tap;
  tapPermission: Permission | undefined;
};

const TapDetailsStatsScreen: React.FC<Props> = ({
  noFlowSensorWarning,
  tap: { id },
  tapPermission,
}) => {
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
          filters: [createFilter('tap/id').equals(id)],
        }}
      />
    </Container>
  );
};

export default withErrorBoundary(TapDetailsStatsScreen, <ErrorScreen shouldShowBackButton />);
