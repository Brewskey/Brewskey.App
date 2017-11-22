// @flow

import type { LoadObject, Location } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { Text, View } from 'react-native';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';

type InjectedProps = {|
  id: string,
  entityLoader: LoadObject<Location>,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.LocationDAO)
@withLoadingActivity()
@observer
class LocationDetailsScreen extends InjectedComponent<InjectedProps> {
  // todo find types for navigationOptions
  static navigationOptions = ({ navigation }: Object): Object => ({
    title:
      navigation.state.params.location && navigation.state.params.location.name,
  });

  componentDidMount() {
    // todo with this solution title on header appears after some lag :/
    const { entityLoader, navigation } = this.injectedProps;
    navigation.setParams({ location: entityLoader.getValueEnforcing() });
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

export default LocationDetailsScreen;
