// @flow

import * as React from 'react';
// imported from experimental sources
// eslint-disable-next-line
import SwipeableRow from 'SwipeableRow';

type Props = {
  extraData?: any,
  isOpen: boolean,
};

class PureSwipeableRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.isOpen !== nextProps.isOpen ||
      this.props.extraData !== nextProps.extraData
    );
  }

  render() {
    return <SwipeableRow {...this.props} />;
  }
}

export default PureSwipeableRow;
