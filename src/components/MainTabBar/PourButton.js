// @flow

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../theme';
import { observer } from 'mobx-react';
import PourProcessStore from '../../stores/PourProcessStore';
import TouchableItem from '../../common/buttons/TouchableItem';
import LoadingIndicator from '../../common/LoadingIndicator';

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
  render(): React.Node {
    return !PourProcessStore.isLoading ? (
      <Icon
        color={COLORS.secondary}
        component={TouchableItem}
        containerStyle={styles.container}
        name="md-beer"
        onPress={PourProcessStore.onShowModal}
        size={26}
        type="ionicon"
      />
    ) : (
      <LoadingIndicator color="white" style={styles.container} />
    );
  }
}

export default PourButton;
