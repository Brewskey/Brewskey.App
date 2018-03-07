// @flow

import * as React from 'react';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';
import Container from '../common/Container';
import Header from '../common/Header';

class HelpScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header showBackButton title="Help" />
        <NotImplementedPlaceholder />
      </Container>
    );
  }
}

export default HelpScreen;
