// flow-typed signature: 996a974af14116f990a3eb92a25e404c
// flow-typed version: c6154227d1/hoist-non-react-statics_v2.x.x/flow_>=v0.104.x

declare module 'hoist-non-react-statics' {
  /*
    S - source component statics
    TP - target component props
    SP - additional source component props
  */
  declare module.exports: <TP, SP, S>(
    target: React$ComponentType<TP>,
    source: React$ComponentType<SP> & S,
    blacklist?: { [key: $Keys<S>]: boolean, ... }
  ) => React$ComponentType<TP> & $Shape<S>;
}
