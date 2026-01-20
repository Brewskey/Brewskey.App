import type { Notification } from '../../stores/NotificationsStore';
import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
} from 'react';

type TextStyleType = 'danger' | 'default' | 'success';

type SnackBarMessageParameters = {
  duration?: number;
  position?: 'bottom' | 'top';
  style?: TextStyleType;
  content: ReactElement | string | Notification;
};

export type SnackBarMessage =
  | {
      duration: number;
      position: 'bottom' | 'top';
      style: TextStyleType;
      text: string;
      type: 'text';
    }
  | {
      content: ReactElement;
      duration: number;
      position: 'bottom' | 'top';
      type: 'content';
    }
  | {
      duration: number;
      notification: Notification;
      position: 'bottom' | 'top';
      type: 'notification';
    };

type ContextType = [
  SnackBarMessage[],
  React.Dispatch<React.SetStateAction<SnackBarMessage[]>>,
];

const SnackBarContext = React.createContext<ContextType>([
  [],
  () => {},
] as ContextType);

export const SnackBarProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = React.useState<SnackBarMessage[]>([]);

  // Initialize global function for legacy stores
  React.useEffect(() => {
    const addMessage = (messageParameters: SnackBarMessageParameters) => {
      let message: SnackBarMessage;

      if (typeof messageParameters.content === 'string') {
        message = {
          duration: 2000,
          position: 'bottom',
          style: 'default',
          type: 'text',
          ...messageParameters,
          text: messageParameters.content,
        };
      } else if (isJSX(messageParameters.content)) {
        message = {
          content: messageParameters.content as ReactElement,
          duration: 2000,
          position: 'top',
          type: 'content',
        };
      } else {
        message = {
          duration: 2000,
          notification: messageParameters.content as Notification,
          position: 'top',
          type: 'notification',
        };
      }
      setMessages((msgs) => [...msgs, message]);
    };
    setGlobalSnackBarMessage(addMessage);
    return () => {
      setGlobalSnackBarMessage(null);
    };
  }, []);

  return (
    <SnackBarContext.Provider value={[messages, setMessages]}>
      {children}
    </SnackBarContext.Provider>
  );
};

const isJSX = (value: unknown): value is React.ReactElement =>
  React.isValidElement(value);

export const useAddSnackBarMessage = (): ((
  messageParameters: SnackBarMessageParameters,
) => void) => {
  const [_, setMessages] = useContext(SnackBarContext);

  return useCallback(
    (messageParameters: SnackBarMessageParameters) => {
      let message: SnackBarMessage;

      if (typeof messageParameters.content === 'string') {
        message = {
          duration: 2000,
          position: 'bottom',
          style: 'default',
          type: 'text',
          ...messageParameters,
          text: messageParameters.content,
        };
      } else if (isJSX(messageParameters.content)) {
        message = {
          content: messageParameters.content as ReactElement,
          duration: 2000,
          position: 'top',
          type: 'content',
        };
      } else {
        message = {
          duration: 2000,
          notification: messageParameters.content as Notification,
          position: 'top',
          type: 'notification',
        };
      }
      setMessages((messages) => [...messages, message]);
    },
    [setMessages],
  );
};

export const useRemoveSnackBarMessage = (): (() => void) => {
  const [_, setMessages] = useContext(SnackBarContext);

  return useCallback(() => {
    setMessages((messages) => {
      messages.shift();
      return [...messages];
    });
  }, [setMessages]);
};

export const useGetCurrentSnackBarMessage = (): SnackBarMessage | null => {
  const [messages] = useContext(SnackBarContext);
  return messages[0] ?? null;
};

// Compatibility layer for legacy stores that can't use hooks
// This is a temporary solution - stores should be migrated to use React hooks
let globalAddSnackBarMessage: ((messageParameters: SnackBarMessageParameters) => void) | null = null;

export const setGlobalSnackBarMessage = (fn: ((messageParameters: SnackBarMessageParameters) => void) | null): void => {
  globalAddSnackBarMessage = fn;
};

const SnackBarStore = {
  showMessage: (messageParameters: SnackBarMessageParameters): void => {
    if (globalAddSnackBarMessage) {
      globalAddSnackBarMessage(messageParameters);
    } else {
      console.warn('SnackBarStore.showMessage called before SnackBarProvider is initialized');
    }
  },
};

export default SnackBarStore;
