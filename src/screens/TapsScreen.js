// @flow

import * as React from 'react';
import HeaderIcon from '../common/HeaderIcon';
import TapsList from '../components/TapsList';

class TapsScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: Object): Object => ({
    headerRight: (
      <HeaderIcon
        name="add"
        onPress={(): void => navigation.navigate('newTap')}
      />
    ),
    title: 'Taps',
  });

  render(): React.Node {
    return <TapsList />;
  }
}

export default TapsScreen;
