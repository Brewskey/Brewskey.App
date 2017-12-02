// @flow

import type { EntityID, LoadObject, Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import DAOApi from 'brewskey.js-api';
import Container from '../common/Container';
import Header from '../common/Header';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  entityLoader: LoadObject<Tap>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.TapDAO)
@withLoadingActivity()
class EditTapScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: TapMutator) => {
    DAOApi.TapDAO.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <Container>
        <Header showBackButton title="Edit tap" />
        <TapForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Edit tap"
          tap={this.injectedProps.entityLoader.getValueEnforcing()}
        />
      </Container>
    );
  }
}

export default EditTapScreen;
