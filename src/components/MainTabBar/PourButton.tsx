import * as React from 'react';

import { Icon } from '@rneui/themed';
import { StyleSheet } from 'react-native';

// import PourProcessStore from 'stores/PourProcessStore';
import { TouchableItem } from 'common/buttons/TouchableItem';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { PourProcessModal } from 'components/modals/PourProcessModal';
import { usePourModalContext } from 'hooks/context/PourProcessContext';
import { COLORS } from 'theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.primary2,
    borderRadius: 50,
    height: 100,
    justifyContent: 'center',
    width: 100,
  },
});

export const PourButton: React.FC = (_) => {
  const { isLoading, openModal } = usePourModalContext();
  return (
    <React.Fragment>
      {!isLoading ? (
        <TouchableItem
          onPress={async () => openModal()}
          style={styles.container}
          testID="pour-button"
        >
          <Icon
            color={COLORS.secondary}
            name="beer-outline"
            size={32}
            type="ionicon"
          />
        </TouchableItem>
      ) : (
        <LoadingIndicator
          color="white"
          style={styles.container}
          testID="pour-button-loading"
        />
      )}
      <PourProcessModal />
    </React.Fragment>
  );
};
