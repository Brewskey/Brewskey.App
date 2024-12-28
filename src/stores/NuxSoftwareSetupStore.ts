import type { Device, EntityID, Location } from '@brewskey/js-api';

import NavigationService from '../NavigationService';

class NuxSoftwareSetupStore {
  selectedLocation: Location | null | undefined = null;

  selectLocation: (arg1?: Location | null | undefined) => void = (
    location?: Location | null,
  ): void => {
    this.selectedLocation = location;
  };

  onGetStartedPress: () => Promise<void> = async (): Promise<void> => {
    // const locationsCount = await waitForLoaded(() => LocationStore.count());
    // if (locationsCount === 1) {
    //   const location = await waitForLoaded(() => LocationStore.getSingle());
    //   this.selectLocation(location);
    // }
    // NavigationService.navigate('nuxLocation', {
    //   locationsCount,
    //   onContinuePress: () => {
    //     if (locationsCount === 0) {
    //       NavigationService.navigate('newLocation', {
    //         onLocationCreated: (location: Location) => {
    //           this.selectLocation(location);
    //           this._onGetLocation();
    //         },
    //         showBackButton: false,
    //       });
    //     } else {
    //       this._onGetLocation();
    //     }
    //   },
    // });
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

  _onWifiSetupFinish: (arg1: string) => void = (particleID: string): void => {
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

  _onDeviceCreated: (arg1: Device) => void = (device: Device): void => {
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

  _onTapSetupFinish: (arg1: EntityID) => void = (tapID: EntityID): void => {
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
