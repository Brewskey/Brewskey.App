// @flow

import type { Navigation, WifiNetwork } from '../types';

import { action, computed, observable, reaction } from 'mobx';
import {
  WifiConfigureStore,
  WifiConnectStore,
} from './ApiRequestStores/SoftApApiStores';
import SoftApService from '../SoftApService';
import { LoadObject } from 'brewskey.js-api';
import { waitForLoaded } from './DAOStores';

type WifiSetupStep = 1 | 2 | 3 | 4;

class WifiSetupStore {
  @observable wifiSetupStep: WifiSetupStep = 1;
  @observable particleID: string = '';
  @observable _wifiSetupLoaderID = null;

  constructor(navigation: Navigation) {
    reaction(
      () => this.wifiSetupStep,
      (wifiSetupStep: WifiSetupStep, currentReaction: Object) => {
        // todo make replace instead navigate to prevent using hardware back button
        navigation.navigate(`wifiSetupStep${wifiSetupStep}`);
        if (wifiSetupStep === 4) {
          currentReaction.dispose();
        }
      },
    );
  }

  @computed
  get wifiSetupLoader(): LoadObject<void> {
    return this._wifiSetupLoaderID
      ? WifiConfigureStore.getFromCache(this._wifiSetupLoaderID).map(
          (): LoadObject<void> => WifiConnectStore.get(),
        )
      : LoadObject.empty();
  }

  @action
  onStep1Ready = () => {
    this.setWifiSetupStep(2);
    this._queryParticleID();
  };

  @action
  setParticleID = (particleID: string) => {
    this.particleID = particleID;
  };

  @action
  setWifiSetupStep = (step: WifiSetupStep) => {
    this.wifiSetupStep = step;
  };

  @action
  setupWifi = async (wifiNetwork: WifiNetwork = {}): Promise<void> => {
    try {
      this._wifiSetupLoaderID = WifiConfigureStore.fetch(wifiNetwork);
      await waitForLoaded(() => this.wifiSetupLoader, 15000);
      this.setWifiSetupStep(4);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  @action
  _queryParticleID = async () => {
    try {
      const particleID = await SoftApService.getParticleID();
      this.setParticleID(particleID);
      this.setWifiSetupStep(3);
    } catch (error) {
      this._queryParticleID();
    }
  };
}

export default WifiSetupStore;
