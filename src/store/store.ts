'use client';

import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './accountSlice';

export const store = configureStore({
  reducer: {
    accountOpening: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['accountOpening/addDocument'],
        ignoredPaths: ['accountOpening.documents'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
