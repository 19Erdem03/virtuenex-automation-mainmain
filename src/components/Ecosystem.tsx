import { motion } from 'framer-motion';
import { Bot, Database, Users, ArrowRight, ChevronRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const steps = [
  {
    icon: Bot,
    title: 'AI Layer',
    subtitle: 'Instant Intelligence',
    items: ['Chat assistants', 'Voice agents', 'Lead scoring', 'Auto-responses'],
    color: 'gold',
  },
  {
    icon: Database,
    title: 'CRM Sync',
    subtitle: 'Seamless Data Flow',
    items: ['Auto-entry', 'Contact enrichment', 'Pipeline updates', 'Document processing'],
    color: 'emerald',
  },
  {
    icon: Users,
    title: 'Human Touch',
    subtitle: 'Your Team Amplified',
    items: ['Hot lead alerts', 'Prioritized tasks', 'Full context briefs', 'Performance insights'],
    color: 'amber',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  gold: { bg: 'bg-gold-500/10', border: 'border-gold-500/20', text: 'text-gold-400', dot: 'bg-gold-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
};

export default function Ecosystem() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16 sm:mb-20">
          <p className="text-sm font-medium text-gold-500 tracking-wide uppercase mb-4">
            The Ecosystem
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            AI + CRM + Human Touch
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Three layers working together so your team operates at peak efficiency without losing the personal touch your clients expect.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-0 relative">
          <div className="hidden lg:flex items-center absolute top-1/2 left-[33.33%] -translate-y-1/2 -translate-x-1/2 z-10">
            <div className="w-10 h-10 rounded-full bg-black border border-white/[0.08] flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="hidden lg:flex items-center absolute top-1/2 left-[66.66%] -translate-y-1/2 -translate-x-1/2 z-10">
            <div className="w-10 h-10 rounded-full bg-black border border-white/[0.08] flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <AnimatedSection key={step.title} delay={i * 0.15}>
                <div className="glass-card p-7 sm:p-8 h-full lg:rounded-none lg:border-x-0 first:lg:rounded-l-2xl first:lg:border-l last:lg:rounded-r-2xl last:lg:border-r">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <step.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className={`text-xs ${colors.text}`}>{step.subtitle}</p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-3 px-6 py-3 glass-card hover:bg-white/[0.06] transition-all cursor-default"
          >
            <div className="flex -space-x-2">
              {['gold', 'emerald', 'amber'].map((c) => (
                <div key={c} className={`w-6 h-6 rounded-full ${colorMap[c].bg} border-2 border-black`} />
              ))}
            </div>
            <span className="text-sm text-gray-300">All layers work together seamlessly</span>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
