import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './src/AppRouter';
import BrewskeyJSApi from '@brewskey/js-api';
import { AuthProvider } from './src/hooks/context/AuthContext';
import { SnackBar } from './src/common/SnackBar';
import { SnackBarProvider } from './src/hooks/context/SnackBarContext';
import { PourProcessProvider } from './src/hooks/context/PourProcessContext';

BrewskeyJSApi.initialize('https://brewskey.com');

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <SnackBarProvider>
        <PourProcessProvider>
          <QueryClientProvider client={queryClient}>
            <AppRouter />
            <SnackBar />
          </QueryClientProvider>
        </PourProcessProvider>
      </SnackBarProvider>
    </AuthProvider>
  );
}
