import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { StyleSheet, View } from 'react-native';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { SectionHeader } from 'common/SectionHeader';
import { BeveragePoursList } from 'components/poursLists/BeveragePoursList';
import { UserBadges } from 'components/UserBadges/UserBadges';
import { useGetAccountById } from 'hooks/queries/AccountQueries';

import type { Account, EntityID } from '@brewskey/js-api';
import type { StaticScreenProps } from '@react-navigation/native';

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

const ProfileOverviewScreenComponent: React.FC<Props> = ({
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
            <UserAvatar size={200} userName={account.userName} />
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

const ProfileOverviewScreen = withErrorBoundary(
  ProfileOverviewScreenComponent,
  <ErrorScreen shouldShowBackButton />,
);
export { ProfileOverviewScreen };
