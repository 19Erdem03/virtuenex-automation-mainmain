import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, AlertTriangle, TrendingDown, CheckCircle, Zap, HelpCircle, ChevronDown } from 'lucide-react';
import type { ServiceData, ServiceFAQ } from '../lib/services';
import { colorMap } from '../lib/services';
import AnimatedSection from './AnimatedSection';

interface ServicePageTemplateProps {
  service: ServiceData;
}

function ProblemSection({ service }: { service: ServiceData }) {
  const { pas } = service;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-sm text-red-400 mb-8">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Problem
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gold-500">{pas.problem.headline.split(' ').slice(0, 3).join(' ')}</span>{' '}
            <span className="text-white">{pas.problem.headline.split(' ').slice(3).join(' ')}</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mb-12">
            {pas.problem.description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-4">
          {pas.problem.painPoints.map((point, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card p-5 flex items-start gap-4 group hover:bg-white/[0.06] transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgitationSection({ service }: { service: ServiceData }) {
  const { pas } = service;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 radial-glow-hero opacity-30" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 mb-8">
            <TrendingDown className="w-3.5 h-3.5" />
            The Real Cost
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gold-500">{pas.agitation.headline.split(' ').slice(0, 4).join(' ')}</span>{' '}
            <span className="text-white">{pas.agitation.headline.split(' ').slice(4).join(' ')}</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            {pas.agitation.description}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {pas.agitation.consequences.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.15}>
              <div className="glass-card glow-border p-7 text-center h-full hover:bg-white/[0.06] transition-all duration-300">
                <div className="text-4xl sm:text-5xl font-bold text-gold-500 mb-3">
                  {item.stat}
                </div>
                <p className="text-white font-medium text-sm mb-3">{item.label}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection({ service }: { service: ServiceData }) {
  const { pas } = service;
  const colors = colorMap[service.color];

  return (
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} text-sm ${colors.text} mb-8`}>
            <Zap className="w-3.5 h-3.5" />
            The Solution
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">{pas.solution.headline}</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mb-14">
            {pas.solution.description}
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 gap-6">
          {pas.solution.outcomes.map((outcome, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="glass-card glow-border p-7 h-full group hover:bg-white/[0.06] transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                    <CheckCircle className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">{outcome.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{outcome.description}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ service }: { service: ServiceData }) {
  const colors = colorMap[service.color];

  return (
    <section className="relative py-20 sm:py-28">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                Key Capabilities
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Everything your team needs to operate at peak efficiency, delivered through
                our battle-tested AI systems.
              </p>
              <Link
                to="/contact"
                className="btn-gradient inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="glass-card glow-border p-6 sm:p-8">
              <div className="space-y-4">
                {service.features.map((feature, i) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0 mt-0.5`}>
                      <feature.icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <span className="text-sm text-gray-300 leading-relaxed pt-1">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onToggle }: { faq: ServiceFAQ; isOpen: boolean; onToggle: () => void }) {
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
            <p className="pb-6 text-gray-400 leading-relaxed pr-8">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceFAQSection({ service }: { service: ServiceData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-20 sm:py-28">
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
            Everything you need to know about {service.title.toLowerCase()}.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.15}>
          <div className="glass-card glow-border p-6 sm:p-8">
            {service.faqs.map((faq, i) => (
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

export default function ServicePageTemplate({ service }: ServicePageTemplateProps) {
  const colors = colorMap[service.color];

  return (
    <div>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 radial-glow-hero" />

        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.13, 0.08] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full blur-[180px]"
            style={{ background: 'rgba(120, 40, 200, 0.15)' }}
          />
        </div>

        <div className="absolute top-[40%] right-1/3 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.11, 0.06] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute inset-0 rounded-full blur-[150px]"
            style={{ background: 'rgba(234, 179, 8, 0.15)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} text-sm ${colors.text} mb-6`}>
              <service.icon className="w-3.5 h-3.5" />
              {service.subtitle}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {service.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {service.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <ProblemSection service={service} />
      <AgitationSection service={service} />
      <SolutionSection service={service} />
      <FeaturesSection service={service} />
      <ServiceFAQSection service={service} />

      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 radial-glow-hero opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Book a 15-minute discovery call and we will map out exactly how
              {' '}{service.title.toLowerCase()} can save your team time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white rounded-xl group"
              >
                Book Your Discovery Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              {['Free audit', 'No commitment', '15-minute call'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
