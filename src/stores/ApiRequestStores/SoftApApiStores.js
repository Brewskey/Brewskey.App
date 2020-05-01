// @flow

import type { WifiNetwork } from '../../types';

import makeRequestApiStore from './makeRequestApiStore';
import SoftApService from '../../SoftApService';

export const WifiNetworksStore = makeRequestApiStore<Array<WifiNetwork>>(() =>
  SoftApService.scanWifi(),
);

export const WifiConfigureStore = makeRequestApiStore<void>((wifiNetwork) =>
  SoftApService.configureWifi(wifiNetwork),
);

export const WifiConnectStore = makeRequestApiStore<void>((index) =>
  SoftApService.connectWifi(index),
);

export const ParticleIDStore = makeRequestApiStore<string>(() =>
  SoftApService.getParticleID(),
);
