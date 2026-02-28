import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, ArrowLeft, Home, Edit2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const UserProfile = () => {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setError('');

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    avatar_url: avatarUrl
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setIsEditing(false);
            window.location.reload(); // Refresh context
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-white/20" />
                        ) : (
                            <div className="p-2 bg-white/5 rounded-full border border-white/10">
                                <User className="w-6 h-6 text-gold-500" />
                            </div>
                        )}
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

                <div className="bg-white/5 border border-white/10 p-8 rounded-xl max-w-lg relative">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Edit Profile"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setFullName(profile?.full_name || '');
                                    setAvatarUrl(profile?.avatar_url || '');
                                    setError('');
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                title="Cancel"
                                disabled={isSaving}
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSave}
                                className="p-2 text-gold-500 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                title="Save Profile"
                                disabled={isSaving}
                            >
                                {isSaving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            </button>
                        </div>
                    )}

                    <div className="space-y-6 mt-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="mt-1 text-lg text-white">{profile?.email}</div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-1 w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                                />
                            ) : (
                                <div className="mt-1 text-lg text-white">{profile?.full_name || <span className="text-gray-500 italic">Not provided</span>}</div>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-400">Profile Picture URL</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://example.com/avatar.png"
                                    className="mt-1 w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                                />
                            ) : (
                                <div className="mt-1 text-lg text-white">
                                    {profile?.avatar_url ? (
                                        <a href={profile.avatar_url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline text-sm truncate block">
                                            {profile.avatar_url}
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 italic">Not provided</span>
                                    )}
                                </div>
                            )}
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
