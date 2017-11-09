// @flow

import type RootStore from './RootStore';
import { AsyncStorage } from 'react-native';
import nullthrows from 'nullthrows';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import ProfileApi from '../ProfileApi';
import CONFIG from '../config';

const CACHE_COUNTER_STORAGE_KEY = 'AVATAR_CACHE_COUNTER';

class AvatarStore {
  _rootStore: RootStore;
  @observable _cacheCounter = 0;

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
    this._initialize();
  }

  _initialize = async (): Promise<void> => {
    const existingCounter = parseInt(
      (await AsyncStorage.getItem(CACHE_COUNTER_STORAGE_KEY)) || 0,
      10,
    );
    this._setCacheCounter(existingCounter);

    reaction(() => this._cacheCounter, this._persist);
  };

  @computed
  get sourceUri(): string {
    return `${CONFIG.CDN}photos/${nullthrows(
      this._rootStore.authStore.userName,
    )}.jpg?w=90&h=90&mode=crop&cacheCounter=${this._cacheCounter}`;
  }

  @action
  update = async (avatarData: string): Promise<void> => {
    await ProfileApi.updateAvatar(avatarData);
    runInAction(() => {
      this._setCacheCounter(this._cacheCounter + 1);
    });
  };

  @action
  _setCacheCounter = (counter: number) => {
    this._cacheCounter = counter;
  };

  _persist = () => {
    AsyncStorage.setItem(
      CACHE_COUNTER_STORAGE_KEY,
      this._cacheCounter.toString(),
    );
  };
}

export default AvatarStore;
