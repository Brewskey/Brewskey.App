import * as React from 'react';

import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Container } from 'common/Container';
import { Fragment } from 'common/Fragment';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 200,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});

interface Props {
  canEdit: boolean;
  tapId: EntityID;
}

export const TapDetailsNoKeg: React.FC<Props> = ({ tapId, canEdit }) => {
  const router = useRouter();
  const _onSetupPress = () =>
    router.navigate({
      pathname: '/(tabs)/taps/[tapId]/keg/new',
      params: { tapId: tapId.toString() },
    });

  return (
    <Container centered style={styles.container}>
      {canEdit ? (
        <Fragment>
          <Text style={styles.text}>You don't have kegs on the tap.</Text>
          <TouchableOpacity
            onPress={_onSetupPress}
            testID="button-create-new-keg"
          >
            <Text style={[styles.text, styles.textLink]}>
              Click to setup one.
            </Text>
          </TouchableOpacity>
        </Fragment>
      ) : (
        <Text style={styles.text}>No keg on the tap.</Text>
      )}
    </Container>
  );
};
