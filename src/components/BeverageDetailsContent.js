// @flow

import type { Beverage } from 'brewskey.js-api';

import * as React from 'react';
import { Dimensions, Image, Text, StyleSheet, View } from 'react-native';
import CacheImage from '../common/CachedImage';
import CONFIG from '../config';
import { COLORS, TYPOGRAPHY } from '../theme';
import OverviewItem from '../common/OverviewItem';
import Fragment from '../common/Fragment';
import LoadingIndicator from '../common/LoadingIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BEVERAGE_IMAGE_HORIZONTAL_MARGIN = 12;
const BEVERAGE_IMAGE_SIZE = SCREEN_WIDTH - BEVERAGE_IMAGE_HORIZONTAL_MARGIN * 2;

const styles = StyleSheet.create({
  beverageImage: {
    borderColor: COLORS.secondary3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  descriptionText: {
    ...TYPOGRAPHY.paragraph,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.secondary2,
    borderColor: COLORS.secondary3,
    marginBottom: 12,
    marginHorizontal: BEVERAGE_IMAGE_HORIZONTAL_MARGIN,
    overflow: 'hidden',
  },
});

type Props = {|
  beverage: Beverage,
|};

type State = {|
  height: number,
  width: number,
|};

class BeverageDetailsContent extends React.Component<Props, State> {
  state: State = {
    height: 0,
    width: BEVERAGE_IMAGE_SIZE,
  };

  constructor(props: Props) {
    super(props);
    this._getSize();
  }

  _getURI = () =>
    `${
      CONFIG.CDN
    }beverages/${this.props.beverage.id.toString()}-large.jpg?w=${BEVERAGE_IMAGE_SIZE}&trim.threshold=80&mode=crop`;

  _getSize = () => {
    Image.getSize(this._getURI(), (width, height) => {
      const calculatedHeight = (BEVERAGE_IMAGE_SIZE / width) * height;
      this.setState({
        height: Math.min(calculatedHeight, BEVERAGE_IMAGE_SIZE * 1.5),
      });
    });
  };

  render(): React.Node {
    const {
      beverage: { beverageType, description, glass, isOrganic, style },
    } = this.props;

    const { height, width } = this.state;

    const imageSize = { height, width };

    return (
      <Fragment>
        <View style={[styles.imageContainer, styles.beverageImage, imageSize]}>
          <CacheImage
            loadingIndicator={LoadingIndicator}
            style={[styles.beverageImage, imageSize]}
            source={{
              uri: this._getURI(),
            }}
          />
        </View>
        <Text style={styles.descriptionText}>{description}</Text>
        <OverviewItem title="Type" value={beverageType} />
        {style ? <OverviewItem title="Style" value={style.name} /> : null}
        {glass ? <OverviewItem title="Glass" value={glass.name} /> : null}
        <OverviewItem title="Organic?" value={isOrganic ? 'Yes' : 'No'} />
      </Fragment>
    );
  }
}

export default BeverageDetailsContent;
