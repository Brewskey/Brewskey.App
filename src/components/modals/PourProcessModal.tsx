import * as React from 'react';

import { Input } from '@rneui/themed';
import { Platform, StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useInterval } from 'usehooks-ts';

import { TouchableItem } from 'common/buttons/TouchableItem';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { CenteredModal } from 'components/modals/CenteredModal';
import { usePourModalContext } from 'hooks/context/PourProcessContext';
import { getNfcManager } from 'services/nfc';
import { COLORS } from 'theme';

import type { TextStyle } from 'react-native';

const styles = StyleSheet.create({
  enableNFCContainer: {
    marginBottom: 12,
  },
  enableNFCText: {
    color: COLORS.textInverse,
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: COLORS.danger2,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  headerText: {
    color: COLORS.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    color: COLORS.textInverse,
    marginTop: 12,
    textAlign: 'center',
    width: '85%',

    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none' } as unknown as TextStyle)
      : {}),
  },
  loadingIndicator: {
    height: 120,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: { color: COLORS.textInverse, fontSize: 30, fontWeight: 'bold' },
  root: {
    alignItems: 'center',
    width: 200,
  },
  smallText: {
    color: COLORS.textInverse,
    borderColor: COLORS.textInverse,
    fontSize: 12,
    marginTop: 12,
  },
});

const PourProcessInputModal: React.FC = () => {
  const [totp, setTotp] = React.useState<string>('');
  const {
    isNFCEnabled,
    isNFCSupported,
    isLoading,
    isVisible,
    closeModal,
    startPourAuthorization,
    pourErrorText,
    clearError,
  } = usePourModalContext();

  const [currentSeconds, setCurrentSeconds] = React.useState<number>(
    30 - (new Date().getSeconds() % 30),
  );
  useInterval(() => {
    setCurrentSeconds(30 - (new Date().getSeconds() % 30));
  }, 1000);

  React.useEffect(() => {
    if (isVisible) {
      setTotp('');
    }
  }, [isVisible]);

  const onInputChanged = async (value: string) => {
    setTotp(value);
    clearError();
    if (value.length === 6) {
      await startPourAuthorization(value);
    }
  };

  const onHideModal = async () => closeModal();

  const onEnableNFC = async () => {
    const nfc = getNfcManager() as {
      default?: { goToNfcSetting?: () => Promise<void> };
      goToNfcSetting?: () => Promise<void>;
    } | null;
    const manager = nfc?.default ?? nfc;
    await manager?.goToNfcSetting?.();
  };

  const headerText = isNFCEnabled ? 'Tap phone to pour' : 'Enter code to pour';

  return (
    <CenteredModal
      header={<Text style={styles.headerText}>{headerText}</Text>}
      isVisible={isVisible}
      onHideModal={onHideModal}
      testID="pour-process-modal"
    >
      <View style={styles.root}>
        {isNFCSupported && !isNFCEnabled ? (
          <TouchableItem
            onPress={onEnableNFC}
            style={styles.enableNFCContainer}
          >
            <Text style={styles.enableNFCText}>
              or press here to enable NFC on your device
            </Text>
          </TouchableItem>
        ) : null}
        <View style={styles.progressContainer}>
          {isLoading ? (
            <LoadingIndicator
              activitySize="large"
              color="white"
              style={styles.loadingIndicator}
            />
          ) : (
            <Progress.Circle
              showsText
              borderWidth={0}
              color="#fa0"
              formatText={() => currentSeconds}
              progress={currentSeconds / 30}
              size={120}
              textStyle={styles.progressText}
              thickness={16}
              unfilledColor="#1d5f68"
            />
          )}
        </View>
        {isNFCEnabled ? (
          <Text style={styles.smallText}>or enter a code</Text>
        ) : null}
        <Input
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          editable={!isLoading}
          enablesReturnKeyAutomatically={false}
          keyboardType="numeric"
          maxLength={6}
          onChangeText={onInputChanged}
          selectionColor={COLORS.textInverse}
          style={styles.input}
          testID="pour-modal-totp-input"
          underlineColorAndroid={COLORS.secondary}
          value={totp}
        />
        <Text style={styles.errorText}>{pourErrorText ?? ''}</Text>
      </View>
    </CenteredModal>
  );
};

export const PourProcessModal: React.FC = () => {
  const { shouldShowPaymentScreen } = usePourModalContext();
  return shouldShowPaymentScreen ? null : ( // <PourProcessPaymentModal />
    <PourProcessInputModal />
  );
};
