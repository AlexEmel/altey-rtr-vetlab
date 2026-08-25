import { rtrApi, vetlabApi } from '@/api/index.api.ts';
import { IApiError } from '@/interfaces/app/api.interface.ts';
import { IDepartment } from '@/interfaces/entities/department.interface.ts';
import { IAnalysisType } from '@/interfaces/entities/analysis-type.interface';
import { IExternalFinanceSource } from '@/interfaces/entities/external-finance-source.interface';
import { IInsuranceType } from '@/interfaces/entities/insurance-type.interface';
import { ITreatmentRoom } from '@/interfaces/entities/treatment-room.interface';
import { ISpecies } from '@/interfaces/entities/species.interface';
import { IBreed } from '@/interfaces/entities/breed.interface';
import { IClient } from '@/interfaces/entities/client.interface';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IDictionaryState {
  departments: IDepartment[];
  analysisTypes: IAnalysisType[];
  externalFinanceSources: IExternalFinanceSource[];
  insuranceTypes: IInsuranceType[];
  treatmentRooms: ITreatmentRoom[];
  species: ISpecies[];
  breeds: IBreed[];
  clients: IClient[];
  isLoading: boolean;
}

const initialState: IDictionaryState = {
  departments: [],
  analysisTypes: [],
  externalFinanceSources: [],
  insuranceTypes: [],
  treatmentRooms: [],
  species: [],
  breeds: [],
  clients: [],
  isLoading: false,
};

export const getDepartments = createAsyncThunk<IDepartment[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getDepartments',
  async (_, { rejectWithValue }) => {
    const res = await rtrApi.getDepartments();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения справочников' });
  },
);

export const getExternalFinanceSources = createAsyncThunk<IExternalFinanceSource[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getExternalFinanceSources',
  async (_, { rejectWithValue }) => {
    const res = await rtrApi.getExternalFinanceSources();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения справочников' });
  }
);

export const getAnalysisTypes = createAsyncThunk<IAnalysisType[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getAnalysisTypes',
  async (_, { rejectWithValue }) => {
    const res = await rtrApi.getAnalysisTypes();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения справочников' });
  },
);

export const getInsuranceTypes = createAsyncThunk<IInsuranceType[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getInsuranceTypes',
  async (_, { rejectWithValue }) => {
    const res = await rtrApi.getInsuranceTypes();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения справочников' });
  },
);

export const getTreatmentRooms = createAsyncThunk<ITreatmentRoom[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getTreatmentRooms',
  async (_, { rejectWithValue }) => {
    const res = await rtrApi.getTreatmentRooms();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Ошибка получения справочников' });
  }
);

export const getSpecies = createAsyncThunk<ISpecies[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getSpecies',
  async (_, { rejectWithValue }) => {
    const res = await vetlabApi.getSpecies();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Unable to load species dictionary' });
  },
);

export const getBreeds = createAsyncThunk<IBreed[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getBreeds',
  async (_, { rejectWithValue }) => {
    const res = await vetlabApi.getBreeds();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Unable to load breeds dictionary' });
  },
);

export const getClients = createAsyncThunk<IClient[], undefined, { rejectValue: IApiError }>(
  'dictionaries/getClients',
  async (_, { rejectWithValue }) => {
    const res = await vetlabApi.getClients();
    if (res.success && res.payload) return res.payload;
    if (!res.success && res.error) return rejectWithValue(res.error);
    return rejectWithValue({ code: 'UNKNOWN_ERROR', message: 'Unable to load clients dictionary' });
  },
);

export const dictionarySlice = createSlice({
  name: 'dictionaries',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
      })
      .addCase(getDepartments.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAnalysisTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAnalysisTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analysisTypes = action.payload;
      })
      .addCase(getAnalysisTypes.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getExternalFinanceSources.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExternalFinanceSources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.externalFinanceSources = action.payload;
      })
      .addCase(getExternalFinanceSources.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getInsuranceTypes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInsuranceTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.insuranceTypes = action.payload;
      })
      .addCase(getInsuranceTypes.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getTreatmentRooms.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTreatmentRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.treatmentRooms = action.payload;
      })
      .addCase(getTreatmentRooms.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSpecies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSpecies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.species = action.payload;
      })
      .addCase(getSpecies.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBreeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBreeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.breeds = action.payload;
      })
      .addCase(getBreeds.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getClients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clients = action.payload;
      })
      .addCase(getClients.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset } = dictionarySlice.actions;
