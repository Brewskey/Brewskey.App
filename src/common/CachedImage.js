// @flow

import * as React from 'react';
import {
  CachedImage as RNCachedImage,
  ImageCache,
} from 'react-native-img-cache';

type Props = {
  mutable?: boolean,
  source: { uri: string },
  // other image Props
};

export const flushImageCache = (uri: string) => {
  const uriWithoutBrewskeyApiParams = uri.match(/=?(\/?.*\.jpg)/)[0];

  Object.keys(ImageCache.get().cache)
    .filter(
      (cacheKey: string): boolean =>
        cacheKey.includes(uriWithoutBrewskeyApiParams),
    )
    .forEach((cacheKey: string) => {
      // todo this deletes only cached link(not file!) from cache.
      // in the ImageCache api there is only method for delete all
      // cached files at once (clear()).
      ImageCache.get().bust(cacheKey);
    });
};

class CachedImage extends React.Component<Props> {
  static defaultProps = {
    mutable: true,
  };

  flushCache = () => flushImageCache(this.props.source.uri);

  render() {
    return <RNCachedImage {...this.props} mutable={this.props.mutable} />;
  }
}

export default CachedImage;
