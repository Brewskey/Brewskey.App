// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject } from 'mobx-react';
import TapForm from '../components/TapForm';

type InjectedProps = {|
  navigation: Navigation,
  tapStore: DAOEntityStore<Tap, TapMutator>,
|};

@inject('tapStore')
class NewTapScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'New tap',
  };

  _onFormSubmit = async (values: TapMutator): Promise<void> => {
    const { tapStore, navigation } = this.injectedProps;
    const { id } = await tapStore.post(values);
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('tapDetails', { id });
  };

  render(): React.Node {
    return (
      <TapForm onSubmit={this._onFormSubmit} submitButtonLabel="Create tap" />
    );
  }
}

export default NewTapScreen;
