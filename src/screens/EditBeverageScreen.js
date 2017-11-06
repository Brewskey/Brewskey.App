// @flow

import type { Beverage } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject } from 'mobx-react';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  beverageStore: DAOEntityStore<Beverage, Beverage>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@inject('beverageStore')
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit beverage',
  };

  _onFormSubmit = async (values: Beverage): Promise<void> => {
    await this.injectedProps.beverageStore.put(values.id, values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <BeverageForm
        beverage={this.injectedProps.beverageStore.getByID(
          this.injectedProps.id,
        )}
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit beverage"
      />
    );
  }
}

export default EditBeverageScreen;
