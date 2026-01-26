import * as React from 'react';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { Badge } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import Container from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import ErrorScreen from '../../../common/ErrorScreen';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import Section from '../../../common/Section';
import MenuLogoutButton from '../../../components/MenuLogoutButton';
import MenuSeparator from '../../../components/MenuSeparator';
import { useAppSettings } from '../../../hooks/context/AppSettingsContext';
import MenuNavigationButton from '../../../components/MenuNavigationButton';
import { useAuthSession } from '../../../hooks/context/AuthContext';
import { useGetFriendsCount } from '../../../hooks/queries/FriendQueries';
import { COLORS } from '../../../theme';
import { MenuUserBlock } from '../../../components/MenuUserBlock';

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
    const { data: session } = useAuthSession();
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
          testID="header-brewskey"
          title="Brewskey"
          rightComponent={
            <HeaderNavigationButton
              href={{ pathname: '/(tabs)/menu/settings', params: {} }}
              name="settings"
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
                icon={{ name: 'people' }}
                routeName="myFriends"
                testID="menu-item-friends"
                title="Friends"
                onPress={() => {
                  router.navigate({
                    pathname: '/(tabs)/menu/my-friends',
                    params: {},
                  });
                }}
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
            {isManageTapsEnabled
              ? [
                  <MenuSeparator key="separator1" />,
                  <MenuNavigationButton
                    key="locations"
                    icon={{ name: 'map-marker', type: 'material-community' }}
                    routeName="locations"
                    testID="menu-item-locations"
                    title="Locations"
                    onPress={() => {
                      router.navigate({
                        pathname: '/(tabs)/locations',
                        params: {},
                      });
                    }}
                  />,
                  <MenuNavigationButton
                    key="taps"
                    icon={{ name: 'stocking', type: 'material-community' }}
                    routeName="taps"
                    testID="menu-item-taps"
                    title="Taps"
                    onPress={() => {
                      router.navigate({ pathname: '/(tabs)/taps', params: {} });
                    }}
                  />,
                  <MenuNavigationButton
                    key="devices"
                    icon={{ name: 'cube', type: 'material-community' }}
                    routeName="devices"
                    testID="menu-item-devices"
                    title="Brewskey boxes"
                    onPress={() => {
                      router.navigate({
                        pathname: '/(tabs)/devices',
                        params: {},
                      });
                    }}
                  />,
                  <MenuNavigationButton
                    key="myBeverages"
                    icon={{ name: 'beer', type: 'material-community' }}
                    routeName="myBeverages"
                    testID="menu-item-beverages"
                    title="Homebrew"
                    onPress={() => {
                      router.navigate({
                        pathname: '/(tabs)/beverages',
                        params: {},
                      });
                    }}
                  />,
                  <MenuSeparator key="separator2" />,
                ]
              : null}
            {Platform.OS !== 'android' ? null : (
              <MenuNavigationButton
                icon={{ name: 'nfc' }}
                routeName="writeNFC"
                testID="menu-item-write-nfc"
                title="Setup NFC Cards"
                onPress={() => {
                  router.navigate({
                    pathname: '/(tabs)/menu/write-nfc',
                    params: {},
                  });
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
                router.navigate({ pathname: '/(tabs)/menu/help', params: {} });
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
