// @flow

import Hub from './Hub';

class TapHub extends Hub {
  subscribe: (tapId: string) => Promise<void> = this.serverMethod('subscribe');
  subscribeMany: (tapIds: Array<string>) => Promise<void> = this.serverMethod(
    'subscribeMany',
  );
  unsubscribe: (tapId: string) => Promise<void> = this.serverMethod(
    'unsubscribe',
  );
  unsubscribeMany: (tapIds: Array<string>) => Promise<void> = this.serverMethod(
    'unsubscribeMany',
  );

  constructor() {
    super('tapHub', {
      logging: true,
    });

    this.registerListener('newPour', this._newPour);
  }

  _newPour() {
    // todo add new Pour handling logic
  }
}

export default new TapHub();
