import * as React from 'react';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { HeaderNavigationButton } from 'common/Header/HeaderNavigationButton';
import { NuxNoEntity } from 'components/NuxNoEntity';
import { SectionTapsList } from 'components/SectionTapsList';

const TapsScreen: React.FC = withErrorBoundary(
  () => (
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
  ),
  <ErrorScreen shouldShowBackButton />,
);

export default TapsScreen;
