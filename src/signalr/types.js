// @flow

export type SocketPour = {
  account: { id: string, name: string },
  id: string,
  keg: { id: string },
  location: { id: string },
  ounces: number,
  pourDate: Date,
  pouredBy: string,
  pulses: number,
  tap: { id: string },
};
