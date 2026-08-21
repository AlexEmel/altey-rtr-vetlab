import { rtrApi } from '@/api/index.api';
import { IApiError } from '@/interfaces/app/api.interface';
import {
  IAppointment,
  INewAppointment,
  IGetAppointmentsQueryParams,
} from '@/interfaces/entities/appointment.interface';
import { ITreatmentRoomQuota } from '@/interfaces/entities/treatment-room-quota.interface';
import { TRootState } from '@/store/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAppointmentsState {
  appointments: IAppointment[];
  currentPage: number | null;
  currentAppointment: IAppointment | null;
  appointmentsQuery: IGetAppointmentsQueryParams;
  treatmentRoomQuotas: ITreatmentRoomQuota[];
  appointmentModal: {
    isOpen: boolean;
    mode: 'new' | 'edit';
  };
  isLoading: boolean;
}

const initialState: IAppointmentsState = {
  appointments: [],
  currentPage: null,
  currentAppointment: null,
  appointmentsQuery: {
    dateFrom: new Date(Date.now()).toISOString(),
    dateTo: new Date(Date.now()).toISOString(),
  },
  treatmentRoomQuotas: [],
  appointmentModal: {
    isOpen: false,
    mode: 'new',
  },
  isLoading: false,
};

export const getAppointments = createAsyncThunk<IAppointment[], undefined, { rejectValue: IApiError }>(
  'appointments/getAppointments',
  async (_, { rejectWithValue, dispatch, getState }) => {
    const { appointments } = getState() as TRootState;
    const res = await rtrApi.getAppointments(appointments.appointmentsQuery);
    if (res.success && res.payload) {
      dispatch(setCurrentPage(null));
      return res.payload;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения списка записей на прием' });
  },
);

export const createAppointment = createAsyncThunk<IAppointment, INewAppointment, { rejectValue: IApiError }>(
  'appointments/createAppointment',
  async (query, { rejectWithValue, dispatch }) => {
    const res = await rtrApi.createAppointment(query);
    if (res.success && res.payload) {
      dispatch(resetTreatmentRoomQuotas());
      return res.payload;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка создания записи на прием' });
  },
);

export const confirmAppointment = createAsyncThunk<IAppointment, string, { rejectValue: IApiError }>(
  'appointments/confirmAppointment',
  async (id, { rejectWithValue }) => {
    const res = await rtrApi.confirmAppointment(id);
    if (res.success && res.payload) {
      return res.payload;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка подтверждения записи на прием' });
  },
);

export const editAppointment = createAsyncThunk<
  IAppointment,
  { id: string; payload: INewAppointment },
  { rejectValue: IApiError }
>('appointments/editAppointment', async (query, { rejectWithValue, dispatch }) => {
  const res = await rtrApi.editAppointment(query.id, query.payload);
  if (res.success && res.payload) {
    dispatch(resetTreatmentRoomQuotas());
    return res.payload;
  }
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка редактирования записи на прием' });
});

export const deleteAppointment = createAsyncThunk<boolean, string, { rejectValue: IApiError }>(
  'appointments/deleteAppointment',
  async (id, { rejectWithValue }) => {
    const res = await rtrApi.deleteAppointment(id);
    if (res.success) {
      return res.success;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка при удалении записи на прием' });
  },
);

export const getTreatmentRoomsQuotas = createAsyncThunk<
  ITreatmentRoomQuota[],
  string,
  { rejectValue: IApiError }
>('appointments/getTreatmentRoomQuotas', async (troomId, { rejectWithValue }) => {
  const res = await rtrApi.getTreatmentRoomQuotas(troomId);
  if (res.success && res.payload) {
    return res.payload;
  }
  if (!res.success && res.error) return rejectWithValue(res.error);
  return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения списка квот' });
});

export const disableQuotas = createAsyncThunk<boolean, string[], { rejectValue: IApiError }>(
  'appointments/disableQuotas',
  async (ids, { rejectWithValue }) => {
    const res = await rtrApi.disableQuotas(ids);
    if (res.success) {
      return res.success;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка деактивации квот' });
  },
);

export const enableQuotas = createAsyncThunk<boolean, string[], { rejectValue: IApiError }>(
  'appointments/enableQuotas',
  async (ids, { rejectWithValue }) => {
    const res = await rtrApi.enableQuotas(ids);
    if (res.success) {
      return res.success;
    }
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка активации квот' });
  },
);

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    resetAppointments: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number | null>) => {
      state.currentPage = action.payload;
    },
    setCurrentAppointment: (state, action: PayloadAction<IAppointment | null>) => {
      state.currentAppointment = action.payload;
    },
    setAppointmentsQuery: (state, action: PayloadAction<Partial<IGetAppointmentsQueryParams>>) => {
      state.appointmentsQuery = { ...state.appointmentsQuery, ...action.payload };
    },
    resetAppointmentsQuery: (state) => {
      state.appointmentsQuery = {
        dateFrom: new Date(Date.now()).toISOString(),
        dateTo: new Date(Date.now()).toISOString(),
      };
    },
    resetTreatmentRoomQuotas: (state) => {
      state.treatmentRoomQuotas = [];
    },
    setShowAppointmentModal: (state, action: PayloadAction<boolean>) => {
      state.appointmentModal.isOpen = action.payload;
    },
    setAppointmentModalMode: (state, action: PayloadAction<'new' | 'edit'>) => {
      state.appointmentModal.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getTreatmentRoomsQuotas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTreatmentRoomsQuotas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.treatmentRoomQuotas = action.payload;
      })
      .addCase(getTreatmentRoomsQuotas.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(confirmAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(confirmAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment,
        );
      })
      .addCase(confirmAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = state.appointments.map((appointment) =>
          appointment._id === action.payload._id ? action.payload : appointment,
        );
      })
      .addCase(editAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(disableQuotas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(disableQuotas.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(disableQuotas.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(enableQuotas.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(enableQuotas.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(enableQuotas.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  resetAppointments,
  setCurrentPage,
  setAppointmentsQuery,
  resetAppointmentsQuery,
  resetTreatmentRoomQuotas,
  setCurrentAppointment,
  setShowAppointmentModal,
  setAppointmentModalMode,
} = appointmentsSlice.actions;
