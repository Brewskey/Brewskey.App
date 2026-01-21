import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLocalSearchParams } from 'expo-router';

import ErrorScreen from '../../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import Container from '../../../../../common/Container';
import Header from '../../../../../common/Header';
import LoadingIndicator from '../../../../../common/LoadingIndicator';
import { useGetTapById } from '../../../../../hooks/queries/TapQueries';
import EditTapFeedRoute from './feed';
import EditTapBasicRoute from './basic';
import EditTapFlowSensorRoute from './flow-sensor';
import EditTapPaymentsRoute from './payments';

type EditTapRouterParamList = {
  feed: { tapId: EntityID };
  basic: { tapId: EntityID };
  'flow-sensor': { tapId: EntityID };
  payments: { tapId: EntityID };
};

const EditTapRouter = createMaterialTopTabNavigator<EditTapRouterParamList>();

const EditTapLayout: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  const { data: tap, isLoading } = useGetTapById(id as EntityID);

  if (isLoading || !tap) {
    return (
      <Container>
        <Header shouldShowBackButton title="Edit Tap" testID="header-edit-tap" />
        <LoadingIndicator />
      </Container>
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton title="Edit Tap" testID="header-edit-tap" />
      <EditTapRouter.Navigator
        initialLayout={{
          height: 0,
          width: Dimensions.get('window').width,
        }}
        initialRouteName="feed"
      >
        <EditTapRouter.Screen
          name="feed"
          component={EditTapFeedRoute}
          initialParams={{ tapId: id as EntityID }}
          options={{ tabBarLabel: 'Home' }}
        />
        <EditTapRouter.Screen
          name="basic"
          component={EditTapBasicRoute}
          initialParams={{ tapId: id as EntityID }}
          options={{ tabBarLabel: 'Basic' }}
        />
        <EditTapRouter.Screen
          name="flow-sensor"
          component={EditTapFlowSensorRoute}
          initialParams={{ tapId: id as EntityID }}
          options={{ tabBarLabel: 'Flow Sensor' }}
        />
        {tap.isPaymentEnabled && (
          <EditTapRouter.Screen
            name="payments"
            component={EditTapPaymentsRoute}
            initialParams={{ tapId: id as EntityID }}
            options={{ tabBarLabel: 'Payments' }}
          />
        )}
      </EditTapRouter.Navigator>
    </Container>
  );
};

export default withErrorBoundary(EditTapLayout, <ErrorScreen />);
