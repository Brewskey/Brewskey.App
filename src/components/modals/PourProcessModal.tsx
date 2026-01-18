import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Input } from '@rneui/themed';

import * as Progress from 'react-native-progress';
import { COLORS } from '../../theme';
import { useInterval } from 'usehooks-ts';
import NfcManager from 'react-native-nfc-manager';
import TouchableItem from '../../common/buttons/TouchableItem';
import LoadingIndicator from '../../common/LoadingIndicator';
import { usePourModalContext } from '../../hooks/context/PourProcessContext';
import CenteredModal from './CenteredModal';

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
     
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
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
    setVisibility,
    startPourAuthorization,
    pourErrorText,
    setContextData,
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
  }, [isVisible, setTotp]);

  const onInputChanged = async (value: string) => {
    setTotp(value);
    setContextData({
      pourErrorText: null,
    });
    if (value.length === 6) {
      await startPourAuthorization(value);
    }
  };

  const onHideModal = () => setVisibility(false);

  const onEnableNFC = async () => {
    await NfcManager.goToNfcSetting();
  };

  const headerText = isNFCEnabled ? 'Tap phone to pour' : 'Enter code to pour';

  return (
    <CenteredModal
      header={<Text style={styles.headerText}>{headerText}</Text>}
      onHideModal={onHideModal}
      isVisible={isVisible}
    >
      <View style={styles.root}>
        {isNFCSupported && !isNFCEnabled && (
          <TouchableItem
            onPress={onEnableNFC}
            style={styles.enableNFCContainer}
          >
            <Text style={styles.enableNFCText}>
              or press here to enable NFC on your device
            </Text>
          </TouchableItem>
        )}
        <View style={styles.progressContainer}>
          {isLoading ? (
            <LoadingIndicator
              activitySize="large"
              color="white"
              style={styles.loadingIndicator}
            />
          ) : (
            <Progress.Circle
              borderWidth={0}
              color="#fa0"
              formatText={() => currentSeconds}
              progress={currentSeconds / 30}
              showsText
              size={120}
              textStyle={styles.progressText}
              thickness={16}
              unfilledColor="#1d5f68"
            />
          )}
        </View>
        {isNFCEnabled && <Text style={styles.smallText}>or enter a code</Text>}
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          clearButtonMode="always"
          editable={!isLoading}
          enablesReturnKeyAutomatically={false}
          keyboardType="numeric"
          maxLength={6}
          selectionColor={COLORS.textInverse}
          underlineColorAndroid={COLORS.secondary}
          onChangeText={onInputChanged}
          style={styles.input}
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
