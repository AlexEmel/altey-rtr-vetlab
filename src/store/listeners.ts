import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { notify } from '@/common/notifications';
import { IApiError } from '@/interfaces/app/api.interface';
import { login, setPassword } from '@/features/user.slice';
import {
  getAnalysisTypes,
  getDepartments,
  getExternalFinanceSources,
  getInsuranceTypes,
  getTreatmentRooms,
  getSpecies,
  getBreeds,
  getClients,
} from '@/features/dictionary.slice';
import { getArchive } from '@/features/archive.slice';
import { getDynamics } from '@/features/dynamics.slice';
import { getOrderResults, getPdfString } from '@/features/result.slice';
import {
  confirmAppointment,
  createAppointment,
  deleteAppointment,
  editAppointment,
  getAppointments,
  getTreatmentRoomsQuotas,
} from '@/features/appointments.slice';

export const listenerMiddleware = createListenerMiddleware();
export const startAppListening = listenerMiddleware.startListening;

const getErrorMessage = (action: unknown, fallback: string): string => {
  if (typeof action === 'object' && action !== null && 'payload' in action) {
    return (action.payload as IApiError | undefined)?.message ?? fallback;
  }
  return fallback;
};

//USER SLICE THUNKS
startAppListening({
  actionCreator: login.fulfilled,
    effect: async (_, api) => {
    api.dispatch(getSpecies());
    api.dispatch(getBreeds());
    api.dispatch(getClients());
  },
});

startAppListening({
  actionCreator: login.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка аутентификации'));
  },
});

startAppListening({
  actionCreator: setPassword.fulfilled,
  effect: async () => {
    notify('success', 'Пароль успешно измененён. Повторите вход в УПК с новым паролем');
  },
});

startAppListening({
  actionCreator: setPassword.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка смены пароля'));
  },
});

//DICTIONARY SLICE
startAppListening({
  matcher: isAnyOf(
    getDepartments.rejected,
    getAnalysisTypes.rejected,
    getExternalFinanceSources.rejected,
    getInsuranceTypes.rejected,
    getTreatmentRooms.rejected,
    getSpecies.rejected,
    getBreeds.rejected,
    getClients.rejected,
  ),
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения справочников'));
  },
});

//ARCHIVE SLICE
startAppListening({
  actionCreator: getArchive.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения архива заказов'));
  },
});

//DYNAMICS SLICE
startAppListening({
  actionCreator: getDynamics.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения динамической карты'));
  },
});

//RESULT SLICE
startAppListening({
  actionCreator: getPdfString.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения бланка результатов'));
  },
});

startAppListening({
  actionCreator: getOrderResults.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения результатов заказа'));
  },
});

//APPOINTMENT SLICE
startAppListening({
  actionCreator: getAppointments.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения списка записей на прием'));
  },
});

startAppListening({
  actionCreator: getTreatmentRoomsQuotas.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения списка квот'));
  },
});

startAppListening({
  actionCreator: createAppointment.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка получения сохранения записи на прием'));
  },
});

startAppListening({
  actionCreator: createAppointment.fulfilled,
  effect: async (_, api) => {
    notify('success', 'Запись на прием успешно создана');
    api.dispatch(getAppointments());
  },
});

startAppListening({
  actionCreator: deleteAppointment.fulfilled,
  effect: async (_, api) => {
    notify('success', 'Запись на прием успешно удалена');
    api.dispatch(getAppointments());
  },
});

startAppListening({
  actionCreator: editAppointment.fulfilled,
  effect: async (_, api) => {
    notify('success', 'Запись на прием успешно обновлена');
    api.dispatch(getAppointments());
  },
});
startAppListening({
  actionCreator: confirmAppointment.rejected,
  effect: async (action) => {
    notify('error', getErrorMessage(action, 'Ошибка подтверждения записи на прием'));
  },
});

startAppListening({
  actionCreator: confirmAppointment.fulfilled,
    effect: async () => {
    notify('success', 'Запись на прием успешно подтверждена');
  },
});
