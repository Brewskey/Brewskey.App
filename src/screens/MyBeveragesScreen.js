// @flow

import type { Navigation } from '../types';
import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import DAOApi from 'brewskey.js-api';
import { inject, observer } from 'mobx-react';
import HeaderIcon from '../common/HeaderIcon';
import BeveragesList from '../components/BeveragesList';

type Props = {|
  authStore: AuthStore,
  navigation: Navigation,
|};

@inject('authStore')
@observer
class MyBeveragesScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Object): Object => ({
    headerRight: (
      <HeaderIcon
        name="add"
        onPress={(): void => navigation.navigate('newBeverage')}
      />
    ),
    title: 'Homebrew',
  });

  render(): React.Node {
    return (
      <BeveragesList
        queryOptions={{
          filters: [
            DAOApi.createFilter('createdBy/id').equals(
              this.props.authStore.userID,
            ),
          ],
        }}
      />
    );
  }
}

export default MyBeveragesScreen;
