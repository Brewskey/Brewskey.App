// @flow

import type { Beverage, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import loadDAOEntity from '../common/loadDAOEntity';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: string,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  static navigationOptions = {
    title: 'Edit beverage',
  };

  _onFormSubmit = (values: Beverage): void => {
    DAOApi.BeverageDAO.put(values.id, values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <BeverageForm
        beverage={this.injectedProps.entityLoader.getValueEnforcing()}
        onSubmit={this._onFormSubmit}
        submitButtonLabel="Edit beverage"
      />
    );
  }
}

export default EditBeverageScreen;
