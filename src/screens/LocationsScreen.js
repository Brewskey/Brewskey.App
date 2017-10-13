// @flow

import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Right,
  Title,
} from 'native-base';

type Props = {|
  navigation: Object,
|};

class LocationsScreen extends React.Component<Props> {
  static navigationOptions = {
    drawerLabel: 'Locations',
  };

  _onAddButtonPress = (): void => this.props.navigation.navigate('newLocation');

  render(): React.Element<*> {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Locations</Title>
          </Body>
          <Right>
            <Button onPress={this._onAddButtonPress} transparent>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <Content />
      </Container>
    );
  }
}

export default LocationsScreen;
