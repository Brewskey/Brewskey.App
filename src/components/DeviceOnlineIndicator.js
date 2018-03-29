// @flow

import type { EntityID, LoadObject, ParticleAttributes } from 'brewskey.js-api';

import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { DeviceStore } from '../stores/DAOStores';
import { Icon } from 'react-native-elements';
import LoaderComponent from '../common/LoaderComponent';
import theme, { COLORS } from '../theme';

const ICON_SIZE_SUBSTRACT = 6;

const styles = StyleSheet.create({
  connected: {
    backgroundColor: theme.deviceOnlineIndicator.connectedColor,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary2,
    justifyContent: 'center',
  },
  disconnected: {
    backgroundColor: theme.deviceOnlineIndicator.disconnectedColor,
  },
});

type Props = {|
  deviceID: EntityID,
  size: number,
|};

@observer
class DeviceOnlineIndicator extends React.Component<Props> {
  static defaultProps = {
    size: 25,
  };

  @computed
  get _onlineStatusLoader(): LoadObject<boolean> {
    return DeviceStore.getParticleAttributes(this.props.deviceID).map(
      ({ connected }: ParticleAttributes): boolean => connected,
    );
  }

  render() {
    const { size } = this.props;
    const sizeStyle = {
      borderRadius: size / 2,
      height: size,
      width: size,
    };
    const iconSize = size - ICON_SIZE_SUBSTRACT;

    return (
      <LoaderComponent
        errorComponent={ErrorComponent}
        iconSize={iconSize}
        loadedComponent={LoadedComponent}
        loader={this._onlineStatusLoader}
        loadingComponent={LoadingComponent}
        sizeStyle={sizeStyle}
      />
    );
  }
}

type ExtraProps = {
  iconSize: number,
  sizeStyle: Object,
};

const LoadingComponent = ({ iconSize, sizeStyle }: ExtraProps) => (
  <View style={[styles.container, sizeStyle]}>
    <ActivityIndicator size={iconSize} />
  </View>
);

type LoadedComponentProps = {
  ...ExtraProps,
  value: boolean,
};

const LoadedComponent = ({
  sizeStyle,
  value: connected,
}: LoadedComponentProps) => (
  <View
    style={[
      styles.container,
      sizeStyle,
      connected ? styles.connected : styles.disconnected,
    ]}
  />
);

type ErrorComponentProps = {
  ...ExtraProps,
  error: Error,
};

const ErrorComponent = ({ iconSize, sizeStyle }: ErrorComponentProps) => (
  <View style={[styles.container, sizeStyle]}>
    <Icon color={COLORS.accent} name="priority-high" size={iconSize} />
  </View>
);

export default DeviceOnlineIndicator;
