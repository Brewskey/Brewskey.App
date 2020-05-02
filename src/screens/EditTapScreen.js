// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import EditBasicTapScreen from './EditBasicTapScreen';
import EditFlowSensorScreen from './EditFlowSensorScreen';
import EditTapPaymentsScreen from './EditTapPaymentsScreen';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditKegScreen from './EditKegScreen';
import createTopTabNavigator from '../components/hoc/createTopTabNavigator';

/* eslint-disable sorting/sort-object-props */
const EditTapRouter = createTopTabNavigator({
  editKegScreen: EditKegScreen,
  editFlowSensor: EditFlowSensorScreen,
  editTap: EditBasicTapScreen,
  editTapPayments: {
    getShouldShowTab: ({ tap }) => tap != null && tap.isPaymentEnabled,
    screen: EditTapPaymentsScreen,
  },
});

type InjectedProps = {
  id: EntityID,
  navigation: Navigation,
};

@errorBoundary(<ErrorScreen />)
@flatNavigationParamsAndScreenProps
@observer
class EditTapScreen extends InjectedComponent<InjectedProps> {
  static router = EditTapRouter.router;

  @computed
  get _tapLoader(): LoadObject<[Tap, ?Permission, FlowSensor]> {
    const { id } = this.injectedProps;
    return TapStore.getByID(id);
  }

  render() {
    const { id, navigation } = this.injectedProps;
    const tap = this._tapLoader.getValue();
    return (
      <Container>
        <Header showBackButton title="Edit Tap" />
        <EditTapRouter
          screenProps={{ tap, tapId: id }}
          navigation={navigation}
        />
      </Container>
    );
  }
}

export default EditTapScreen;
