// flow-typed signature: 7ddb30f6e66062d2c31521b5f533e37f
// flow-typed version: <<STUB>>/react-native-maps_v^0.27.1/flow_v0.125.1

declare module 'react-native-maps' {
  declare type Coordinates = {|
    latitude: number,
    longitude: number,
  |};
  declare type Region = {|
    ...Coordinates,
    latitudeDelta: number,
    longitudeDelta: number,
  |};
  declare type MarkerProps = {|
    coordinate: Coordinates,
  |};
  declare type MapViewProps = {|
    children: React$Node,
    initialRegion?: Region,
    style?: Object,
  |};

  declare export class Marker extends React$Component<MarkerProps> {}

  declare export default class MapView extends React$Component<MapViewProps> {
    static Marker: typeof Marker;
  }
}
