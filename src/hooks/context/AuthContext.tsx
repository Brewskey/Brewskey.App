import BrewskeyJSApi, { AuthResponse } from '@brewskey/js-api';
import * as React from 'react';
import { Storage } from '../../utils/Storage';

type AuthContextValues = [
  AuthResponse | undefined,
  (response: AuthResponse | undefined) => Promise<void>,
];
export const SESSION_DATA = 'session_data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = React.createContext<AuthContextValues>([] as any);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [authResponse, setAuthResponseState] = React.useState<
    AuthResponse | undefined
  >();

  const setAuthResponse = React.useCallback(
    async (response: AuthResponse | undefined) => {
      if (response != null) {
        await Storage.setItem(SESSION_DATA, response);

        BrewskeyJSApi.setToken(response.accessToken);
        BrewskeyJSApi.setRefreshToken(response.refreshToken);
      } else {
        await Storage.removeItem(SESSION_DATA);
      }
      setAuthResponseState(response);
    },
    [Storage, setAuthResponseState],
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const sessionData = await Storage.getItem<AuthResponse>(SESSION_DATA);
        if (!sessionData) {
          return;
        }

        setAuthResponse(sessionData);
      } catch (error) {
        /* intentionally ignore */
      }
    };
    bootstrapAsync();
  }, []);

  React.useEffect(() => {
    if (authResponse?.accessToken == null) {
      return;
    }
    BrewskeyJSApi.setToken(authResponse.accessToken);
    BrewskeyJSApi.setRefreshToken(authResponse.refreshToken);
  }, [authResponse]);

  React.useEffect(() => {
    BrewskeyJSApi.setOnSessionUpdated(setAuthResponse);
  }, [setAuthResponse]);

  return (
    <AuthContext.Provider value={[authResponse, setAuthResponse]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => React.useContext(AuthContext);

export const useIsSignedIn = () => {
  const [session] = useAuthContext();
  return session != null;
};

export const useIsSignedOut = () => {
  const [session] = useAuthContext();
  return session == null;
};
