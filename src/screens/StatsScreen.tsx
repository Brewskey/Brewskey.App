import type { AchievementType } from '@brewskey/js-api';

import * as React from 'react';
import { createFilter } from '@brewskey/js-api/dist/filters';
import nullthrows from 'nullthrows';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import Fragment from '../common/Fragment';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';
import { StaticScreenProps } from '@react-navigation/native';
import { useEffect } from 'react';
import {
  UserBadges,
  UserBadgesHandle,
} from '../components/UserBadges/UserBadges';
import {
  AllBeveragesHScroll,
  AllBeveragesHScrollHandle,
} from '../components/Stats/AllBeveragesHScroll';
import { useAuthContext } from '../hooks/context/AuthContext';

type Props = StaticScreenProps<{
  initialPopUpAchievementType?: AchievementType;
}>;

const StatsScreenComponent: React.FC<Props> = ({ route }: Props) => {
    const [session] = useAuthContext();
    const userBadges = React.useRef<UserBadgesHandle>(null);
    const initialPopUpAchievementType =
      route.params?.initialPopUpAchievementType;

    const allBeverages = React.useRef<AllBeveragesHScrollHandle | undefined>(undefined);

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
        <Header title="My Stats" />
        <BeveragePoursList
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
              <SectionHeader title="Recent Pours" />
            </Fragment>
          }
          onRefresh={onRefresh}
          queryOptions={{
            filters: [createFilter('owner/id').equals(`'${userID}'`)],
            orderBy: [{ column: 'id', direction: 'desc' }],
          }}
          testID="recent-pours-list"
        />
      </Container>
    );
};

export const StatsScreen = withErrorBoundary(StatsScreenComponent, ErrorScreen);
