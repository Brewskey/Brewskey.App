import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import Fragment from '../common/Fragment';
import Container from '../common/Container';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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

type Props = {
  canEdit: boolean;
  tapId: EntityID;
};

export const TapDetailsNoKeg: React.FC<Props> = ({ tapId, canEdit }) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  const _onSetupPress = () =>
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'newKeg',
        params: {
          tapId,
        },
      },
    });

  return (
    <Container centered style={styles.container}>
      {canEdit ? (
        <Fragment>
          <Text style={styles.text}>You don't have kegs on the tap.</Text>
          <TouchableOpacity onPress={_onSetupPress}>
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
