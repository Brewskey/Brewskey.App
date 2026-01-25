import * as React from 'react';
import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
import Header from '../../../common/Header';
import { HeaderNavigationButton } from '../../../common/Header/HeaderNavigationButton';
import NuxNoEntity from '../../../components/NuxNoEntity';
import { SectionTapsList } from '../../../components/SectionTapsList';

const TapsScreen: React.FC = () => {
  return (
    <Container>
      <Header
        rightComponent={
          <HeaderNavigationButton
            name="add"
            testID="header-add-button"
            href={{ pathname: '/(tabs)/taps/new', params: {} }}
          />
        }
        shouldShowBackButton
        title="Taps"
        testID="header-taps"
      />
      <SectionTapsList ListEmptyComponent={NuxNoEntity} />
    </Container>
  );
};

export default withErrorBoundary(TapsScreen, <ErrorScreen shouldShowBackButton />);
