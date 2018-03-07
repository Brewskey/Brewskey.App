// @flow

import * as React from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import AppSettingsStore from '../stores/AppSettingsStore';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import Container from '../common/Container';
import Section from '../common/Section';
import Header from '../common/Header';
import MenuUserBlock from '../components/MenuUserBlock';
import MenuSeparator from '../components/MenuSeparator';
import MenuLogoutButton from '../components/MenuLogoutButton';
import MenuNavigationButton from '../components/MenuNavigationButton';

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
            {AppSettingsStore.isManageTapsEnabled && (
              <React.Fragment>
                <MenuSeparator />
                <MenuNavigationButton
                  icon={{ name: 'map-marker', type: 'material-community' }}
                  routeName="locations"
                  title="Locations"
                />
                <MenuNavigationButton
                  icon={{ name: 'stocking', type: 'material-community' }}
                  routeName="taps"
                  title="Taps"
                />
                <MenuNavigationButton
                  icon={{ name: 'cube', type: 'material-community' }}
                  routeName="devices"
                  title="Brewskey boxes"
                />
                <MenuNavigationButton
                  icon={{ name: 'beer', type: 'material-community' }}
                  routeName="myBeverages"
                  title="Homebrew"
                />
                <MenuSeparator key="separator" />
              </React.Fragment>
            )}
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
