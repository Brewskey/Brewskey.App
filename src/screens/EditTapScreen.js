// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import flatNavigationParams from '../common/flatNavigationParams';
import TapForm from '../components/TapForm';

type Props = {|
  id: string,
  navigation: Object,
  tapStore: DAOEntityStore<Tap, TapMutator>,
|};

@flatNavigationParams
@inject('tapStore')
class EditTapScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Edit tap',
  };

  _onFormSubmit = async (values: Location): Promise<void> => {
    await this.props.tapStore.put(values.id, values);
    this.props.navigation.goBack(null);
  };

  render(): React.Node {
    return (
      <TapForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit tap"
        tap={this.props.tapStore.getByID(this.props.id)}
      />
    );
  }
}

export default EditTapScreen;
