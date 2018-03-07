// @flow

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';

class StatsScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header title="Statistics" />
        <NotImplementedPlaceholder />
      </Container>
    );
  }
}

export default StatsScreen;
