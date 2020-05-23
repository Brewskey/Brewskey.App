// flow-typed signature: bb0717ecf9921badea93ce70facd0199
// flow-typed version: <<STUB>>/react-native-progress_v^4.1.2/flow_v0.125.1

declare module 'react-native-progress' {
  declare type CircleProps = {|
    animated?: boolean,
    borderColor?: string,
    borderWidth?: number,
    color?: string,
    children?: React$Node,
    direction?: 'clockwise' | 'counter-clockwise',
    fill?: string,
    formatText?: (number | string) => number | string,
    indeterminate?: boolean,
    progress?: number | any,
    rotation?: any,
    showsText?: boolean,
    size?: number,
    style?: Object,
    strokeCap?: 'butt' | 'square' | 'round',
    textStyle?: Object,
    thickness?: number,
    unfilledColor?: string,
    endAngle?: number,
    allowFontScaling?: boolean,
  |};
  declare export class Circle extends React$Component<CircleProps> {}
}
