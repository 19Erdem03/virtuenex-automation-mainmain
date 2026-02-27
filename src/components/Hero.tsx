import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 radial-glow-hero" />

      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full blur-[180px]"
          style={{ background: 'rgba(120, 40, 200, 0.15)' }}
        />
      </div>

      <div className="absolute top-[40%] right-1/3 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.10, 0.06] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute inset-0 rounded-full blur-[150px]"
          style={{ background: 'rgba(234, 179, 8, 0.15)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-7">
            <span className="text-white">Automate Your Agency.</span>
            <br />
            <span className="text-gold-500">Dominate Your Postcode.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          We deploy autonomous AI systems that handle valuations, viewings,
          and offers while you sleep. Reclaim 2+ hours every single day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white rounded-xl group"
          >
            Share your biggest challenge
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#solutions"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-gray-300 glass-card hover:bg-white/[0.08] transition-all duration-200"
          >
            See Our Solutions
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center justify-center gap-10 sm:gap-16 mt-16 pt-8 border-t border-white/[0.06]"
        >
          {[
            { value: '2h+', label: 'Saved Daily' },
            { value: '24/7', label: 'Lead Capture' },
            { value: '98%', label: 'Data Accuracy' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
