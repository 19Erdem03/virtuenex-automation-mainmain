import { useAuth } from '../../contexts/AuthContext';
import { ClientDashboard } from './ClientDashboard';
import { UserProfile } from './UserProfile';

export const Dashboard = () => {
    const { profile } = useAuth();

    if (profile?.role === 'Client') {
        return <ClientDashboard />;
    }

    // Default to UserProfile for Lead
    return <UserProfile />;
};
