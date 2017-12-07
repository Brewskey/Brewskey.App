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
import LoadingIndicator from '../common/LoadingIndicator';
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

  _renderLoading = (): React.Node => <LoadingIndicator />;

  _renderLoaded = (value: Beverage): React.Node => (
    <BeverageForm
      beverage={value}
      onSubmit={this._onFormSubmit}
      submitButtonLabel="Edit beverage"
    />
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit beverage" />
        <LoaderComponent
          loader={BeverageStore.getByID(id)}
          renderLoaded={this._renderLoaded}
          renderLoading={this._renderLoading}
        />
      </Container>
    );
  }
}

export default EditBeverageScreen;
