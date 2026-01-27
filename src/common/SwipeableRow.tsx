import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SharedValue } from 'react-native-reanimated';

export interface SwipeableProps {
  isOpen: boolean;
  maxSwipeDistance?: number;
  onClose: () => void;
  onOpen: (rowKey: string) => void;
  onSwipeEnd?: () => void;
  onSwipeStart?: () => void;
  preventSwipeRight?: boolean;
  rowKey: string;
  shouldBounceOnMount: boolean;
  swipeThreshold?: number;
}

export interface RowItemProps<TEntity> {
  index: number;
  item: TEntity;
  separators: {
    highlight: () => void;
    unhighlight: () => void;
    updateProps: (select: 'leading' | 'trailing', newProps: unknown) => void;
  };
  onDeleteItemPress?: (item: TEntity) => void;
  onEditItemPress?: (item: TEntity) => void;
  onItemPress?: (item: TEntity) => void;
}

type Props<TEntity> = SwipeableProps &
  RowItemProps<TEntity> & {
    maxSwipeDistance?: number;
    preventSwipeRight?: boolean;
    rowItemComponent: React.ComponentType<RowItemProps<TEntity>>;
    slideoutComponent: React.ComponentType<RowItemProps<TEntity>>;
  };

const styles = StyleSheet.create({
  slideoutContainer: {
    flex: 1,
  },
});

const SwipeableRow = <TEntity,>(props: Props<TEntity>): React.ReactElement => {
  const {
    index,
    item,
    preventSwipeRight = true,
    rowItemComponent: RowItemComponent,
    separators,
    swipeThreshold = 50,
    maxSwipeDistance = 150,
    slideoutComponent: SlideoutComponent,
    shouldBounceOnMount,
    isOpen,
    onOpen,
    rowKey,
    onClose,
    onSwipeStart,
    onSwipeEnd,
    ...extraProps
  } = props;

  const swipeableRef = React.useRef<SwipeableMethods>(null);

  React.useEffect(() => {
    if (shouldBounceOnMount && !isOpen) {
      // Trigger a brief bounce animation after a short delay to ensure ref is set
      const timeoutId = setTimeout(() => {
        swipeableRef.current?.openRight();
        setTimeout(() => {
          swipeableRef.current?.close();
        }, 300);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      swipeableRef.current?.openRight();
    } else {
      swipeableRef.current?.close();
    }
  }, [isOpen]);

  const _onOpen = React.useCallback((): void => {
    onOpen(rowKey);
  }, [onOpen, rowKey]);

  const _onSwipeableWillOpen = React.useCallback(
    (direction: 'left' | 'right'): void => {
      // Only handle right swipe (swipe left to reveal right actions)
      if (direction === 'right') {
        onSwipeStart?.();
        _onOpen();
      }
    },
    [onSwipeStart, _onOpen],
  );

  const _onSwipeableWillClose = React.useCallback(
    (_direction: 'left' | 'right'): void => {
      onClose();
    },
    [onClose],
  );

  const _onSwipeableOpen = React.useCallback(
    (_direction: 'left' | 'right'): void => {
      onSwipeEnd?.();
    },
    [onSwipeEnd],
  );

  const _onSwipeableClose = React.useCallback(
    (_direction: 'left' | 'right'): void => {
      onSwipeEnd?.();
    },
    [onSwipeEnd],
  );

  const renderRightActions = React.useCallback(
    (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      _swipeableMethods: SwipeableMethods,
    ): React.ReactElement => (
      <View style={[styles.slideoutContainer, { width: maxSwipeDistance }]}>
        <SlideoutComponent
          index={index}
          item={item}
          separators={separators}
          {...extraProps}
        />
      </View>
    ),
    [index, item, separators, SlideoutComponent, maxSwipeDistance, extraProps],
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      onSwipeableClose={_onSwipeableClose}
      onSwipeableOpen={_onSwipeableOpen}
      onSwipeableWillClose={_onSwipeableWillClose}
      onSwipeableWillOpen={_onSwipeableWillOpen}
      overshootLeft={!preventSwipeRight}
      overshootRight={false}
      renderRightActions={renderRightActions}
      rightThreshold={swipeThreshold}
    >
      <RowItemComponent
        index={index}
        item={item}
        separators={separators}
        {...extraProps}
      />
    </ReanimatedSwipeable>
  );
};

export const SwipeableRowMemo = React.memo(SwipeableRow) as typeof SwipeableRow;
export { SwipeableRowMemo as SwipeableRow };
