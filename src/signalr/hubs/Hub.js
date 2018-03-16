// @flow

import signalr from 'react-native-signalr';
import CONFIG from '../../config';

const PING_INTERVAL = 60000;

type Options = {
  logging?: boolean,
  queryParams?: Object,
  rootPath?: string,
  shareConnection?: boolean,
  transport?: string | Array<string>,
};

class Hub {
  static CONNECTIONS: Object = {};
  static dispatch: Function;

  _connection: Object;
  _connectionPromise: ?Promise<void>;
  _proxy: Object;
  _transport: ?(string | Array<string>);

  static middleware({ dispatch }: { dispatch: Function }): Function {
    Hub.dispatch = dispatch;
    return (next: Function): Function => (action: Object): Object =>
      next(action);
  }

  static initNewConnection(rootPath: ?string): Object {
    return rootPath ? signalr.hubConnection(rootPath) : signalr.hubConnection();
  }

  static getConnection(rootPath: ?string, shareConnection: boolean): Object {
    if (!shareConnection) {
      return Hub.initNewConnection(rootPath);
    }

    let connection = Hub.CONNECTIONS[rootPath];

    if (!connection) {
      connection = Hub.initNewConnection(rootPath);
      Hub.CONNECTIONS[rootPath] = connection;
    }

    return connection;
  }

  constructor(
    name: string,
    {
      logging = false,
      queryParams,
      rootPath = CONFIG.HOST,
      shareConnection = true,
      transport,
    }: Options = {},
  ) {
    this._connection = Hub.getConnection(rootPath, shareConnection);
    this._proxy = this._connection.createHubProxy(name);
    this._connection.logging = logging;
    this._connection.qs = queryParams;
    this._transport = transport;
  }

  connect(queryParams?: Object): Promise<void> {
    const { _connection, _transport } = this;
    if (queryParams) {
      _connection.qs = { ...(_connection.qs || {}), ...queryParams };
    }

    this._connectionPromise = _transport
      ? _connection.start({
          pingInterval: PING_INTERVAL,
          transport: _transport,
        })
      : _connection.start({ pingInterval: PING_INTERVAL });

    return this._connectionPromise;
  }

  disconnect() {
    this._connection.stop();
  }

  serverMethod(name: string): Function {
    return (...args: Array<any>): ?Promise<any> =>
      this._connectionPromise &&
      this._connectionPromise.then((): Promise<any> =>
        this._proxy.invoke(name, ...args),
      );
  }

  registerListener(name: string, listener: Function) {
    this._proxy.on(name, listener);
  }

  registerErrorHandler(handler: Function) {
    this._connection.error(handler);
  }
}

export default Hub;
