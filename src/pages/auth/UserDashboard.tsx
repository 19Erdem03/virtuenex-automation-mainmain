import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';
import { ProfileDropdown } from '../../components/auth/ProfileDropdown';

export const UserDashboard = () => {
    const { profile } = useAuth();

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <User className="w-8 h-8 text-gold-500" />
                        My Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">{profile?.email}</span>
                        <div className="relative z-50">
                            <ProfileDropdown />
                        </div>
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
