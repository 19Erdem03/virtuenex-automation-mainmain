import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const faqs = [
  {
    question: 'Does the AI sound human?',
    answer: 'Yes, we use low-latency NLP models for natural flow. Our voice agents are trained on thousands of real estate conversations and use advanced speech synthesis to deliver responses that are virtually indistinguishable from a human agent. Callers consistently rate the experience as natural and helpful.',
  },
  {
    question: 'Can it book into my calendar?',
    answer: 'Native integration with Calendly, Google, and Outlook. Our AI agents can check real-time availability, book viewings, schedule callbacks, and send confirmation emails automatically. Your calendar stays up to date without any manual intervention from your team.',
  },
  {
    question: 'Will this replace my team?',
    answer: 'Not at all. VirtueNex AI is designed to amplify your existing team, not replace them. It handles the repetitive, time-consuming tasks like initial lead responses, data entry, and after-hours inquiries so your agents can focus on building relationships, negotiating deals, and closing sales.',
  },
  {
    question: 'How long does it take to get set up?',
    answer: 'Most clients are fully live within 21 days. Our onboarding team handles the entire setup — from CRM integration to AI training and testing — so you can hit the ground running without disrupting your existing workflows.',
  },
  {
    question: 'How quickly will I see results?',
    answer: 'Most teams see measurable time savings within the first week. Our AI agents start handling leads immediately after setup. Within 30 days, you can expect improved response times, higher lead conversion rates, and a significant reduction in manual admin tasks.',
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <span className={`text-base sm:text-lg font-medium transition-colors duration-200 ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className={`w-5 h-5 transition-colors duration-200 ${isOpen ? 'text-gold-400' : 'text-gray-500'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 leading-relaxed pr-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm text-gold-400 mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Common Questions
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Everything you need to know about working with VirtueNex.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="glass-card glow-border p-6 sm:p-8">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
