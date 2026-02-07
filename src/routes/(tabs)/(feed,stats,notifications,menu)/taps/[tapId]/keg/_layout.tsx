import * as React from 'react';

import { Stack } from 'expo-router';

const KegLayout: React.FC = () => (
  <Stack
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="index" />
    <Stack.Screen name="new" />
  </Stack>
);

export default KegLayout;
