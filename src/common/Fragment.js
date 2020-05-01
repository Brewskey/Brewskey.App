// @flow

import * as React from 'react';

type Props = {|
  children?: React.Node,
|};

class Fragment extends React.PureComponent<Props> {
  render(): React.Node {
    return this.props.children ?? null;
  }
}

export default Fragment;
