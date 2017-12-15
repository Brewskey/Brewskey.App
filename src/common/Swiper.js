// @flow
// add controlled behavior to react-native-swiper
// https://github.com/leecade/react-native-swiper/issues/163

import * as React from 'react';
import RNSwiper from 'react-native-swiper';

type Props = {
  index: number,
  onIndexChanged: (index: number) => void,
  // other rnSwiper props
};

class Swiper extends React.PureComponent<Props> {
  _index: number = 0;
  _swiperRef: RNSwiper;

  constructor(props: Props) {
    super(props);
    const { index } = this.props;
    this._index = index;
  }

  componentWillReceiveProps({ index }: Props) {
    if (index !== this._index) {
      const difference = index - this._index;
      this._swiperRef.scrollBy(difference);
    }
  }

  _getRNSwiperRef = ref => (this._swiperRef = ref);

  _onIndexChanged = (newIndex: number) => {
    this._index = newIndex;
    this.props.onIndexChanged(newIndex);
  };

  render() {
    return (
      <RNSwiper
        {...this.props}
        onIndexChanged={this._onIndexChanged}
        ref={this._getRNSwiperRef}
      />
    );
  }
}

export default Swiper;
