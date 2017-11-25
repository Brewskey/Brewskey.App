// @flow

import styled from 'styled-components/native';

type AlignItems = 'baseline' | 'center' | 'stretch' | 'flex-end' | 'flex-start';

type FlexDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse';

type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

type JustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'space-around'
  | 'space-between';

type Props = {
  alignItems?: AlignItems,
  flexDirection?: FlexDirection,
  flexWrap?: FlexWrap,
  justifyContent?: JustifyContent,
  paddedBottom?: boolean,
  paddedHorizontal?: boolean,
  paddedTop?: boolean,
  theme: Object,
};

const Row = styled.View`
  align-items: ${({ alignItems = 'stretch' }: Props): AlignItems => alignItems};
  flex-direction: ${({ flexDirection = 'row' }: Props): FlexDirection =>
    flexDirection};
  flex-wrap: ${({ flexWrap = 'nowrap' }: Props): FlexWrap => flexWrap};
  justify-content: ${({
    justifyContent = 'flex-start',
  }: Props): JustifyContent => justifyContent};
  padding-top: ${({ paddedTop }: Props): number => (paddedTop ? 15 : 0)};
  padding-bottom: ${({ paddedBottom }: Props): number =>
    paddedBottom ? 15 : 0};
  padding-horizontal: ${({ paddedHorizontal }: Props): number =>
    paddedHorizontal ? 15 : 0};
`;

export default Row;
