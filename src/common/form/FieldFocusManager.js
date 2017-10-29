// @flow

import * as React from 'react';
import { action, observable } from 'mobx';

class FieldFocusManager extends React.Component<> {
  @observable _fieldRefs: Array<React.Element<any>> = [];

  @action
  _addFieldRef = (index: number): Function => (ref: React.Element<any>) => {
    this._fieldRefs[index] = ref;
  };

  @action
  _focusField = (index: number): Function => () => {
    const fieldRef = this._fieldRefs[index];
    if (fieldRef) {
      fieldRef.focus();
    }
  };

  render(): React.Node {
    return this.props.children({
      addFieldRef: this._addFieldRef,
      focusField: this._focusField,
    });
  }
}

export default FieldFocusManager;
