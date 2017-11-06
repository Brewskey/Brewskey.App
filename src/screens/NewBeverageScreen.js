// @flow

import type { Beverage } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject } from 'mobx-react';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  navigation: Navigation,
|};

@inject('beverageStore')
class NewBeverageScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'New beverage',
  };

  _onFormSubmit = async (values: Beverage): Promise<void> => {
    const { beverageStore, navigation } = this.injectedProps;
    const { id } = await beverageStore.post(values);
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('beverageDetails', { id });
  };

  render() {
    return (
      <BeverageForm
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Create beverage"
      />
    );
  }
}

export default NewBeverageScreen;
