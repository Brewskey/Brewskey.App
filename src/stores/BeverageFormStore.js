// @flow

import type { Availability, Glass, Srm, Style } from 'brewskey.js-api';
import type { IComponentStore } from './types';

import { computed } from 'mobx';
import DAOApi from 'brewskey.js-api';
import DAOEntityStore from './DAOEntityStore';

class BeverageFormStore implements IComponentStore {
  _availabilityStore: DAOEntityStore<Availability> = new DAOEntityStore(
    DAOApi.AvailabilityDAO,
  );
  _srmStore: DAOEntityStore<Srm> = new DAOEntityStore(DAOApi.SrmDAO);
  _glassStore: DAOEntityStore<Glass> = new DAOEntityStore(DAOApi.GlassDAO);
  _styleStore: DAOEntityStore<Style> = new DAOEntityStore(DAOApi.StyleDAO);

  initialize = () => {
    this._availabilityStore.initialize();
    this._srmStore.initialize();
    this._glassStore.initialize();
    this._styleStore.initialize();
    this._srmStore.setQueryOptions({
      orderBy: [{ column: 'hex', direction: 'desc' }],
    });
  };

  dispose = () => {
    this._availabilityStore.dispose();
    this._srmStore.dispose();
    this._glassStore.dispose();
    this._styleStore.dispose();
  };

  @computed
  get availabilities(): Array<Availability> {
    return this._availabilityStore.allItems;
  }

  @computed
  get glasses(): Array<Glass> {
    return this._glassStore.allItems;
  }

  @computed
  get srm(): Array<Srm> {
    return this._srmStore.allItems;
  }

  @computed
  get styles(): Array<Style> {
    return this._styleStore.allItems;
  }
}

export default BeverageFormStore;
