// @flow

import type { EntityID, LoadObject, Tap } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { Text, View } from 'react-native';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
  entityLoader: LoadObject<Tap>,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.TapDAO)
@withLoadingActivity()
@observer
class TapDetailsScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { entityLoader } = this.injectedProps;
    const { description, name } = entityLoader.getValueEnforcing();

    // todo prettify and move content to separate component
    return (
      <View>
        <Header showBackButton title={name} />
        <Text>{name}</Text>
        <Text>{description}</Text>
      </View>
    );
  }
}

export default TapDetailsScreen;
