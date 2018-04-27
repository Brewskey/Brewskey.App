// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';
import type DAOStore from '../stores/DAOStores';
import type { Row } from '../stores/DAOListStore';
import type { PickerValue } from '../stores/PickerStore';
import type { PickerProps } from '../common/withPicker';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { autorun } from 'mobx';
import Header from '../common/Header';
import HeaderIconButton from '../common/Header/HeaderIconButton';
import HeaderSearchBar from '../common/Header/HeaderSearchBar';
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
  error?: ?string,
  headerTitle: string,
  label: string,
  labelStyle?: Style,
  multiple: boolean,
  onChange?: (value: PickerValue<TEntity>) => void,
  placeholder?: string,
  queryOptions: QueryOptions,
  renderRow: (renderRowProps: RenderRowProps<TEntity>) => React.Element<any>,
  searchBy: string,
  stringValueExtractor?: (item: TEntity) => string,
  value?: PickerValue<TEntity>,
  // other react-native textInput props
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

  _listStore: DAOListStore<TEntity> = new DAOListStore(this.props.daoStore);
  _modalToggleStore: ToggleStore = new ToggleStore();
  _searchTextStore: DebouncedTextStore = new DebouncedTextStore();

  componentDidMount() {
    const { queryOptions, searchBy } = this.props;
    this._listStore.initialize(queryOptions);

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
    const {
      item: { loader },
    } = renderRowProps;
    const isSelected =
      loader.hasValue() && checkIsSelected(loader.getValueEnforcing());

    return renderRow(({ ...renderRowProps, isSelected, toggleItem }: any));
  };

  render() {
    const {
      error,
      headerTitle,
      label,
      multiple,
      placeholder,
      stringValueExtractor,
      ...rest
    } = this.props;
    const { clear, value } = this.injectedProps;

    return (
      <View>
        <PickerTextInput
          {...rest}
          error={error}
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
                  <HeaderSearchBar
                    onChangeText={this._searchTextStore.setText}
                    value={this._searchTextStore.text}
                  />
                }
                title={headerTitle}
              />
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
