import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import LandingPage from '../pages/landing/LandingPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import HistoryPage from '../pages/history/HistoryPage';
import WizardPage from '../pages/wizard/WizardPage';
import MistDetailPage from '../pages/mist/MistDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/wizard" element={<WizardPage />} />
        <Route path="/mist/:id" element={<MistDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRouter;