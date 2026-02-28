import { useAuth } from '../../contexts/AuthContext';
import { ProfileDropdown } from '../../components/auth/ProfileDropdown';

export const AdminDashboard = () => {
    const { profile } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-gold-500">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">{profile?.email}</span>
                        <div className="relative z-50">
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">System Deployments</h2>
                        <p className="text-gray-400 text-sm">Manage client AI instances.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">Lead Manager</h2>
                        <p className="text-gray-400 text-sm">View all captured leads.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">User CRM</h2>
                        <p className="text-gray-400 text-sm">Manage user roles and access.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
