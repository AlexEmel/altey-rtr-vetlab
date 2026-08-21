import { authApi, rtrApi } from '@/api/index.api';
import { IAuthRes, ICredentials, IJwtPayload } from '@/interfaces/app/auth.interface';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApiError } from '@/interfaces/app/api.interface';
import { jwtDecode } from 'jwt-decode';

export enum EResultViewRule {
  ORDER_DONE = 1,
  NAPR_DONE = 2,
  NAPR_SIGNED = 3,
  PRELIMINARY_RESULT = 4,
}

export enum EResultViewType {
  REGULAR = 0,
  MERGED = 1,
  ENG = 2,
}

export interface IResultViewRules {
  view: EResultViewRule;
  type: EResultViewType;
  attachments: boolean;
}

interface IUserState {
  token: string | null;
  userInfo: IJwtPayload | null;
  resultViewRules: IResultViewRules;
  isLoading: boolean;
  isLoggedIn: boolean;
  isTempPassword: boolean;
}

const initialState: IUserState = {
  token: null,
  userInfo: null,
  resultViewRules: {
    view: EResultViewRule.ORDER_DONE,
    type: EResultViewType.REGULAR,
    attachments: false,
  },
  isLoading: false,
  isLoggedIn: true,
  isTempPassword: false,
};

export const login = createAsyncThunk<IAuthRes, ICredentials, { rejectValue: IApiError }>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    const res = await authApi.login(credentials);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка аутентификации' });
  },
);

export const setPassword = createAsyncThunk<boolean, string, { rejectValue: IApiError }>(
  'user/setPassword',
  async (password, { rejectWithValue }) => {
    const res = await rtrApi.setPassword(password);
    if (res.success) return true;
    if (!res.success && res.error) return rejectWithValue(res.error!);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка смены пароля' });
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => initialState,
    setResultViewRules: (state, action: PayloadAction<Partial<IResultViewRules>>) => {
      state.resultViewRules = { ...state.resultViewRules, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
        state.isTempPassword = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        const decoded = jwtDecode(action.payload.accessToken) as IJwtPayload;
        state.userInfo = decoded;
        if (decoded.isTemporalPassword) {
          state.isLoggedIn = false;
          state.isTempPassword = true;
        } else {
          state.isLoggedIn = true;
          state.isTempPassword = false;
        }
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isTempPassword = false;
      })
      .addCase(setPassword.pending, (state) => {
        state.isLoading = true;
        state.isLoggedIn = false;
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isTempPassword = false;
      })
      .addCase(setPassword.rejected, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
      });
  },
});

export const { logout, setResultViewRules } = userSlice.actions;
