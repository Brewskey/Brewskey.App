// @flow

import type { Beverage, BeverageMutator, EntityID } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import nullthrows from 'nullthrows';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { BeverageStore } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import Container from '../common/Container';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = (values: BeverageMutator): void => {
    DAOApi.BeverageDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit beverage" />
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={BeverageStore.getByID(id)}
          onFormSubmit={this._onFormSubmit}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = () => {
  onFormSubmit: (values: BeverageMutator) => void,
  value: Beverage,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <BeverageForm
    beverage={value}
    onSubmit={onFormSubmit}
    submitButtonLabel="Edit beverage"
  />
);

export default EditBeverageScreen;
