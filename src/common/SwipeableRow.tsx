import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ReanimatedSwipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SharedValue } from 'react-native-reanimated';

export type SwipeableProps = {
  isOpen: boolean;
  maxSwipeDistance: number;
  onClose: () => void;
  onOpen: (rowKey: string) => void;
  onSwipeEnd?: () => void;
  onSwipeStart?: () => void;
  preventSwipeRight?: boolean;
  rowKey: string;
  shouldBounceOnMount: boolean;
  swipeThreshold?: number;
};

export type RowItemProps<TEntity> = {
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
};

type Props<TEntity> = SwipeableProps &
  RowItemProps<TEntity> & {
    maxSwipeDistance: number;
    preventSwipeRight: boolean;
    rowItemComponent: React.ComponentType<RowItemProps<TEntity>>;
    slideoutComponent: React.ComponentType<RowItemProps<TEntity>>;
  };

const styles = StyleSheet.create({
  slideoutContainer: {
    flex: 1,
  },
});

class SwipeableRow<TEntity> extends React.PureComponent<Props<TEntity>> {
  static defaultProps = {
    maxSwipeDistance: 150,
    preventSwipeRight: true,
  };

  private swipeableRef = React.createRef<SwipeableMethods>();

  componentDidMount(): void {
    const { shouldBounceOnMount, isOpen } = this.props;
    if (shouldBounceOnMount && !isOpen) {
      // Trigger a brief bounce animation after a short delay to ensure ref is set
      setTimeout(() => {
        this.swipeableRef.current?.openRight();
        setTimeout(() => {
          this.swipeableRef.current?.close();
        }, 300);
      }, 100);
    }
  }

  componentDidUpdate(prevProps: Props<TEntity>): void {
    const { isOpen } = this.props;
    if (prevProps.isOpen !== isOpen) {
      if (isOpen) {
        this.swipeableRef.current?.openRight();
      } else {
        this.swipeableRef.current?.close();
      }
    }
  }

  _onOpen = (): void => {
    this.props.onOpen(this.props.rowKey);
  };

  _onSwipeableWillOpen = (direction: 'left' | 'right'): void => {
    // Only handle right swipe (swipe left to reveal right actions)
    if (direction === 'right') {
      this.props.onSwipeStart?.();
      this._onOpen();
    }
  };

  _onSwipeableWillClose = (_direction: 'left' | 'right'): void => {
    this.props.onClose();
  };

  _onSwipeableOpen = (_direction: 'left' | 'right'): void => {
    this.props.onSwipeEnd?.();
  };

  _onSwipeableClose = (_direction: 'left' | 'right'): void => {
    this.props.onSwipeEnd?.();
  };

  renderRightActions = (
    _progress: SharedValue<number>,
    _translation: SharedValue<number>,
    _swipeableMethods: SwipeableMethods,
  ): React.ReactElement => {
    const {
      index,
      item,
      separators,
      slideoutComponent: SlideoutComponent,
      maxSwipeDistance,
      ...extraProps
    } = this.props;

    return (
      <View style={[styles.slideoutContainer, { width: maxSwipeDistance }]}>
        <SlideoutComponent
          index={index}
          item={item}
          separators={separators}
          {...extraProps}
        />
      </View>
    );
  };

  render(): React.ReactElement {
    const {
      index,
      item,
      preventSwipeRight,
      rowItemComponent: RowItemComponent,
      separators,
      swipeThreshold = 50,
      ...extraProps
    } = this.props;

    return (
      <ReanimatedSwipeable
        ref={this.swipeableRef}
        renderRightActions={this.renderRightActions}
        rightThreshold={swipeThreshold}
        overshootRight={false}
        overshootLeft={preventSwipeRight ? false : true}
        friction={2}
        onSwipeableWillOpen={this._onSwipeableWillOpen}
        onSwipeableWillClose={this._onSwipeableWillClose}
        onSwipeableOpen={this._onSwipeableOpen}
        onSwipeableClose={this._onSwipeableClose}
      >
        <RowItemComponent
          index={index}
          item={item}
          separators={separators}
          {...extraProps}
        />
      </ReanimatedSwipeable>
    );
  }
}

export default SwipeableRow;
