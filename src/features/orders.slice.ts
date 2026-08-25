import { vetlabApi } from '@/api/index.api';
import { IApiError } from '@/interfaces/app/api.interface';
import {
  IOrder,
  IOrderInput,
  IOrdersQueryParams,
  IOwnerCreateResult,
  IOwnerInput,
  IOwnerQueryParams,
  IOwnerRecord,
  IPetInput,
  IPetPreview,
  IPetQueryParams,
} from '@/interfaces/entities/order.interface';
import type { TRootState } from '@/store/store';
import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

export interface IOrdersState {
  orders: IOrder[];
  foundOwners: IOwnerRecord[];
  foundPets: IPetPreview[];
  newOrder: IOrderInput | null;
  currentOrder: IOrder | null;
  currentPage: number | null;
  ordersQuery: IOrdersQueryParams;
  isLoading: boolean;
}

const initialState: IOrdersState = {
  orders: [],
  foundOwners: [],
  foundPets: [],
  newOrder: null,
  currentOrder: null,
  currentPage: null,
  ordersQuery: {},
  isLoading: false,
};

const unknownError = (message: string): IApiError => ({ code: 'UNKNOWN_ERROR', message });

export const findPets = createAsyncThunk<IPetPreview[], IPetQueryParams, { rejectValue: IApiError }>(
  'orders/findPets',
  async (query, { rejectWithValue }) => {
    const res = await vetlabApi.getPets(query);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка поиска питомцев'));
  },
);

export const getPet = createAsyncThunk<IPetPreview, string, { rejectValue: IApiError }>(
  'orders/getPet',
  async (petId, { rejectWithValue }) => {
    const res = await vetlabApi.getPet(petId);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка получения питомца'));
  },
);

export const createPet = createAsyncThunk<IPetPreview, IPetInput, { rejectValue: IApiError }>(
  'orders/createPet',
  async (payload, { rejectWithValue }) => {
    const res = await vetlabApi.createPet(payload);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка создания питомца'));
  },
);

export const updatePet = createAsyncThunk<
  IPetPreview,
  { id: string; payload: IPetInput },
  { rejectValue: IApiError }
>('orders/updatePet', async ({ id, payload }, { rejectWithValue }) => {
  const res = await vetlabApi.updatePet(id, payload);
  if (res.success && res.payload) return res.payload;
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue(unknownError('Ошибка изменения питомца'));
});

export const findOwners = createAsyncThunk<IOwnerRecord[], IOwnerQueryParams, { rejectValue: IApiError }>(
  'orders/findOwners',
  async (query, { rejectWithValue }) => {
    const res = await vetlabApi.getOwners(query);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка поиска владельцев'));
  },
);

export const getOwner = createAsyncThunk<IOwnerRecord, string, { rejectValue: IApiError }>(
  'orders/getOwner',
  async (ownerId, { rejectWithValue }) => {
    const res = await vetlabApi.getOwner(ownerId);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка получения владельца'));
  },
);

export const createOwner = createAsyncThunk<IOwnerCreateResult, IOwnerInput, { rejectValue: IApiError }>(
  'orders/createOwner',
  async (payload, { rejectWithValue }) => {
    const res = await vetlabApi.createOwner(payload);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка создания владельца'));
  },
);

export const updateOwner = createAsyncThunk<
  IOwnerRecord,
  { id: string; payload: IOwnerInput },
  { rejectValue: IApiError }
>('orders/updateOwner', async ({ id, payload }, { rejectWithValue }) => {
  const res = await vetlabApi.updateOwner(id, payload);
  if (res.success && res.payload) return res.payload;
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue(unknownError('Ошибка изменения владельца'));
});

export const getOrders = createAsyncThunk<IOrder[], void, { rejectValue: IApiError }>(
  'orders/getOrders',
  async (_, { rejectWithValue, getState }) => {
    const { orders } = getState() as TRootState;
    const res = await vetlabApi.getOrders(orders.ordersQuery);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка получения заказов'));
  },
);

export const getOrder = createAsyncThunk<IOrder, string, { rejectValue: IApiError }>(
  'orders/getOrder',
  async (orderId, { rejectWithValue }) => {
    const res = await vetlabApi.getOrder(orderId);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка получения заказа'));
  },
);

export const createOrder = createAsyncThunk<IOrder, IOrderInput, { rejectValue: IApiError }>(
  'orders/createOrder',
  async (payload, { rejectWithValue }) => {
    const res = await vetlabApi.createOrder(payload);
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка создания заказа'));
  },
);

export const updateOrder = createAsyncThunk<
  IOrder,
  { id: string; payload: IOrderInput },
  { rejectValue: IApiError }
>('orders/updateOrder', async ({ id, payload }, { rejectWithValue }) => {
  const res = await vetlabApi.updateOrder(id, payload);
  if (res.success && res.payload) return res.payload;
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue(unknownError('Ошибка изменения заказа'));
});

export const deleteOrder = createAsyncThunk<string, string, { rejectValue: IApiError }>(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    const res = await vetlabApi.deleteOrder(orderId);
    if (res.success) return orderId;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue(unknownError('Ошибка удаления заказа'));
  },
);

const upsertById = <T extends { _id: string }>(items: T[], item: T): T[] => {
  const index = items.findIndex((current) => current._id === item._id);
  if (index === -1) return [...items, item];
  return items.map((current) => (current._id === item._id ? item : current));
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrders: () => initialState,
    setNewOrder: (state, action: PayloadAction<IOrderInput | null>) => {
      state.newOrder = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<IOrder | null>) => {
      state.currentOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number | null>) => {
      state.currentPage = action.payload;
    },
    setOrdersQuery: (state, action: PayloadAction<Partial<IOrdersQueryParams>>) => {
      state.ordersQuery = { ...state.ordersQuery, ...action.payload };
    },
    resetOrdersQuery: (state) => {
      state.ordersQuery = {};
    },
    resetFoundOwners: (state) => {
      state.foundOwners = [];
    },
    resetFoundPets: (state) => {
      state.foundPets = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findPets.fulfilled, (state, action) => {
        state.foundPets = action.payload;
      })
      .addCase(getPet.fulfilled, (state, action) => {
        state.foundPets = upsertById(state.foundPets, action.payload);
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.foundPets = upsertById(state.foundPets, action.payload);
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.foundPets = upsertById(state.foundPets, action.payload);
      })
      .addCase(findOwners.fulfilled, (state, action) => {
        state.foundOwners = action.payload;
      })
      .addCase(getOwner.fulfilled, (state, action) => {
        state.foundOwners = upsertById(state.foundOwners, action.payload);
      })
      .addCase(createOwner.fulfilled, (state, action) => {
        if (action.payload._id) {
          state.foundOwners = upsertById(state.foundOwners, action.payload as IOwnerRecord);
        }
      })
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.foundOwners = upsertById(state.foundOwners, action.payload);
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.currentPage = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders = upsertById(state.orders, action.payload);
        state.currentOrder = action.payload;
        state.newOrder = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders = upsertById(state.orders, action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
        if (state.currentOrder?._id === action.payload) state.currentOrder = null;
      })
      .addMatcher(
        isAnyOf(
          findPets.pending,
          getPet.pending,
          createPet.pending,
          updatePet.pending,
          findOwners.pending,
          getOwner.pending,
          createOwner.pending,
          updateOwner.pending,
          getOrders.pending,
          getOrder.pending,
          createOrder.pending,
          updateOrder.pending,
          deleteOrder.pending,
        ),
        (state) => {
          state.isLoading = true;
        },
      )
      .addMatcher(
        isAnyOf(
          findPets.fulfilled,
          getPet.fulfilled,
          createPet.fulfilled,
          updatePet.fulfilled,
          findOwners.fulfilled,
          getOwner.fulfilled,
          createOwner.fulfilled,
          updateOwner.fulfilled,
          getOrders.fulfilled,
          getOrder.fulfilled,
          createOrder.fulfilled,
          updateOrder.fulfilled,
          deleteOrder.fulfilled,
          findPets.rejected,
          getPet.rejected,
          createPet.rejected,
          updatePet.rejected,
          findOwners.rejected,
          getOwner.rejected,
          createOwner.rejected,
          updateOwner.rejected,
          getOrders.rejected,
          getOrder.rejected,
          createOrder.rejected,
          updateOrder.rejected,
          deleteOrder.rejected,
        ),
        (state) => {
          state.isLoading = false;
        },
      );
  },
});

export const {
  resetOrders,
  setNewOrder,
  setCurrentOrder,
  setCurrentPage,
  setOrdersQuery,
  resetOrdersQuery,
  resetFoundOwners,
  resetFoundPets,
} = ordersSlice.actions;
