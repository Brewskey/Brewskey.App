// @flow

import type { Beverage } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { DAOEntityStore } from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import BeverageForm from '../components/BeverageForm';

type Props = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  navigation: Navigation,
|};

@inject('beverageStore')
class NewBeverageScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'New beverage',
  };

  _onFormSubmit = async (values: Beverage): Promise<void> => {
    const { beverageStore, navigation } = this.props;
    const { id } = await beverageStore.post(values);
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('beverageDetails', { id });
  };

  render(): React.Node {
    return (
      <BeverageForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Create beverage"
      />
    );
  }
}

export default NewBeverageScreen;
