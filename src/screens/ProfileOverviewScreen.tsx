import type { Account, EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { StyleSheet, View } from 'react-native';
import { StaticScreenProps } from '@react-navigation/native';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';

import UserAvatar from '../common/avatars/UserAvatar';
import BeveragePoursList from '../components/poursLists/BeveragePoursList';
import { UserBadges } from '../components/UserBadges/UserBadges';
import SectionHeader from '../common/SectionHeader';
import { useGetAccountById } from '../hooks/queries/AccountQueries';
import LoadingIndicator from '../common/LoadingIndicator';

const styles = StyleSheet.create({
  // todo make separate components for such things
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
});

type Props = StaticScreenProps<{
  account?: Account;
  accountId?: EntityID;
}>;

const ProfileOverviewScreen: React.FC<Props> = ({
  route: {
    params: { account: accountFromParams, accountId: accountIdParam },
  },
}: Props) => {
  // Get account from route params or fetch by ID
  const accountId = accountIdParam || accountFromParams?.id;
  
  const { data: accountFromQuery, isLoading } = useGetAccountById(
    accountId && !accountFromParams ? accountId : undefined,
  );
  
  const account = accountFromParams || accountFromQuery;

  if (isLoading || !account) {
    return <LoadingIndicator />;
  }

  return (
    <BeveragePoursList
      ListHeaderComponent={
        <View>
          <View style={styles.avatarContainer}>
            <UserAvatar userName={account.userName} size={200} />
          </View>
          <SectionHeader title="Badges" />
          <UserBadges userID={account.id} />
          <SectionHeader title="Recent Pours" />
        </View>
      }
      queryOptions={{
        filters: [createFilter('owner/id').equals(account.id)],
        orderBy: [{ column: 'id', direction: 'desc' }],
      }}
    />
  );
};

export default withErrorBoundary(ProfileOverviewScreen, <ErrorScreen shouldShowBackButton />);
