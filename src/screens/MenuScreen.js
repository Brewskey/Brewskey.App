// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
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
            <MenuNavigationButton
              icon={{ name: 'people' }}
              routeName="myFriends"
              title="Friends"
            />
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
