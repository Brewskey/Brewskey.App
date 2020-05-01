// @flow

import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TYPOGRAPHY } from '../../../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  description: { ...TYPOGRAPHY.paragraph },
  image: { height: 300, width: '100%' },
  title: { ...TYPOGRAPHY.heading },
});

type Props = {|
  description: string,
  image: ?number,
  title: string,
|};

const FlowSensorSwiperItem = ({
  description,
  image,
  title,
}: Props): React.Node => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Image source={image} style={styles.image} resizeMode="contain" />
    <Text style={styles.description}>{description}</Text>
  </View>
);

export default FlowSensorSwiperItem;
