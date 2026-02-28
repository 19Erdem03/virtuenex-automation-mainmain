import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Shield, Save, Mail, UploadCloud, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useDropzone } from 'react-dropzone';
import { ProfileDropdown } from '../../components/auth/ProfileDropdown';

export const UserProfile = () => {
    const { user, profile } = useAuth();

    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!user || acceptedFiles.length === 0) return;

        try {
            setIsUploading(true);
            setError('');
            const file = acceptedFiles[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);

            // Auto-save the new avatar URL to profile
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

        } catch (err: any) {
            setError(err.message || 'Error uploading image');
        } finally {
            setIsUploading(false);
        }
    }, [user]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        },
        maxFiles: 1,
        multiple: false
    });

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    avatar_url: avatarUrl
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSuccessMessage('Profile saved successfully.');
            // Reload after short delay to refresh Auth context cleanly throughout the app
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-3xl mx-auto pt-10">

                {/* Top Right Navigation */}
                <div className="absolute top-4 right-8 z-50">
                    <ProfileDropdown />
                </div>

                {/* Header Section */}
                <div className="flex items-center gap-6 mb-12 mt-12">
                    <div {...getRootProps()} className="relative group cursor-pointer">
                        <input {...getInputProps()} />
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-gold-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-gold-500/50 relative z-10 shadow-lg shadow-gold-500/5">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-semibold text-gold-500">
                                    {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>

                        {/* hover overlay for upload */}
                        <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <UploadCloud className="w-6 h-6 text-white mb-1" />
                            <span className="text-[10px] text-white font-medium">Upload</span>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {fullName || 'User'}
                        </h1>
                        <div className="text-gray-400 mb-2">{profile?.email}</div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gold-500/10 border border-gold-500/20">
                            <Shield className="w-3.5 h-3.5 text-gold-500" />
                            <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">
                                {profile?.role || 'USER'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="glass-card border border-white/5 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-1">Profile Details</h2>
                        <p className="text-sm text-gray-400">Manage your personal information and account settings.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                            <div className="mt-0.5">⚠️</div>
                            <div>{error}</div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
                            <div className="mt-0.5">✓</div>
                            <div>{successMessage}</div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* First Name Input */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-2">First Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={profile?.email || ''}
                                    disabled
                                    className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-gray-400 cursor-not-allowed shadow-inner"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Email cannot be changed currently.</p>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-500/90 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
