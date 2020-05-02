// @flow

import * as React from 'react';
import RNSwipeableRow from 'react-native-swipeable-list';

type SwipeableProps = {
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
};

export type RowItemProps<TEntity, TExtraProps = {}> = {
  // section?: Object, add this when resolve object recreation issue in SectionlistStore
  ...TExtraProps,
  index: number,
  item: TEntity,
  separators: Object,
};

type Props<TEntity, TExtraProps = {}> = {
  ...TExtraProps,
  rowItemComponent: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
  slideoutComponent: React.ComponentType<RowItemProps<TEntity, TExtraProps>>,
} & SwipeableProps &
  RowItemProps<TEntity>;

class SwipeableRow<TEntity> extends React.PureComponent<Props<TEntity>> {
  static defaultProps = {
    maxSwipeDistance: 150,
    preventSwipeRight: true,
  };

  _onOpen = (): void => this.props.onOpen(this.props.rowKey);

  render() {
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
