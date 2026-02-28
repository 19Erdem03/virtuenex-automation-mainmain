import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import CostOfSilence from '../components/CostOfSilence';
import Problem from '../components/Problem';
import Solutions from '../components/Solutions';
import Ecosystem from '../components/Ecosystem';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import AnimatedSection from '../components/AnimatedSection';

const pricingPreview = [
  { name: 'Starter', price: '$600', period: '/mo', highlight: false, note: 'Chat Agent + Analytics' },
  { name: 'Standard', price: '$1,500', period: '/mo', highlight: true, note: 'Website + SEO + Everything in Starter' },
  { name: 'Ultra', price: '$3,000', period: '/mo', highlight: false, note: 'Full stack — Phone, Data & Custom' },
];

function PricingTeaser() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 radial-gradient-bottom pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Transparent packages,{' '}
            <span className="text-gradient-gold">built to scale</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every plan is fully customizable. Add or remove features — pricing adjusts to fit.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {pricingPreview.map((plan, i) => (
            <AnimatedSection key={plan.name} delay={i * 0.1}>
              <div className={`rounded-2xl p-6 text-center transition-all duration-300 ${plan.highlight ? 'bg-white/[0.05] border border-gold-500/40 shadow-lg shadow-gold-500/10' : 'glass-card border border-white/[0.06]'}`}>
                {plan.highlight && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold mb-3">
                    <Sparkles className="w-2.5 h-2.5" />
                    Most Popular
                  </span>
                )}
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-gold-400' : 'text-gray-500'}`}>{plan.name}</p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{plan.note}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl btn-gradient text-sm font-semibold text-white group"
          >
            See Full Pricing & Features
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}

function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition"
    >
      Break the world (Test Sentry)
    </button>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ErrorButton />
      <CostOfSilence />
      <Problem />
      <Solutions />
      <Ecosystem />
      <FAQ />
      <PricingTeaser />
      <Contact />
    </>
  );
}
