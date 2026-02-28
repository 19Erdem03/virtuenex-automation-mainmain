import { useAuth } from '../../contexts/AuthContext';
import { ClientDashboard } from './ClientDashboard';
import { UserDashboard } from './UserDashboard';

export const Dashboard = () => {
    const { profile } = useAuth();

    if (profile?.role === 'Client') {
        return <ClientDashboard />;
    }

    // Default to UserDashboard for Lead
    return <UserDashboard />;
};
