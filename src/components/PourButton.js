// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../theme';
import { observer } from 'mobx-react';
import PourButtonStore from '../stores/PourButtonStore';
import NFCStore from '../stores/NFCStore';

const styles = StyleSheet.create({
  container: {
    bottom: 15,
    position: 'absolute',
    right: 15,
  },
  hidden: {
    display: 'none',
  },
});

@observer
class PourButton extends React.Component {
  render() {
    return (
      <View
        style={[styles.container, !PourButtonStore.isVisible && styles.hidden]}
      >
        <Icon
          name="md-beer"
          type="ionicon"
          color={COLORS.primary2}
          onPress={NFCStore.onShowModal}
          raised
          reverse
        />
      </View>
    );
  }
}

export default PourButton;
