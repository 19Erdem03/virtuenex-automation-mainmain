import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const ClientDashboard = () => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-28">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-gold-500">Client Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">{profile?.email}</span>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">My AI Systems</h2>
                        <p className="text-gray-400 text-sm">View metrics for your chat and phone agents.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-semibold mb-4 text-white">Captured Leads</h2>
                        <p className="text-gray-400 text-sm">Access your CRM entries.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
