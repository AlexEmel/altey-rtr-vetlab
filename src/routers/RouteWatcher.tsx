import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store/store';
import { resetCurrentOrder } from '@/features/archive.slice';
import { resetResults } from '@/features/result.slice';
import { resetDynamics } from '@/features/dynamics.slice';
import { resetAppointments } from '@/features/appointments.slice';

export const RouteWatcher = (): null => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const from = previousPath.current;
    const to = location.pathname;

    const isResultOrDynamics = (path: string | null) =>
      path?.startsWith('/archive/results') || path?.startsWith('/dynamics');

    if (from && isResultOrDynamics(from) && !isResultOrDynamics(to)) {
      dispatch(resetCurrentOrder());
      dispatch(resetResults());
      dispatch(resetDynamics());
    }

    const isAppointments = (path: string | null) =>
      path?.startsWith('/appointments');

    if (from && isAppointments(from) && !isAppointments(to)) {
      dispatch(resetAppointments());
    }

    previousPath.current = to;
  }, [location, dispatch]);

  return null;
};
