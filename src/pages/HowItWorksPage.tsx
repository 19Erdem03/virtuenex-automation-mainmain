import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Wrench, Plug, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Workflow Audit',
    subtitle: 'We map your bottlenecks',
    description: 'We start with a deep-dive into your team\'s daily operations. Every phone call, every CRM entry, every lead follow-up is analysed to identify exactly where time is being wasted and revenue is leaking.',
    details: [
      'Full analysis of your current tech stack and workflows',
      'Identify the top 3 time-draining tasks for your agents',
      'Quantify the revenue impact of slow response times',
      'Benchmark against top-performing teams in your market',
    ],
    color: 'gold',
  },
  {
    number: '02',
    icon: Wrench,
    title: 'Custom Build',
    subtitle: 'We engineer your AI systems',
    description: 'No templates. No generic chatbots. We build bespoke AI systems trained on your specific listings, your market terminology, and your team\'s voice. Every interaction is designed to feel like it came from your best agent.',
    details: [
      'AI trained on your brand voice and listing inventory',
      'Custom conversation flows for your buyer and seller journeys',
      'Integration architecture designed for your specific CRM',
      'Rigorous testing with real-world scenarios from your market',
    ],
    color: 'emerald',
  },
  {
    number: '03',
    icon: Plug,
    title: 'Integration',
    subtitle: 'We connect everything seamlessly',
    description: 'Your AI systems plug directly into your existing tools. CRM, calendar, email, phone system, property portals. Everything syncs in real-time with zero disruption to your current operations.',
    details: [
      'Direct integration with your CRM (Follow Up Boss, KvCORE, etc.)',
      'Calendar sync for automated viewing bookings',
      'Portal connections for instant lead capture',
      'End-to-end encryption for all data transfers',
    ],
    color: 'amber',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch & Optimise',
    subtitle: 'We go live and keep improving',
    description: 'Your AI systems go live and start handling leads immediately. But we do not walk away. We monitor performance, analyse conversion data, and continuously refine your systems to maximise results.',
    details: [
      'Guided launch with real-time monitoring',
      'Weekly performance reports with actionable insights',
      'Continuous AI refinement based on conversation data',
      'Dedicated account manager for ongoing support',
    ],
    color: 'rose',
  },
];

const colorStyles: Record<string, { bg: string; border: string; text: string; line: string }> = {
  gold: { bg: 'bg-gold-500/10', border: 'border-gold-500/20', text: 'text-gold-400', line: 'bg-gold-500/30' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', line: 'bg-emerald-500/30' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', line: 'bg-amber-500/30' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', line: 'bg-rose-500/30' },
};

export default function HowItWorksPage() {
  return (
    <div>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 radial-glow-hero" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 rounded-full bg-gold-500 blur-[150px] opacity-[0.07]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-sm text-gold-400 mb-6">
              <Wrench className="w-3.5 h-3.5" />
              Our Process
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gold-500">Four Steps</span>{' '}
              <span className="text-white">to Automation</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              From initial audit to full deployment, we handle everything. Your team stays focused on selling while we build, integrate, and optimise your AI systems.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/30 via-emerald-500/30 via-amber-500/30 to-rose-500/30 hidden sm:block" />

            {steps.map((step, i) => {
              const colors = colorStyles[step.color];
              const isEven = i % 2 === 0;

              return (
                <AnimatedSection key={step.number} delay={i * 0.15}>
                  <div className={`relative flex items-start gap-6 md:gap-12 mb-16 sm:mb-24 last:mb-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`hidden sm:block absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${colors.bg} border-2 ${colors.border} z-10`}>
                      <div className={`absolute inset-1 rounded-full ${colors.line}`} />
                    </div>

                    <div className={`flex-1 ${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} sm:pl-20 md:pl-0`}>
                      <div className={`glass-card glow-border p-7 sm:p-8 hover:bg-white/[0.06] transition-all duration-300`}>
                        <div className={`flex items-center gap-4 mb-5 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`w-12 h-12 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                            <step.icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div className={isEven ? 'md:text-right' : ''}>
                            <span className={`text-xs font-bold ${colors.text} uppercase tracking-widest`}>Step {step.number}</span>
                            <h3 className="text-xl font-bold text-white">{step.title}</h3>
                          </div>
                        </div>

                        <p className={`text-sm text-gold-400 font-medium mb-3 ${isEven ? 'md:text-right' : ''}`}>{step.subtitle}</p>
                        <p className={`text-gray-400 text-sm leading-relaxed mb-6 ${isEven ? 'md:text-right' : ''}`}>{step.description}</p>

                        <ul className={`space-y-2.5 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
                          {step.details.map((detail) => (
                            <li key={detail} className={`flex items-start gap-2.5 text-sm text-gray-300 ${isEven ? 'md:flex-row-reverse md:text-right' : ''}`}>
                              <CheckCircle className={`w-4 h-4 ${colors.text} shrink-0 mt-0.5`} />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="hidden md:block flex-1" />
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24">
        <div className="absolute inset-0 radial-glow-hero opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Audit?
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Book a free 15-minute discovery call. We will identify the biggest
              time-wasters in your workflow and show you exactly where AI can help.
            </p>
            <Link
              to="/contact"
              className="btn-gradient inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white rounded-xl group"
            >
              Book Your Free Audit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
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
