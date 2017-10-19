// @flow

import * as React from 'react';
// imported from experimental sources
// eslint-disable-next-line
import SwipeableRow from 'SwipeableRow';

type Props = {
  // todo fill the props
};

class PureSwipeableRow extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props): boolean {
    return (
      this.props.isOpen !== nextProps.isOpen ||
      this.props.extraData !== nextProps.extraData
    );
  }

  render(): React.Element<*> {
    return <SwipeableRow {...this.props} />;
  }
}

export default PureSwipeableRow;
