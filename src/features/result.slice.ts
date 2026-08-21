import { rtrApi } from '@/api/index.api.ts';
import { IApiError } from '@/interfaces/app/api.interface.ts';
import { IOrderResults } from '@/interfaces/entities/result.interface.ts';
import { TRootState } from '@/store/store.ts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IStoredPdf {
  orderId: string | null;
  base64String: string | null;
}

interface IResultState {
  results: IOrderResults | null;
  storedPdf: IStoredPdf;
  isLoading: boolean;
}

const initialState: IResultState = {
  results: null,
  storedPdf: { orderId: null, base64String: null },
  isLoading: false,
};

export const getPdfString = createAsyncThunk<IStoredPdf, string, { rejectValue: IApiError }>(
  'results/getPdfString',
  async (orderId, { rejectWithValue, getState }) => {
    const { user } = getState() as TRootState;
    const res = await rtrApi.getPdfByOrderId(orderId, user.resultViewRules);
    if (res.success && res.payload) return { orderId: orderId, base64String: res.payload };
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения бланка результатов' });
  },
);

export const getOrderResults = createAsyncThunk<IOrderResults, string, { rejectValue: IApiError }>(
  'results/getOrderResults',
  async (orderId, { rejectWithValue, getState }) => {
    const { user } = getState() as TRootState;
    const res = await rtrApi.getResultsByOrderId(orderId, user.resultViewRules);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения результатов заказа' });
  },
);

export const resultSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetResultSlice: () => initialState,
    resetStoredPdf: (state) => {
      state.storedPdf = { orderId: null, base64String: null };
    },
    resetResults: (state) => {
      state.results = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPdfString.pending, (state) => {
        state.isLoading = true;
        state.storedPdf = { orderId: null, base64String: null };
      })
      .addCase(getPdfString.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storedPdf = action.payload;
      })
      .addCase(getPdfString.rejected, (state) => {
        state.isLoading = false;
        state.storedPdf = { orderId: null, base64String: null };
      })
      .addCase(getOrderResults.pending, (state) => {
        state.isLoading = true;
        state.results = null;
      })
      .addCase(getOrderResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(getOrderResults.rejected, (state) => {
        state.isLoading = false;
        state.results = null;
      });
  },
});

export const { resetResultSlice, resetStoredPdf, resetResults } = resultSlice.actions;
