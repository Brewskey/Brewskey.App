// @flow

import type { EntityID, QueryOptions } from 'brewskey.js-api';
import type { Style } from '../../types';
import type DAOStore from '../../stores/DAOStores';
import type { Row } from '../../stores/DAOListStore';
import type { PickerValue } from '../../stores/PickerStore';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import { autorun } from 'mobx';
import Header from '../../common/Header';
import HeaderIconButton from '../../common/Header/HeaderIconButton';
import HeaderSearchBar from '../../common/Header/HeaderSearchBar';
import DebouncedTextStore from '../../stores/DebouncedTextStore';
import ToggleStore from '../../stores/ToggleStore';
import List from '../../common/List';
import Container from '../../common/Container';
import Fragment from '../../common/Fragment';
import LoadingListFooter from '../../common/LoadingListFooter';
import DAOListStore from '../../stores/DAOListStore';
import Modal from '../../components/modals/Modal';
import DAOApi from 'brewskey.js-api';
import PickerTextInput from './PickerTextInput';
import PickerControl from './PickerControl';
import PickerStore from '../../stores/PickerStore';

type RenderRowProps<TEntity> = {|
  index: number,
  isSelected: boolean,
  item: Row<TEntity>,
  separators: Object,
  toggleItem: (item: TEntity) => void,
|};

type Props<TEntity, TMultiple> = {
  daoStore: DAOStore<TEntity>,
  error?: ?string,
  headerTitle: string,
  inputStyle?: Style,
  label: string,
  labelStyle?: Style,
  multiple: TMultiple,
  onChange?: (value: PickerValue<TEntity, TMultiple>) => void,
  // todo figure flow for pickerInputComponent, it throws weird error for React.Component
  pickerInputComponent?: any,
  placeholder?: string,
  placeholderTextColor?: string,
  queryOptions: QueryOptions,
  renderRow: (renderRowProps: RenderRowProps<TEntity>) => React.Element<any>,
  searchBy: string,
  selectionColor?: string,
  stringValueExtractor?: (item: TEntity) => string,
  underlineColorAndroid?: string,
  validationTextStyle?: Style,
  value: PickerValue<TEntity, TMultiple>,
  // other react-native textInput props
};

@observer
class DAOPicker<
  TEntity: { id: EntityID },
  TMultiple: boolean,
> extends React.Component<Props<TEntity, TMultiple>> {
  static defaultProps = {
    queryOptions: {},
    searchBy: 'name',
  };

  _listStore: DAOListStore<TEntity> = new DAOListStore(this.props.daoStore);
  _modalToggleStore: ToggleStore = new ToggleStore();
  _searchTextStore: DebouncedTextStore = new DebouncedTextStore();

  _pickerStore: PickerStore<TEntity, TMultiple> = new PickerStore({
    initialValue: this.props.value,
    multiple: this.props.multiple,
    onChange: this.props.onChange,
  });

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

      this._listStore.reset();
    });
  }

  _listKeyExtractor = (row: Row<TEntity>): string => row.key;

  _renderRow = (
    renderRowProps: RenderRowProps<TEntity>,
  ): React.Element<any> => {
    const { renderRow } = this.props;
    const { checkIsSelected, toggleItem } = this._pickerStore;
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
      pickerInputComponent = PickerTextInput,
      placeholder,
      stringValueExtractor,
    } = this.props;
    const { clear, value } = this._pickerStore;
    const PickerInputComponent = pickerInputComponent;

    return (
      <Fragment>
        <PickerInputComponent
          error={error}
          label={label}
          multiple={multiple}
          onPress={this._modalToggleStore.toggleOn}
          placeholder={placeholder}
          stringValueExtractor={stringValueExtractor}
          value={value}
        />
        <Modal
          isVisible={this._modalToggleStore.isToggled}
          onHideModal={this._modalToggleStore.toggleOff}
        >
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
      </Fragment>
    );
  }
}

export default DAOPicker;
