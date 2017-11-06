// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  id: string,
  navigation: Navigation,
  tapStore: DAOEntityStore<Tap, TapMutator>,
|};

@flatNavigationParamsAndScreenProps
@inject('tapStore')
class EditTapScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit tap',
  };

  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    await this.injectedProps.tapStore.put(nullthrows(values.id), values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <TapForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit tap"
        tap={this.injectedProps.tapStore.getByID(this.injectedProps.id)}
      />
    );
  }
}

export default EditTapScreen;
