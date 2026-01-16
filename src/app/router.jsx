import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../modules/marketing/pages/LandingPage.jsx";
import AuthPage from "../modules/auth/pages/AuthPage.jsx";
import ResetPasswordPage from "../modules/auth/pages/ResetPasswordPage.jsx";
import AnalyzePage from "../modules/inbox/pages/AnalyzePage.jsx";
import { getAuthToken } from "../shared/lib/storage.jsx";
import SessionTimeout from "../shared/components/SessionTimeout.jsx";

function ProtectedRoute({ children }) {
  const token = getAuthToken();
  if (!token) return <Navigate to="/auth?mode=login" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <SessionTimeout />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/app/analyze"
          element={
            <ProtectedRoute>
              <AnalyzePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
