// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import TapsList from '../components/TapsList';

type Props = {|
  navigation: Navigation,
|};

class TapsScreen extends React.Component<Props> {
  render() {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newTap" />
          }
          title="Taps"
        />
        <TapsList />
      </Container>
    );
  }
}

export default TapsScreen;
