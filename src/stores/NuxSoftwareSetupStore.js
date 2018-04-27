// @flow

import type { Device, Location } from 'brewskey.js-api';

import { action, observable } from 'mobx';
import NavigationService from '../NavigationService';

type IntermediateData = {
  location?: Location,
};

class NuxSoftwareSetupStore {
  @observable _intermediateData: IntermediateData = {};

  onGetStartedPress = async () => {
    NavigationService.navigate('nuxLocation', {
      onContinuePress: (location?: Location) => {
        if (location) {
          this._onGetLocation(location);
        } else {
          NavigationService.navigate('newLocation', {
            onLocationCreated: this._onGetLocation,
            showBackButton: false,
          });
        }
      },
    });
  };

  _onGetLocation = (location: Location) => {
    this._updateIntermediateData({ location });
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
        const { location } = this._intermediateData;

        NavigationService.navigate('newDevice', {
          hideLocation: true,
          hideStatus: true,
          hideType: true,
          initialValues: {
            deviceStatus: 'Active',
            deviceType: 'BrewskeyBox',
            location,
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
        this._resetIntermediateData();
        // todo fix to reset on react-navigation@2.0.0
        NavigationService.navigate('tapDetails', { id: tapID });
      },
    });
  };

  @action
  _updateIntermediateData = (data: $Shape<IntermediateData>) => {
    this._intermediateData = { ...this._intermediateData, ...data };
  };

  @action
  _resetIntermediateData = () => {
    this._intermediateData = {};
  };
}

export default new NuxSoftwareSetupStore();
