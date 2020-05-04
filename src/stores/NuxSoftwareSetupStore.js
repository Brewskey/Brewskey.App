// @flow

import type { Device, EntityID, Location } from 'brewskey.js-api';

import { action, observable } from 'mobx';
import { LocationStore, waitForLoaded } from './DAOStores';
import NavigationService from '../NavigationService';

class NuxSoftwareSetupStore {
  @observable
  selectedLocation: ?Location = null;

  @action
  selectLocation: (?Location) => void = (location: ?Location): void => {
    this.selectedLocation = location;
  };

  onGetStartedPress: () => Promise<void> = async (): Promise<void> => {
    const locationsCount = await waitForLoaded(() => LocationStore.count());

    if (locationsCount === 1) {
      const location = await waitForLoaded(() => LocationStore.getSingle());

      this.selectLocation(location);
    }

    NavigationService.navigate('nuxLocation', {
      locationsCount,
      onContinuePress: () => {
        if (locationsCount === 0) {
          NavigationService.navigate('newLocation', {
            onLocationCreated: (location: Location) => {
              this.selectLocation(location);
              this._onGetLocation();
            },
            showBackButton: false,
          });
        } else {
          this._onGetLocation();
        }
      },
    });
  };

  _onGetLocation: () => void = (): void => {
    NavigationService.navigate('nuxWifi', {
      onContinuePress: () => {
        NavigationService.navigate('wifiSetup', {
          forNewDevice: true,
          onSetupFinish: this._onWifiSetupFinish,
        });
      },
    });
  };

  _onWifiSetupFinish: (string) => void = (particleID: string): void => {
    NavigationService.navigate('nuxDevice', {
      onContinuePress: () => {
        NavigationService.navigate('newDevice', {
          hideLocation: true,
          hideStatus: true,
          initialValues: {
            location: this.selectedLocation,
            particleId: particleID,
          },
          onDeviceCreated: this._onDeviceCreated,
          showBackButton: false,
        });
      },
    });
  };

  _onDeviceCreated: (Device) => void = (device: Device): void => {
    NavigationService.navigate('nuxTap', {
      onContinuePress: () => {
        NavigationService.navigate('newTap', {
          initialValues: { device },
          onTapSetupFinish: this._onTapSetupFinish,
          showBackButton: false,
        });
      },
    });
  };

  _onTapSetupFinish: (EntityID) => void = (tapID: EntityID): void => {
    NavigationService.navigate('nuxFinish', {
      onContinuePress: () => {
        this.selectLocation(null);

        NavigationService.reset('menu', 'menu');
        NavigationService.navigate('taps');
        NavigationService.navigate('tapDetails', { id: tapID });
      },
    });
  };
}

export default new NuxSoftwareSetupStore();
