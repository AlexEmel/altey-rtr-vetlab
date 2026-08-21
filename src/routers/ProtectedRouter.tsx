import { useAppSelector } from '@/store/store';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRouter = (): JSX.Element => {
  const isLoggedIn = useAppSelector((store) => store.user.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
