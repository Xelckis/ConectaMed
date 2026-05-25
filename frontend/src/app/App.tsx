import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Agenda } from './pages/Agenda';
import { Historico } from './pages/Historico';
import { RedeApoio } from './pages/RedeApoio';
import { Perfil } from './pages/Perfil';
import { Notificacoes } from './pages/Notificacoes';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children, redirectIfAuthenticated = true }: { children: React.ReactNode; redirectIfAuthenticated?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user && redirectIfAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <PrivateRoute>
            <MainLayout>
              <Agenda />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/historico"
        element={
          <PrivateRoute>
            <MainLayout>
              <Historico />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/rede-apoio"
        element={
          <PrivateRoute>
            <MainLayout>
              <RedeApoio />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <MainLayout>
              <Perfil />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/notificacoes"
        element={
          <PrivateRoute>
            <MainLayout>
              <Notificacoes />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}