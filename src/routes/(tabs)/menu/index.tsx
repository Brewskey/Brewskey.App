import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';

import { useAppSettings } from '../../../hooks/context/AppSettingsContext';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Section from '../../../common/Section';
import Header from '../../../common/Header';
import MenuSeparator from '../../../components/MenuSeparator';
import MenuLogoutButton from '../../../components/MenuLogoutButton';
import MenuNavigationButton from '../../../components/MenuNavigationButton';
import { COLORS } from '../../../theme';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import { MenuUserBlock } from '../../../components/MenuUserBlock';
import ErrorScreen from '../../../common/ErrorScreen';
import { useRouter } from 'expo-router';
import { useGetFriendsCount } from '../../../hooks/queries/FriendQueries';
import { useAuthContext } from '../../../hooks/context/AuthContext';
import { Badge } from '@rneui/themed';

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

const MenuScreen = withErrorBoundary(
  () => {
    const router = useRouter();
    const [session] = useAuthContext();
    const { isManageTapsEnabled } = useAppSettings();
    const queryOptions = {
      filters: [
        createFilter('friendAccount').notEquals(null),
        createFilter('owningAccount/id').equals(session?.id),
        createFilter('friendStatus').equals(FRIEND_STATUSES.PENDING),
      ],
    };
    const pendingRequestCount = useGetFriendsCount(queryOptions, {
      isEnabled: session != null,
    });
    return (
      <Container>
        <Header
          title="Brewskey"
          testID="header-brewskey"
          rightComponent={
            <HeaderNavigationButton
              name="settings"
              href="/(tabs)/menu/settings"
              testID="header-settings-button"
            />
          }
        />
        <ScrollView>
          <Section bottomPadded>
            <MenuUserBlock />
          </Section>
          <Section>
            <View>
              <MenuNavigationButton
                onPress={() => {
                  router.navigate('/(tabs)/menu/my-friends');
                }}
                icon={{ name: 'people' }}
                routeName="myFriends"
                testID="menu-item-friends"
                title="Friends"
              />
              {(pendingRequestCount.data ?? 0) === 0 ? null : (
                <View style={styles.container}>
                  <Badge
                    badgeStyle={styles.badge}
                    textStyle={styles.badgeText}
                    value={pendingRequestCount.data}
                  />
                </View>
              )}
            </View>
            {isManageTapsEnabled && [
              <MenuSeparator key="separator1" />,
              <MenuNavigationButton
                icon={{ name: 'map-marker', type: 'material-community' }}
                key="locations"
                routeName="locations"
                testID="menu-item-locations"
                title="Locations"
                onPress={() => {
                  router.navigate('/(tabs)/locations');
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'stocking', type: 'material-community' }}
                key="taps"
                routeName="taps"
                testID="menu-item-taps"
                title="Taps"
                onPress={() => {
                  router.navigate('/(tabs)/taps');
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'cube', type: 'material-community' }}
                key="devices"
                routeName="devices"
                testID="menu-item-devices"
                title="Brewskey boxes"
                onPress={() => {
                  router.navigate('/(tabs)/devices');
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'beer', type: 'material-community' }}
                key="myBeverages"
                routeName="myBeverages"
                testID="menu-item-beverages"
                title="Homebrew"
                onPress={() => {
                  router.navigate('/(tabs)/beverages');
                }}
              />,
              <MenuSeparator key="separator2" />,
            ]}
            {Platform.OS !== 'android' ? null : (
              <MenuNavigationButton
                icon={{ name: 'nfc' }}
                routeName="writeNFC"
                testID="menu-item-write-nfc"
                title="Setup NFC Cards"
                onPress={() => {
                  router.navigate('/(tabs)/menu/write-nfc');
                }}
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
              testID="menu-item-help"
              title="Help"
              onPress={() => {
                router.navigate('/(tabs)/menu/help');
              }}
            />
            <MenuSeparator />
            <MenuLogoutButton />
          </Section>
        </ScrollView>
      </Container>
    );
  },
  <ErrorScreen />,
);

export default MenuScreen;
