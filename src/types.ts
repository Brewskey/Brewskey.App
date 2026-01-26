import type { EntityID, KegType } from '@brewskey/js-api';
import type { SectionListData } from 'react-native/Libraries/Lists/SectionList';

export type Section<TEntity> = SectionListData<TEntity>;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface NearbyTap {
  currentKeg: {
    beverageId: number; // not translated to string,
    beverageName: string;
    kegType: KegType;
    maxOunces: number;
    ounces: number;
  };
  device: {
    id: number; // not translated to string,
    name: string;
  };
  id: EntityID;
  name: string;
  tapNumber: number;
}

export interface NearbyLocation {
  id: EntityID;
  name: string;
  summary: string | null | undefined;
  taps: NearbyTap[];
}

export interface WifiNetwork {
  channel?: number;
  index?: number;
  password?: string;
  security: number;
  ssid: string;
}
