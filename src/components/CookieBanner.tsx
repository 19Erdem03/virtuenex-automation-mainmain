import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'vna_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
        >
          <div className="relative glass-card glow-border p-6 shadow-2xl shadow-black/60">
            <button
              onClick={handleDecline}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <Cookie size={18} className="text-gold-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base mb-1">We value your privacy</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content,
                  and analyze our traffic. By clicking "Accept", you consent to our use of cookies.{' '}
                  <a
                    href="#"
                    className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors"
                  >
                    Read our Cookie Policy.
                  </a>
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecline}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-5 py-2 text-sm font-semibold text-black rounded-lg btn-gradient transition-all duration-200"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
