import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import BeverageAvatar from '../common/avatars/BeverageAvatar';

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  allowsEditing: true,
  base64: true,
  aspect: [1, 1],
  quality: 1,
  mediaTypes: ['images'],
} as const;

type Props = {
  beverageId: EntityID | null | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  onChange: (imageData?: string | null | undefined) => void;
  value: string | null | undefined;
};

const BeverageImagePickerField: React.FC<Props> = ({
  beverageId,
  containerStyle,
  onChange,
  value,
}) => {
  const handleAvatarPress = React.useCallback(async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);
    
    if (result.canceled || !result.assets || !result.assets[0]) {
      return;
    }

    onChange(result.assets[0].base64 || null);
  }, [onChange]);

  return (
    <BeverageAvatar
      beverageId={beverageId}
      cached={false}
      containerStyle={containerStyle}
      onPress={handleAvatarPress}
      rounded={true}
      size={250}
      uri={value ? `data:image/jpeg;base64,${value}` : null}
    />
  );
};

export default BeverageImagePickerField;
