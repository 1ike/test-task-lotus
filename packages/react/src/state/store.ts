import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';

import { errorMessageReducer, errorMessageReducerName } from './errorMessage';
import { tenderReducer, tenderReducerName } from '../pages/tender/state/tender';

const rootReducer = combineReducers({
  [errorMessageReducerName]: errorMessageReducer,
  [tenderReducerName]: tenderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
