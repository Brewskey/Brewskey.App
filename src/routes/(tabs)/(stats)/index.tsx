import * as React from 'react';
import { useEffect } from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';
import nullthrows from 'nullthrows';

import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Fragment } from 'common/Fragment';
import { Header } from 'common/Header';
import { Section } from 'common/Section';
import { SectionHeader } from 'common/SectionHeader';
import { BeveragePoursList } from 'components/poursLists/BeveragePoursList';
import { AllBeveragesHScroll } from 'components/Stats/AllBeveragesHScroll';
import { UserBadges } from 'components/UserBadges/UserBadges';
import { useAuthContext } from 'hooks/context/AuthContext';

import type { AchievementType } from '@brewskey/js-api';

import type { AllBeveragesHScrollHandle } from 'components/Stats/AllBeveragesHScroll';
import type { UserBadgesHandle } from 'components/UserBadges/UserBadges';

const StatsScreenComponent: React.FC = () => {
  const { initialPopUpAchievementType } = useLocalSearchParams<{
    initialPopUpAchievementType?: AchievementType;
  }>();
  const [session] = useAuthContext();
  const userBadges = React.useRef<UserBadgesHandle>(null);
  const allBeverages = React.useRef<AllBeveragesHScrollHandle | undefined>(
    undefined,
  );

  useEffect(() => {
    if (userBadges.current && initialPopUpAchievementType != null) {
      userBadges.current.openBadgeModal(initialPopUpAchievementType);
    }
  }, [initialPopUpAchievementType]);

  const onRefresh = () => {
    userBadges.current?.refresh();
    allBeverages.current?.refresh();
  };

  if (session == null) {
    return null;
  }

  const userID = nullthrows(session.id);
  return (
    <Container>
      <Header testID="header-stats" title="My Stats" />
      <BeveragePoursList
        onRefresh={onRefresh}
        testID="recent-pours-list"
        ListHeaderComponent={
          <Fragment>
            <Section bottomPadded testID="badges-section">
              <SectionHeader title="Badges" />
              <UserBadges ref={userBadges} userID={userID} />
            </Section>
            <Section bottomPadded testID="beverages-section">
              <SectionHeader title="Beverages Poured" />
              <AllBeveragesHScroll userID={userID} />
            </Section>
            <SectionHeader
              testID="section-header-recent-pours-stats"
              title="Recent Pours"
            />
          </Fragment>
        }
        queryOptions={{
          filters: [createFilter('owner/id').equals(userID)],
          orderBy: [{ column: 'id', direction: 'desc' }],
        }}
      />
    </Container>
  );
};

const StatsScreen = withErrorBoundary(StatsScreenComponent, ErrorScreen);

export default StatsScreen;
