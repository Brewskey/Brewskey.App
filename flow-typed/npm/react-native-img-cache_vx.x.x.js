// flow-typed signature: 8c7b964e52de95e2b887f748891890d7
// flow-typed version: <<STUB>>/react-native-img-cache_vhttps://github.com/Brewskey/react-native-img-cache/flow_v0.125.1

declare module 'react-native-img-cache' {
  declare type CacheHandler = (path: string) => void;

  declare type CachedImageURISource = {|
    uri: string,
  |};

  declare type CacheEntry = {
    source: CachedImageURISource,
    downloading: boolean,
    handlers: Array<CacheHandler>,
    path?: string,
    immutable: boolean,
    task?: any,
  };

  declare type CachedImageProps = {|
    mutable?: boolean,
    indicator?: React$ComponentType<any>,
    source: CachedImageURISource,
    style: Object,
  |};
  declare export class CachedImage extends React$Component<CachedImageProps> {}

  declare export class ImageCache {
    static get(): ImageCache;
    bust(uri: string): void;
    cache: { [key: string]: CacheEntry };
    clear(): void;
  }
}
