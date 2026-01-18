import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import type { StaticScreenProps } from '@react-navigation/native';
import type { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import LoadingIndicator from '../common/LoadingIndicator';
import { EditTapScreen as EditBasicTapScreen } from './EditBasicTapScreen';
import EditFlowSensorScreen from './EditFlowSensorScreen';
import EditTapPaymentsScreen from './EditTapPaymentsScreen';
import EditKegScreen from './EditKegScreen';
import { useGetTapById } from '../hooks/queries/TapQueries';

type EditTapRouterParamList = {
  Feed: { tapId: EntityID };
  Basic: { tapId: EntityID };
  FlowSensor: { tapId: EntityID };
  Payments: { tapId: EntityID };
};

const EditTapRouter = createMaterialTopTabNavigator<EditTapRouterParamList>();

// EditTapScreen receives props from Stack Navigator
// Using StaticScreenProps for React Navigation static navigation type inference
type Props = StaticScreenProps<{
  tapId: EntityID;
}>;

const EditTapScreen: React.FC<Props> = ({
  route: {
    params: { tapId },
  },
}) => {
  const id = tapId;

  const { data: tap, isLoading } = useGetTapById(id);

  if (isLoading || !tap) {
    return (
      <Container>
        <Header showBackButton title="Edit Tap" />
        <LoadingIndicator />
      </Container>
    );
  }

  return (
    <Container>
      <Header showBackButton title="Edit Tap" />
      <EditTapRouter.Navigator
        initialLayout={{
          height: 0,
          width: Dimensions.get('window').width,
        }}
      >
        <EditTapRouter.Screen
          name="Feed"
          component={EditKegScreen}
          initialParams={{ tapId: id }}
          options={{ tabBarLabel: 'Home' }}
        />
        <EditTapRouter.Screen
          name="Basic"
          component={EditBasicTapScreen}
          initialParams={{ tapId: id }}
          options={{ tabBarLabel: 'Basic' }}
        />
        <EditTapRouter.Screen
          name="FlowSensor"
          component={EditFlowSensorScreen}
          initialParams={{ tapId: id }}
          options={{ tabBarLabel: 'Flow Sensor' }}
        />
        {tap.isPaymentEnabled && (
          <EditTapRouter.Screen
            name="Payments"
            component={EditTapPaymentsScreen}
            initialParams={{ tapId: id }}
            options={{ tabBarLabel: 'Payments' }}
          />
        )}
      </EditTapRouter.Navigator>
    </Container>
  );
};

export default withErrorBoundary(EditTapScreen, <ErrorScreen />);
