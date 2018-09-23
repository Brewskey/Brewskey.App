// @flow

import type CachedImage from '../common/CachedImage';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import nullthrows from 'nullthrows';
import * as ImagePicker from 'react-native-image-picker';
import { observer } from 'mobx-react/native';
import { computed, observable, runInAction, when } from 'mobx';
import AuthStore from '../stores/AuthStore';
import SnackBarStore from '../stores/SnackBarStore';
import { UpdateAvatarStore } from '../stores/ApiRequestStores/CommonApiStores';
import UserAvatar from '../common/avatars/UserAvatar';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  loadingIndicator: {
    alignItems: 'center',
    backgroundColor: COLORS.secondary2,
    borderRadius: 100,
    height: 200,
    justifyContent: 'center',
    width: 200,
  },
});

const IMAGE_PICKER_OPTIONS = {
  allowsEditing: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
  rotation: 0,
  title: 'Select Avatar',
};

@observer
class AvatarPicker extends React.Component<{}> {
  _cachedImageRef: ?CachedImage;

  @observable
  _updateAvatarCacheKey = null;

  @computed
  get _isLoading(): boolean {
    return this._updateAvatarCacheKey
      ? UpdateAvatarStore.getFromCache(this._updateAvatarCacheKey).isLoading()
      : false;
  }

  _onAvatarPress = () => {
    ImagePicker.showImagePicker(
      IMAGE_PICKER_OPTIONS,
      async ({ data, didCancel, error }: Object): Promise<void> => {
        if (didCancel || error) {
          return;
        }

        runInAction(async () => {
          this._updateAvatarCacheKey = UpdateAvatarStore.fetch(data);
          await when(() => !this._isLoading);
          nullthrows(this._cachedImageRef).flushCache();
          SnackBarStore.showMessage({ text: 'Avatar updated' });
        });
      },
    );
  };

  _getAvatarImageRef = ref => {
    this._cachedImageRef = ref;
  };

  render() {
    return this._isLoading ? (
      <LoadingIndicator style={styles.loadingIndicator} />
    ) : (
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
