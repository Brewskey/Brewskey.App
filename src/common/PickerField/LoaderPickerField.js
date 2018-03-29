// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { Props as PickerFieldProps } from './index';

import * as React from 'react';
import PickerField from './index';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';

type Props<TItem> = {
  ...PickerFieldProps,
  children: (items: Array<TItem>) => React.Node,
  itemsLoader: LoadObject<Array<LoadObject<TItem>>>,
};

// todo add error state
@observer
class LoaderPickerField<TItem> extends React.Component<Props<TItem>> {
  static Item = PickerField.Item;

  @computed
  get _isLoading(): boolean {
    const { itemsLoader } = this.props;
    return (
      itemsLoader.isLoading() ||
      (itemsLoader.hasValue() &&
        itemsLoader
          .getValueEnforcing()
          .some((itemLoader: LoadObject<TItem>): boolean =>
            itemLoader.isLoading(),
          ))
    );
  }

  @computed
  get _items(): Array<TItem> {
    const { itemsLoader } = this.props;
    if (!this.props.itemsLoader.hasValue()) {
      return [];
    }

    return itemsLoader
      .getValueEnforcing()
      .filter((itemLoader: LoadObject<TItem>): boolean => itemLoader.hasValue())
      .map((itemLoader: LoadObject<TItem>): TItem =>
        itemLoader.getValueEnforcing(),
      );
  }

  render() {
    const { children, itemsLoader, ...rest } = this.props;
    return (
      <PickerField {...rest} isLoading={this._isLoading}>
        {children(this._items)}
      </PickerField>
    );
  }
}

export default LoaderPickerField;
