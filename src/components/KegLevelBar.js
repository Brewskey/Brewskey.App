// @flow

import type { EntityID, LoadObject, Keg } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { KegStore } from '../stores/DAOStores';
import LoaderComponent from '../common/LoaderComponent';
import LoadingIndicator from '../common/LoadingIndicator';
import { calculateKegLevel } from '../utils';
import { COLORS, TYPOGRAPHY, getElevationStyle } from '../theme';

const LOW_KEG_LEVEL = 10;

const styles = StyleSheet.create({
  container: {
    ...getElevationStyle(1),
    backgroundColor: COLORS.secondary,
    height: 50,
    justifyContent: 'center',
  },
  filledBar: {
    backgroundColor: COLORS.accent,
    height: 50,
    left: 0,
    position: 'absolute',
    width: '30%',
  },
  filledBarDanger: {
    backgroundColor: COLORS.danger,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
  },
  textDanger: {
    color: COLORS.danger,
  },
  textLeft: {
    color: COLORS.textInverse,
    marginLeft: 15,
    marginRight: 'auto',
  },
  textRight: {
    color: COLORS.text,
    marginLeft: 'auto',
    marginRight: 15,
  },
});

type Props = {|
  kegID: EntityID,
|};

@observer
class KegLevelBar extends React.Component<Props> {
  @computed
  get _kegLoader(): LoadObject<Keg> {
    return KegStore.getByID(this.props.kegID);
  }

  refresh = () => KegStore.flushCacheForEntity(this.props.kegID);

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedKegLevelBar}
        loader={this._kegLoader}
        loadingComponent={LoadingKegLevelBar}
      />
    );
  }
}

const LoadingKegLevelBar = () => (
  <View style={styles.container}>
    <LoadingIndicator />
  </View>
);

type LoadedProps = {|
  value: Keg,
|};

class LoadedKegLevelBar extends React.PureComponent<LoadedProps> {
  render() {
    const { value } = this.props;
    const kegLevel = calculateKegLevel(value);
    const isLowLevel = kegLevel <= LOW_KEG_LEVEL;
    const levelText = isLowLevel
      ? `Low keg level: ${kegLevel.toFixed(0)}%`
      : `${kegLevel.toFixed(0)}%`;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.filledBar,
            { width: `${kegLevel}%` },
            isLowLevel && styles.filledBarDanger,
          ]}
        />
        <Text
          style={[
            styles.text,
            kegLevel > 50 ? styles.textLeft : styles.textRight,
            isLowLevel && styles.textDanger,
          ]}
        >
          {levelText}
        </Text>
      </View>
    );
  }
}

export default KegLevelBar;
