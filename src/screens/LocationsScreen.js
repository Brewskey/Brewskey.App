// @flow

import * as React from 'react';
import { Body, Container, Content, Header, Title } from 'native-base';

type Props = {|
  navigation: Object,
|};

class MyLocationsScreen extends React.Component<Props> {
  static navigationOptions = {
    drawerLabel: 'Locations',
  };

  render(): React.Element<*> {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Locations</Title>
          </Body>
        </Header>
        <Content />
      </Container>
    );
  }
}

export default MyLocationsScreen;
