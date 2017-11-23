// @flow

import type { Beverage, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { Text, View } from 'react-native';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.beverage && navigation.state.params.beverage.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { entityLoader, navigation } = this.injectedProps;
    navigation.setParams({ beverage: entityLoader.getValueEnforcing() });
  }

  render() {
    const { entityLoader } = this.injectedProps;
    const { description, name } = entityLoader.getValueEnforcing();

    // todo prettify and move content to separate component
    return (
      <View>
        <Text>{name}</Text>
        <Text>{description}</Text>
      </View>
    );
  }
}

export default BeverageDetailsScreen;
