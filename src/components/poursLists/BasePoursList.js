// @flow

import type { Pour, QueryOptions } from 'brewskey.js-api';
import type { Row } from '../../stores/DAOListStore';
import type { RowItemProps } from '../../common/SwipeableRow';

import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOListStore from '../../stores/DAOListStore';
import { PourStore } from '../../stores/DAOStores';
import SwipeableList from '../../common/SwipeableList';
import LoaderRow from '../../common/LoaderRow';
import LoadingListFooter from '../../common/LoadingListFooter';
import BeverageModal from '../modals/BeverageModal';
import nullthrows from 'nullthrows';

type Props<TComponentType> = {|
  ListEmptyComponent?: ?(React.ComponentType<any> | React.Node),
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Node),
  loadedRow: React.ComponentType<TComponentType>,
  onDeleteItemPress?: (item: Pour) => Promise<void>,
  onRefresh?: () => void,
  queryOptions?: QueryOptions,
  rowItemComponent?: React.ComponentType<RowItemProps<Pour>>,
  slideoutComponent?: React.ComponentType<RowItemProps<Pour>>,
|};

@withNavigation
@observer
class BasePoursList<TComponentType> extends React.Component<
  Props<TComponentType>,
> {
  static defaultProps = {
    queryOptions: {},
  };

  _beverageModal = React.createRef<BeverageModal>();
  _listStore: DAOListStore<Pour> = new DAOListStore(PourStore);

  componentDidMount() {
    this._listStore.initialize({
      orderBy: [
        {
          column: 'id',
          direction: 'desc',
        },
      ],
      ...this.props.queryOptions,
    });
  }

  _keyExtractor = (row: Row<Pour>): string => row.key;

  _onRefresh = () => {
    const { onRefresh } = this.props;
    onRefresh && onRefresh();
    this._listStore.reload();
  };

  _renderRow = ({
    info: { item: row, index, separators },
    ...swipeableStateProps
  }): React.Node => (
    <LoaderRow
      index={index}
      loadedRow={this.props.loadedRow}
      loader={row.loader}
      onDeleteItemPress={this.props.onDeleteItemPress}
      rowItemComponent={this.props.rowItemComponent}
      separators={separators}
      slideoutComponent={this.props.slideoutComponent}
      onItemPress={(pour) =>
        nullthrows(this._beverageModal.current).setBeverageID(pour.beverage.id)
      }
      {...swipeableStateProps}
    />
  );

  render(): React.Node {
    const { ListEmptyComponent, ListHeaderComponent } = this.props;
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <>
        <SwipeableList
          data={this._listStore.rows}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={!isLoading ? ListEmptyComponent : null}
          ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
          ListHeaderComponent={ListHeaderComponent}
          onEndReached={this._listStore.fetchNextPage}
          onRefresh={this._onRefresh}
          renderItem={this._renderRow}
        />
        <BeverageModal ref={this._beverageModal} />
      </>
    );
  }
}

export default BasePoursList;
