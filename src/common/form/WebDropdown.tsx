import * as React from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../../theme';

import type { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

type DropdownProps = React.ComponentProps<typeof RNEDropdown>;

const styles = StyleSheet.create({
  trigger: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.secondary3,
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
  clearButton: { padding: 4, marginRight: 4 },
  clearIcon: { fontSize: 18, color: COLORS.textFaded },
  dropdownIcon: { fontSize: 12, color: COLORS.text },

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
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary3,
  },
  listItem: { paddingVertical: 17, paddingHorizontal: 12 },
  listItemSelected: { backgroundColor: COLORS.primary4 },
  listItemHovered: { backgroundColor: COLORS.secondary2 },
  listItemText: { fontSize: 16, color: COLORS.text },
  emptyText: {
    padding: 17,
    fontSize: 16,
    color: COLORS.textFaded,
    textAlign: 'center' as const,
  },
});

/** API-compatible with react-native-element-dropdown Dropdown. */
export type WebDropdownProps = DropdownProps;

/**
 * Wraps renderItem so any hooks inside it (e.g. useGetDeviceById in a custom renderItem)
 * run in this component's scope rather than the parent's. This keeps the parent's hook
 * count stable and avoids "Rendered fewer hooks than expected" when renderItem is only
 * called conditionally (e.g. when selectedItem != null).
 */
const RenderItemWrapper = <T,>({
  item,
  selected,
  renderItem,
}: {
  item: T;
  selected: boolean;
  renderItem: (item: T, selected?: boolean) => React.ReactElement | null;
}) => renderItem(item, selected) ?? null;

const DropdownTrigger = ({
  displayText,
  placeholder,
  hasSelection,
  isOpen,
  disabled,
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
  testID?: string;
  onPress: () => void;
  onClear?: () => void;
  selectedContent?: React.ReactNode;
}) => {
  const triggerStyle = [
    styles.trigger,
    isOpen && styles.triggerFocused,
    disabled && styles.triggerDisabled,
  ];
  const textStyle = [
    styles.triggerText,
    !hasSelection && styles.triggerPlaceholder,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={triggerStyle}
      testID={testID}
    >
      {selectedContent != null ? (
        <View
          style={[
            styles.triggerText,
            { flexDirection: 'row', alignItems: 'center' },
          ]}
        >
          {selectedContent}
        </View>
      ) : (
        <Text numberOfLines={1} style={textStyle}>
          {hasSelection ? displayText : (placeholder ?? 'Select item')}
        </Text>
      )}
      <View style={styles.triggerIconContainer}>
        {hasSelection && onClear ? (
          <TouchableOpacity
            style={styles.clearButton}
            testID={testID ? `${testID}-clear` : undefined}
            onPress={(e: any) => {
              e.stopPropagation?.();
              onClear?.();
            }}
          >
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.dropdownIcon}>{isOpen ? '▲' : '▼'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DropdownListItem = <T,>({
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
  item: T;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  labelField: string;
  activeColor?: string;
  renderItem?: (item: T, selected?: boolean) => React.ReactElement | null;
  onPress: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
}) => {
  const label = String((item as Record<string, unknown>)[labelField] ?? '');
  const itemStyle = [
    renderItem == null ? styles.listItem : null,
    isSelected && [
      styles.listItemSelected,
      activeColor ? { backgroundColor: activeColor } : null,
    ],
    isHovered && !isSelected && styles.listItemHovered,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onPressIn={onHoverIn}
      onPressOut={onHoverOut}
      style={itemStyle}
      testID={`option-${index}`}
    >
      {renderItem ? (
        <RenderItemWrapper<T>
          item={item}
          renderItem={renderItem}
          selected={isSelected}
        />
      ) : (
        <Text style={styles.listItemText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const WebDropdown = <T = unknown,>(
  props: WebDropdownProps,
): React.ReactElement => {
  const {
    data = [],
    labelField,
    valueField,
    value,
    placeholder = 'Select item',
    disable,
    search = false,
    searchPlaceholder,
    searchPlaceholderTextColor,
    activeColor,
    maxHeight = 340,
    renderItem,
    onChange,
    onChangeText,
    onFocus,
    onBlur,
    testID,
    confirmSelectItem,
    onConfirmSelectItem,
    closeModalWhenSelectedItem = true,
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);
  const [triggerLayout, setTriggerLayout] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const triggerRef = React.useRef<View>(null);

  const measureTrigger = React.useCallback(() => {
    (triggerRef.current as any)?.measureInWindow?.(
      (x: number, y: number, w: number, h: number) => {
        setTriggerLayout({ x, y, width: w, height: h });
      },
    );
  }, []);

  const handleOpen = React.useCallback(() => {
    if (disable) return;
    measureTrigger();
    setIsOpen(true);
    onFocus?.();
  }, [disable, measureTrigger, onFocus]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    setSearchText('');
    setHoveredKey(null);
    onChangeText?.('');
    onBlur?.();
  }, [onBlur, onChangeText]);

  const handleToggle = React.useCallback(() => {
    if (isOpen) handleClose();
    else handleOpen();
  }, [isOpen, handleOpen, handleClose]);

  const handleSelectItem = React.useCallback(
    (item: T) => {
      if (confirmSelectItem && onConfirmSelectItem) {
        onConfirmSelectItem(item);
        return;
      }
      onChange(item);
      if (closeModalWhenSelectedItem) handleClose();
    },
    [
      confirmSelectItem,
      onConfirmSelectItem,
      onChange,
      closeModalWhenSelectedItem,
      handleClose,
    ],
  );

  const handleClear = React.useCallback(
    () => onChange(null as any),
    [onChange],
  );

  const handleSearchChange = React.useCallback(
    (text: string) => {
      setSearchText(text);
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const displayText =
    value != null ? String(value[labelField as string] ?? '') : '';

  const selectedContent =
    renderItem && value != null ? (
      <RenderItemWrapper<T> selected item={value} renderItem={renderItem} />
    ) : undefined;
  const hasSelection = value != null;

  const panelStyle = {
    ...styles.dropdownPanel,
    top: triggerLayout.y + triggerLayout.height + 4,
    left: triggerLayout.x,
    width: triggerLayout.width,
    maxHeight,
  };

  const scrollH = maxHeight - (search ? 40 : 0);

  return (
    <View ref={triggerRef} collapsable={false}>
      <DropdownTrigger
        disabled={disable}
        displayText={displayText}
        hasSelection={hasSelection}
        isOpen={isOpen}
        onClear={hasSelection ? handleClear : undefined}
        onPress={handleToggle}
        placeholder={placeholder}
        selectedContent={selectedContent}
        testID={testID}
      />

      <Modal
        transparent
        animationType="none"
        onRequestClose={handleClose}
        testID={testID ? `${testID}-modal` : undefined}
        visible={isOpen}
      >
        <Pressable onPress={handleClose} style={styles.modalBackdrop} />
        <View style={panelStyle}>
          {search ? (
            <TextInput
              autoFocus
              onChangeText={handleSearchChange}
              placeholder={searchPlaceholder ?? 'Search...'}
              style={styles.searchInput}
              testID={testID ? `${testID}-search` : undefined}
              value={searchText}
              placeholderTextColor={
                searchPlaceholderTextColor ?? COLORS.textInputPlaceholder
              }
            />
          ) : null}

          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: scrollH }}
            testID={testID ? `${testID}-scroll-view` : undefined}
          >
            {!isOpen || data.length === 0 ? (
              <Text style={styles.emptyText}>No results found</Text>
            ) : (
              data.map((item, index) => (
                <DropdownListItem<T>
                  key={index}
                  activeColor={activeColor}
                  index={index}
                  isHovered={hoveredKey === item[valueField as string]}
                  isSelected={item === value}
                  item={item}
                  labelField={String(labelField)}
                  onHoverIn={() => setHoveredKey(item[valueField as string])}
                  onHoverOut={() => setHoveredKey(null)}
                  onPress={() => handleSelectItem(item)}
                  renderItem={renderItem}
                />
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export { WebDropdown };
