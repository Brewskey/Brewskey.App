// @flow

import type { Navigation, WifiNetwork } from '../types';

import { action, autorun, computed, observable, reaction, when, runInAction } from 'mobx';
import SoftApService from '../SoftApService';

import { StackActions } from 'react-navigation';
import { LoadObject } from 'brewskey.js-api';
import promiseRetry from 'promise-retry';

type WifiSetupStep = 1 | 2 | 3 | 4;


// export const WifiNetworksStore = makeRequestApiStore<Array<WifiNetwork>>(() =>
//   SoftApService.scanWifi(),
// );

// export const WifiConfigureStore = makeRequestApiStore<void>((wifiNetwork) =>
//   SoftApService.configureWifi(wifiNetwork),
// );

// export const WifiConnectStore = makeRequestApiStore<void>((index) =>
//   SoftApService.connectWifi(index),
// );

// export const ParticleIDStore = makeRequestApiStore<string>(() =>
//   SoftApService.getParticleID(),
// );


class WifiSetupStore {
  @observable
  wifiSetupStep: WifiSetupStep = 1;

  @observable
  particleID: string = [];

  @observable
  isSettingUpWifi: boolean = false;

  @observable
  wifiSetupLoader: LoadObject<Array<WifiNetwork>> = LoadObject.empty();

  navigation: Navigation;

  _shouldStillFetchDeviceID: boolean = false;

  @action
  initialize: (Navigation) => void = (navigation: Navigation): void => {
    this.navigation = navigation;
    this._setWifiSetupStep(1);
  };

  dispose: () => void = (): void => {
    this._setupLoopPromise = null;
  };

  @action
  onStep1Ready: () => void = async (): Promise<void> => {
    this._setWifiSetupStep(2);

    const TIME_BETWEEN_RUNS = 1000;
    const MAX_RUNS = 10;
    this._shouldStillFetchDeviceID = true;
    const handleError = (retry) => (err) => {
      console.log(err);
      if (this._shouldStillFetchDeviceID) {
        return retry(err);
      }
    };

    try {
      await promiseRetry((retry, number) => {
        return this.loadParticleID().catch(handleError(retry));
      });
      console.log('loaded particle ID')
      await promiseRetry((retry, number) => {
        return this.loadWifiNetworks().catch(handleError(retry));
      });
      console.log('loaded wifi')

      this._shouldStillFetchDeviceID = false;
      this._setWifiSetupStep(3);
    } catch (_) {
      this._setWifiSetupStep(1);
    }
  };

  @action.bound
  loadParticleID = async () => {
    const particleID = await SoftApService.getParticleID();
    console.log(particleID)
    runInAction(() => {
      this.particleID = particleID;
    });
    return particleID;
  };

  @action.bound
  loadWifiNetworks = async () => {
    runInAction(() => {
      this.wifiSetupLoader = LoadObject.loading();
    });
    const wifiList = await SoftApService.scanWifi();
    console.log(wifiList);
    runInAction(() => {
      this.wifiSetupLoader = LoadObject.withValue(wifiList);
    });
    return wifiList;
  };

  @action
  setupWifi: (WifiNetwork) => Promise<void> = async (
    wifiNetwork: WifiNetwork,
  ): Promise<void> => {
    this.isSettingUpWifi = true;
    console.log('wifiNetwork', wifiNetwork)
    const key = await SoftApService.configureWifi(wifiNetwork);
    console.log('key', key)
    await SoftApService.connectWifi().then(console.log).catch(console.error);
    this._setWifiSetupStep(4);
  };

  @action.bound
  _setWifiSetupStep: (WifiSetupStep) => void = (step: WifiSetupStep): void => {
    console.log('Step', step);
    this.wifiSetupStep = step;
    this.isSettingUpWifi = false;

    this.navigation.dispatch(
      StackActions.replace({
        routeName: `wifiSetupStep${step}`,
      }),
    )
  };
}

export default WifiSetupStore;
