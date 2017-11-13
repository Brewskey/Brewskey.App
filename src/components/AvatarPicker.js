// @flow

import type AuthStore from '../stores/AuthStore';
import type CachedImage from '../common/CachedImage';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import nullthrows from 'nullthrows';
import ImagePicker from 'react-native-image-picker';
import { inject, observer } from 'mobx-react';
import UserAvatar from '../common/avatars/UserAvatar';
import CommonApi from '../CommonApi';

const IMAGE_PICKER_OPTIONS = {
  title: 'SelectAvatar',
};

type InjectedProps = {|
  authStore: AuthStore,
|};

@inject('authStore')
@observer
class AvatarPicker extends InjectedComponent<InjectedProps> {
  _cachedImageRef: ?CachedImage;

  _onAvatarPress = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      async ({ data, didCancel, error }: Object): Promise<void> => {
        if (didCancel || error) {
          return;
        }

        await CommonApi.updateAvatar(data);
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
        userName={this.injectedProps.authStore.userName || ''}
      />
    );
  }
}

export default AvatarPicker;
