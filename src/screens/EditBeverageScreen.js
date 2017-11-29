// @flow

import type { Beverage, EntityID, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import { View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import loadDAOEntity from '../common/loadDAOEntity';
import Header from '../common/Header';
import withLoadingActivity from '../common/withLoadingActivity';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  entityLoader: LoadObject<Beverage>,
  id: EntityID,
  navigation: Navigation,
|};

@flatNavigationParamsAndScreenProps
@loadDAOEntity(DAOApi.BeverageDAO)
@withLoadingActivity()
class EditBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = (values: Beverage): void => {
    DAOApi.BeverageDAO.put(values.id, values);
    this.injectedProps.navigation.goBack(null);
  };

  render() {
    return (
      <View>
        <Header showBackButton title="Edit beverage" />
        <BeverageForm
          beverage={this.injectedProps.entityLoader.getValueEnforcing()}
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Edit beverage"
        />
      </View>
    );
  }
}

export default EditBeverageScreen;
