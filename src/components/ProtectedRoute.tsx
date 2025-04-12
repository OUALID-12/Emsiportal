
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RenderFunctionParams {
  user: any;
}

interface ProtectedRouteProps {
  children: React.ReactNode | ((params: RenderFunctionParams) => React.ReactNode);
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
};
