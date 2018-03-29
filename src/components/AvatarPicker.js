// @flow

import type CachedImage from '../common/CachedImage';

import * as React from 'react';
import nullthrows from 'nullthrows';
import ImagePicker from 'react-native-image-picker';
import { observer } from 'mobx-react/native';
import AuthStore from '../stores/AuthStore';
import UserAvatar from '../common/avatars/UserAvatar';
import { UpdateAvatarStore } from '../stores/ApiRequestStores/CommonApiStores';
import { waitForLoaded } from '../stores/DAOStores';

const IMAGE_PICKER_OPTIONS = {
  title: 'SelectAvatar',
};

@observer
class AvatarPicker extends React.Component<{}> {
  _cachedImageRef: ?CachedImage;

  _onAvatarPress = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      async ({ data, didCancel, error }: Object): Promise<void> => {
        if (didCancel || error) {
          return;
        }

        await waitForLoaded(() => UpdateAvatarStore.get(data));
        nullthrows(this._cachedImageRef).flushCache();
      },
    );
  };

  _getAvatarImageRef = ref => {
    this._cachedImageRef = ref;
  };

  render() {
    return (
      <UserAvatar
        imageRef={this._getAvatarImageRef}
        onPress={this._onAvatarPress}
        size={200}
        userName={AuthStore.userName || ''}
      />
    );
  }
}

export default AvatarPicker;
