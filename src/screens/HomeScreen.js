// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import Header from '../common/Header';
import HomeScreenStore from '../stores/HomeScreenStore';
import NearbyLocationsList from '../components/NearbyLocationsList';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import HeaderSearchBar from '../common/Header/HeaderSearchBar';

const styles = StyleSheet.create({
  permissionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingBottom: 15,
    textAlign: 'center',
  },
});

type InjectedProps = {|
  navigation: Navigation,
|};

@errorBoundary(ErrorScreen)
@observer
class HomeScreen extends InjectedComponent<InjectedProps> {
  render(): React.Node {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderSearchBar
              onChangeText={HomeScreenStore.searchTextStore.setText}
              onClearPress={HomeScreenStore.onClearSearchBar}
              onClosePress={HomeScreenStore.onClearSearchBar}
              value={HomeScreenStore.searchTextStore.text}
            />
          }
          title="Nearby locations"
        />
        {HomeScreenStore.isAskLocationPermissionVisible ? (
          <Container centered>
            <Text style={styles.permissionText}>
              In order to see nearby taps, we need location permissions
            </Text>
            <Button
              onPress={HomeScreenStore.onAskLocationPermissionButtonPress}
              title="Provide permissions"
            />
          </Container>
        ) : (
          <NearbyLocationsList
            isLoading={HomeScreenStore.isLoading}
            nearbyLocations={HomeScreenStore.nearbyLocations}
            onRefresh={HomeScreenStore.refresh}
          />
        )}
      </Container>
    );
  }
}

export default HomeScreen;
