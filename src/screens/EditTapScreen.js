// @flow

import type { Tap, TapMutator } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import flatNavigationParams from '../common/flatNavigationParams';

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
    return null;
    // todo add TapForm
  }
}

export default EditTapScreen;
