import { rtrApi } from '@/api/index.api.ts';
import { IApiError } from '@/interfaces/app/api.interface.ts';
import { IDynamics } from '@/interfaces/entities/dynamics.interface.ts';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IDynamicsState {
  dynamics: IDynamics | null;
  isLoading: boolean;
}

const initialState: IDynamicsState = {
  dynamics: null,
  isLoading: false,
};

export const getDynamics = createAsyncThunk<
  IDynamics,
  { patientId: string; groupId: string },
  { rejectValue: IApiError }
>('dynamics/getDynamics', async ({ patientId, groupId }, { rejectWithValue }) => {
  const res = await rtrApi.getDynamics(patientId, groupId);
  if (res.success && res.payload) return res.payload;
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения динамической карты' });
});

export const dynamicsSlice = createSlice({
  name: 'dynamics',
  initialState,
  reducers: {
    resetDynamics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDynamics.pending, (state) => {
        state.isLoading = true;
        state.dynamics = null;
      })
      .addCase(getDynamics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dynamics = action.payload;
      })
      .addCase(getDynamics.rejected, (state) => {
        state.isLoading = false;
        state.dynamics = null;
      });
  },
});

export const { resetDynamics } = dynamicsSlice.actions;
