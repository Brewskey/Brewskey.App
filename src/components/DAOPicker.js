// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';
import type DAOStore from '../stores/DAOStores';
import type { Row } from '../stores/DAOListStore';
import type { PickerValue } from '../stores/PickerStore';
import type { PickerProps } from '../common/withPicker';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { SearchBar } from 'react-native-elements';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import DebouncedTextStore from '../stores/DebouncedTextStore';
import ToggleStore from '../stores/ToggleStore';
import List from '../common/List';
import Container from '../common/Container';
import LoadingListFooter from '../common/LoadingListFooter';
import DAOListStore from '../stores/DAOListStore';
import Modal from '../components/modals/Modal';
import DAOApi from 'brewskey.js-api';
import PickerTextInput from './PickerTextInput';
import PickerControl from '../components/PickerControl';
import withPicker from '../common/withPicker';

type RenderRowProps<TEntity> = {|
  index: number,
  isSelected: boolean,
  item: Row<TEntity>,
  separators: Object,
  toggleItem: (item: TEntity) => void,
|};

type Props<TEntity> = {
  daoStore: DAOStore<TEntity>,
  headerTitle: string,
  label: string,
  multiple: boolean,
  renderRow: (renderRowProps: RenderRowProps<TEntity>) => React.Element<any>,
  onChange?: (value: PickerValue<TEntity>) => void,
  placeholder?: string,
  queryOptions: QueryOptions,
  searchBy: string,
  stringValueExtractor?: (item: TEntity) => string,
  value?: PickerValue<TEntity>,
};

@withPicker
@observer
class SearchPicker<TEntity: { id: EntityID }> extends InjectedComponent<
  PickerProps<TEntity>,
  Props<TEntity>,
> {
  static defaultProps = {
    queryOptions: {},
    searchBy: 'name',
  };

  _listStore: DAOListStore<TEntity>;
  _modalToggleStore: ToggleStore = new ToggleStore();
  _searchTextStore: DebouncedTextStore = new DebouncedTextStore();
  _searchToggleStore: ToggleStore = new ToggleStore();

  componentWillMount() {
    const { daoStore, queryOptions, searchBy } = this.props;
    this._listStore = new DAOListStore(daoStore);

    autorun(() => {
      this._listStore.setQueryOptions({
        ...queryOptions,
        filters: [
          ...(queryOptions.filters || []),
          DAOApi.createFilter(searchBy).contains(
            this._searchTextStore.debouncedText,
          ),
        ],
      });

      this._listStore.reload();
    });
  }

  _listKeyExtractor = (row: Row<TEntity>): string => row.key;

  _renderRow = (
    renderRowProps: RenderRowProps<TEntity>,
  ): React.Element<any> => {
    const { checkIsSelected, toggleItem } = this.injectedProps;
    const { renderRow } = this.props;
    const { item: { loader } } = renderRowProps;
    const isSelected =
      loader.hasValue() && checkIsSelected(loader.getValueEnforcing());

    return renderRow(({ ...renderRowProps, isSelected, toggleItem }: any));
  };

  render() {
    const {
      headerTitle,
      label,
      multiple,
      placeholder,
      stringValueExtractor,
    } = this.props;
    const { clear, value } = this.injectedProps;

    return (
      <View>
        <PickerTextInput
          label={label}
          onPress={this._modalToggleStore.toggleOn}
          placeholder={placeholder}
          stringValueExtractor={stringValueExtractor}
          value={value}
        />
        <Modal isVisible={this._modalToggleStore.isToggled}>
          {this._modalToggleStore.isToggled && (
            <Container>
              <Header
                leftComponent={
                  <HeaderIconButton
                    name="arrow-back"
                    onPress={this._modalToggleStore.toggleOff}
                  />
                }
                rightComponent={
                  <HeaderIconButton
                    name="search"
                    onPress={this._searchToggleStore.toggle}
                  />
                }
                title={headerTitle}
              />
              {this._searchToggleStore.isToggled && (
                <SearchBar
                  onChangeText={this._searchTextStore.setText}
                  showLoadingIcon={this._listStore.isFetchingRemoteCount}
                  value={this._searchTextStore.text}
                />
              )}
              <List
                data={this._listStore.rows}
                extraData={Array.isArray(value) ? value.length : value}
                keyExtractor={this._listKeyExtractor}
                ListFooterComponent={
                  <LoadingListFooter
                    isLoading={this._listStore.isFetchingRemoteCount}
                  />
                }
                onEndReached={this._listStore.fetchNextPage}
                onRefresh={this._listStore.reload}
                renderItem={this._renderRow}
              />
              <PickerControl
                multiple={multiple}
                onClearPress={clear}
                onSelectPress={this._modalToggleStore.toggleOff}
                value={value}
              />
            </Container>
          )}
        </Modal>
      </View>
    );
  }
}

export default SearchPicker;
