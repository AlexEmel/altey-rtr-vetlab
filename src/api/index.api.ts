import { Store } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { TRootState, useAppDispatch } from '@/store/store.ts';
import { logout } from '@/features/user.slice';
import { AuthApi } from './auth.api';
import { RtrApi } from './rtr.api';
import { VetlabApi } from './vetlab.api';

type AppStore = Store<TRootState>;

export const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let appStore: AppStore;
export let appDispatch: ReturnType<typeof useAppDispatch>;

export const appInjectStore = (store: AppStore) => {
  appStore = store;
};

apiAxios.interceptors.request.use((config) => {
  try {
    config.headers.Authorization = `Bearer ${appStore.getState().user.token}`;
  } catch (err) {
    console.log(err);
  }
  return config;
});

apiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      appDispatch(logout());
      return Promise.reject(new Error('Unauthorized'));
    }
    return Promise.reject(error);
  },
);

export const authApi = new AuthApi(authAxios);
export const rtrApi = new RtrApi(apiAxios);
export const vetlabApi = new VetlabApi(apiAxios, authAxios);

