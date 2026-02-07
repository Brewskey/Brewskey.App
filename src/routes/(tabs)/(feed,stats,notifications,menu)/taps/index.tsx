import * as React from 'react';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { NuxNoEntity } from 'components/NuxNoEntity';
import { SectionTapsList } from 'components/SectionTapsList';

const TapsScreen: React.FC = () => (
  <Container>
    <Header
      shouldShowBackButton
      testID="header-taps"
      title="Taps"
      rightComponent={
        <HeaderNavigationButton
          href={{ pathname: '/taps/new', params: {} }}
          name="add"
          testID="header-add-button"
        />
      }
    />
    <SectionTapsList ListEmptyComponent={NuxNoEntity} />
  </Container>
);

export default TapsScreen;
