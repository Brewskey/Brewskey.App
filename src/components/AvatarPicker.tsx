import * as React from 'react';
import { useState } from 'react';

import { Icon } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { CONFIG } from 'config';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { COLORS } from 'theme';

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

const IMAGE_PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  allowsEditing: true,
  base64: true,
  aspect: [1, 1],
  quality: 1,
  mediaTypes: ['images'],
} as const;

const AvatarPicker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const addSnackBarMessage = useAddSnackBarMessage();
  const { data: authResponse } = useAuthSession();

  const onAvatarPress = async () => {
    // Request permissions
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      addSnackBarMessage({
        content: 'Permission to access media library is required.',
        style: 'danger',
      });
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const { base64 } = result.assets[0];
    if (!base64) {
      return;
    }

    setIsLoading(true);
    try {
      // Update avatar using direct fetch call
      await fetch(`${CONFIG.HOST}/api/profile/photo/`, {
        body: JSON.stringify({ photo: base64 }),
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${authResponse?.accessToken || ''}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      });
      // Force re-render by updating key or state
      addSnackBarMessage({ content: 'Avatar updated' });
    } catch (fetchError) {
      addSnackBarMessage({
        content:
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to update avatar',
        style: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }

  return (
    <TouchableOpacity onPress={onAvatarPress}>
      <UserAvatar size={200} userName={authResponse?.userName || ''} />
      <Icon
        raised
        reverse
        color={COLORS.textInverse}
        name="add-a-photo"
        reverseColor={COLORS.primary3}
        size={20}
        containerStyle={{
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
      />
    </TouchableOpacity>
  );
};

export { AvatarPicker };
