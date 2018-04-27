// @flow

import type { Location, LoadObject } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, computed, observable, when } from 'mobx';
import { Icon } from 'react-native-elements';
import { LocationStore, waitForLoaded } from '../stores/DAOStores';
import ToggleStore from '../stores/ToggleStore';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import InjectedComponent from '../common/InjectedComponent';
import Fragment from '../common/Fragment';
import LoadingIndicator from '../common/LoadingIndicator';
import LoaderComponent from '../common/LoaderComponent';
import Header from '../common/Header';
import Container from '../common/Container';
import LocationPicker from '../components/LocationPicker';
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

type InjectedProps = {|
  onContinuePress: (location?: Location) => void | Promise<any>,
|};

@flatNavigationParamsAndScreenProps
@observer
class NuxLocation extends InjectedComponent<InjectedProps> {
  // We use LocationStore.count() in boundaries  of this component in two places
  // here and in LocationPicker. LocationPicker flushes the cache of LocationStore
  // and it leads to infinite loop, so we freeze countLoader for the current case.
  // To avoid this crutch we need to implement more robust cache control in our
  // DAO
  @observable _freezedLocationsCountLoader: LoadObject<number> = null;

  componentDidMount() {
    when(
      () => this._locationsCountLoader.hasValue(),
      () => {
        this._freezedLocationsCountLoader = this._locationsCountLoader;
      },
    );
  }

  @computed
  get _locationsCountLoader(): LoadObject<number> {
    return this._freezedLocationsCountLoader || LocationStore.count();
  }

  render() {
    return (
      <LoaderComponent
        loadedComponent={LoadedComponent}
        loader={this._locationsCountLoader}
        loadingComponent={LoadingComponent}
        onContinuePress={this.injectedProps.onContinuePress}
      />
    );
  }
}

const LoadingComponent = () => (
  <Fragment>
    <Header showBackButton title="1. Setup location" />
    <LoadingIndicator color={COLORS.secondary} style={styles.container} />
  </Fragment>
);

type LoadedComponentProps = {|
  onContinuePress: (location?: Location) => void | Promise<any>,
  value: number,
|};

@observer
class LoadedComponent extends React.Component<LoadedComponentProps> {
  _isLocationLoadingToggleStore: ToggleStore = new ToggleStore();

  @observable _selectedLocation: ?Location = null;

  @action
  _onLocationSelect = (location: ?Location) => {
    this._selectedLocation = location;
  };

  _onContinuePress = async (): Promise<void> => {
    const { value: locationsCount, onContinuePress } = this.props;
    switch (locationsCount) {
      case 0: {
        onContinuePress();
        break;
      }
      case 1: {
        this._isLocationLoadingToggleStore.toggleOn();
        const locationLoaders = await waitForLoaded(() =>
          LocationStore.getMany(),
        );

        this._isLocationLoadingToggleStore.toggleOff();
        onContinuePress(locationLoaders[0].getValueEnforcing());
        break;
      }
      default: {
        onContinuePress(this._selectedLocation);
      }
    }
  };

  render() {
    const { value: locationsCount } = this.props;

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
            {hasNoLocation && "Okay! Let's create a location first."}
            {hasOneLocation &&
              'It seems you already created one location, ' +
                'we will use it in the further setup.'}
            {hasManyLocations &&
              'You already created some locations, you need to choose one ' +
                'for further setup.'}
          </Text>
          {hasManyLocations && (
            <LocationPicker
              inputStyle={styles.input}
              labelStyle={styles.label}
              onChange={this._onLocationSelect}
              placeholderTextColor={COLORS.textInverse}
              selectionColor={COLORS.textInverse}
              underlineColorAndroid={COLORS.secondary}
              validationTextStyle={styles.validationText}
              value={this._selectedLocation}
            />
          )}
          <Button
            disabled={
              (hasManyLocations && !this._selectedLocation) ||
              this._isLocationLoadingToggleStore.isToggled
            }
            loading={this._isLocationLoadingToggleStore.isToggled}
            onPress={this._onContinuePress}
            secondary
            title={hasNoLocation ? 'Go to location form' : 'Go to next step'}
          />
        </View>
      </Container>
    );
  }
}

export default NuxLocation;
