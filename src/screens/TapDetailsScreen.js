// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type Props = {|
  id: string,
  navigation: Object,
  tapStore: DAOEntityStore<Tap, TapMutator>,
|};

@flatNavigationParamsAndScreenProps
@inject('tapStore')
@observer
class TapDetailsScreen extends React.Component<Props> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title: navigation.state.params.tap && navigation.state.params.tap.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { tapStore, id, navigation } = this.props;
    navigation.setParams({ tap: tapStore.getByID(id) });
  }

  render(): React.Node {
    const tap = this.props.tapStore.getByID(this.props.id);
    // todo prettify and move content to separate component
    return (
      <View>
        <Text>{tap.name}</Text>
        <Text>{tap.description}</Text>
      </View>
    );
  }
}

export default TapDetailsScreen;
