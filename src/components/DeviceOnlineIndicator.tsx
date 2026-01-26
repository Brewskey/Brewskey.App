import * as React from 'react';

import { Icon } from '@rneui/themed';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useGetParticleAttributes } from '../hooks/queries/CloudDeviceQueries';
import theme, { COLORS } from '../theme';

import type { EntityID } from '@brewskey/js-api';

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

interface Props {
  particleID: EntityID;
  size?: number;
}

export const DeviceOnlineIndicator: React.FC<Props> = ({
  particleID,
  size = 25,
}) => {
  const {
    data: cloudDevice,
    isLoading,
    error,
  } = useGetParticleAttributes(particleID);

  const sizeStyle = {
    borderRadius: size / 2,
    height: size,
    width: size,
  } as const;
  const iconSize = size - ICON_SIZE_SUBSTRACT;

  if (isLoading) {
    return (
      <View style={[styles.container, sizeStyle]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, sizeStyle]}>
        <Icon color={COLORS.accent} name="priority-high" size={iconSize} />
      </View>
    );
  }

  const connected = cloudDevice?.connected ?? false;

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        connected ? styles.connected : styles.disconnected,
      ]}
    />
  );
};

interface ExtraProps {
  iconSize: number;
  sizeStyle: { borderRadius: number; height: number; width: number };
}

const LoadingComponent = ({ sizeStyle }: ExtraProps) => (
  <View style={[styles.container, sizeStyle]}>
    <ActivityIndicator size="small" />
  </View>
);

type LoadedComponentProps = ExtraProps & {
  value: boolean;
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

type ErrorComponentProps = ExtraProps & {
  error: Error;
};

const ErrorComponent = ({ iconSize, sizeStyle }: ErrorComponentProps) => (
  <View style={[styles.container, sizeStyle]}>
    <Icon color={COLORS.accent} name="priority-high" size={iconSize} />
  </View>
);

export default DeviceOnlineIndicator;
