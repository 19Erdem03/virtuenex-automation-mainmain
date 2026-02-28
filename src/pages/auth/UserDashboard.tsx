import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserDashboard = () => {
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-gold-500" />
                        My Profile
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={profile?.role === 'Admin' ? '/admin' : '/dashboard'}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 rounded-lg transition-colors text-gray-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            to="/"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 rounded-lg transition-colors text-gray-300"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-xl max-w-lg">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="mt-1 text-lg text-white">{profile?.email}</div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Account Type</label>
                            <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-500/10 text-gold-500 border border-gold-500/20">
                                {profile?.role}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Member Since</label>
                            <div className="mt-1 text-white">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
