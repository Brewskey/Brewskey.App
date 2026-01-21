import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import nullthrows from 'nullthrows';
import { COLORS, TYPOGRAPHY } from '../../theme';
import Modal from '../../components/modals/Modal';
import Container from '../../common/Container';
import Header from '../../common/Header';
import { HeaderIconButton } from '../../common/Header/HeaderIconButton';
import { HeaderSearchBar } from '../../common/Header/HeaderSearchBar';
import List from '../../common/List';
import LoadingListFooter from '../../common/LoadingListFooter';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '@rneui/themed';

type DropdownProps<T> = React.ComponentProps<typeof RNEDropdown>;

export type DropdownInputProps<TValueType> = Omit<
  DropdownProps<TValueType>,
  'onChange' | 'data'
> & {
  // Form integration
  defaultValue?: TValueType | TValueType[];
  name: string;
  required?: boolean | string;
  onChange?: DropdownProps<TValueType>['onChange'];
  testID?: string;

  // Data source - either static array or async query
  data?: TValueType[];
  useQueryHook?: (options?: any) => UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error>;
  queryOptions?: any;
  onSearchFilter?: (searchText: string, baseQueryOptions: any) => any;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;

  // Multi-select support
  multiple?: boolean;

  // Modal mode
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;

  // Confirmation flow
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType | TValueType[]) => void;

  // Value normalization
  keyExtractor?: (item: TValueType) => string;

  // Styling variants
  inputVariant?: 'default' | 'picker'; // 'picker' for underline style
};

// Shared styles for web dropdown components
const webStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  select: {
    width: '100%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: TYPOGRAPHY.paragraph.fontSize,
    flex: 1,
  },
  selectIcon: {
    fontSize: 12,
    color: COLORS.text,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textFaded,
  },
  underline: {
    backgroundColor: COLORS.secondary3,
    height: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 4,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 1000,
    elevation: 5,
    marginTop: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  searchInput: {
    width: '100%',
    padding: 12,
    fontSize: TYPOGRAPHY.paragraph.fontSize,
    color: COLORS.text,
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary3,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary2,
  },
  itemText: {
    fontSize: TYPOGRAPHY.paragraph.fontSize,
    color: COLORS.text,
  },
  emptyText: {
    padding: 12,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
  inputContainer: {
    marginHorizontal: 16,
  },
  inputValue: {
    minHeight: 46,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  inputValueText: {
    color: COLORS.textInputPlaceholder,
    fontSize: 17,
  },
  inputValueTextSelected: {
    color: COLORS.textInput,
    fontSize: 17,
  },
});

// Component for rendering a single dropdown item
const DropdownListItem = <TValueType,>({
  item,
  isSelected,
  isHovered,
  labelField,
  activeColor,
  itemIndex,
  renderItem,
  onPress,
  onPressIn,
  onPressOut,
}: {
  item: TValueType;
  isSelected: boolean;
  isHovered: boolean;
  labelField: string;
  activeColor?: string;
  itemIndex: number;
  renderItem?: (item: TValueType, selected: boolean) => React.ReactNode;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}) => {
  const itemAny = item as any;
  const label = itemAny[labelField]?.toString() ?? '';

  // Generate testID: {pickerTestID}-option-{index}
  const testID = `option-${itemIndex}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        webStyles.item,
        isSelected && { backgroundColor: activeColor ?? COLORS.primary4 },
        isHovered && !isSelected && { backgroundColor: COLORS.secondary2 },
      ]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      testID={testID}
    >
      {renderItem ? (
        renderItem(item, isSelected)
      ) : (
        <Text style={webStyles.itemText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// Component for rendering the modal input trigger
const DropdownInputTrigger = ({
  disabled,
  placeholder,
  displayText,
  hasSelection,
  inputVariant,
  testID,
  onPress,
}: {
  disabled?: boolean;
  placeholder?: string;
  displayText: string;
  hasSelection: boolean;
  inputVariant?: 'default' | 'picker';
  testID?: string;
  onPress: () => void;
}) => {
  return (
    <View style={webStyles.inputContainer}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={webStyles.inputValue}
        testID={testID}
      >
        <Text style={hasSelection ? webStyles.inputValueTextSelected : webStyles.inputValueText}>
          {hasSelection ? displayText : placeholder}
        </Text>
      </TouchableOpacity>
      {inputVariant === 'picker' && <View style={webStyles.underline} />}
    </View>
  );
};

// Component for rendering the inline dropdown trigger
const DropdownInlineTrigger = ({
  disabled,
  displayText,
  isOpen,
  inputVariant,
  isFocused,
  testID,
  onPress,
  hasSelection,
  onClear,
  placeholder,
}: {
  disabled?: boolean;
  displayText: string;
  isOpen: boolean;
  inputVariant?: 'default' | 'picker';
  isFocused: boolean;
  testID?: string;
  onPress: () => void;
  hasSelection: boolean;
  onClear?: () => void;
  placeholder?: string;
}) => {
  const selectStyle = React.useMemo(() => [
    webStyles.select,
    {
      backgroundColor: disabled ? COLORS.secondary2 : COLORS.secondary,
      borderWidth: inputVariant === 'picker' ? 0 : 1,
      borderColor: isFocused ? COLORS.primary : COLORS.secondary3,
      borderRadius: inputVariant === 'picker' ? 0 : 4,
      opacity: disabled ? 0.6 : 1,
    },
  ], [disabled, inputVariant, isFocused]);

  const selectTextStyle = React.useMemo(() => [
    webStyles.selectText,
    {
      color: hasSelection ? COLORS.text : COLORS.textInputPlaceholder,
    },
  ], [hasSelection]);

  const handleClearPress = React.useCallback((e: any) => {
    e.stopPropagation();
    onClear?.();
  }, [onClear]);

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={selectStyle}
        testID={testID}
      >
        <Text style={selectTextStyle} numberOfLines={1}>
          {hasSelection ? displayText : (placeholder || '')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {hasSelection && onClear && (
            <TouchableOpacity
              onPress={handleClearPress}
              style={webStyles.clearButton}
              testID={testID ? `${testID}-clear` : undefined}
            >
              <Text style={webStyles.clearIcon}>×</Text>
            </TouchableOpacity>
          )}
          <Text style={webStyles.selectIcon}>{isOpen ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>
      {inputVariant === 'picker' && <View style={webStyles.underline} />}
    </>
  );
};

// Component for rendering dropdown list content
const DropdownListContent = <TValueType,>({
  filteredData,
  queryResult,
  getItemKey,
  checkIsSelected,
  labelField,
  activeColor,
  renderItem,
  hoveredItemKey,
  setHoveredItemKey,
  toggleItem,
}: {
  filteredData: TValueType[];
  queryResult: UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error> | null;
  getItemKey: (item: TValueType) => string;
  checkIsSelected: (item: TValueType) => boolean;
  labelField: string;
  activeColor?: string;
  renderItem?: (item: TValueType, selected: boolean) => React.ReactNode;
  hoveredItemKey: string | null;
  setHoveredItemKey: (key: string | null) => void;
  toggleItem: (item: TValueType) => void;
}) => {
  if (filteredData.length === 0) {
    return (
      <View style={{ padding: 12 }}>
        <Text style={webStyles.emptyText}>
          {queryResult?.isLoading ? 'Loading...' : 'No results found'}
        </Text>
      </View>
    );
  }

  return (
    <>
      {filteredData.map((item, index) => {
        const itemKey = getItemKey(item);
        const isSelected = checkIsSelected(item);
        const isHovered = hoveredItemKey === itemKey;

        return (
          <DropdownListItem
            key={itemKey}
            item={item}
            isSelected={isSelected}
            isHovered={isHovered}
            labelField={labelField}
            activeColor={activeColor}
            itemIndex={index}
            renderItem={renderItem}
            onPress={() => toggleItem(item)}
            onPressIn={() => setHoveredItemKey(itemKey)}
            onPressOut={() => setHoveredItemKey(null)}
          />
        );
      })}
      {queryResult?.isFetchingNextPage && (
        <View style={{ padding: 15, alignItems: 'center' }}>
          <Text style={{ color: COLORS.textFaded }}>Loading...</Text>
        </View>
      )}
      {queryResult?.hasNextPage && !queryResult?.isFetchingNextPage && (
        <TouchableOpacity
          onPress={() => queryResult?.fetchNextPage()}
          style={{ padding: 15, alignItems: 'center' }}
        >
          <Text style={{ color: COLORS.primary }}>Load more</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

// Web dropdown component
const WebDropdown = <TValueType,>(props: DropdownProps<TValueType> & {
  testID?: string;
  multiple?: boolean;
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType | TValueType[]) => void;
  useQueryHook?: (options?: any) => UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error>;
  queryOptions?: any;
  onSearchFilter?: (searchText: string, baseQueryOptions: any) => any;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;
  keyExtractor?: (item: TValueType) => string;
  inputVariant?: 'default' | 'picker';
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [pendingSelection, setPendingSelection] = React.useState<Map<string, TValueType>>(new Map());
  const [hoveredItemKey, setHoveredItemKey] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<View>(null);
  const debouncedSearchText = useDebounce(searchText, 300);

  const multiple = props.multiple ?? false;
  const mode = props.mode ?? 'default';
  const isModal = mode === 'modal' || (mode === 'auto' && Platform.OS !== 'web');
  const confirmSelect = props.confirmSelectItem ?? false;

  // Key extractor - defined early as it's used in other hooks
  const getItemKey = React.useCallback((item: TValueType): string => {
    if (props.keyExtractor) {
      return props.keyExtractor(item);
    }
    if ((item as any).id != null) {
      return String((item as any).id);
    }
    return String((item as any)[props.valueField]);
  }, [props.keyExtractor, props.valueField]);

  // Get current selection map (pending if confirming, otherwise from props.value)
  const currentSelection = React.useMemo(() => {
    if (confirmSelect && isOpen) {
      return pendingSelection;
    }
    const map = new Map<string, TValueType>();
    if (props.value != null) {
      const items = Array.isArray(props.value) ? props.value : [props.value];
      items.forEach((item) => {
        const key = getItemKey(item);
        map.set(key, item);
      });
    }
    return map;
  }, [confirmSelect, isOpen, pendingSelection, props.value, getItemKey]);

  // Handle async data loading
  const finalQueryOptions = React.useMemo(() => {
    if (!props.useQueryHook) return null;

    const baseOptions = { ...(props.queryOptions || {}) };

    if (!debouncedSearchText) {
      return baseOptions;
    }

    if (props.onSearchFilter) {
      return props.onSearchFilter(debouncedSearchText, baseOptions);
    }

    if (props.shouldUseSearchQuery) {
      return {
        ...baseOptions,
        search: debouncedSearchText,
      };
    }

    // For web, we'll do client-side filtering if no server-side search
    return baseOptions;
  }, [props.queryOptions, debouncedSearchText, props.onSearchFilter, props.shouldUseSearchQuery, props.useQueryHook]);

  const queryResult = props.useQueryHook
    ? props.useQueryHook(finalQueryOptions)
    : null;

  const flatData = React.useMemo(() => {
    if (queryResult?.data) {
      return queryResult.data.pages.flatMap((page) => page);
    }
    return props.data || [];
  }, [queryResult?.data, props.data]);

  // Filter data based on search query (client-side if no server-side search)
  const filteredData = React.useMemo(() => {
    if (!props.search || !searchText.trim() || props.shouldUseSearchQuery || props.onSearchFilter) {
      return flatData;
    }

    const searchLower = searchText.toLowerCase();
    return flatData.filter((item) => {
      const labelValue = (item[props.labelField] as unknown as any)?.toString().toLowerCase() ?? '';
      const searchFieldValue = props.searchField
        ? (item[props.searchField] as unknown as any)?.toString().toLowerCase() ?? ''
        : '';

      if (props.searchQuery) {
        return props.searchQuery(searchText, labelValue);
      }

      return labelValue.includes(searchLower) || searchFieldValue.includes(searchLower);
    });
  }, [flatData, props.search, searchText, props.labelField, props.searchField, props.searchQuery, props.shouldUseSearchQuery, props.onSearchFilter]);

  // Initialize pending selection when modal opens
  React.useEffect(() => {
    if (!isOpen || !confirmSelect) return;

    const newMap = new Map<string, TValueType>();
    if (props.value != null) {
      const items = Array.isArray(props.value) ? props.value : [props.value];
      items.forEach((item) => {
        const key = getItemKey(item);
        newMap.set(key, item);
      });
    }
    setPendingSelection(newMap);
  }, [isOpen, confirmSelect, props.value, getItemKey]);

  // Handle click outside to close dropdown (non-modal only) - handled by Modal component for modal mode

  // Common function to reset dropdown state
  const resetDropdownState = React.useCallback(() => {
    setIsOpen(false);
    setIsFocused(false);
    setSearchText('');
    setPendingSelection(new Map());
    props.onBlur?.();
  }, [props]);

  const toggleItem = React.useCallback((item: TValueType) => {
    const key = getItemKey(item);

    if (confirmSelect) {
      // Update pending selection
      setPendingSelection((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(key)) {
          newMap.delete(key);
        } else {
          if (!multiple) {
            newMap.clear();
          }
          newMap.set(key, item);
        }
        return newMap;
      });
    } else {
      // Immediate selection
      if (multiple) {
        // For multi-select without confirmation, toggle in current selection
        const currentItems = Array.from(currentSelection.values());
        const existingIndex = currentItems.findIndex((i) => getItemKey(i) === key);
        if (existingIndex >= 0) {
          currentItems.splice(existingIndex, 1);
        } else {
          currentItems.push(item);
        }
        props.onChange?.(currentItems as any);
      } else {
        props.onChange?.(item as any);
      }

      // Close if not modal or single select
      if (!isModal || !multiple) {
        resetDropdownState();
      }
    }
  }, [multiple, confirmSelect, getItemKey, currentSelection, isModal, props, resetDropdownState]);

  const handleConfirm = React.useCallback(() => {
    const items = Array.from(pendingSelection.values());
    if (multiple) {
      props.onChange?.(items as any);
      props.onConfirmSelectItem?.(items);
    } else {
      props.onChange?.(items[0] as any);
      props.onConfirmSelectItem?.(items[0]);
    }
    resetDropdownState();
  }, [pendingSelection, multiple, props, resetDropdownState]);

  const handleClear = React.useCallback(() => {
    if (confirmSelect) {
      setPendingSelection(new Map());
    } else {
      props.onChange?.(multiple ? [] : null as any);
      resetDropdownState();
    }
  }, [confirmSelect, multiple, props, resetDropdownState]);

  const handleToggle = React.useCallback(() => {
    if (props.disable) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFocused(true);
      props.onFocus?.();
    } else {
      resetDropdownState();
    }
  }, [isOpen, props, resetDropdownState]);

  const handleClose = React.useCallback(() => {
    resetDropdownState();
  }, [resetDropdownState]);

  // Get selected items for display
  const selectedItemsForDisplay = React.useMemo(() => {
    return Array.from(currentSelection.values());
  }, [currentSelection]);

  const displayText = React.useMemo(() => {
    if (selectedItemsForDisplay.length === 0) {
      return props.placeholder ?? '';
    }
    if (multiple) {
      return selectedItemsForDisplay
        .map((item) => (item as any)[props.labelField]?.toString() ?? '')
        .join(', ');
    }
    return (selectedItemsForDisplay[0] as any)[props.labelField]?.toString() ?? '';
  }, [selectedItemsForDisplay, multiple, props.labelField, props.placeholder]);

  const checkIsSelected = React.useCallback((item: TValueType): boolean => {
    const key = getItemKey(item);
    return currentSelection.has(key);
  }, [getItemKey, currentSelection]);

  const dropdownListStyle = React.useMemo(() => [
    webStyles.dropdownList,
    {
      borderColor: isFocused ? COLORS.primary : COLORS.secondary3,
      maxHeight: props.maxHeight ?? 300,
    },
  ], [isFocused, props.maxHeight]);

  // Render modal version
  if (isModal) {
    const footerComponent = React.useMemo(() => {
      const components = [];
      
      components.push(
        <LoadingListFooter 
          key="loading-footer"
          isLoading={queryResult?.isFetchingNextPage || queryResult?.isLoading || false} 
        />
      );
      
      if (confirmSelect) {
        components.push(
          <View 
            key="confirm-buttons"
            style={{ 
              flexDirection: 'row', 
              justifyContent: 'flex-end', 
              paddingHorizontal: 12, 
              height: 49, 
              alignItems: 'center', 
              borderTopWidth: 1, 
              borderTopColor: COLORS.secondary3 
            }}
          >
            <Button
              disabled={pendingSelection.size === 0}
              onPress={handleClear}
              title="Clear"
              type="clear"
              titleStyle={{ color: pendingSelection.size === 0 ? COLORS.textFaded : COLORS.danger }}
            />
            <Button
              onPress={handleConfirm}
              title={multiple ? `Select (${pendingSelection.size})` : 'Select'}
              type="clear"
              titleStyle={{ color: COLORS.primary2 }}
              testID="picker-control-select-button"
            />
          </View>
        );
      }
      
      return <>{components}</>;
    }, [queryResult?.isFetchingNextPage, queryResult?.isLoading, confirmSelect, pendingSelection.size, handleClear, handleConfirm, multiple]);

    return (
      <>
        <DropdownInputTrigger
          disabled={props.disable}
          placeholder={props.placeholder}
          displayText={displayText}
          hasSelection={selectedItemsForDisplay.length > 0}
          inputVariant={props.inputVariant}
          testID={props.testID}
          onPress={handleToggle}
        />

        <Modal 
          isVisible={isOpen} 
          onHideModal={handleClose} 
          testID={props.testID ? `${props.testID}-modal` : undefined}
        >
          <Container>
            <Header
              leftComponent={
                <HeaderIconButton name="arrow-back" onPress={handleClose} />
              }
              rightComponent={
                props.search ? (
                  <HeaderSearchBar
                    onChangeText={setSearchText}
                    value={searchText}
                  />
                ) : undefined
              }
              title={props.headerTitle ?? 'Select'}
            />
            <List
              data={{ pages: [filteredData], pageParams: [0] } as InfiniteData<TValueType[]>}
              extraData={{ size: currentSelection.size, hoveredItemKey }}
              keyExtractor={(item) => getItemKey(item)}
              listType="flatList"
              ListFooterComponent={footerComponent}
              onEndReached={() => {
                if (queryResult?.hasNextPage && !queryResult?.isFetchingNextPage) {
                  queryResult.fetchNextPage();
                }
              }}
              renderItem={({ item, index }) => {
                const itemKey = getItemKey(item);
                const isSelected = checkIsSelected(item);
                const isHovered = hoveredItemKey === itemKey;

                return (
                  <DropdownListItem
                    item={item}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    labelField={String(props.labelField)}
                    activeColor={props.activeColor}
                    itemIndex={index}
                    renderItem={props.renderItem}
                    onPress={() => toggleItem(item)}
                    onPressIn={() => setHoveredItemKey(itemKey)}
                    onPressOut={() => setHoveredItemKey(null)}
                  />
                );
              }}
            />
          </Container>
        </Modal>
      </>
    );
  }

  // Render inline dropdown
  return (
    <View ref={dropdownRef} style={webStyles.container}>
      <DropdownInlineTrigger
        disabled={props.disable}
        displayText={displayText || props.placeholder || ''}
        isOpen={isOpen}
        inputVariant={props.inputVariant}
        isFocused={isFocused}
        testID={props.testID}
        onPress={handleToggle}
        hasSelection={selectedItemsForDisplay.length > 0}
        onClear={() => {
          props.onChange?.(multiple ? [] : null as any);
        }}
        placeholder={props.placeholder}
      />

      {isOpen && (
        <View style={dropdownListStyle}>
          <ScrollView style={{ maxHeight: props.maxHeight ?? 300 }}>
            {props.search && (
              <TextInput
                placeholder={props.searchPlaceholder ?? 'Search...'}
                placeholderTextColor={props.searchPlaceholderTextColor ?? COLORS.textInputPlaceholder}
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  props.onChangeText?.(text);
                }}
                style={webStyles.searchInput}
                testID={props.testID ? `${props.testID}-search` : undefined}
              />
            )}
            <DropdownListContent
              filteredData={filteredData}
              queryResult={queryResult}
              getItemKey={getItemKey}
              checkIsSelected={checkIsSelected}
              labelField={String(props.labelField)}
              activeColor={props.activeColor}
              renderItem={props.renderItem}
              hoveredItemKey={hoveredItemKey}
              setHoveredItemKey={setHoveredItemKey}
              toggleItem={toggleItem}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// Native dropdown wrapper
const Dropdown = <TValueType,>(props: DropdownProps<TValueType> & {
  testID?: string;
  multiple?: boolean;
  mode?: 'default' | 'modal' | 'auto';
  headerTitle?: string;
  confirmSelectItem?: boolean;
  onConfirmSelectItem?: (item: TValueType | TValueType[]) => void;
  useQueryHook?: (options?: any) => UseInfiniteQueryResult<InfiniteData<TValueType[]>, Error>;
  queryOptions?: any;
  onSearchFilter?: (searchText: string, baseQueryOptions: any) => any;
  searchBy?: string;
  shouldUseSearchQuery?: boolean;
  keyExtractor?: (item: TValueType) => string;
  inputVariant?: 'default' | 'picker';
}) => {
  if (Platform.OS === 'web') {
    return <WebDropdown {...props} />;
  }

  // For native, use react-native-element-dropdown
  // Add clear button support via renderRightIcon if value exists
  const nativeProps: any = { ...props };
  if (props.value != null && !props.renderRightIcon) {
    nativeProps.renderRightIcon = () => {
      if (props.value == null) return null;
      return (
        <TouchableOpacity
          onPress={(e: any) => {
            e.stopPropagation();
            props.onChange?.(props.multiple ? [] : null as any);
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 16, color: COLORS.textFaded }}>×</Text>
        </TouchableOpacity>
      );
    };
  }

  return <RNEDropdown {...nativeProps} />;
};

export const DropdownInput = <TValueType,>({
  defaultValue,
  name,
  required = false,
  onChange: onChangeOuter,
  valueField,
  testID,
  multiple = false,
  mode = 'default',
  headerTitle,
  confirmSelectItem = false,
  onConfirmSelectItem,
  useQueryHook,
  queryOptions,
  onSearchFilter,
  searchBy,
  shouldUseSearchQuery = false,
  keyExtractor,
  inputVariant = 'default',
  ...props
}: DropdownInputProps<TValueType>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={nullthrows(name, 'DropdownInput: name prop is required and must be a non-empty string')}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => {
        // Handle value normalization - support both objects and primitives
        let displayValue: TValueType | TValueType[] | undefined;

        if (multiple) {
          if (Array.isArray(value)) {
            displayValue = value;
          } else if (value != null) {
            displayValue = [value] as TValueType[];
          } else {
            displayValue = [];
          }
        } else {
          if (valueField && value != null) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              // Value is an object, use it directly
              displayValue = value;
            } else {
              // Value is a primitive (ID), will be resolved by component
              displayValue = value;
            }
          } else {
            displayValue = value;
          }
        }

        return (
          <View>
            <Dropdown<TValueType>
              {...(props as any)}
              data={(props.data || []) as any[]}
              valueField={valueField}
              value={displayValue}
              onBlur={onBlur}
              testID={testID}
              multiple={multiple}
              mode={mode}
              headerTitle={headerTitle}
              confirmSelectItem={confirmSelectItem}
              onConfirmSelectItem={(item) => {
                onConfirmSelectItem?.(item);
                if (multiple) {
                  onChange(item as TValueType[]);
                } else {
                  onChange(item as TValueType);
                }
              }}
              useQueryHook={useQueryHook}
              queryOptions={queryOptions}
              onSearchFilter={onSearchFilter}
              searchBy={searchBy}
              shouldUseSearchQuery={shouldUseSearchQuery}
              keyExtractor={keyExtractor}
              inputVariant={inputVariant}
              onChange={(item) => {
                if (!confirmSelectItem) {
                  // Extract the value if valueField is provided
                  const valueToStore = valueField && item != null
                    ? (item as any)[valueField]
                    : item;

                  if (multiple) {
                    const currentValues = Array.isArray(value) ? value : [];
                    const itemValue = valueField ? (item as any)[valueField] : item;
                    const newValues = currentValues.includes(itemValue)
                      ? currentValues.filter((v) => v !== itemValue)
                      : [...currentValues, itemValue];
                    onChange(newValues as any);
                  } else {
                    onChange(valueToStore);
                  }
                  onChangeOuter?.(item);
                }
              }}
            />
          </View>
        );
      }}
    />
  );
};
