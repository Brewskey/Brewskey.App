import * as React from 'react';

import { Image, ImageBackground, StyleSheet } from 'react-native';
import tinycolor from 'tinycolor2';

import { useGetBeverageById } from '../../hooks/queries/BeverageQueries';

import type { EntityID } from '@brewskey/js-api';

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

interface Props {
  beverageID: EntityID | null | undefined;
  level?: number;
}

const BEER_COLOR = '#ffd233';
const COFFEE_COLOR = '#4D2A22';
const CIDER_COLOR = '#e1c336';
const SODA_COLOR = '#711F25';

const Pint: React.FC<Props> = ({ beverageID, level = 100 }) => {
  const { data: beverage } = useGetBeverageById(beverageID);
  const _tintColor = (): string => {
    if (beverage == null) {
      return BEER_COLOR;
    }

    const hex = beverage.srm?.hex;
    if (hex != null) {
      return `#${hex}`;
    }

    switch (beverage.beverageType) {
      case 'Beer': {
        return BEER_COLOR;
      }
      case 'Coffee': {
        return COFFEE_COLOR;
      }
      case 'Cider': {
        return CIDER_COLOR;
      }
      case 'Soda': {
        return SODA_COLOR;
      }
      default: {
        return BEER_COLOR;
      }
    }
  };

  const colorToDarken = tinycolor(_tintColor());

  return (
    <ImageBackground
      source={require('../../resources/empty-glass.png')}
      style={styles.glass}
    >
      <Image
        source={require('../../resources/beer.png')}
        style={[
          styles.beerLevel,
          {
            height: `${level <= 98 ? level : 98}%`,
            tintColor: _tintColor(),
          },
        ]}
      />
      <Image
        source={require('../../resources/beer-bottom.png')}
        style={[
          styles.beerLevel,
          {
            height: `${level <= 98 ? level : 98}%`,
            tintColor: colorToDarken
              .darken(colorToDarken.isLight() ? 10 : 5)
              .toString(),
          },
        ]}
      />
    </ImageBackground>
  );
};

export { Pint };
