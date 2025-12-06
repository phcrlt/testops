import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import testsReducer from './slices/testsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tests: testsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tests/setGeneratedCode'],
        ignoredPaths: ['tests.generatedCode'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;