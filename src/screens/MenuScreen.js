// @flow

import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import AppSettingsStore from '../stores/AppSettingsStore';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import Container from '../common/Container';
import Section from '../common/Section';
import Header from '../common/Header';
import MenuUserBlock from '../components/MenuUserBlock';
import MenuSeparator from '../components/MenuSeparator';
import MenuLogoutButton from '../components/MenuLogoutButton';
import MenuNavigationButton from '../components/MenuNavigationButton';
import { Badge } from 'react-native-elements';
import { COLORS } from '../theme';
import FriendRequestsListStore from '../stores/FriendRequestsListStore';
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.primary2,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
  },
  container: {
    position: 'absolute',
    right: 8,
    top: 12,
    zIndex: 10,
  },
});

errorBoundary(ErrorScreen);
@observer
class MenuScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header
          title="Brewskey"
          rightComponent={
            <HeaderNavigationButton name="settings" toRoute="settings" />
          }
        />
        <ScrollView>
          <Section bottomPadded>
            <MenuUserBlock />
          </Section>
          <Section>
            <View>
              <MenuNavigationButton
                action={
                  FriendRequestsListStore.pendingRequestsCount === 0
                    ? undefined
                    : NavigationActions.navigate({
                        routeName: 'myFriendsRequest',
                      })
                }
                icon={{ name: 'people' }}
                routeName="myFriends"
                title="Friends"
              />
              {FriendRequestsListStore.pendingRequestsCount === 0 ? null : (
                <View style={styles.container}>
                  <Badge
                    containerStyle={styles.badge}
                    textStyle={styles.badgeText}
                    value={FriendRequestsListStore.pendingRequestsCount}
                  />
                </View>
              )}
            </View>
            {AppSettingsStore.isManageTapsEnabled && [
              <MenuSeparator key="separator1" />,
              <MenuNavigationButton
                icon={{ name: 'map-marker', type: 'material-community' }}
                key="locations"
                routeName="locations"
                title="Locations"
              />,
              <MenuNavigationButton
                icon={{ name: 'stocking', type: 'material-community' }}
                key="taps"
                routeName="taps"
                title="Taps"
              />,
              <MenuNavigationButton
                icon={{ name: 'cube', type: 'material-community' }}
                key="devices"
                routeName="devices"
                title="Brewskey boxes"
              />,
              <MenuNavigationButton
                icon={{ name: 'beer', type: 'material-community' }}
                key="myBeverages"
                routeName="myBeverages"
                title="Homebrew"
              />,
              <MenuSeparator key="separator2" />,
            ]}
            {Platform.OS !== 'android' ? null : (
              <MenuNavigationButton
                icon={{ name: 'nfc' }}
                routeName="writeNFC"
                title="Setup NFC Cards"
              />
            )}
            {/* <MenuNavigationButton
              icon={{ name: 'credit-card' }}
              routeName="payments"
              title="Payment"
            /> */}
            <MenuNavigationButton
              icon={{ name: 'help' }}
              routeName="help"
              title="Help"
            />
            <MenuSeparator />
            <MenuLogoutButton />
          </Section>
        </ScrollView>
      </Container>
    );
  }
}

export default MenuScreen;
