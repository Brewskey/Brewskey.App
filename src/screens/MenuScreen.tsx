import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { FRIEND_STATUSES } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';

import { useAppSettings } from '../hooks/context/AppSettingsContext';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Section from '../common/Section';
import Header from '../common/Header';
import MenuSeparator from '../components/MenuSeparator';
import MenuLogoutButton from '../components/MenuLogoutButton';
import MenuNavigationButton from '../components/MenuNavigationButton';
import { COLORS } from '../theme';
import { HeaderNavigationButton } from '../common/Header/HeaderNavigationButton';
import { MenuUserBlock } from '../components/MenuUserBlock';
import ErrorScreen from '../common/ErrorScreen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useGetFriendsCount } from '../hooks/queries/FriendQueries';
import { useAuthContext } from '../hooks/context/AuthContext';
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

export const MenuScreen: React.FC = withErrorBoundary(
  () => {
    const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
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
          rightComponent={
            <HeaderNavigationButton
              name="settings"
              screen="LoggedInStack"
              params={{
                screen: 'menu',
                params: {
                  screen: 'settings',
                },
              }}
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
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'myFriends',
                    },
                  });
                }}
                icon={{ name: 'people' }}
                routeName="myFriends"
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
                title="Locations"
                onPress={() => {
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'locations',
                    },
                  });
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'stocking', type: 'material-community' }}
                key="taps"
                routeName="taps"
                title="Taps"
                onPress={() => {
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'taps',
                    },
                  });
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'cube', type: 'material-community' }}
                key="devices"
                routeName="devices"
                title="Brewskey boxes"
                onPress={() => {
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'devices',
                    },
                  });
                }}
              />,
              <MenuNavigationButton
                icon={{ name: 'beer', type: 'material-community' }}
                key="myBeverages"
                routeName="myBeverages"
                title="Homebrew"
                onPress={() => {
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'myBeverages',
                    },
                  });
                }}
              />,
              <MenuSeparator key="separator2" />,
            ]}
            {Platform.OS !== 'android' ? null : (
              <MenuNavigationButton
                icon={{ name: 'nfc' }}
                routeName="writeNFC"
                title="Setup NFC Cards"
                onPress={() => {
                  navigation.navigate('LoggedInStack', {
                    screen: 'menu',
                    params: {
                      screen: 'writeNFC',
                    },
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
              title="Help"
              onPress={() => {
                navigation.navigate('LoggedInStack', {
                  screen: 'menu',
                  params: {
                    screen: 'help',
                  },
                });
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
