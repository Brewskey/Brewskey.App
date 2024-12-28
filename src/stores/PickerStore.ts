import { EntityID } from '@brewskey/js-api';

export type PickerValue<
  TEntity,
  TMultiple extends boolean,
> = TMultiple extends true ? TEntity[] : TEntity | undefined;

export type KeyExtractor<TEntity> = (item: TEntity) => string;

type PickerStoreProps<TEntity, TMultiple extends boolean> = {
  readonly initialValue: PickerValue<TEntity, TMultiple>;
  readonly keyExtractor?: KeyExtractor<TEntity>;
  readonly multiple: TMultiple;
  readonly onChange?: (
    value: PickerValue<TEntity, TMultiple>,
  ) => void | Promise<void>;
};

const defaultKeyExtractor = <TEntity extends { id?: EntityID }>(
  item: TEntity,
): string => {
  if (!item.id) {
    throw new Error(
      'PickerStore: keyExtractorError, there is no id prop in item',
    );
  }
  return item.id.toString();
};

class PickerStore<TEntity extends { id: EntityID }, TMultiple extends boolean> {
  _keyExtractor: KeyExtractor<TEntity>;

  _onChange:
    | ((value: PickerValue<TEntity, TMultiple>) => void | Promise<void>)
    | undefined;

  readonly _config: PickerStoreProps<TEntity, TMultiple>;

  _values: TEntity[] = [];

  constructor(config: PickerStoreProps<TEntity, TMultiple>) {
    this._config = config;

    this._onChange = config.onChange;
    this._keyExtractor = config.keyExtractor || defaultKeyExtractor;
    if (config.initialValue) {
      this.setValue(config.initialValue);
    }
  }

  get value(): PickerValue<TEntity, TMultiple> {
    if (this._config.multiple === true) {
      return this._values as PickerValue<TEntity, TMultiple>;
    }

    return this._values[0] as PickerValue<TEntity, TMultiple>;
  }

  checkIsSelected(item: TEntity): boolean {
    return this._values.some(
      (value) => this._keyExtractor(value) === this._keyExtractor(item),
    );
  }

  clear() {
    if (this._onChange) {
      this._onChange(this.value);
    }
  }

  setValue(value: PickerValue<TEntity, TMultiple>) {
    const arrayValues = Array.isArray(value) ? value : [value];

    this._values = arrayValues.filter(Boolean);
  }

  toggleItem(_item: TEntity) {
    // const itemKey = this._keyExtractor(item);
    // if (this._valueByKey.has(itemKey)) {
    //   this._valueByKey.delete(itemKey);
    // } else {
    //   !this._config.multiple && this._valueByKey.clear();
    //   this._valueByKey.set(itemKey, item);
    // }
    // this._onChange && this._onChange(this.value);
  }
}

export default PickerStore;
