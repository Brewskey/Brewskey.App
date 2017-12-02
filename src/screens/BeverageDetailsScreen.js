// @flow

import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { observer } from 'mobx-react';
import { Text } from 'react-native';
import Container from '../common/Container';
import Header from '../common/Header';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class BeverageDetailsScreen extends InjectedComponent<InjectedProps> {
  render() {
    const { entityLoader } = this.injectedProps;
    const { description, name } = entityLoader.getValueEnforcing();

    // todo prettify and move content to separate component
    return (
      <Container>
        <Header showBackButton title={name} />
        <Text>{name}</Text>
        <Text>{description}</Text>
      </Container>
    );
  }
}

export default BeverageDetailsScreen;
