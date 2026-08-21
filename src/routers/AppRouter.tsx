import { AppLayout } from '@/components/layouts/Layout';
import { ArchivePage } from '@/components/pages/Archive/ArchivePage';
import { AppointmentsPage } from '@/components/pages/Appointments/AppointmentsPage';
import { DynamicsPage } from '@/components/pages/Dynamics/DynamicsPage';
import { LoginPage } from '@/components/pages/Login/LoginPage';
import { NotFoundPage } from '@/components/pages/NotFound/NotFoundPage';
import { PdfPage } from '@/components/pages/Pdf/PdfPage';
import { ProfilePage } from '@/components/pages/Profile/ProfilePage';
import { ResultsPage } from '@/components/pages/Results/ResultsPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RouteWatcher } from './RouteWatcher';
import { ProtectedRouter } from './ProtectedRouter';
import QuotasPage from '@/components/pages/Quotas/QuotasPage';

export const AppRouter = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRouter />}>
            <Route path="/" index element={<Navigate to={'/archive'} />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/archive/pdf/:id" element={<PdfPage />} />
            <Route path="/archive/results/:id" element={<ResultsPage />} />
            <Route path="/dynamics" element={<DynamicsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/quotas" element={<QuotasPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <RouteWatcher />
    </BrowserRouter>
  );
};
