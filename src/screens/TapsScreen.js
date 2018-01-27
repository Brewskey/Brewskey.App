// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import SectionTapsList from '../components/SectionTapsList';

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
        <SectionTapsList />
      </Container>
    );
  }
}

export default TapsScreen;
