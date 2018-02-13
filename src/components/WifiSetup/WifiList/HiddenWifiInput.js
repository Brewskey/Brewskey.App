// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Container from '../../../common/Container';
import { COLORS, TYPOGRAPHY } from '../../../theme';
import HiddenWifiForm from './HiddenWifiForm';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary3,
    borderBottomWidth: 2,
    paddingVertical: 15,
  },
  title: {
    ...TYPOGRAPHY.secondary,
    paddingHorizontal: 18,
  },
});

type Props = {|
  onConnectPress: (wifiNetwork: WifiNetwork) => Promise<void>,
  wifiSetupLoader: LoadObject<void>,
|};

@observer
class HiddenWifiInput extends React.Component<Props> {
  @observable _isExpanded: boolean = false;

  @action
  _toggleIsExpanded = () => {
    this._isExpanded = !this._isExpanded;
  };

  render() {
    const { onConnectPress, wifiSetupLoader } = this.props;

    return (
      <Container style={styles.container}>
        <TouchableOpacity onPress={this._toggleIsExpanded}>
          <Text style={styles.title}>Hidden network</Text>
        </TouchableOpacity>
        {this._isExpanded && (
          <HiddenWifiForm
            error={wifiSetupLoader.getError()}
            onSubmit={onConnectPress}
          />
        )}
      </Container>
    );
  }
}

export default HiddenWifiInput;
