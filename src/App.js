// @flow

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { Button } from 'react-native-elements';

@observer
export default class App extends React.Component {
  @observable counter = 0;

  @action increment = () => this.counter++;

  componentDidMount() {
    setInterval(this.increment, 1000);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Brewskey supa dupa app</Text>
        <Text>Counter: {this.counter}</Text>
        <Button raised title="Test Button" />
      </View>
    );
  }
}

const backgroundColor = '#fb3';
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
});
