import * as React from 'react';

type Props = {
  children?: React.ReactNode
};

class Fragment extends React.PureComponent<Props> {
  render(): React.ReactElement {
    return this.props.children ?? null;
  }
}

export default Fragment;
