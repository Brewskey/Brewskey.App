// @flow

import { action, computed, observable } from 'mobx';

class ErrorStore {
  store: RootStore;

  @observable error: Error = null;

  constructor(rootStore: RootStore) {
    this.store = rootStore;
  }

  @action
  setError = (error: Error) => {
    return (this.error = error);
  };

  @computed
  get errorStatus(): ?number {
    return this.error ? this.error.status : null;
  }
}

export default ErrorStore;
