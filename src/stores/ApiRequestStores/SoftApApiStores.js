// @flow

import type { WifiNetwork } from '../../types';

import makeRequestApiStore from './makeRequestApiStore';
import SoftApService from '../../SoftApService';

export const WifiNetworksStore = makeRequestApiStore((): Promise<
  Array<WifiNetwork>,
> => SoftApService.scanWifi());

export const WifiConfigureStore = makeRequestApiStore(
  (wifiNetwork: WifiNetwork): Promise<void> =>
    SoftApService.configureWifi(wifiNetwork),
);

export const WifiConnectStore = makeRequestApiStore((index?: number): Promise<
  void,
> => SoftApService.connectWifi(index));

export const ParticleIDStore = makeRequestApiStore((): Promise<string> =>
  SoftApService.getParticleID(),
);
