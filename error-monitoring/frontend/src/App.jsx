import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import styled, { ThemeProvider } from 'styled-components';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ErrorList from './pages/ErrorList';
import ErrorDetails from './pages/ErrorDetails';
import ErrorGroups from './pages/ErrorGroups';
import GroupDetails from './pages/GroupDetails';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import NotFound from './pages/NotFound';

// Context
import { ErrorProvider } from './contexts/ErrorContext';
import { SocketProvider } from './contexts/SocketContext';

// Styles
import { GlobalStyles, theme } from './styles/GlobalStyles';

// 🔴 CRITICAL COMPONENT: App
// Zależności: React Router, React Query, Styled Components
// Wpływ: CAŁA APLIKACJA FRONTEND
// Jeśli się zepsuje: APLIKACJA NIE DZIAŁA
// Używane w: main.jsx

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minut
    },
  },
});

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <SocketProvider>
              <AppContainer>
                <Router>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/errors" element={<ErrorList />} />
                      <Route path="/errors/:id" element={<ErrorDetails />} />
                      <Route path="/groups" element={<ErrorGroups />} />
                      <Route path="/groups/:id" element={<GroupDetails />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/alerts" element={<Alerts />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </Router>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: theme.colors.surface,
                      color: theme.colors.text,
                      border: `1px solid ${theme.colors.border}`,
                    },
                    success: {
                      iconTheme: {
                        primary: theme.colors.success,
                        secondary: theme.colors.surface,
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: theme.colors.error,
                        secondary: theme.colors.surface,
                      },
                    },
                  }}
                />
              </AppContainer>
            </SocketProvider>
          </ErrorProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App; 