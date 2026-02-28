import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    requiredRole?: 'Lead' | 'Client' | 'Admin';
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
    const { user, profile, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex bg-black h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    if (!user || !profile) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && profile.role !== requiredRole) {
        if (requiredRole === 'Admin') {
            return <Navigate to="/unauthorized" replace />;
        }

        // If they have the wrong role, send them to their appropriate dashboard
        if (profile.role === 'Admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
