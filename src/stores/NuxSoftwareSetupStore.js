// @flow

import type { Device, EntityID, Location } from 'brewskey.js-api';

import { action, observable } from 'mobx';
import { LocationStore, waitForLoaded } from './DAOStores';
import NavigationService from '../NavigationService';

class NuxSoftwareSetupStore {
  @observable
  selectedLocation: ?Location = null;

  @action
  selectLocation = (location: ?Location) => {
    this.selectedLocation = location;
  };

  onGetStartedPress = async () => {
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

  _onGetLocation = () => {
    NavigationService.navigate('nuxWifi', {
      onContinuePress: () => {
        NavigationService.navigate('wifiSetup', {
          forNewDevice: true,
          onSetupFinish: this._onWifiSetupFinish,
        });
      },
    });
  };

  _onWifiSetupFinish = (particleID: string) => {
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

  _onDeviceCreated = (device: Device) => {
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

  _onTapSetupFinish = (tapID: EntityID) => {
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
