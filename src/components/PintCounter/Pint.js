// @flow

import type { EntityID } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { ImageBackground, Image, StyleSheet } from 'react-native';
import BeerImage from '../../resources/beer.png';
import BeerAlphaImage from '../../resources/beer-bottom.png';
import EmptyGlassImage from '../../resources/empty-glass.png';
import { BeverageStore } from '../../stores/DAOStores';
import tinycolor from 'tinycolor2';

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
  beverageID: ?EntityID,
  level?: number,
|};

const BEER_COLOR = '#ffd233';
const COFFEE_COLOR = '#4D2A22';
const CIDER_COLOR = '#e1c336';
const SODA_COLOR = '#711F25';

@observer
class Pint extends React.Component<Props> {
  @computed
  get _tintColor(): string {
    const { beverageID } = this.props;

    if (beverageID == null) {
      return BEER_COLOR;
    }

    return (
      BeverageStore.getByID(beverageID)
        .map((beverage) => {
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
        })
        .getValue() || BEER_COLOR
    );
  }

  render(): React.Node {
    const { level = 100 } = this.props;
    const colorToDarken = tinycolor(this._tintColor);

    return (
      <ImageBackground source={EmptyGlassImage} style={styles.glass}>
        <Image
          source={BeerImage}
          style={[
            styles.beerLevel,
            {
              height: `${level <= 98 ? level : 98}%`,
              tintColor: this._tintColor,
            },
          ]}
        />
        <Image
          source={BeerAlphaImage}
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
  }
}

export default Pint;
