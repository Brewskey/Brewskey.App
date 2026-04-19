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
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';

import { COLORS } from '../../theme';

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
      style={triggerStyle}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      activeOpacity={0.7}
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
        <Text style={textStyle} numberOfLines={1}>
          {hasSelection ? displayText : (placeholder ?? 'Select item')}
        </Text>
      )}
      <View style={styles.triggerIconContainer}>
        {hasSelection && onClear ? (
          <TouchableOpacity
            onPress={(e: any) => {
              e.stopPropagation?.();
              onClear?.();
            }}
            style={styles.clearButton}
            testID={testID ? `${testID}-clear` : undefined}
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
      style={itemStyle}
      onPress={onPress}
      onPressIn={onHoverIn}
      onPressOut={onHoverOut}
      testID={`option-${index}`}
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

export function WebDropdown<T = any>(props: WebDropdownProps) {
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

  const getItemKey = (item: T, index: number) =>
    String(
      (item as Record<string, unknown>)[valueField as string] ??
        (item as Record<string, unknown>).id ??
        index,
    );

  const resolveToItem = React.useCallback(
    (val: T | string | null | undefined): T | null => {
      if (val == null) {
        return null;
      }
      if (
        valueField &&
        data.length > 0 &&
        (typeof val === 'string' || typeof val === 'number')
      ) {
        const m = data.find(
          (i) =>
            (i as Record<string, unknown>)[valueField as string] === val ||
            String((i as Record<string, unknown>)[valueField as string]) ===
              String(val),
        );
        return m ?? null;
      }
      return val as T;
    },
    [valueField, data],
  );

  const selectedItem = resolveToItem(value);

  const measureTrigger = React.useCallback(() => {
    (triggerRef.current as any)?.measureInWindow?.(
      (x: number, y: number, w: number, h: number) => {
        setTriggerLayout({ x, y, width: w, height: h });
      },
    );
  }, []);

  const handleOpen = React.useCallback(() => {
    if (disable) {
      return;
    }
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
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [isOpen, handleOpen, handleClose]);

  const handleSelectItem = React.useCallback(
    (item: T) => {
      if (confirmSelectItem && onConfirmSelectItem) {
        onConfirmSelectItem(item);
        return;
      }
      onChange(item);
      if (closeModalWhenSelectedItem) {
        handleClose();
      }
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
    selectedItem != null
      ? String(
          (selectedItem as Record<string, unknown>)[labelField as string] ?? '',
        )
      : '';

  const selectedContent =
    renderItem && selectedItem != null
      ? renderItem(selectedItem, true)
      : undefined;
  const hasSelection = selectedItem != null;

  const checkIsSelected = (item: T, index: number) => {
    if (selectedItem == null) {
      return false;
    }
    const k = getItemKey(item, index);
    const sk = getItemKey(selectedItem, -1);
    return (
      k === sk ||
      (item as Record<string, unknown>)[valueField as string] ===
        (selectedItem as Record<string, unknown>)[valueField as string]
    );
  };

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
        displayText={displayText}
        placeholder={placeholder}
        hasSelection={hasSelection}
        isOpen={isOpen}
        disabled={disable}
        testID={testID}
        onPress={handleToggle}
        onClear={hasSelection ? handleClear : undefined}
        selectedContent={selectedContent}
      />

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        testID={testID ? `${testID}-modal` : undefined}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleClose} />
        <View style={panelStyle}>
          {search ? (
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder ?? 'Search...'}
              placeholderTextColor={
                searchPlaceholderTextColor ?? COLORS.textInputPlaceholder
              }
              value={searchText}
              onChangeText={handleSearchChange}
              testID={testID ? `${testID}-search` : undefined}
              autoFocus
            />
          ) : null}

          <ScrollView
            style={{ maxHeight: scrollH }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            testID={testID ? `${testID}-scroll-view` : undefined}
          >
            {data.length === 0 ? (
              <Text style={styles.emptyText}>No results found</Text>
            ) : (
              data.map((item, index) => {
                const itemKey = getItemKey(item, index);
                return (
                  <DropdownListItem<T>
                    key={itemKey}
                    item={item}
                    index={index}
                    isSelected={checkIsSelected(item, index)}
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
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
