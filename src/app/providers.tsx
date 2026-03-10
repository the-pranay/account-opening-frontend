'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store/store';
import theme from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#0a1929',
              color: '#fff',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#00bfa5', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f44336', secondary: '#fff' },
            },
          }}
        />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
