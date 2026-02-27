import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { services } from '../lib/services';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/[0.06]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/images/VirtueNex-Automation-Logo.png"
                alt="VirtueNex Automation"
                className="h-8 sm:h-9 w-auto"
              />
              <span className="text-base sm:text-lg font-bold tracking-tight">
                <span className="text-white">Virtue</span>
                <span className="text-gold-500">Nex</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-white/[0.04] ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Home
              </Link>

              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-white/[0.04] ${pathname.startsWith('/services') ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Solutions
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 glass-card p-2 shadow-xl shadow-black/40"
                    >
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          to={service.path}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                            <service.icon className="w-4 h-4 text-gold-400" />
                          </div>
                          {service.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/how-it-works"
                className={`px-4 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-white/[0.04] ${pathname === '/how-it-works' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className={`px-4 py-2 text-sm transition-colors duration-200 rounded-lg hover:bg-white/[0.04] ${pathname === '/contact' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Contact
              </Link>
            </div>

            <div className="hidden md:block">
              <Link
                to="/contact"
                className="btn-gradient inline-flex items-center px-5 py-2.5 text-sm font-medium text-white rounded-xl"
              >
                Book a Call
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <Link to="/" className="text-2xl text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </motion.div>

              {services.map((service, i) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    to={service.path}
                    className="text-base text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <service.icon className="w-4 h-4 text-gold-400" />
                    {service.title}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Link to="/how-it-works" className="text-2xl text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link to="/contact" className="text-2xl text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Link
                  to="/contact"
                  className="btn-gradient mt-4 inline-flex items-center px-8 py-3 text-base font-medium text-white rounded-xl"
                >
                  Book a Call
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
