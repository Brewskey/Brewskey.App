// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Style } from '../types';

import * as React from 'react';
import ImagePicker from 'react-native-image-picker';
import { observer } from 'mobx-react';
import BeverageAvatar from '../common/avatars/BeverageAvatar';

const IMAGE_PICKER_OPTIONS = {
  allowsEditing: true,
  maxHeight: 1024,
  maxWidth: 1024,
  mediaType: 'photo',
  rotation: 0,
  storageOptions: {
    cameraRoll: false,
    skipBackup: true,
    waitUntilSaved: true,
  },
  title: 'Select beverage photo',
};

type Props = {
  beverageId: ?EntityID,
  containerStyle?: Style,
  onChange: (imageData: ?string) => void,
  value: ?string,
};

@observer
class BeverageImagePickerField extends React.Component<Props> {
  _onAvatarPress = () => {
    const { onChange } = this.props;
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (result): void => {
      const { didCancel, error } = result;
      if (didCancel || error) {
        return;
      }

      onChange(result.data);
    });
  };

  render(): React.Node {
    const { beverageId, containerStyle, value } = this.props;

    return (
      <BeverageAvatar
        beverageId={beverageId}
        cached={false}
        containerStyle={containerStyle}
        onPress={this._onAvatarPress}
        size={250}
        uri={value ? `data:image/jpeg;base64,${value}` : null}
      />
    );
  }
}

export default BeverageImagePickerField;
