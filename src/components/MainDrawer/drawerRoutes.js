// @flow

export type DrawerRoute = {|
  icon: { name: string, type?: string },
  isManageTapsRequired: boolean,
  routeKey: string,
  title: string,
|};

const DRAWER_ROUTES: Array<DrawerRoute> = [
  {
    icon: { name: 'home' },
    isManageTapsRequired: false,
    routeKey: 'home',
    title: 'Home',
  },
  {
    icon: { name: 'account', type: 'material-community' },
    isManageTapsRequired: false,
    routeKey: 'profile',
    title: 'My profile',
  },
  {
    icon: { name: 'map-marker', type: 'material-community' },
    isManageTapsRequired: true,
    routeKey: 'locations',
    title: 'Locations',
  },
  {
    icon: { name: 'stocking', type: 'material-community' },
    isManageTapsRequired: true,
    routeKey: 'taps',
    title: 'Taps',
  },
  {
    icon: { name: 'cube', type: 'material-community' },
    isManageTapsRequired: true,
    routeKey: 'devices',
    title: 'Brewskey boxes',
  },
  {
    icon: { name: 'beer', type: 'material-community' },
    isManageTapsRequired: true,
    routeKey: 'myBeverages',
    title: 'Homebrew',
  },
  {
    icon: { name: 'settings', type: 'material-community' },
    isManageTapsRequired: false,
    routeKey: 'settings',
    title: 'Settings',
  },
];

export default DRAWER_ROUTES;
