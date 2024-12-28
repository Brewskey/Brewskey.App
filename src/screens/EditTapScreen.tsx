import type { EntityID, LoadObject, Tap } from '@brewskey/js-api';

import * as React from 'react';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import { Dimensions } from 'react-native';
import Header from '../common/Header';
import EditBasicTapScreen from './EditBasicTapScreen';
import EditFlowSensorScreen from './EditFlowSensorScreen';
import EditTapPaymentsScreen from './EditTapPaymentsScreen';
import EditKegScreen from './EditKegScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import theme from '../theme';

const EditTapRouter = createMaterialTopTabNavigator();

// {
//   screens: {
//     editKegScreen: EditKegScreen,
//     editFlowSensor: EditFlowSensorScreen,
//     editTap: EditBasicTapScreen,
//     editTapPayments: {
//       getShouldShowTab: ({ tap }) => tap != null && tap.isPaymentEnabled,
//       screen: EditTapPaymentsScreen,
//     },
//   },
// }

type InjectedProps = {
  id: EntityID;
};

@errorBoundary(<ErrorScreen />)
class EditTapScreen extends React.Component<InjectedProps> {
  get _tapLoader(): LoadObject<Tap> {
    const { id } = this.injectedProps;
    return TapStore.getByID(id);
  }

  render(): React.ReactElement {
    const { id, navigation } = this.injectedProps;
    const tap = this._tapLoader.getValue();
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
            options={{ tabBarLabel: 'Home' }}
          />
        </EditTapRouter.Navigator>
        <EditTapRouter
          screenProps={{ tap, tapId: id }}
          navigation={navigation}
        />
      </Container>
    );
  }
}

export default EditTapScreen;
