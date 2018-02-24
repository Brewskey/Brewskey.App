// @flow

import type DAOStore from '../stores/DAOStores';
import type { Row } from '../stores/DAOListStore';

import React from 'react';
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

type Props<TEntity> = {
  daoStore: DAOStore<TEntity>,
  headerTitle: string,
  label: string,
  multiple: boolean,
  onChange?: (value: PickerValue<TEntity>) => void,
  placeholder?: string,
  queryOptions?: QueryOptions,
  searchBy: Array<string>,
  stringValueExtractor?: (item: TEntity) => string,
  value?: PickerValue<TEntity>,
};

@withPicker
@observer
class SearchPicker<TEntity> extends InjectedComponent<
  PickerProps<TEntity>,
  Props<TEntity>,
> {
  static defaultProps = {
    queryOptions: {},
    searchBy: ['name'],
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
          ...(queryOptions.filters || {}),
          DAOApi.createFilter(searchBy).contains(
            this._searchTextStore.debouncedText,
          ),
        ],
      });

      this._listStore.reload();
    });
  }

  _listKeyExtractor = (row: Row<TEntity>): string => row.key;

  _renderRow = (renderRowProps): Rect.Element<any> => {
    const { checkIsSelected, toggleItem } = this.injectedProps;
    const { renderRow } = this.props;
    const { item: { loader } } = renderRowProps;
    const isSelected = loader.hasValue()
      ? checkIsSelected(loader.getValue())
      : false;

    return renderRow({ ...renderRowProps, isSelected, toggleItem });
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
          multiple
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
                  showLoadingIcon={this._listStore.isLoading}
                  value={this._searchTextStore.text}
                />
              )}
              <List
                data={this._listStore.rows}
                extraData={multiple ? value.length : value}
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
