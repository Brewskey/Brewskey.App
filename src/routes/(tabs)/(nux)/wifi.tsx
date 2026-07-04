import * as React from 'react';

import { Icon } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
});

const NuxWifiScreen: React.FC = () => {
  const router = useRouter();
  const { locationId } = useLocalSearchParams<{
    locationId?: string;
  }>();

  const handlePress = () => {
    router.navigate({
      pathname: '/devices/[id]/wifi-setup',
      params: {
        id: 'new',
        forNewDevice: 'true',
        returnTo: 'nux-device',
        locationId,
      },
    });
  };

  return (
    <Container>
      <Header title="2. Setup Wifi" />
      <View style={styles.container} testID="nux-wifi-content">
        <Icon
          // rneui v5 typings dropped the vector-icon props after the
          // vector-icons migration; the runtime still forwards them.
          {...{ color: COLORS.textInverse, name: 'wifi', size: 200 }}
          containerStyle={styles.iconContainer}
        />
        <Text style={styles.descriptionText} testID="nux-wifi-description">
          Next, you need to setup WiFi on your Brewskey box.
        </Text>
        <Button
          secondary
          onPress={handlePress}
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default NuxWifiScreen;
