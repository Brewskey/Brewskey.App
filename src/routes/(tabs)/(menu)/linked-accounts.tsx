import * as React from 'react';

import { RefreshControl, ScrollView } from 'react-native';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { LinkedAccountsSection } from 'components/LinkedAccountsSection';

const LinkedAccountsScreen: React.FC = () => {
  const [refreshState, setRefreshState] = React.useState<{
    isRefreshing: boolean;
    onRefresh: () => void;
  }>({
    isRefreshing: false,
    onRefresh: () => {},
  });

  return (
    <Container>
      <Header
        shouldShowBackButton
        testID="header-linked-accounts"
        title="Linked Login Providers"
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={refreshState.onRefresh}
            refreshing={refreshState.isRefreshing}
          />
        }
      >
        <LinkedAccountsSection onRefreshStateChange={setRefreshState} />
      </ScrollView>
    </Container>
  );
};

export default LinkedAccountsScreen;
