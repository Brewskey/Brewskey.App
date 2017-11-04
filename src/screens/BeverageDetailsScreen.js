// @flow

import type { Beverage } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  id: string,
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('beverageStore')
@observer
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.beverage && navigation.state.params.beverage.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { beverageStore, id, navigation } = this.injectedProps;
    navigation.setParams({ beverage: beverageStore.getByID(id) });
  }

  render(): React.Node {
    const beverage = this.injectedProps.beverageStore.getByID(
      this.injectedProps.id,
    );
    // todo prettify and move content to separate component
    return (
      <View>
        <Text>{beverage.name}</Text>
        <Text>{beverage.description}</Text>
      </View>
    );
  }
}

export default BeverageDetailsScreen;
