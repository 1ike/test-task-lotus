import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

export type ErrorMessage = string;

const errorMessageInitialState: ErrorMessage = '';

const slice = createSlice({
  name: 'errorMessage',
  initialState: errorMessageInitialState,
  reducers: {
    setErrorMessage: (state, action: PayloadAction<ErrorMessage>) => action.payload,
    resetErrorMessage: () => errorMessageInitialState,
  },
});

export const errorMessageReducerName = slice.name;
export const errorMessageReducer = slice.reducer;
export const errorMessageActions = slice.actions;

export const selectErrorMessage = (state: RootState) => state[errorMessageReducerName];
