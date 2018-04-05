// @flow

import * as React from 'react';
import { ImageBackground, Image, StyleSheet } from 'react-native';
import BeerImage from '../../resources/beer.png';
import EmptyGlassImage from '../../resources/empty-glass.png';

const styles = StyleSheet.create({
  beerLevel: {
    bottom: 2,
    position: 'absolute',
  },
  glass: {
    height: 40,
    marginHorizontal: 1,
    width: 23,
  },
});

type Props = {|
  level?: number,
|};

const Pint = ({ level = 100 }: Props) => (
  <ImageBackground source={EmptyGlassImage} style={styles.glass}>
    <Image
      source={BeerImage}
      style={[styles.beerLevel, { height: `${level <= 98 ? level : 98}%` }]}
    />
  </ImageBackground>
);

export default Pint;
