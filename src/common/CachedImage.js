// @flow

import * as React from 'react';
import {
  CachedImage as RNCachedImage,
  ImageCache,
} from 'react-native-img-cache';

export const flushImageCache = (uri: string): void => {
  const uriWithoutBrewskeyApiParams =
    (uri.match(/=?(\/?.*\.jpg)/) || [])[0] || uri;

  if (!uriWithoutBrewskeyApiParams) {
    return;
  }

  Object.keys(ImageCache.get().cache)
    .filter((cacheKey: string): boolean =>
      cacheKey.includes(uriWithoutBrewskeyApiParams),
    )
    .forEach((cacheKey: string) => {
      // todo this deletes only cached link(not file!) from cache.
      // in the ImageCache api there is only method for delete all
      // cached files at once (clear()).
      ImageCache.get().bust(cacheKey);
    });
};

class CachedImage extends React.Component<
  React.ElementProps<typeof RNCachedImage>,
> {
  static defaultProps: {| mutable: boolean |} = {
    mutable: true,
  };

  flushCache: () => void = (): void => flushImageCache(this.props.source.uri);

  render(): React.Node {
    return <RNCachedImage {...this.props} />;
  }
}

export default CachedImage;
