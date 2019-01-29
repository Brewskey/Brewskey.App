// @flow

import type { Navigation, WifiNetwork } from '../types';
import type { LoadObject } from 'brewskey.js-api';

import { action, autorun, computed, observable, reaction, when } from 'mobx';
import {
  ParticleIDStore,
  WifiConfigureStore,
  WifiConnectStore,
} from './ApiRequestStores/SoftApApiStores';

import { StackActions } from 'react-navigation';

type WifiSetupStep = 1 | 2 | 3 | 4;

class WifiSetupStore {
  @observable
  wifiSetupStep: WifiSetupStep = 1;
  @observable
  _particleIDLoaderCacheKey: string = '';
  @observable
  _wifiSetupLoaderCacheKey: string = '';
  _disposers: Array<Function> = [];

  initialize = (navigation: Navigation) => {
    const navigationReaction = reaction(
      () => this.wifiSetupStep,
      (wifiSetupStep: WifiSetupStep) =>
        // todo need to reset store state instead of pushing out of stack
        // for that we need to implement custom back route behaviour
        navigation.dispatch(
          StackActions.replace({
            routeName: `wifiSetupStep${wifiSetupStep}`,
          }),
        ),
    );
    this._disposers.push(navigationReaction);

    const setupFinishReaction = when(
      (): boolean => this.wifiSetupLoader.hasValue(),
      (): void => this._setWifiSetupStep(4),
    );

    this._disposers.push(setupFinishReaction);
  };

  dispose = () => {
    ParticleIDStore.flushCache();
    this._flushWifiConfigurationCache();
    this._disposers.forEach((disposer: Function) => disposer());
  };

  @computed
  get wifiSetupLoader(): LoadObject<void> {
    return WifiConfigureStore.getFromCache(this._wifiSetupLoaderCacheKey).map(
      () => WifiConnectStore.get(),
    );
  }

  @computed
  get particleIDLoader(): LoadObject<string> {
    return ParticleIDStore.getFromCache(this._particleIDLoaderCacheKey);
  }

  @action
  onStep1Ready = () => {
    this._setWifiSetupStep(2);
    const particleIDReaction = autorun(currentReaction => {
      if (this.particleIDLoader.hasValue()) {
        this._setWifiSetupStep(3);
        currentReaction.dispose();
      }
      if (this.particleIDLoader.hasError()) {
        ParticleIDStore.flushCache();
        ParticleIDStore.fetch();
      }
    });

    this._disposers.push(particleIDReaction);
    this._particleIDLoaderCacheKey = ParticleIDStore.fetch();
  };

  @action
  _setWifiSetupStep = (step: WifiSetupStep) => {
    this.wifiSetupStep = step;
  };

  @action
  setupWifi = async (wifiNetwork: WifiNetwork): Promise<void> => {
    this._flushWifiConfigurationCache();
    this._wifiSetupLoaderCacheKey = WifiConfigureStore.fetch(wifiNetwork);
  };

  _flushWifiConfigurationCache = () => {
    WifiConfigureStore.flushCache();
    WifiConnectStore.flushCache();
  };
}

export default WifiSetupStore;
