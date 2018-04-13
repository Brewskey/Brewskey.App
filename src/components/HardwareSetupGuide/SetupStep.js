// @flow

import * as React from 'react';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';
import Fragment from '../../common/Fragment';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  image: {
    height: Dimensions.get('window').width - 150,
    maxHeight: 300,
    maxWidth: 300,
    width: Dimensions.get('window').width - 150,
  },
  instructionText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textInverse,
    paddingHorizontal: 40,
    paddingVertical: 40,
    textAlign: 'center',
  },
  titleText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingHorizontal: 40,
    paddingVertical: 40,
    textAlign: 'center',
  },
});

type Props = {|
  description: string,
  image: number,
  title: string,
|};

const SetupStep = ({ description, image, title }: Props) => (
  <Fragment>
    <Text style={styles.titleText}>{title}</Text>
    <Image style={styles.image} source={image} />
    <Text style={styles.instructionText}>{description}</Text>
  </Fragment>
);

export default SetupStep;
