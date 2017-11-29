// @flow

import type { Beverage, LoadObject } from 'brewskey.js-api';
import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import DAOApi from 'brewskey.js-api';
import { View } from 'react-native';
import Header from '../common/Header';
import BeverageForm from '../components/BeverageForm';

type InjectedProps = {|
  navigation: Navigation,
|};

class NewBeverageScreen extends InjectedComponent<InjectedProps> {
  _onFormSubmit = async (values: Beverage): Promise<void> => {
    const { navigation } = this.injectedProps;
    const clientID = DAOApi.BeverageDAO.post(values);
    const { id } = await DAOApi.BeverageDAO.waitForLoaded((): LoadObject<
      Beverage,
    > => DAOApi.BeverageDAO.fetchByID(clientID));
    // todo figure out how to replace page instead adding to stack history
    // the navigation object injected in the component
    // doesn't have reset function.
    navigation.navigate('beverageDetails', { id });
  };

  render() {
    return (
      <View>
        <Header showBackButton title="New beverage" />
        <BeverageForm
          onSubmit={this._onFormSubmit}
          submitButtonLabel="Create beverage"
        />
      </View>
    );
  }
}

export default NewBeverageScreen;
