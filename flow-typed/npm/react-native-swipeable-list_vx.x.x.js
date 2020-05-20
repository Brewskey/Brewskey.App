// flow-typed signature: 79af8137a71ca98af1056647f6d25b4a
// flow-typed version: <<STUB>>/react-native-swipeable-list_v^0.0.9/flow_v0.125.1

// @flow

declare module 'react-native-swipeable-list' {
  declare type SwipeableRowProps = $ReadOnly<{|
    children?: ?React$Node,
    isOpen?: ?boolean,
    maxSwipeDistance?: ?number,
    onClose?: ?() => void,
    onOpen?: ?() => void,
    onSwipeEnd?: ?() => void,
    onSwipeStart?: ?() => void,
    preventSwipeRight?: ?boolean,
    shouldBounceOnMount?: ?boolean,
    slideoutView?: ?React$Node,
    swipeThreshold?: ?number,
  |}>;

  declare export class SwipeableRow extends React$Component<
    SwipeableRowProps,
    any,
  > {}
}
