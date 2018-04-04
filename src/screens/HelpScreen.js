// @flow

import * as React from 'react';
import NotImplementedPlaceholder from '../common/NotImplementedPlaceholder';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';

@errorBoundary(<ErrorScreen showBackButton />)
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
