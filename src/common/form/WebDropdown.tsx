import * as React from 'react';
import { Platform, View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
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

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

// Shared styles for web dropdown components
const webStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
    overflow: 'visible',
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
    zIndex: 99999,
    elevation: 50,
    marginTop: 4,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
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
  pickerTestID,
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
  pickerTestID?: string;
}) => {
  const itemAny = item as any;
  const label = itemAny[labelField]?.toString() ?? '';

  // Generate testID: {pickerTestID}-option-{index}
  const testID = pickerTestID ? `${pickerTestID}-option-${itemIndex}` : `option-${itemIndex}`;

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
  pickerTestID,
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
  pickerTestID?: string;
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
            pickerTestID={pickerTestID}
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
export const WebDropdown = <TValueType,>(props: DropdownProps & {
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
  // Track pending form state updates that should be applied after dropdown closes
  const pendingFormUpdateRef = React.useRef<(() => void) | null>(null);

  const multiple = props.multiple ?? false;
  const mode = props.mode ?? 'default';
  const isModal = mode === 'modal';
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

  // Handle async data loading with search
  const finalQueryOptions = React.useMemo(() => {
    if (!props.useQueryHook) return null;
    
    const baseOptions = { ...(props.queryOptions || {}) };
    if (!debouncedSearchText) return baseOptions;

    // Apply search filter if provided, otherwise add search param if enabled
    return props.onSearchFilter
      ? props.onSearchFilter(debouncedSearchText, baseOptions)
      : props.shouldUseSearchQuery
        ? { ...baseOptions, search: debouncedSearchText }
        : baseOptions; // Client-side filtering will handle it
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

  // Helper function to resolve value(s) to item objects
  // Handles both primitive IDs (when valueField is used) and full objects
  const resolveValuesToItems = React.useCallback((value: TValueType | TValueType[] | null | undefined): Map<string, TValueType> => {
    const map = new Map<string, TValueType>();
    if (value == null) return map;

    const values = Array.isArray(value) ? value : [value];
    
    values.forEach((val) => {
      // If valueField is provided and value is a primitive, find matching item in data
      if (props.valueField && flatData && flatData.length > 0 && val !== null && typeof val !== 'object') {
        const matchingItem = flatData.find((item) => {
          const itemValue = (item as any)[props.valueField!];
          return itemValue === val || String(itemValue) === String(val);
        });
        if (matchingItem) {
          map.set(getItemKey(matchingItem), matchingItem);
        }
      } else if (val != null) {
        // Value is already an object, use it directly
        map.set(getItemKey(val as TValueType), val as TValueType);
      }
    });
    
    return map;
  }, [props.valueField, flatData, getItemKey]);

  // Get current selection map (pending if confirming, otherwise from props.value)
  const currentSelection = React.useMemo(() => {
    if (confirmSelect && isOpen) {
      return pendingSelection;
    }
    return resolveValuesToItems(props.value);
  }, [confirmSelect, isOpen, pendingSelection, props.value, resolveValuesToItems]);

  // Filter data based on search query (client-side if no server-side search)
  const filteredData = React.useMemo(() => {
    // Skip client-side filtering if search is disabled, empty, or handled server-side
    if (!props.search || !searchText.trim() || props.shouldUseSearchQuery || props.onSearchFilter) {
      return flatData;
    }

    const searchLower = searchText.toLowerCase();
    return flatData.filter((item) => {
      const labelValue = (item[props.labelField] as unknown as any)?.toString().toLowerCase() ?? '';
      const searchFieldValue = props.searchField
        ? (item[props.searchField] as unknown as any)?.toString().toLowerCase() ?? ''
        : '';

      return props.searchQuery
        ? props.searchQuery(searchText, labelValue)
        : labelValue.includes(searchLower) || searchFieldValue.includes(searchLower);
    });
  }, [flatData, props.search, searchText, props.labelField, props.searchField, props.searchQuery, props.shouldUseSearchQuery, props.onSearchFilter]);

  // Initialize pending selection when modal opens
  React.useEffect(() => {
    if (!isOpen || !confirmSelect) return;
    setPendingSelection(resolveValuesToItems(props.value));
  }, [isOpen, confirmSelect, props.value, resolveValuesToItems]);

  // Apply pending form state updates after dropdown closes
  React.useEffect(() => {
    if (!isOpen && pendingFormUpdateRef.current) {
      // Dropdown is now closed, apply the pending form state update
      // The dropdown list is conditionally rendered with {isOpen && ...}, so when isOpen is false,
      // it's removed from the DOM. Use requestAnimationFrame to ensure DOM has updated.
      const updateFn = pendingFormUpdateRef.current;
      pendingFormUpdateRef.current = null;
      requestAnimationFrame(() => {
        updateFn();
      });
    }
  }, [isOpen]);

  // Cleanup: clear pending updates on unmount
  React.useEffect(() => {
    return () => {
      pendingFormUpdateRef.current = null;
    };
  }, []);

  // Common function to reset dropdown state
  const resetDropdownState = React.useCallback(() => {
    setIsOpen(false);
    setIsFocused(false);
    setSearchText('');
    setPendingSelection(new Map());
    props.onBlur?.();
  }, [props]);

  // Handle click outside to close dropdown (non-modal only) - handled by Modal component for modal mode
  React.useEffect(() => {
    if (!isOpen || isModal) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current) {
        const element = dropdownRef.current as any;
        const target = event.target as Node;
        // Check if click is outside the dropdown container
        // On React Native Web, we need to check the underlying DOM element
        const domNode = element?._nativeNode || element;
        if (domNode && !domNode.contains(target)) {
          resetDropdownState();
        }
      }
    };

    // Use capture phase to catch clicks before they bubble
    // Add a small delay to avoid closing immediately when opening
    const timeoutId = setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('mousedown', handleClickOutside, true);
        document.addEventListener('touchstart', handleClickOutside, true);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside, true);
        document.removeEventListener('touchstart', handleClickOutside, true);
      }
    };
  }, [isOpen, isModal, resetDropdownState]);

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
      // For immediate selection, close dropdown first, then update form state after it's hidden
      // Close if not modal or single select
      if (!isModal || !multiple) {
        // Store the form state update to apply after dropdown closes
        if (multiple) {
          // For multi-select without confirmation, toggle in current selection
          const currentItems = Array.from(currentSelection.values());
          const existingIndex = currentItems.findIndex((i) => getItemKey(i) === key);
          if (existingIndex >= 0) {
            currentItems.splice(existingIndex, 1);
          } else {
            currentItems.push(item);
          }
          pendingFormUpdateRef.current = () => {
            props.onChange?.(currentItems as any);
          };
        } else {
          pendingFormUpdateRef.current = () => {
            props.onChange?.(item as any);
          };
        }
        // Close dropdown first - form state will update after it's hidden
        resetDropdownState();
      } else {
        // Modal or multi-select: update immediately (dropdown stays open)
        if (multiple) {
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
      // Clear any pending form updates when opening dropdown
      pendingFormUpdateRef.current = null;
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

  // Container style with dynamic z-index when dropdown is open
  const containerStyle = React.useMemo(() => [
    webStyles.container,
    {
      // Increase z-index when dropdown is open to ensure it appears above other inputs
      // Use a high value to ensure it's above any form inputs or other UI elements
      zIndex: isOpen ? 10000 : 1,
    },
  ], [isOpen]);

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
                    pickerTestID={props.testID}
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
    <View ref={dropdownRef} style={containerStyle}>
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
          <ScrollView 
            style={{ maxHeight: props.maxHeight ?? 300 }}
            nestedScrollEnabled
          >
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
              pickerTestID={props.testID}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};
