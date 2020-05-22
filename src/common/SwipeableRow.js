// @flow

import * as React from 'react';
import { SwipeableRow as RNSwipeableRow } from 'react-native-swipeable-list';

export type SwipeableProps = {|
  isOpen: boolean,
  maxSwipeDistance: number,
  onClose: () => void,
  onOpen: (rowKey: string) => void,
  onSwipeEnd?: () => void,
  onSwipeStart?: () => void,
  preventSwipeRight?: boolean,
  rowKey: string,
  shouldBounceOnMount: boolean,
  swipeThreshold?: number,
|};

export type RowItemProps<TEntity> = {|
  index: number,
  item: TEntity,
  separators: Object,
  onDeleteItemPress?: (TEntity) => void,
  onEditItemPress?: (TEntity) => void,
  onItemPress?: (TEntity) => void,
  onListItemPress?: (TEntity) => void,
|};

type Props<TEntity> = {|
  ...SwipeableProps,
  ...RowItemProps<TEntity>,
  maxSwipeDistance: number,
  preventSwipeRight: boolean,
  rowItemComponent: React.ComponentType<RowItemProps<TEntity>>,
  slideoutComponent: React.ComponentType<RowItemProps<TEntity>>,
|};

class SwipeableRow<TEntity, TExtraProps> extends React.PureComponent<
  Props<TEntity>,
> {
  static defaultProps = {
    maxSwipeDistance: 150,
    preventSwipeRight: true,
  };

  _onOpen = (): void => this.props.onOpen(this.props.rowKey);

  render(): React.Node {
    const {
      index,
      isOpen,
      item,
      maxSwipeDistance,
      onClose,
      onOpen,
      onSwipeEnd,
      onSwipeStart,
      preventSwipeRight,
      rowItemComponent: RowItemComponent,
      rowKey,
      separators,
      shouldBounceOnMount,
      slideoutComponent: SlideoutComponent,
      swipeThreshold,
      ...extraProps
    } = this.props;

    return (
      <RNSwipeableRow
        isOpen={isOpen}
        maxSwipeDistance={maxSwipeDistance}
        onClose={onClose}
        onOpen={this._onOpen}
        onSwipeEnd={onSwipeEnd}
        onSwipeStart={onSwipeStart}
        preventSwipeRight={preventSwipeRight}
        shouldBounceOnMount={shouldBounceOnMount}
        slideoutView={
          <SlideoutComponent
            index={index}
            item={item}
            separators={separators}
            {...extraProps}
          />
        }
        swipeThreshold={swipeThreshold}
      >
        <RowItemComponent
          index={index}
          item={item}
          separators={separators}
          {...extraProps}
        />
      </RNSwipeableRow>
    );
  }
}

export default SwipeableRow;
