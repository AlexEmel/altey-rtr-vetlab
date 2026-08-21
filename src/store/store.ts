import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';
import { appSlice } from '../features/app.slice';
import { userSlice } from '../features/user.slice';
import { archiveSlice } from '@/features/archive.slice';
import { dictionarySlice } from '@/features/dictionary.slice';
import { resultSlice } from '@/features/result.slice';
import { dynamicsSlice } from '@/features/dynamics.slice';
import { listenerMiddleware } from './listeners';
import { appointmentsSlice } from '@/features/appointments.slice';

const appPersistConfig = {
  key: 'altey-rtr-vetlab-v1',
  storage,
  whitelist: ['app', 'dictionaries'],
};

const userPersistConfig = {
  key: 'user',
  storage: sessionStorage,
};

const archivePersistConfig = {
  key: 'archive',
  storage: sessionStorage,
};

const rootReducer = combineReducers({
  app: appSlice.reducer,
  user: persistReducer(userPersistConfig, userSlice.reducer),
  archive: persistReducer(archivePersistConfig, archiveSlice.reducer),
  results: resultSlice.reducer,
  dynamics: dynamicsSlice.reducer,
  dictionaries: dictionarySlice.reducer,
  appointments: appointmentsSlice.reducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(appPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);
export type TAppDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => TAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
