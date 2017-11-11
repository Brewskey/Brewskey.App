// @flow

import * as React from 'react';
import {
  CachedImage as RNCachedImage,
  ImageCache,
} from 'react-native-img-cache';

type Props = {
  source: { uri: string },
  // other image Props
};

class CachedImage extends React.Component<Props> {
  flushCache = () => {
    const uriWithoutQueryString = this.props.source.uri.split('?')[0];

    Object.keys(ImageCache.get().cache)
      .filter((cacheKey: string): boolean =>
        cacheKey.includes(uriWithoutQueryString),
      )
      .forEach((cacheKey: string) => {
        // todo this deletes only cached link(not file!) from cache.
        // in the ImageCache api there is only method for delete all
        // cached files at once (clear()).
        ImageCache.get().bust(cacheKey);
      });
  };

  render() {
    return <RNCachedImage {...this.props} mutable />;
  }
}

export default CachedImage;
