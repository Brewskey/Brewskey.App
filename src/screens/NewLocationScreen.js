// @flow

import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Left,
  Title,
} from 'native-base';

type Props = {|
  navigation: Object,
|};

class NewLocationScreen extends React.Component<Props> {
  _onBackButtonPress = (): void => this.props.navigation.goBack(null);
  render(): React.Element<*> {
    return (
      <Container>
        <Header>
          <Left>
            <Button onPress={this._onBackButtonPress} transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>New location</Title>
          </Body>
        </Header>
        <Content />
      </Container>
    );
  }
}

export default NewLocationScreen;
