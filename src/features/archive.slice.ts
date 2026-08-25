import { vetlabApi } from '@/api/index.api.ts';
import { IApiError } from '@/interfaces/app/api.interface.ts';
import { IArchiveOrderPreview, IArchiveQueryParams } from '@/interfaces/entities/order.interface.ts';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IArchiveState {
  orders: IArchiveOrderPreview[];
  currentPage: number | null;
  selectedOrders: string[];
  currentOrder: IArchiveOrderPreview | null;
  archiveQuery: IArchiveQueryParams;
  isLoading: boolean;
}

const initialState: IArchiveState = {
  orders: [],
  currentPage: null,
  selectedOrders: [],
  currentOrder: null,
  archiveQuery: {},
  isLoading: false,
};

export const getArchive = createAsyncThunk<
  IArchiveOrderPreview[],
  IArchiveQueryParams | undefined,
  { rejectValue: IApiError }
>('orders/getArchive', async (query, { rejectWithValue, dispatch }) => {
  const res = await vetlabApi.getArchive(query);
  if (res.success && res.payload) {
    dispatch(setCurrentPage(null));
    return res.payload;
  }
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения архива заказов' });
});

export const getArchiveOrder = createAsyncThunk<
  IArchiveOrderPreview,
  string,
  { rejectValue: IApiError }
>('orders/getArchiveOrder', async (orderId, { rejectWithValue }) => {
  const res = await vetlabApi.getArchiveOrder(orderId);
  if (res.success && res.payload) return res.payload;
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения заказа' });
});

export const archiveSlice = createSlice({
  name: 'archive',
  initialState,
  reducers: {
    resetArchive: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number | null>) => {
      state.currentPage = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<string>) => {
      const foundOrder = state.orders.find((order) => order._id === action.payload);
      state.currentOrder = foundOrder || null;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setArchiveQuery: (state, action: PayloadAction<Partial<IArchiveQueryParams>>) => {
      state.archiveQuery = {...state.archiveQuery, ...action.payload};
    },
    resetArchiveQuery: (state) => {
      state.archiveQuery = {};
    },
    setSelectedOrders: (state, action: PayloadAction<string[]>) => {
      state.selectedOrders = action.payload;
    },
    setIsPrinted: (state, action: PayloadAction<string>) => {
      const modifiedOrders = state.orders.map((order) => {
        if (order._id === action.payload) {
          return { ...order, isPrinted: true };
        }
        return order;
      });
      state.orders = modifiedOrders;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArchive.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArchive.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getArchive.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getArchiveOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getArchiveOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = state.currentOrder
          ? {
              ...state.currentOrder,
              ...action.payload,
              pet: { ...state.currentOrder.pet, ...action.payload.pet },
              owner: { ...state.currentOrder.owner, ...action.payload.owner },
            }
          : action.payload;
      })
      .addCase(getArchiveOrder.rejected, (state) => {
        state.isLoading = false;
        state.currentOrder = null;
      });
  },
});

export const {
  resetArchive,
  setCurrentPage,
  setCurrentOrder,
  resetCurrentOrder,
  setArchiveQuery,
  setSelectedOrders,
  setIsPrinted,
  resetArchiveQuery,
} = archiveSlice.actions;
