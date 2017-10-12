// @flow

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text, Switch } from 'react-native';
import {
  Body,
  Container,
  Content,
  Header,
  List,
  ListItem,
  Right,
  Title,
} from 'native-base';

@inject('appSettingsStore')
@observer
class SettingsScreen extends React.Component<Props> {
  static navigationOptions = {
    drawerLabel: 'Settings',
  };

  render(): React.Element<*> {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Settings</Title>
          </Body>
        </Header>
        <Content>
          <List>
            <ListItem>
              <Body>
                <Text>Multi account mode</Text>
              </Body>
              <Right>
                <Switch
                  onValueChange={
                    this.props.appSettingsStore.toggleMultiAccountMode
                  }
                  value={this.props.appSettingsStore.multiAccountModeEnabled}
                />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Manage taps</Text>
              </Body>
              <Right>
                <Switch
                  onValueChange={this.props.appSettingsStore.toggleManageTaps}
                  value={this.props.appSettingsStore.manageTapsEnabled}
                />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export default SettingsScreen;
