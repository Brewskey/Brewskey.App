// @flow

import type {
  Beverage,
  BeverageMutator,
  EntityID,
  LoadObject,
} from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import loadDAOEntity from '../common/loadDAOEntity';
import Container from '../common/Container';
import Header from '../common/Header';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = (values: BeverageMutator): void => {
    DAOApi.BeverageDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit beverage" />
        <BeverageForm
          beverage={this.injectedProps.entityLoader.getValueEnforcing()}
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Edit beverage"
        />
      </Container>
    );
  }
}

export default EditBeverageScreen;
