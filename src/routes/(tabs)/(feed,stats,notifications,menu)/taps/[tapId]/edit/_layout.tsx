import * as React from 'react';

import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";
import { useLocalSearchParams } from 'expo-router';
import { Dimensions } from 'react-native';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { ScreenFallback } from 'common/ScreenFallback';
import { useGetTapById } from 'hooks/queries/TapQueries';

import EditTapFlowSensorRoute from './flow-sensor';
import EditTapFeedRoute from './keg';
import EditTapPaymentsRoute from './payments';
import EditTapBasicRoute from './tap';

import type { EntityID } from '@brewskey/js-api';

interface EditTapRouterParamList {
  keg: undefined;
  tap: undefined;
  'flow-sensor': undefined;
  payments: undefined;
}

// EditTapRouterParamList extends ParamListBase; conditional tab (payments) causes generic inference issues
const EditTapRouter = createMaterialTopTabNavigator<
  EditTapRouterParamList & Record<string, object | undefined>
>();

const EditTapLayout: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const id =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  const { data: tap, isLoading } = useGetTapById(id as EntityID);
  if (isLoading || !tap) {
    return (
      <ScreenFallback shouldShowBackButton testID="edit-tap" title="Edit Tap" />
    );
  }

  return (
    <Container>
      <Header shouldShowBackButton testID="header-edit-tap" title="Edit Tap" />
      <EditTapRouter.Navigator
        initialRouteName="keg"
        initialLayout={{
          height: 0,
          width: Dimensions.get('window').width,
        }}
      >
        <EditTapRouter.Screen
          component={EditTapFeedRoute}
          name="keg"
          options={{ tabBarLabel: 'On Tap' }}
        />
        <EditTapRouter.Screen
          component={EditTapFlowSensorRoute}
          name="flow-sensor"
          options={{ tabBarLabel: 'Flow Sensor' }}
        />
        <EditTapRouter.Screen
          component={EditTapBasicRoute}
          name="tap"
          options={{ tabBarLabel: 'Tap' }}
        />
        {tap.isPaymentEnabled ? (
          <EditTapRouter.Screen
            component={EditTapPaymentsRoute}
            name="payments"
            options={{ tabBarLabel: 'Payments' }}
          />
        ) : null}
      </EditTapRouter.Navigator>
    </Container>
  );
};

export default EditTapLayout;
