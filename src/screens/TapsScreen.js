// @flow

import * as React from 'react';
import TapsList from '../components/TapsList';

class TapsScreen extends React.Component<Props> {
  static navigationOptions = {
    title: 'Taps',
  };

  render(): React.Node {
    return <TapsList />;
  }
}

export default TapsScreen;
