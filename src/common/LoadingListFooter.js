// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

const Container = styled.View`
  align-items: center;
  padding-vertical: 10;
`;

type Props = {|
  isLoading: boolean,
|};

class LoadingListFooter extends React.PureComponent<Props> {
  render() {
    return !this.props.isLoading ? null : (
      <Container>
        <ActivityIndicator size="large" />
      </Container>
    );
  }
}

export default LoadingListFooter;
