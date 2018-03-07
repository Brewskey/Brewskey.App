// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../theme';
import { observer } from 'mobx-react';
import NFCStore from '../../stores/NFCStore';
import TouchableItem from '../../common/buttons/TouchableItem';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary2,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginTop: -25,
    width: 100,
  },
});

@observer
class PourButton extends React.Component<{}> {
  render() {
    return (
      <Icon
        borderless
        color={COLORS.secondary}
        component={TouchableItem}
        containerStyle={styles.container}
        name="md-beer"
        onPress={NFCStore.onShowModal}
        size={26}
        type="ionicon"
      />
    );
  }
}

export default PourButton;
