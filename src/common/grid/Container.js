// @flow

import styled from 'styled-components/native';

type Props = {
  padded?: boolean,
  paddedHorizontal?: boolean,
  paddedVertical?: boolean,
  theme: Object,
};

const Container = styled.View`
  padding-horizontal: ${({ padded, paddedHorizontal }: Props): number =>
    padded || paddedHorizontal ? 15 : 0};
  padding-vertical: ${({ padded, paddedVertical }: Props): number =>
    padded || paddedVertical ? 15 : 0};
`;

export default Container;
