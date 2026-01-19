import type { EntityID } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary, withErrorBoundary } from '../common/ErrorBoundary';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import Header from '../common/Header';
import {
  StaticScreenProps,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCreateFlowSensor } from '../hooks/queries/FlowSensorQueries';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { HomeStackParamList } from '../AppRouter';

type Navigation = NativeStackNavigationProp<HomeStackParamList>;

const DEFAULT_FLOW_SENSOR = {
  flowSensorType: 'Titan',
  pulsesPerGallon: 5375,
} as const;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 30,
  },
  container: {
    paddingVertical: 30,
  },
});

type Props = StaticScreenProps<{
  onTapSetupFinish?: (tapID: EntityID) => void | Promise<void>;
  showBackButton?: boolean;
  tapId: EntityID;
  shouldReturnOnFinish: boolean;
}>;

export const NewFlowSensorScreen: React.FC<Props> = withErrorBoundary(
  ({
    route: {
      params: { tapId, shouldReturnOnFinish, onTapSetupFinish },
    },
  }: Props) => {
    const navigation = useNavigation<Navigation>();
    const createFlowSensor = useCreateFlowSensor();
    const addSnackBarMessage = useAddSnackBarMessage();

    const _onFlowSensorCreated = () => {
      addSnackBarMessage({ content: 'Flow sensor set' });

      if (shouldReturnOnFinish && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('newKeg', { tapId });
      }
    };

    const _onDefaultButtonPress = async () => {
      await createFlowSensor.mutateAsync({
        ...DEFAULT_FLOW_SENSOR,
        tapId,
      });
      _onFlowSensorCreated();
    };

    const _onCustomButtonPress = () => {
      navigation.navigate('newFlowSensorCustom', {
        tapId,
        onFlowSensorCreated: _onFlowSensorCreated,
      });
    };

    return (
      <Container>
        <Header title="Setup flow sensor" />
        <View style={styles.container}>
          <Button
            containerStyle={styles.buttonContainer}
            onPress={_onDefaultButtonPress}
            title="I got my sensor from Brewskey"
          />
          <Button
            onPress={_onCustomButtonPress}
            title="I'd like to setup a different sensor"
          />
        </View>
      </Container>
    );
  },
  <ErrorScreen showBackButton />,
);
