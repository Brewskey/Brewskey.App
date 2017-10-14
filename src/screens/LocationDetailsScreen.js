// @flow

import type { Location } from 'brewskey.js-api';
import type DAOEntityStore from '../stores/DAOEntityStore';

import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Text } from 'react-native';
import flatNavigationParams from '../common/flatNavigationParams';
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
  id: string,
  locationStore: DAOEntityStore<Location, Location>,
  navigation: Object,
|};

@flatNavigationParams
@inject('locationStore')
@observer
class LocationDetailsScreen extends React.Component<Props> {
  _onBackButtonPress = (): void => this.props.navigation.goBack(null);

  render(): React.Element<*> {
    const location = this.props.locationStore.getByID(this.props.id);
    // todo prettify and move content to separate component
    return (
      <Container>
        <Header>
          <Left>
            <Button onPress={this._onBackButtonPress} transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{location.name}</Title>
          </Body>
        </Header>
        <Content padder>
          <Text>{location.name}</Text>
          <Text>{location.description}</Text>
        </Content>
      </Container>
    );
  }
}

export default LocationDetailsScreen;
