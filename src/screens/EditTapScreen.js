// @flow

import type { EntityID, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { observer } from 'mobx-react';
import DAOApi from 'brewskey.js-api';
import { TapStore } from '../stores/DAOStores';
import Container from '../common/Container';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@observer
class EditTapScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    DAOApi.TapDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit tap" />
        <LoaderComponent
          loadedComponent={LoadedComponent}
          loader={TapStore.getByID(id)}
          onFormSubmit={this._onFormSubmit}
        />
      </Container>
    );
  }
}

type LoadedComponentProps = {
  onFormSubmit: (values: TapMutator) => Promise<void>,
  value: Tap,
};

const LoadedComponent = ({ onFormSubmit, value }: LoadedComponentProps) => (
  <TapForm onSubmit={onFormSubmit} submitButtonLabel="Edit tap" tap={value} />
);

export default EditTapScreen;
