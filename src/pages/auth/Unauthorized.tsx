import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 pt-24">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-gray-400 mb-8">
                    You do not have the required permissions to access this page.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center w-full bg-gold-500 text-black font-semibold py-2.5 rounded-lg hover:bg-gold-500/90 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};
