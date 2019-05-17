// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
import InjectedComponent from '../common/InjectedComponent';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import EditBasicTapScreen from './EditBasicTapScreen';
import EditFlowSensorScreen from './EditFlowSensorScreen';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import EditKegScreen from './EditKegScreen';
import theme from '../theme';

/* eslint-disable sorting/sort-object-props */
const EditTapRouter = createMaterialTopTabNavigator(
  {
    editKegScreen: { screen: EditKegScreen },
    editFlowSensor: { screen: EditFlowSensorScreen },
    editTap: { screen: EditBasicTapScreen },
  },
  /* eslint-enable */
  {
    ...theme.tabBar,
    initialLayout: {
      height: 0,
      width: Dimensions.get('window').width,
    },
    lazy: true,
  },
);

type InjectedProps = {
  id: EntityID,
  navigation: Navigation,
};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
class EditTapScreen extends InjectedComponent<InjectedProps> {
  static router = EditTapRouter.router;

  render() {
    const { id, navigation } = this.injectedProps;

    return (
      <Container>
        <Header showBackButton title="Edit Tap" />
        <EditTapRouter screenProps={{ tapId: id }} navigation={navigation} />
      </Container>
    );
  }
}

export default EditTapScreen;
