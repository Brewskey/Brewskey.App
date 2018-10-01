// @flow

import type { Location } from 'brewskey.js-api';
import type { PickerValue } from '../stores/PickerStore';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { Icon } from 'react-native-elements';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Header from '../common/Header';
import Container from '../common/Container';
import LocationPicker from '../components/pickers/LocationPicker';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import NuxSoftwareSetupStore from '../stores/NuxSoftwareSetupStore';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingHorizontal: 15,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
  input: {
    color: COLORS.textInverse,
  },
  label: {
    color: COLORS.textInverse,
  },
  validationText: {
    color: COLORS.danger2,
  },
});

type Props = {|
  onContinuePress: () => void | Promise<any>,
  locationsCount: number,
|};

@errorBoundary(<ErrorScreen showBackButton />)
@flatNavigationParamsAndScreenProps
@observer
class NuxLocationScreen extends InjectedComponent<Props> {
  _onLocationChange = (location: PickerValue<Location, false>) => {
    // todo
    // PickerValue: ?TEntity | Array<TEntity>
    // depends on multiple prop, try to find a way to do conditional
    // type on Flow
    NuxSoftwareSetupStore.selectLocation(((location: any): ?Location));
  };

  render() {
    const { locationsCount } = this.injectedProps;
    const hasNoLocation = locationsCount === 0;
    const hasOneLocation = locationsCount === 1;
    const hasManyLocations = locationsCount > 1;

    return (
      <Container>
        <Header showBackButton title="1. Setup location" />
        <View style={styles.container}>
          <Icon
            color={COLORS.textInverse}
            containerStyle={styles.iconContainer}
            name="map-marker"
            size={200}
            type="material-community"
          />
          <Text style={styles.descriptionText}>
            {hasNoLocation &&
              'Okay, the first thing we need to do ' +
                'is to set up a location for your Brewskey box.'}
            {hasOneLocation &&
              `You've already set up the location ${
                NuxSoftwareSetupStore.selectLocation
                  ? NuxSoftwareSetupStore.selectLocation.name
                  : ''
              }`}
            {hasManyLocations &&
              'You already created some locations, you need to choose one ' +
                'for further setup.'}
          </Text>
          {hasManyLocations && (
            <LocationPicker
              inputStyle={styles.input}
              labelStyle={styles.label}
              multiple={false}
              onChange={this._onLocationChange}
              placeholderTextColor={COLORS.textInverse}
              selectionColor={COLORS.textInverse}
              underlineColorAndroid={COLORS.secondary}
              validationTextStyle={styles.validationText}
              value={NuxSoftwareSetupStore.selectedLocation}
            />
          )}
          <Button
            disabled={
              hasManyLocations && !NuxSoftwareSetupStore.selectedLocation
            }
            onPress={this.injectedProps.onContinuePress}
            secondary
            title="Next"
          />
        </View>
      </Container>
    );
  }
}

export default NuxLocationScreen;
