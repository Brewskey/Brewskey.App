// flow-typed signature: 18380daf2d6f68ed753fb5d9da738d7c
// flow-typed version: <<STUB>>/react-native-code-push_v^6.2.0/flow_v0.125.1

declare module 'react-native-code-push' {
  declare type CodePushOptions = {|
    foo: string,
  |};
  declare type UpdateMetadata = {|
    appVersion: string,
    label: string,
  |};
  declare type CodePush = {|
    (options?: CodePushOptions): (x: any) => any,
    getUpdateMetadata: () => Promise<UpdateMetadata>,
  |};
  declare export default CodePush;
}
