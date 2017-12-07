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
import LoadingIndicator from '../common/LoadingIndicator';
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
  _onFormSubmit = async (values: TapMutator) => {
    DAOApi.TapDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  _renderLoading = (): React.Node => <LoadingIndicator />;

  _renderLoaded = (value: Tap): React.node => (
    <TapForm
      onSubmit={this._onFormSubmit}
      submitButtonLabel="Edit tap"
      tap={value}
    />
  );

  render() {
    const { id } = this.injectedProps;
    return (
      <Container>
        <Header showBackButton title="Edit tap" />
        <LoaderComponent
          loader={TapStore.getByID(id)}
          renderLoaded={this._renderLoaded}
          renderLoading={this._renderLoading}
        />
      </Container>
    );
  }
}

export default EditTapScreen;
