// @flow

import type { EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import EditBasicTapScreen from './EditBasicTapScreen';
import EditFlowSensorScreen from './EditFlowSensorScreen';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditKegScreen from './EditKegScreen';
import { COLORS } from '../theme';

/* eslint-disable sorting/sort-object-props */
const EditTapRouter = TabNavigator(
  {
    editKegScreen: { screen: EditKegScreen },
    editFlowSensor: { screen: EditFlowSensorScreen },
    editTap: { screen: EditBasicTapScreen },
  },
  /* eslint-enable */
  {
    lazy: true,
    tabBarOptions: {
      activeBackgroundColor: COLORS.primary3,
      inactiveBackgroundColor: COLORS.primary2,
      indicatorStyle: { backgroundColor: COLORS.secondary },
      style: { backgroundColor: COLORS.primary2 },
    },
  },
);

type InjectedProps = {
  id: EntityID,
};

@flatNavigationParamsAndScreenProps
class EditTapScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { id } = this.injectedProps;

    return (
      <Container>
        <Header showBackButton title="Edit Tap" />
        <EditTapRouter screenProps={{ tapId: id }} />
      </Container>
    );
  }
}

export default EditTapScreen;
