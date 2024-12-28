import type {Navigation} from '../types';

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import HeaderNavigationButton from '../common/Header/HeaderNavigationButton';
import NuxNoEntity from '../components/NuxNoEntity';
import {SectionTapsList} from '../components/SectionTapsList';

type Props = {
  navigation: Navigation
};

@errorBoundary(<ErrorScreen showBackButton />)
export const TapsScreen: React.FC<Props> = () => {
    return (
      <Container>
        <Header
          rightComponent={
            <HeaderNavigationButton name="add" toRoute="newTap" />
          }
          showBackButton
          title="Taps"
        />
        <SectionTapsList ListEmptyComponent={NuxNoEntity} />
      </Container>
    );
}

