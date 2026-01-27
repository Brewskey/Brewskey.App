import { useCallback, useRef } from 'react';

import nullthrows from 'nullthrows';
import { StyleSheet, View } from 'react-native';

import { Fragment } from './Fragment';
import { SwipeableActionButton } from './SwipeableActionButton';
import { DeleteModal } from '../components/modals/DeleteModal';
import { ToggleStore } from '../stores/ToggleStore';
import { COLORS } from '../theme';

import type { ReactElement } from 'react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderColor: COLORS.secondary3,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButtonContainer: {
    backgroundColor: COLORS.danger,
  },
  deleteIcon: {
    color: COLORS.textInverse,
  },
  editButtonContainer: {
    backgroundColor: COLORS.accent,
  },
  editIcon: {
    color: COLORS.textInverse,
  },
});

interface Props<TItem> {
  deleteModalMessage: string;
  deleteModalTitle: string;
  item: TItem;
  onDeleteItemPress?: (item: TItem) => void | Promise<void>;
  onEditItemPress?: (item: TItem) => void;
}

const QuickActions = <TItem,>(props: Props<TItem>): ReactElement => {
  const {
    deleteModalTitle,
    deleteModalMessage,
    onDeleteItemPress,
    onEditItemPress,
    item,
  } = props;

  const modalToggleStore = useRef(new ToggleStore()).current;

  const onDeleteModalConfirm = useCallback(() => {
    modalToggleStore.toggleOff();
    nullthrows(onDeleteItemPress)(item);
  }, [modalToggleStore, onDeleteItemPress, item]);

  const onEditItemPressHandler = useCallback((): void => {
    nullthrows(onEditItemPress)(item);
  }, [onEditItemPress, item]);

  return (
    <View style={styles.container}>
      {!onEditItemPress ? null : (
        <SwipeableActionButton
          containerStyle={styles.editButtonContainer}
          iconName="create"
          iconStyle={styles.editIcon}
          onPress={onEditItemPressHandler}
        />
      )}
      {!onDeleteItemPress ? null : (
        <Fragment>
          <SwipeableActionButton
            containerStyle={styles.deleteButtonContainer}
            iconName="delete"
            iconStyle={styles.deleteIcon}
            onPress={modalToggleStore.toggleOn}
          />
          <DeleteModal
            isVisible={modalToggleStore.isToggled}
            message={deleteModalMessage}
            onCancelButtonPress={modalToggleStore.toggleOff}
            onDeleteButtonPress={onDeleteModalConfirm}
            title={deleteModalTitle}
          />
        </Fragment>
      )}
    </View>
  );
};

export { QuickActions };
