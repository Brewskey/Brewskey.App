// @flow

import type { Beverage } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import flatNavigationParams from '../common/flatNavigationParams';

type Props = {|
  id: string,
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  navigation: Object,
|};

@flatNavigationParams
@inject('beverageStore')
@observer
class BeverageDetailsScreen extends React.Component<Props> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.beverage && navigation.state.params.beverage.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { beverageStore, id, navigation } = this.props;
    navigation.setParams({ beverage: beverageStore.getByID(id) });
  }

  render(): React.Node {
    const beverage = this.props.beverageStore.getByID(this.props.id);
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
