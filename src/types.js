// @flow

// todo make the type annotation
export type Navigation = Object;

export type Coordinates = {|
  latitude: number,
  longitude: number,
|};

export type NearbyTap = {
  CurrentKeg: {
    beverageId: number, // not translated to string
    beverageName: string,
    maxOunces: number,
    ounces: number,
  },
  deviceID: number, // not translated to string
  id: string,
  name: string,
};

export type NearbyLocation = {
  CurrentKeg?: {
    beverageId: string,
    beverageName: string,
  },
  id: string,
  name: string,
  summary: ?string,
  taps: Array<NearbyTap>,
};
