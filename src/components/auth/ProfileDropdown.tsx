import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, profile, signOut } = useAuth();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div ref={dropdownRef} className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            >
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gold-500/30" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center overflow-hidden">
                        <User className="w-5 h-5 text-gold-500" />
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 glass-card p-2 shadow-xl shadow-black/40"
                    >
                        <div className="px-3 py-2 border-b border-white/10 mb-2 truncate">
                            <p className="text-sm font-medium text-white truncate">{profile?.email || user.email}</p>
                            <p className="text-xs text-gold-500 capitalize">{profile?.role}</p>
                        </div>
                        <Link
                            to={profile?.role === 'Admin' ? '/admin' : profile?.role === 'Client' ? '/client' : '/dashboard'}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                        >
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                            {profile?.role === 'Admin' ? 'Admin' : 'Dashboard'}
                        </Link>
                        <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                        >
                            <User className="w-4 h-4 text-gray-400" />
                            Profile
                        </Link>
                        <button
                            onClick={async () => {
                                await signOut();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4 text-red-400" />
                            Log Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
