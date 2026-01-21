import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import SwipeableActionButton from './SwipeableActionButton';
import Fragment from './Fragment';
import DeleteModal from '../components/modals/DeleteModal';
import ToggleStore from '../stores/ToggleStore';
import { COLORS } from '../theme';

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

type Props<TItem> = {
  deleteModalMessage: string;
  deleteModalTitle: string;
  item: TItem;
  onDeleteItemPress?: (item: TItem) => void | Promise<void>;
  onEditItemPress?: (item: TItem) => void;
};

function QuickActions<TItem>(props: Props<TItem>): React.ReactElement {
  const {
    deleteModalTitle,
    deleteModalMessage,
    onDeleteItemPress,
    onEditItemPress,
    item,
  } = props;

  const _modalToggleStore = React.useRef(new ToggleStore()).current;

  const _onDeleteModalConfirm = React.useCallback(() => {
    _modalToggleStore.toggleOff();
    nullthrows(onDeleteItemPress)(item);
  }, [_modalToggleStore, onDeleteItemPress, item]);

  const _onEditItemPress = React.useCallback((): void => {
    nullthrows(onEditItemPress)(item);
  }, [onEditItemPress, item]);

  return (
    <View style={styles.container}>
      {!onEditItemPress ? null : (
        <SwipeableActionButton
          containerStyle={styles.editButtonContainer}
          iconName="create"
          iconStyle={styles.editIcon}
          onPress={_onEditItemPress}
        />
      )}
      {!onDeleteItemPress ? null : (
        <Fragment>
          <SwipeableActionButton
            containerStyle={styles.deleteButtonContainer}
            iconName="delete"
            iconStyle={styles.deleteIcon}
            onPress={_modalToggleStore.toggleOn}
          />
          <DeleteModal
            title={deleteModalTitle}
            isVisible={_modalToggleStore.isToggled}
            message={deleteModalMessage}
            onCancelButtonPress={_modalToggleStore.toggleOff}
            onDeleteButtonPress={_onDeleteModalConfirm}
          />
        </Fragment>
      )}
    </View>
  );
}

export default QuickActions;
