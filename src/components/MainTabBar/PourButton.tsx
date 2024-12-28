import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';

// import PourProcessStore from '../../stores/PourProcessStore';
import TouchableItem from '../../common/buttons/TouchableItem';
import LoadingIndicator from '../../common/LoadingIndicator';
import Ionicons from '@expo/vector-icons/Ionicons';
import { PourProcessModal } from '../modals/PourProcessModal';
import { usePourModalContext } from '../../hooks/context/PourProcessContext';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary2,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    marginTop: -25,
    width: 100,
  },
});

export const PourButton: React.FC = (_) => {
  const { isLoading, setVisibility } = usePourModalContext();
  return (
    <>
      {!isLoading ? (
        <View style={styles.container}>
          <Ionicons
            color={COLORS.secondary}
            Component={TouchableItem}
            containerStyle={styles.container}
            name="beer-outline"
            onPress={() => setVisibility(true)}
            size={32}
            type="ionicon"
          />
        </View>
      ) : (
        <LoadingIndicator color="white" style={styles.container} />
      )}
      <PourProcessModal />
    </>
  );
};
