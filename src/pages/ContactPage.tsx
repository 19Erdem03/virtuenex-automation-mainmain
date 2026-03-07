
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import FAQ from '../components/FAQ';
import BookingForm from '../components/BookingForm';
import { SEO } from '../components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact VirtueNex | Book Your Free Audit"
        description="Book a free discovery call and see how VirtueNex can automate 2+ hours of your real estate team's daily workload."
        canonicalUrl="https://virtuenex.xyz/contact"
      />
      <div>
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden min-h-[70vh] flex flex-col justify-center">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 radial-glow-hero" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full bg-gold-500 blur-[150px] opacity-[0.07]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-grow flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-sm text-gold-400 mb-6">
                <Terminal className="w-3.5 h-3.5" />
                Get In Touch
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gold-500">Let&apos;s Build</span>{' '}
                <span className="text-white">Your AI System</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
                Book a free discovery call and we&apos;ll show you exactly how VirtueNex
                can automate 2+ hours of your team&apos;s daily workload.
              </p>

              <div className="mt-12 w-full text-left">
                <BookingForm className="shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </section>

        <FAQ />
      </div>
    </>
  );
}
