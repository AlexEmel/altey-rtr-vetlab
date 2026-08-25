import { vetlabApi } from '@/api/index.api.ts';
import { IApiError } from '@/interfaces/app/api.interface.ts';
import { IOrderResults } from '@/interfaces/entities/result.interface.ts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IStoredPdf {
  orderId: string | null;
  pdf: Blob | null;
}

interface IResultState {
  results: IOrderResults | null;
  storedPdf: IStoredPdf;
  isLoading: boolean;
}

const initialState: IResultState = {
  results: null,
  storedPdf: { orderId: null, pdf: null },
  isLoading: false,
};

export const getPdfString = createAsyncThunk<IStoredPdf, string, { rejectValue: IApiError }>(
  'results/getPdfString',
  async (orderId, { rejectWithValue }) => {
    const res = await vetlabApi.getFormsPdf(orderId);
    if (res.success && res.payload) return { orderId, pdf: res.payload };
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения бланка результатов' });
  },
);

export const getOrderResults = createAsyncThunk<IOrderResults, string, { rejectValue: IApiError }>(
  'results/getOrderResults',
  async (orderId, { rejectWithValue }) => {
    const res = await vetlabApi.getOrderResults(orderId);
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
      state.storedPdf = { orderId: null, pdf: null };
    },
    resetResults: (state) => {
      state.results = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPdfString.pending, (state) => {
        state.isLoading = true;
        state.storedPdf = { orderId: null, pdf: null };
      })
      .addCase(getPdfString.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storedPdf = action.payload;
      })
      .addCase(getPdfString.rejected, (state) => {
        state.isLoading = false;
        state.storedPdf = { orderId: null, pdf: null };
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
