// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { DAOEntityStore } from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import TapForm from '../components/TapForm';

type Props = {|
  navigation: Navigation,
  tapStore: DAOEntityStore<Tap, TapMutator>,
|};

@inject('tapStore')
class NewTapScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'New tap',
  };

  _onFormSubmit = async (values: Tap): Promise<void> => {
    const { tapStore, navigation } = this.props;
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
