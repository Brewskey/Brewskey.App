// @flow

import * as React from 'react';
import styled from 'styled-components/native';

const HeaderTextContainer = styled.Text`
  border-bottom-color: #bbb;
  border-bottom-width: 1;
  padding-vertical: 6;
  text-align: center;
`;

type Props = {|
  title: string,
|};

class ListSectionHeader extends React.PureComponent<Props> {
  render() {
    return <HeaderTextContainer>{this.props.title}</HeaderTextContainer>;
  }
}

export default ListSectionHeader;
