import type { EntityID, QueryOptions } from '@brewskey/js-api';
import type { ListRenderItemInfo, StyleProp, TextStyle, ViewStyle } from 'react-native';

import * as React from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

import Header from '../../common/Header';
import { HeaderIconButton } from '../../common/Header/HeaderIconButton';
import { HeaderSearchBar } from '../../common/Header/HeaderSearchBar';
import List from '../../common/List';
import Container from '../../common/Container';
import Fragment from '../../common/Fragment';
import LoadingListFooter from '../../common/LoadingListFooter';
import Modal from '../../components/modals/Modal';
import PickerTextInput from './PickerTextInput';
import PickerControl from './PickerControl';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { useDebounce } from '../../hooks/useDebounce';

export type PickerValue<TEntity, TMultiple extends boolean> = TMultiple extends true
  ? TEntity[]
  : TEntity | null | undefined;

export type RenderRowProps<TEntity> = {
  index: number;
  isSelected: boolean;
  item: TEntity;
  separators: ListRenderItemInfo<TEntity>['separators'];
  toggleItem: (item: TEntity) => void;
};

type Props<TEntity, TMultiple extends boolean> = {
  error?: string | null | undefined;
  headerTitle: string;
  inputStyle?: StyleProp<ViewStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  multiple: TMultiple;
  onChange?: (value: PickerValue<TEntity, TMultiple>) => void;
  onSearchFilter?: (searchText: string, baseQueryOptions: QueryOptions) => QueryOptions;
  pickerInputComponent?: React.ComponentType<any>;
  placeholder?: string;
  placeholderTextColor?: string;
  queryOptions: QueryOptions;
  renderRow: (renderRowProps: RenderRowProps<TEntity>) => React.ReactElement;
  searchBy: string;
  selectionColor?: string;
  shouldUseSearchQuery: boolean;
  stringValueExtractor: (item: TEntity) => string;
  underlineColorAndroid?: string;
  useQueryHook: (options?: Omit<QueryOptions, 'skip'>) => UseInfiniteQueryResult<
    InfiniteData<TEntity[]>,
    Error
  >;
  validationTextStyle?: StyleProp<TextStyle>;
  value: PickerValue<TEntity, TMultiple>;
  keyExtractor?: (item: TEntity) => string;
};

const defaultKeyExtractor = <TEntity extends { id: unknown }>(item: TEntity): string => {
  if (item.id == null) {
    throw new Error('DAOPicker: keyExtractorError, there is no id prop in item');
  }
  return String(item.id);
};

function DAOPicker<TEntity extends { id: unknown }, TMultiple extends boolean>({
  error,
  headerTitle,
  inputStyle,
  label,
  labelStyle,
  multiple,
  onChange,
  onSearchFilter,
  pickerInputComponent: PickerInputComponent = PickerTextInput,
  placeholder,
  queryOptions = {},
  renderRow,
  searchBy = 'name',
  shouldUseSearchQuery = false,
  stringValueExtractor,
  useQueryHook,
  value,
  keyExtractor,
}: Props<TEntity, TMultiple>): React.ReactElement {
  const actualKeyExtractor = keyExtractor || defaultKeyExtractor;
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Search state
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);

  // Selection state
  const [selectedItems, setSelectedItems] = useState<Map<string, TEntity>>(new Map());
  const [committedValue, setCommittedValue] = useState<PickerValue<TEntity, TMultiple>>(value);

  // Build query options with search
  const finalQueryOptions = useMemo(() => {
    const baseOptions = { ...queryOptions };
    
    if (!debouncedSearchText) {
      return baseOptions;
    }

    // If onSearchFilter callback is provided, use it to customize the filter
    if (onSearchFilter) {
      return onSearchFilter(debouncedSearchText, baseOptions);
    }

    // Default behavior: use search query parameter or create filter
    if (shouldUseSearchQuery) {
      return {
        ...baseOptions,
        search: debouncedSearchText,
      };
    }

    return {
      ...baseOptions,
      filters: [
        ...(baseOptions.filters || []),
        createFilter(searchBy).contains(debouncedSearchText),
      ],
    };
  }, [queryOptions, debouncedSearchText, searchBy, shouldUseSearchQuery, onSearchFilter]);

  // Use the query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useQueryHook(finalQueryOptions);

  // Flatten paginated data
  const flatData = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  // Normalize value - convert ID to entity if needed
  const normalizedValue = useMemo((): PickerValue<TEntity, TMultiple> => {
    if (value == null) {
      return value;
    }

    // Check if value is a primitive (ID) rather than an entity object
    const isPrimitiveId = (val: unknown): boolean => {
      return typeof val === 'string' || typeof val === 'number';
    };

    if (Array.isArray(value)) {
      return value.map((item) => {
        if (isPrimitiveId(item)) {
          // Try to find the entity in flatData
          const found = flatData.find((entity) => actualKeyExtractor(entity) === String(item));
          return found ?? (item as TEntity);
        }
        return item;
      }) as PickerValue<TEntity, TMultiple>;
    } else {
      const val = value as TEntity | EntityID;
      if (isPrimitiveId(val)) {
        // Try to find the entity in flatData
        const found = flatData.find((entity) => actualKeyExtractor(entity) === String(val));
        return (found ?? null) as PickerValue<TEntity, TMultiple>;
      }
      return val as PickerValue<TEntity, TMultiple>;
    }
  }, [value, flatData, actualKeyExtractor]);

  // Update committedValue when normalizedValue changes (e.g., when data loads and ID is resolved to entity)
  useEffect(() => {
    if (!isModalVisible) {
      // Always update committedValue with normalizedValue when modal is closed
      // This ensures that if value was an ID and data loads, we update the display
      if (normalizedValue !== undefined) {
        setCommittedValue(normalizedValue);
      }
    }
  }, [normalizedValue, isModalVisible]);

  // Selection helpers
  const checkIsSelected = useCallback(
    (item: TEntity): boolean => {
      return selectedItems.has(actualKeyExtractor(item));
    },
    [selectedItems, actualKeyExtractor],
  );

  const toggleItem = useCallback(
    (item: TEntity) => {
      const itemKey = actualKeyExtractor(item);
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        
        if (newMap.has(itemKey)) {
          newMap.delete(itemKey);
        } else {
          if (!multiple) {
            newMap.clear();
          }
          newMap.set(itemKey, item);
        }
        
        return newMap;
      });
    },
    [multiple, actualKeyExtractor],
  );

  const clearSelection = useCallback(() => {
    setSelectedItems(new Map());
  }, []);

  const getSelectedValue = useCallback((): PickerValue<TEntity, TMultiple> => {
    const values = Array.from(selectedItems.values());
    if (multiple) {
      return values as PickerValue<TEntity, TMultiple>;
    }
    return (values[0] ?? null) as PickerValue<TEntity, TMultiple>;
  }, [selectedItems, multiple]);

  // Modal handlers
  const handleOpen = useCallback(() => {
    setIsModalVisible(true);
    // Initialize selection with current normalized value
    // Also try to resolve IDs from flatData if normalizedValue didn't find them
    const newMap = new Map<string, TEntity>();
    
    if (normalizedValue != null) {
      if (Array.isArray(normalizedValue)) {
        normalizedValue.forEach((item) => {
          // Only add if item has an id property (is an entity object)
          try {
            newMap.set(actualKeyExtractor(item), item);
          } catch (error) {
            // Skip items that don't have an id property
            console.warn('DAOPicker: Skipping item without id property', item);
          }
        });
      } else {
        const val = normalizedValue as TEntity;
        try {
          newMap.set(actualKeyExtractor(val), val);
        } catch (error) {
          // If value is still just an ID, try to find it in flatData
          const isPrimitiveId = typeof val === 'string' || typeof val === 'number';
          if (isPrimitiveId) {
            const found = flatData.find((entity) => actualKeyExtractor(entity) === String(val));
            if (found) {
              newMap.set(actualKeyExtractor(found), found);
            }
          }
        }
      }
    } else if (value != null) {
      // If normalizedValue is null but value exists, it might be an ID that wasn't found
      // Try to find it in flatData
      const isPrimitiveId = typeof value === 'string' || typeof value === 'number';
      if (isPrimitiveId && !Array.isArray(value)) {
        const found = flatData.find((entity) => actualKeyExtractor(entity) === String(value));
        if (found) {
          newMap.set(actualKeyExtractor(found), found);
        }
      }
    }
    
    setSelectedItems(newMap);
    setSearchText('');
  }, [normalizedValue, value, flatData, actualKeyExtractor]);

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleSelect = useCallback(() => {
    setIsModalVisible(false);
    const newValue = getSelectedValue();
    setCommittedValue(newValue);
    onChange?.(newValue);
  }, [getSelectedValue, onChange]);

  // List handlers
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listKeyExtractor = useCallback(
    (item: TEntity, _index: number) => {
      return actualKeyExtractor(item);
    },
    [actualKeyExtractor],
  );

  const renderItem = useCallback(
    ({ item, index, separators }: ListRenderItemInfo<TEntity>) => {
      const isSelected = checkIsSelected(item);
      return renderRow({ item, index, isSelected, separators, toggleItem });
    },
    [checkIsSelected, renderRow, toggleItem],
  );

  return (
    <Fragment>
      <PickerInputComponent
        error={error}
        inputStyle={inputStyle}
        label={label}
        labelStyle={labelStyle}
        onPress={handleOpen}
        placeholder={placeholder}
        stringValueExtractor={stringValueExtractor}
        value={
          normalizedValue ??
          (committedValue &&
          typeof committedValue !== 'string' &&
          typeof committedValue !== 'number' &&
          !Array.isArray(committedValue)
            ? committedValue
            : null)
        }
      />
      <Modal isVisible={isModalVisible} onHideModal={handleClose}>
        <Container>
          <Header
            leftComponent={
              <HeaderIconButton name="arrow-back" onPress={handleClose} />
            }
            rightComponent={
              <HeaderSearchBar
                onChangeText={setSearchText}
                value={searchText}
              />
            }
            title={headerTitle}
          />
          <List
            data={{ pages: [flatData], pageParams: [0] } as InfiniteData<TEntity[]>}
            extraData={{ size: selectedItems.size }}
            keyExtractor={listKeyExtractor}
            ListFooterComponent={
              <LoadingListFooter isLoading={isFetchingNextPage || isLoading} />
            }
            onEndReached={handleEndReached}
            renderItem={renderItem}
          />
          <PickerControl
            onClearPress={clearSelection}
            onSelectPress={handleSelect}
            value={getSelectedValue()}
          />
        </Container>
      </Modal>
    </Fragment>
  );
}

export default DAOPicker;
