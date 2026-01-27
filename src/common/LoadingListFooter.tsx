import * as React from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 15,
  },
});

interface Props {
  isLoading: boolean;
}

const LoadingListFooter: React.FC<Props> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export { LoadingListFooter };
