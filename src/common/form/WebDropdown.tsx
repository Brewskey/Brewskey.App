import * as React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '@rneui/themed';

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

// Styles matching react-native-element-dropdown visual design
const styles = StyleSheet.create({
  // Trigger styles
  trigger: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary,
  },
  triggerDefault: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.secondary3,
  },
  triggerPicker: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary3,
  },
  triggerFocused: {
    borderColor: COLORS.primary,
  },
  triggerDisabled: {
    backgroundColor: COLORS.secondary2,
    opacity: 0.6,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  triggerPlaceholder: {
    color: COLORS.textInputPlaceholder,
  },
  triggerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  clearIcon: {
    fontSize: 18,
    color: COLORS.textFaded,
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Modal styles
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  dropdownPanel: {
    position: 'absolute',
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.secondary3,
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  // Search input styles
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary3,
  },

  // List item styles
  listItem: {
    paddingVertical: 17,
    paddingHorizontal: 12,
  },
  listItemSelected: {
    backgroundColor: COLORS.primary4,
  },
  listItemHovered: {
    backgroundColor: COLORS.secondary2,
  },
  listItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  emptyText: {
    padding: 17,
    fontSize: 16,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
  loadMoreButton: {
    padding: 15,
    alignItems: 'center',
  },
  loadMoreText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  loadingText: {
    padding: 15,
    textAlign: 'center',
    color: COLORS.textFaded,
  },

  // Confirmation footer styles
  confirmFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    height: 49,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.secondary3,
  },
});

// Props for WebDropdown component
export type WebDropdownProps<TValueType> = DropdownProps & {
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
};

// Dropdown trigger component
const DropdownTrigger = ({
  displayText,
  placeholder,
  hasSelection,
  isOpen,
  disabled,
  inputVariant,
  testID,
  onPress,
  onClear,
  selectedContent,
}: {
  displayText: string;
  placeholder?: string;
  hasSelection: boolean;
  isOpen: boolean;
  disabled?: boolean;
  inputVariant?: 'default' | 'picker';
  testID?: string;
  onPress: () => void;
  onClear?: () => void;
  selectedContent?: React.ReactNode;
}) => {
  const triggerStyle = React.useMemo(() => [
    styles.trigger,
    inputVariant === 'picker' ? styles.triggerPicker : styles.triggerDefault,
    isOpen && styles.triggerFocused,
    disabled && styles.triggerDisabled,
  ], [inputVariant, isOpen, disabled]);

  const textStyle = React.useMemo(() => [
    styles.triggerText,
    !hasSelection && styles.triggerPlaceholder,
  ], [hasSelection]);

  const handleClear = React.useCallback((e: any) => {
    e.stopPropagation?.();
    onClear?.();
  }, [onClear]);

  return (
    <TouchableOpacity
      style={triggerStyle}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={0.7}
    >
      {selectedContent != null ? (
        <View style={[styles.triggerText, { flexDirection: 'row', alignItems: 'center' }]}>
          {selectedContent}
        </View>
      ) : (
        <Text style={textStyle} numberOfLines={1}>
          {hasSelection ? displayText : (placeholder || 'Select...')}
        </Text>
      )}
      <View style={styles.triggerIconContainer}>
        {hasSelection && onClear && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            testID={testID ? `${testID}-clear` : undefined}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.dropdownIcon}>{isOpen ? '▲' : '▼'}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Dropdown list item component
const DropdownListItem = <TValueType,>({
  item,
  index,
  isSelected,
  isHovered,
  labelField,
  activeColor,
  renderItem,
  onPress,
  onHoverIn,
  onHoverOut,
}: {
  item: TValueType;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  labelField: string;
  activeColor?: string;
  renderItem?: (item: TValueType, selected: boolean) => React.ReactNode;
  onPress: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) => {
  const label = (item as any)[labelField]?.toString() ?? '';
  const testID =  `option-${index}`;

  const itemStyle = React.useMemo(() => [
    styles.listItem,
    isSelected && [styles.listItemSelected, activeColor ? { backgroundColor: activeColor } : null],
    isHovered && !isSelected && styles.listItemHovered,
  ], [isSelected, isHovered, activeColor]);

  return (
    <TouchableOpacity
      style={itemStyle}
      onPress={onPress}
      onPressIn={onHoverIn}
      onPressOut={onHoverOut}
      testID={testID}
      activeOpacity={0.7}
    >
      {renderItem ? (
        renderItem(item, isSelected)
      ) : (
        <Text style={styles.listItemText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// Main WebDropdown component
export const WebDropdown = <TValueType,>(props: WebDropdownProps<TValueType>) => {
  const {
    data: staticData,
    labelField,
    valueField,
    value,
    placeholder,
    disable,
    search,
    searchPlaceholder,
    searchPlaceholderTextColor,
    activeColor,
    maxHeight = 300,
    renderItem,
    onChange,
    onChangeText,
    onFocus,
    onBlur,
    testID,
    multiple = false,
    confirmSelectItem = false,
    onConfirmSelectItem,
    useQueryHook,
    queryOptions,
    onSearchFilter,
    shouldUseSearchQuery = false,
    keyExtractor,
    inputVariant = 'default',
  } = props;

  // State
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [pendingSelection, setPendingSelection] = React.useState<Map<string, TValueType>>(new Map());
  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);
  const [triggerLayout, setTriggerLayout] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const triggerRef = React.useRef<View>(null);
  const debouncedSearchText = useDebounce(searchText, 300);

  // Key extractor helper
  const getItemKey = React.useCallback((item: TValueType): string => {
    if (keyExtractor) return keyExtractor(item);
    if ((item as any).id != null) return String((item as any).id);
    return String((item as any)[valueField]);
  }, [keyExtractor, valueField]);

  // Query options with search
  const finalQueryOptions = React.useMemo(() => {
    if (!useQueryHook) return null;
    const baseOptions = { ...(queryOptions || {}) };
    if (!debouncedSearchText) return baseOptions;
    
    if (onSearchFilter) {
      return onSearchFilter(debouncedSearchText, baseOptions);
    }
    if (shouldUseSearchQuery) {
      return { ...baseOptions, search: debouncedSearchText };
    }
    return baseOptions;
  }, [queryOptions, debouncedSearchText, onSearchFilter, shouldUseSearchQuery, useQueryHook]);

  // Query hook for async data
  const queryResult = useQueryHook ? useQueryHook(finalQueryOptions) : null;

  // Flatten data from query or use static data
  const flatData = React.useMemo(() => {
    if (queryResult?.data) {
      return queryResult.data.pages.flatMap((page) => page);
    }
    return staticData || [];
  }, [queryResult?.data, staticData]);

  // Resolve value to item objects
  const resolveValuesToItems = React.useCallback((val: TValueType | TValueType[] | null | undefined): Map<string, TValueType> => {
    const map = new Map<string, TValueType>();
    if (val == null) return map;

    const values = Array.isArray(val) ? val : [val];
    values.forEach((v) => {
      if (valueField && flatData.length > 0 && v !== null && typeof v !== 'object') {
        const match = flatData.find((item) => {
          const itemValue = (item as any)[valueField];
          return itemValue === v || String(itemValue) === String(v);
        });
        if (match) map.set(getItemKey(match), match);
      } else if (v != null) {
        map.set(getItemKey(v as TValueType), v as TValueType);
      }
    });
    return map;
  }, [valueField, flatData, getItemKey]);

  // Current selection
  const currentSelection = React.useMemo(() => {
    if (confirmSelectItem && isOpen) return pendingSelection;
    return resolveValuesToItems(value);
  }, [confirmSelectItem, isOpen, pendingSelection, value, resolveValuesToItems]);

  // Filter data for client-side search
  const filteredData = React.useMemo(() => {
    if (!search || !searchText.trim() || shouldUseSearchQuery || onSearchFilter) {
      return flatData;
    }
    const searchLower = searchText.toLowerCase();
    return flatData.filter((item) => {
      const labelValue = (item as any)[labelField]?.toString().toLowerCase() ?? '';
      return labelValue.includes(searchLower);
    });
  }, [flatData, search, searchText, labelField, shouldUseSearchQuery, onSearchFilter]);

  // Initialize pending selection when opening with confirmation
  React.useEffect(() => {
    if (isOpen && confirmSelectItem) {
      setPendingSelection(resolveValuesToItems(value));
    }
  }, [isOpen, confirmSelectItem, value, resolveValuesToItems]);

  // Measure trigger position when opening
  const measureTrigger = React.useCallback(() => {
    if (triggerRef.current) {
      (triggerRef.current as any).measureInWindow?.((x: number, y: number, width: number, height: number) => {
        setTriggerLayout({ x, y, width, height });
      });
    }
  }, []);

  // Handlers
  const handleOpen = React.useCallback(() => {
    if (disable) return;
    measureTrigger();
    setIsOpen(true);
    onFocus?.();
  }, [disable, measureTrigger, onFocus]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setSearchText('');
    setPendingSelection(new Map());
    setHoveredKey(null);
    onBlur?.();
  }, [onBlur]);

  const handleToggle = React.useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);

  const handleSelectItem = React.useCallback((item: TValueType) => {
    const key = getItemKey(item);

    if (confirmSelectItem) {
      // Update pending selection
      setPendingSelection((prev) => {
        const next = new Map(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          if (!multiple) next.clear();
          next.set(key, item);
        }
        return next;
      });
    } else {
      // Immediate selection
      if (multiple) {
        const currentItems = Array.from(currentSelection.values());
        const existingIndex = currentItems.findIndex((i) => getItemKey(i) === key);
        if (existingIndex >= 0) {
          currentItems.splice(existingIndex, 1);
        } else {
          currentItems.push(item);
        }
        onChange?.(currentItems as any);
      } else {
        onChange?.(item as any);
        handleClose();
      }
    }
  }, [confirmSelectItem, multiple, getItemKey, currentSelection, onChange, handleClose]);

  const handleConfirm = React.useCallback(() => {
    const items = Array.from(pendingSelection.values());
    if (multiple) {
      onChange?.(items as any);
      onConfirmSelectItem?.(items);
    } else {
      onChange?.(items[0] as any);
      onConfirmSelectItem?.(items[0]);
    }
    handleClose();
  }, [pendingSelection, multiple, onChange, onConfirmSelectItem, handleClose]);

  const handleClear = React.useCallback(() => {
    if (confirmSelectItem) {
      setPendingSelection(new Map());
    } else {
      onChange?.(multiple ? ([] as any) : (null as any));
    }
  }, [confirmSelectItem, multiple, onChange]);

  const handleSearchChange = React.useCallback((text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  }, [onChangeText]);

  // Display text (fallback when renderItem is not used for the trigger)
  const selectedItems = Array.from(currentSelection.values());
  const displayText = React.useMemo(() => {
    if (selectedItems.length === 0) return '';
    if (multiple) {
      return selectedItems.map((item) => (item as any)[labelField]?.toString() ?? '').join(', ');
    }
    return (selectedItems[0] as any)[labelField]?.toString() ?? '';
  }, [selectedItems, multiple, labelField]);

  // Selected content using renderItem when provided (e.g. custom row like ColorIcon in SrmPicker)
  const selectedContent = React.useMemo((): React.ReactNode => {
    if (!renderItem || selectedItems.length === 0) return undefined;
    if (multiple) {
      return selectedItems.map((it, i) => (
        <React.Fragment key={getItemKey(it)}>
          {i > 0 ? ', ' : null}
          {renderItem(it, true)}
        </React.Fragment>
      ));
    }
    return renderItem(selectedItems[0], true);
  }, [renderItem, selectedItems, multiple, getItemKey]);

  const hasSelection = selectedItems.length > 0;

  // Check if item is selected
  const checkIsSelected = React.useCallback((item: TValueType): boolean => {
    return currentSelection.has(getItemKey(item));
  }, [currentSelection, getItemKey]);

  // Dropdown panel position
  const panelStyle = React.useMemo(() => ({
    ...styles.dropdownPanel,
    top: triggerLayout.y + triggerLayout.height + 4,
    left: triggerLayout.x,
    width: triggerLayout.width,
    maxHeight,
  }), [triggerLayout, maxHeight]);

  return (
    <View ref={triggerRef} collapsable={false}>
      <DropdownTrigger
        displayText={displayText}
        placeholder={placeholder}
        hasSelection={hasSelection}
        isOpen={isOpen}
        disabled={disable}
        inputVariant={inputVariant}
        testID={testID}
        onPress={handleToggle}
        onClear={hasSelection ? handleClear : undefined}
        selectedContent={selectedContent}
      />

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
        testID={testID ? `${testID}-modal` : undefined}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleClose} />
        
        <View style={panelStyle}>
          {search && (
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder ?? 'Search...'}
              placeholderTextColor={searchPlaceholderTextColor ?? COLORS.textInputPlaceholder}
              value={searchText}
              onChangeText={handleSearchChange}
              testID={testID ? `${testID}-search` : undefined}
              autoFocus
            />
          )}

          <ScrollView
            style={{ maxHeight: maxHeight - (search ? 40 : 0) - (confirmSelectItem ? 49 : 0) }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filteredData.length === 0 ? (
              <Text style={styles.emptyText}>
                {queryResult?.isLoading ? 'Loading...' : 'No results found'}
              </Text>
            ) : (
              filteredData.map((item, index) => {
                const itemKey = getItemKey(item);
                return (
                  <DropdownListItem
                    key={itemKey}
                    item={item}
                    index={index}
                    isSelected={checkIsSelected(item)}
                    isHovered={hoveredKey === itemKey}
                    labelField={String(labelField)}
                    activeColor={activeColor}
                    renderItem={renderItem}
                    onPress={() => handleSelectItem(item)}
                    onHoverIn={() => setHoveredKey(itemKey)}
                    onHoverOut={() => setHoveredKey(null)}
                  />
                );
              })
            )}

            {queryResult?.hasNextPage && !queryResult?.isFetchingNextPage && (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() => queryResult.fetchNextPage()}
              >
                <Text style={styles.loadMoreText}>Load more</Text>
              </TouchableOpacity>
            )}

            {queryResult?.isFetchingNextPage && (
              <Text style={styles.loadingText}>Loading...</Text>
            )}
          </ScrollView>

          {confirmSelectItem && (
            <View style={styles.confirmFooter}>
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
          )}
        </View>
      </Modal>
    </View>
  );
};
