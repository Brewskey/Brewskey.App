// @flow

import styled from 'styled-components/native';

const StubAvatar = styled.View`
  background-color: #eee;
  border-radius: ${({ rounded, size }: Object): number =>
    rounded ? size / 2 : 10};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

export default StubAvatar;
