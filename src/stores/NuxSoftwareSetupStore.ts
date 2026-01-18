import type { Device, EntityID, Location } from '@brewskey/js-api';
import type { NavigationProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

class NuxSoftwareSetupStore {
  selectedLocation: Location | null | undefined = null;

  selectLocation: (arg1?: Location | null | undefined) => void = (
    location?: Location | null,
  ): void => {
    this.selectedLocation = location;
  };

  onGetStartedPress: () => Promise<void> = async (): Promise<void> => {
    // const locationsCount = await waitForLoaded(() => LocationStore.count());
    // if (locationsCount === 1) {
    //   const location = await waitForLoaded(() => LocationStore.getSingle());
    //   this.selectLocation(location);
    // }
    // Note: Navigation logic has been migrated to NuxNoEntity component
  };

  _onGetLocation: (navigation: NavigationProp<ReactNavigation.RootParamList>) => void = (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
  ): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'nuxWifi',
        params: {
          onContinuePress: async () => {
            navigation.navigate('LoggedInStack', {
              screen: 'menu',
              params: {
                screen: 'devices',
                params: {
                  screen: 'wifiSetup',
                  params: {
                    forNewDevice: true,
                    onSetupFinish: async (particleID: string) => {
                      await this._onWifiSetupFinish(navigation, particleID);
                    },
                  },
                },
              },
            } satisfies ReactNavigation.RootParamList['LoggedInStack']);
          },
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  _onWifiSetupFinish: (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    particleID: string,
  ) => void = (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    particleID: string,
  ): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'nuxDevice',
        params: {
          onContinuePress: async () => {
            navigation.navigate('LoggedInStack', {
              screen: 'menu',
              params: {
                screen: 'devices',
                params: {
                  screen: 'newDevice',
                  params: {
                    hideLocation: true,
                    initialValues: {
                      location: this.selectedLocation,
                      particleId: particleID,
                    } as any,
                    onDeviceCreated: async (device: Device) => {
                      await this._onDeviceCreated(navigation, device);
                    },
                    showBackButton: false,
                  },
                },
              },
            } satisfies ReactNavigation.RootParamList['LoggedInStack']);
          },
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  _onDeviceCreated: (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    device: Device,
  ) => void = (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    device: Device,
  ): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'nuxTap',
        params: {
          onContinuePress: async () => {
            navigation.navigate('LoggedInStack', {
              screen: 'menu',
              params: {
                screen: 'taps',
                params: {
                  screen: 'newTap',
                  params: {
                    initialValues: { device },
                    onTapSetupFinish: async (tapID: EntityID) => {
                      await this._onTapSetupFinish(navigation, tapID);
                    },
                    showBackButton: false,
                  },
                },
              },
            } satisfies ReactNavigation.RootParamList['LoggedInStack']);
          },
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };

  _onTapSetupFinish: (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    tapID: EntityID,
  ) => void = (
    navigation: NavigationProp<ReactNavigation.RootParamList>,
    tapID: EntityID,
  ): void => {
    navigation.navigate('LoggedInStack', {
      screen: 'menu',
      params: {
        screen: 'nuxFinish',
        params: {
          onContinuePress: async () => {
            this.selectLocation(null);

            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LoggedInStack',
                    params: {
                      screen: 'menu',
                      params: {
                        screen: 'taps',
                      },
                    },
                  },
                  {
                    name: 'LoggedInStack',
                    params: {
                      screen: 'menu',
                      params: {
                        screen: 'taps',
                        params: {
                          screen: 'tapDetails',
                          params: { tapId: tapID },
                        },
                      },
                    },
                  },
                ],
              }),
            );
          },
        },
      },
    } satisfies ReactNavigation.RootParamList['LoggedInStack']);
  };
}

export default new NuxSoftwareSetupStore();
