// @flow

import styled from 'styled-components/native';

// todo add z-depth with shadows etc

type Props = {|
  grow?: boolean,
|};

const Paper = styled.View`
  background-color: white;
  border-color: #eee;
  border-width: 1;
  flex: ${({ grow }: Props): number => (grow ? 1 : 0)};
  padding-horizontal: 5;
  padding-vertical: 5;
`;

export default Paper;
