// @flow

import type CachedImage from '../common/CachedImage';

import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import nullthrows from 'nullthrows';
import { launchImageLibrary } from 'react-native-image-picker';
import { observer } from 'mobx-react';
import { action, computed, observable, runInAction, when } from 'mobx';
import AuthStore from '../stores/AuthStore';
import SnackBarStore from '../stores/SnackBarStore';
import { updateAvatar } from '../stores/ApiRequestStores/CommonApiStores';
import UserAvatar from '../common/avatars/UserAvatar';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../theme';
import { Icon } from 'react-native-elements';

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
  includeBase64: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
  rotation: 0,
  title: 'Select Avatar',
};

@observer
class AvatarPicker extends React.Component<{||}> {
  _cachedImageRef = React.createRef();

  @observable
_isLoading = false;


@action
_onAvatarPress = () => {
  const flushCache = this._cachedImageRef?.current.flushCache;
  launchImageLibrary(
    IMAGE_PICKER_OPTIONS,
    async ({ base64, didCancel, error }: Object): Promise<void> => {
      if (didCancel || error) {
        return;
      }

      runInAction(async () => {
        this._isLoading = true;
      });
      await updateAvatar(base64);

      runInAction(async () => {
        this._isLoading = false;
        flushCache();
        SnackBarStore.showMessage({ text: 'Avatar updated' });
      });
    },
  );
};

render(): React.Node {
  return this._isLoading ? (
    <LoadingIndicator style={styles.loadingIndicator} />
  ) : (
    <TouchableOpacity onPress={this._onAvatarPress}>
      <UserAvatar
        cached={true}
        imageRef={this._cachedImageRef}
        size={200}
        userName={AuthStore.userName || ''}
      />
      <Icon
        color={COLORS.textInverse}
        name="add-a-photo"
        reverse
        reverseColor={COLORS.primary3}
        size={20}
        raised={true}
        containerStyle={{
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      />
    </ TouchableOpacity>
  );
}
}

export default AvatarPicker;
